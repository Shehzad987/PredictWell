"""
================================================================================
 PredictWell — Prediction
================================================================================
Loads the trained model + preprocessing artifacts and scores a single new
employee record. This is the module the FastAPI backend calls for every
"Prediction Center" request — it mirrors preprocess.py's transformations
exactly (same encoders, same scaler, same feature order) so training/serving
skew can't creep in.
================================================================================
"""

import pandas as pd

from utils import (
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES,
    RISK_ORDER,
    MODEL_PATH,
    SCALER_PATH,
    ENCODERS_PATH,
    LABEL_ENCODER_PATH,
    FEATURE_COLUMNS_PATH,
    load_artifact,
    load_json,
    recommendations_for_risk,
)


class BurnoutPredictor:
    """Wraps the trained model + all preprocessing artifacts for inference."""

    def __init__(self):
        self.model = load_artifact(MODEL_PATH)
        self.scaler = load_artifact(SCALER_PATH)
        self.encoders = load_artifact(ENCODERS_PATH)
        self.label_encoder = load_artifact(LABEL_ENCODER_PATH)
        self.feature_columns = load_json(FEATURE_COLUMNS_PATH)

    def _engineer(self, row: dict) -> dict:
        row = dict(row)
        row["Workload_Pressure"] = round(row["Number_of_Projects"] / max(row["Working_Hours_Per_Day"], 1), 3)
        row["Rest_Deficit"] = round(max(8 - row["Sleep_Hours"], 0), 2)
        return row

    def _to_frame(self, employee: dict) -> pd.DataFrame:
        row = self._engineer(employee)
        df = pd.DataFrame([row])

        for col in CATEGORICAL_FEATURES:
            df[col] = self.encoders[col].transform(df[col].astype(str))

        engineered_numeric = NUMERIC_FEATURES + ["Workload_Pressure", "Rest_Deficit"]
        df[engineered_numeric] = self.scaler.transform(df[engineered_numeric])

        return df[self.feature_columns]

    def predict(self, employee: dict) -> dict:
        """
        employee: dict with keys matching the raw dataset columns, e.g.
            {
              "Age": 34, "Gender": "Female", "Job_Role": "Software Engineer",
              "Working_Hours_Per_Day": 9.5, "Number_of_Projects": 4,
              "Sleep_Hours": 5.5, "Work_Life_Balance_Score": 4.0,
              "Stress_Level": 7.5, "Overtime_Hours": 6.0,
              "Years_of_Experience": 6, "Satisfaction_Level": 4.5,
              "Remote_or_Onsite": "Onsite"
            }
        """
        X = self._to_frame(employee)

        pred_encoded = self.model.predict(X)[0]
        risk_level = self.label_encoder.inverse_transform([pred_encoded])[0]

        if hasattr(self.model, "predict_proba"):
            proba = self.model.predict_proba(X)[0]
            class_order = self.label_encoder.inverse_transform(self.model.classes_)
            probabilities = {label: round(float(p), 4) for label, p in zip(class_order, proba)}
            probabilities = {label: probabilities.get(label, 0.0) for label in RISK_ORDER}
        else:
            probabilities = {label: (1.0 if label == risk_level else 0.0) for label in RISK_ORDER}

        return {
            "risk_level": risk_level,
            "confidence": probabilities[risk_level],
            "probabilities": probabilities,
            "recommendations": recommendations_for_risk(risk_level, employee),
        }


# Lazily-instantiated singleton so the (relatively cheap, but non-zero) model
# load only happens once per process, not once per request.
_predictor_instance = None


def get_predictor() -> BurnoutPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = BurnoutPredictor()
    return _predictor_instance


if __name__ == "__main__":
    sample_employee = {
        "Age": 34,
        "Gender": "Female",
        "Job_Role": "Software Engineer",
        "Working_Hours_Per_Day": 10.5,
        "Number_of_Projects": 6,
        "Sleep_Hours": 5.2,
        "Work_Life_Balance_Score": 3.5,
        "Stress_Level": 8.5,
        "Overtime_Hours": 9.0,
        "Years_of_Experience": 6,
        "Satisfaction_Level": 3.8,
        "Remote_or_Onsite": "Onsite",
    }

    predictor = get_predictor()
    result = predictor.predict(sample_employee)

    print("Sample prediction (high-risk profile):")
    print(f"  Risk Level: {result['risk_level']}")
    print(f"  Confidence: {result['confidence']}")
    print(f"  Probabilities: {result['probabilities']}")
    print("  Recommendations:")
    for r in result["recommendations"]:
        print(f"   - {r}")

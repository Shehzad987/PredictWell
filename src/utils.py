import json
from pathlib import Path

import joblib

# --------------------------------------------------------------------------
# PATHS
# --------------------------------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
MODELS_DIR = ROOT_DIR / "models"

RAW_DATA_PATH = DATA_DIR / "employee_burnout_data.csv"

MODEL_PATH = MODELS_DIR / "best_model.pkl"
SCALER_PATH = MODELS_DIR / "scaler.pkl"
ENCODERS_PATH = MODELS_DIR / "encoders.pkl"
LABEL_ENCODER_PATH = MODELS_DIR / "label_encoder.pkl"
FEATURE_COLUMNS_PATH = MODELS_DIR / "feature_columns.json"
METRICS_PATH = MODELS_DIR / "metrics.json"
CHARTS_DATA_PATH = MODELS_DIR / "charts_data.json"

MODELS_DIR.mkdir(exist_ok=True)

# --------------------------------------------------------------------------
# FEATURE DEFINITIONS
# --------------------------------------------------------------------------

TARGET_COLUMN = "Burnout_Risk"
RISK_ORDER = ["Low", "Medium", "High"]  # fixed, meaningful class ordering

NUMERIC_FEATURES = [
    "Age",
    "Working_Hours_Per_Day",
    "Number_of_Projects",
    "Sleep_Hours",
    "Work_Life_Balance_Score",
    "Stress_Level",
    "Overtime_Hours",
    "Years_of_Experience",
    "Satisfaction_Level",
]

CATEGORICAL_FEATURES = ["Gender", "Job_Role", "Remote_or_Onsite"]

ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

# --------------------------------------------------------------------------
# MODEL REGISTRY
# --------------------------------------------------------------------------

MODEL_DISPLAY_NAMES = {
    "logistic_regression": "Logistic Regression",
    "decision_tree": "Decision Tree",
    "random_forest": "Random Forest",
    "knn": "K-Nearest Neighbors",
    "svm": "Support Vector Machine",
}

# --------------------------------------------------------------------------
# HELPERS
# --------------------------------------------------------------------------


def save_json(data, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)


def load_json(path):
    with open(path) as f:
        return json.load(f)


def save_artifact(obj, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(obj, path)


def load_artifact(path):
    return joblib.load(path)


def recommendations_for_risk(risk_level, employee):
    """
    Returns a short list of AI-style, actionable recommendations tailored
    to the predicted risk level and the employee's specific input values.
    This is rule-based (not a language model) but reads naturally and is
    grounded in the same features the classifier was trained on.
    """
    recs = []

    if employee.get("Overtime_Hours", 0) > 8:
        recs.append("Reduce weekly overtime — current levels are well above a sustainable threshold.")
    if employee.get("Sleep_Hours", 8) < 6:
        recs.append("Prioritize sleep recovery — fewer than 6 hours/night is strongly linked to burnout.")
    if employee.get("Work_Life_Balance_Score", 5) < 5:
        recs.append("Encourage flexible scheduling or PTO to help restore work-life balance.")
    if employee.get("Stress_Level", 5) >= 7:
        recs.append("Consider a workload review or check-in with a manager to address elevated stress.")
    if employee.get("Number_of_Projects", 1) > 5:
        recs.append("Reassess concurrent project load — consider redistributing or deprioritizing tasks.")
    if employee.get("Satisfaction_Level", 5) < 5:
        recs.append("Schedule a 1:1 to discuss role satisfaction, growth path, and recognition.")

    if risk_level == "Low" and not recs:
        recs.append("Current work patterns look sustainable — maintain regular check-ins to stay ahead of burnout.")
    elif risk_level == "High" and len(recs) < 2:
        recs.append("Recommend a structured wellbeing plan and closer manager follow-up over the next 2-4 weeks.")

    if not recs:
        recs.append("No major risk factors detected — continue monitoring periodically.")

    return recs[:5]

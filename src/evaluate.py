"""
================================================================================
 PredictWell — Model Evaluation
================================================================================
Computes accuracy/precision/recall/F1, confusion matrices, and feature
importance for a trained model, and produces the JSON data structures the
frontend's interactive charts consume directly (no server-side image
rendering needed for the dashboard — Recharts renders from this JSON).
================================================================================
"""

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

from utils import RISK_ORDER


def evaluate_model(model, X_test, y_test, label_encoder):
    """Returns a dict of standard classification metrics for one model."""
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    recall = recall_score(y_test, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

    cm = confusion_matrix(y_test, y_pred, labels=label_encoder.transform(RISK_ORDER))

    report = classification_report(
        y_test,
        y_pred,
        target_names=RISK_ORDER,
        labels=label_encoder.transform(RISK_ORDER),
        output_dict=True,
        zero_division=0,
    )

    return {
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "confusion_matrix": cm.tolist(),
        "confusion_matrix_labels": RISK_ORDER,
        "classification_report": report,
    }


def get_feature_importance(model, feature_columns):
    """
    Extracts feature importance where the model type supports it
    (tree-based models directly; linear models via absolute coefficient
    magnitude, averaged across classes). Returns None for models where
    neither concept applies cleanly (e.g. raw KNN, SVM with non-linear kernel).
    """
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "coef_"):
        importances = np.mean(np.abs(model.coef_), axis=0)
    else:
        return None

    pairs = sorted(zip(feature_columns, importances.tolist()), key=lambda x: x[1], reverse=True)
    return [{"feature": name, "importance": round(float(val), 4)} for name, val in pairs]


def build_model_comparison(results_by_model):
    """
    Shapes per-model evaluate_model() outputs into the flat comparison
    structure the "Model Training" dashboard page renders as a bar chart.
    """
    comparison = []
    for model_key, result in results_by_model.items():
        comparison.append(
            {
                "model": model_key,
                "accuracy": result["accuracy"],
                "precision": result["precision"],
                "recall": result["recall"],
                "f1_score": result["f1_score"],
            }
        )
    return sorted(comparison, key=lambda x: x["accuracy"], reverse=True)

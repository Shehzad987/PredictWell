import time

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC

from preprocess import run_preprocessing_pipeline, load_raw_data, clean_data
from evaluate import evaluate_model, get_feature_importance, build_model_comparison
from utils import (
    NUMERIC_FEATURES,
    TARGET_COLUMN,
    RISK_ORDER,
    MODEL_PATH,
    LABEL_ENCODER_PATH,
    METRICS_PATH,
    CHARTS_DATA_PATH,
    MODEL_DISPLAY_NAMES,
    load_artifact,
    save_artifact,
    save_json,
)

MODEL_REGISTRY = {
    "logistic_regression": lambda: LogisticRegression(max_iter=1000, random_state=42),
    "decision_tree": lambda: DecisionTreeClassifier(max_depth=8, random_state=42),
    "random_forest": lambda: RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
    "knn": lambda: KNeighborsClassifier(n_neighbors=9),
    "svm": lambda: SVC(kernel="rbf", probability=True, random_state=42),
}


def build_charts_data(df_raw, results_by_model, feature_columns, best_model_key):
    """Assembles every JSON structure the frontend's chart components need."""

    # ---- Class distribution ----
    class_counts = df_raw[TARGET_COLUMN].value_counts().reindex(RISK_ORDER).fillna(0).astype(int)
    class_distribution = [{"risk": risk, "count": int(class_counts[risk])} for risk in RISK_ORDER]

    # ---- Correlation heatmap (numeric features only) ----
    corr = df_raw[NUMERIC_FEATURES].corr().round(3)
    correlation_heatmap = {
        "features": NUMERIC_FEATURES,
        "matrix": corr.values.tolist(),
    }

    # ---- Model accuracy comparison ----
    model_comparison = build_model_comparison(results_by_model)
    model_comparison = [{**m, "display_name": MODEL_DISPLAY_NAMES[m["model"]]} for m in model_comparison]

    # ---- Feature importance (best model) ----
    best_model = load_artifact(MODEL_PATH)
    feature_importance = get_feature_importance(best_model, feature_columns) or []

    # ---- Confusion matrix (best model) ----
    confusion_matrix_data = {
        "labels": results_by_model[best_model_key]["confusion_matrix_labels"],
        "matrix": results_by_model[best_model_key]["confusion_matrix"],
    }

    # ---- Summary stats for the Dataset Analytics page ----
    dataset_summary = {
        "total_employees": int(len(df_raw)),
        "avg_stress_level": round(float(df_raw["Stress_Level"].mean()), 2),
        "avg_sleep_hours": round(float(df_raw["Sleep_Hours"].mean()), 2),
        "avg_overtime_hours": round(float(df_raw["Overtime_Hours"].mean()), 2),
        "avg_satisfaction": round(float(df_raw["Satisfaction_Level"].mean()), 2),
        "high_risk_pct": round(float((df_raw[TARGET_COLUMN] == "High").mean() * 100), 1),
    }

    # ---- Burnout risk by job role (stacked bar on Dataset Analytics page) ----
    by_role = (
        df_raw.groupby(["Job_Role", TARGET_COLUMN], observed=True)
        .size()
        .unstack(fill_value=0)
        .reindex(columns=RISK_ORDER, fill_value=0)
    )
    burnout_by_role = [
        {"job_role": role, **{risk: int(by_role.loc[role, risk]) for risk in RISK_ORDER}}
        for role in by_role.index
    ]

    return {
        "class_distribution": class_distribution,
        "correlation_heatmap": correlation_heatmap,
        "model_comparison": model_comparison,
        "feature_importance": feature_importance,
        "confusion_matrix": confusion_matrix_data,
        "dataset_summary": dataset_summary,
        "burnout_by_role": burnout_by_role,
        "best_model": best_model_key,
    }


def train_all_models():
    print("=" * 70)
    print(" PredictWell — Training Pipeline")
    print("=" * 70)

    X_train, X_test, y_train, y_test, feature_columns = run_preprocessing_pipeline()
    label_encoder = load_artifact(LABEL_ENCODER_PATH)

    results_by_model = {}
    trained_models = {}

    for key, build_fn in MODEL_REGISTRY.items():
        name = MODEL_DISPLAY_NAMES[key]
        print(f"\n🔧 Training {name}...")
        start = time.time()

        model = build_fn()
        model.fit(X_train, y_train)
        elapsed = round(time.time() - start, 2)

        result = evaluate_model(model, X_test, y_test, label_encoder)
        result["training_time_seconds"] = elapsed
        results_by_model[key] = result
        trained_models[key] = model

        print(
            f"   Accuracy={result['accuracy']:.3f}  Precision={result['precision']:.3f}  "
            f"Recall={result['recall']:.3f}  F1={result['f1_score']:.3f}  ({elapsed}s)"
        )

    # Pick the best model by weighted F1 score (fair under class imbalance)
    best_model_key = max(results_by_model, key=lambda k: results_by_model[k]["f1_score"])
    best_model = trained_models[best_model_key]
    save_artifact(best_model, MODEL_PATH)

    print(f"\n🏆 Best model: {MODEL_DISPLAY_NAMES[best_model_key]} (F1={results_by_model[best_model_key]['f1_score']})")

    metrics_output = {
        "results_by_model": results_by_model,
        "best_model": best_model_key,
        "best_model_display_name": MODEL_DISPLAY_NAMES[best_model_key],
        "feature_columns": feature_columns,
    }
    save_json(metrics_output, METRICS_PATH)

    # Charts need the raw (unencoded) dataset for human-readable labels
    df_raw = clean_data(load_raw_data())
    charts_data = build_charts_data(df_raw, results_by_model, feature_columns, best_model_key)
    save_json(charts_data, CHARTS_DATA_PATH)

    print(f"\n✅ Saved best model -> {MODEL_PATH}")
    print(f"✅ Saved metrics -> {METRICS_PATH}")
    print(f"✅ Saved chart data -> {CHARTS_DATA_PATH}")

    return metrics_output


if __name__ == "__main__":
    train_all_models()

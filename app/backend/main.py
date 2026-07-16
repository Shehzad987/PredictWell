"""
================================================================================
 PredictWell — FastAPI Backend
================================================================================
Serves the REST API consumed by the React dashboard: dataset analytics,
model training/comparison, live predictions, prediction history, model
download, and PDF report export.

Run (from the app/backend directory):
    uvicorn main:app --reload --port 8000
================================================================================
"""

import sys
from pathlib import Path

# Make src/ importable without turning this into a full installable package —
# pragmatic for a project of this size, and keeps src/ runnable standalone
# (python src/train.py) for the ML pipeline independent of the API.
SRC_DIR = Path(__file__).resolve().parent.parent.parent / "src"
sys.path.insert(0, str(SRC_DIR))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
import io

from schemas import EmployeeInput, TrainRequest
import history
from report_generator import generate_prediction_report

from utils import MODEL_PATH, METRICS_PATH, CHARTS_DATA_PATH, MODEL_DISPLAY_NAMES, load_json

app = FastAPI(
    title="PredictWell API",
    description="Employee Burnout Prediction System — ML-powered HR analytics API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _artifacts_ready() -> bool:
    return MODEL_PATH.exists() and METRICS_PATH.exists() and CHARTS_DATA_PATH.exists()


def _require_artifacts():
    if not _artifacts_ready():
        raise HTTPException(
            status_code=503,
            detail="No trained model found yet. Run 'python src/train.py' or POST /api/models/train first.",
        )


# --------------------------------------------------------------------------
# Health
# --------------------------------------------------------------------------


@app.get("/api/health")
def health_check():
    return {
        "success": True,
        "message": "PredictWell API is running 🚀",
        "model_ready": _artifacts_ready(),
    }


# --------------------------------------------------------------------------
# Dataset Analytics
# --------------------------------------------------------------------------


@app.get("/api/dataset/summary")
def dataset_summary():
    _require_artifacts()
    charts = load_json(CHARTS_DATA_PATH)
    return {"success": True, "summary": charts["dataset_summary"]}


@app.get("/api/dataset/charts")
def dataset_charts():
    _require_artifacts()
    charts = load_json(CHARTS_DATA_PATH)
    return {
        "success": True,
        "class_distribution": charts["class_distribution"],
        "correlation_heatmap": charts["correlation_heatmap"],
        "burnout_by_role": charts["burnout_by_role"],
    }


# --------------------------------------------------------------------------
# Model Training & Comparison
# --------------------------------------------------------------------------


@app.get("/api/models/metrics")
def model_metrics():
    _require_artifacts()
    metrics = load_json(METRICS_PATH)
    charts = load_json(CHARTS_DATA_PATH)
    return {
        "success": True,
        "best_model": metrics["best_model"],
        "best_model_display_name": metrics["best_model_display_name"],
        "model_comparison": charts["model_comparison"],
        "confusion_matrix": charts["confusion_matrix"],
        "feature_importance": charts["feature_importance"],
        "results_by_model": metrics["results_by_model"],
    }


@app.post("/api/models/train")
def train_models(payload: TrainRequest = TrainRequest()):
    # Imported lazily so a slow/heavy training run never affects API startup time
    from train import train_all_models

    try:
        result = train_all_models()
    except Exception as exc:  # noqa: BLE001 — surface any training failure clearly to the UI
        raise HTTPException(status_code=500, detail=f"Training failed: {exc}") from exc

    charts = load_json(CHARTS_DATA_PATH)
    return {
        "success": True,
        "message": "Training complete",
        "best_model": result["best_model"],
        "best_model_display_name": result["best_model_display_name"],
        "model_comparison": charts["model_comparison"],
    }


# --------------------------------------------------------------------------
# Prediction Center
# --------------------------------------------------------------------------


@app.post("/api/predict")
def predict(employee: EmployeeInput):
    _require_artifacts()
    from predict import get_predictor

    predictor = get_predictor()
    employee_dict = employee.model_dump()

    try:
        result = predictor.predict(employee_dict)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Prediction failed: {exc}") from exc

    entry = history.add_entry(employee_dict, result)
    return {"success": True, "prediction": entry}


@app.get("/api/predict/history")
def prediction_history(limit: int = 50):
    return {"success": True, "history": history.get_history(limit=limit)}


@app.delete("/api/predict/history")
def clear_prediction_history():
    history.clear_history()
    return {"success": True, "message": "Prediction history cleared"}


# --------------------------------------------------------------------------
# Model Download
# --------------------------------------------------------------------------


@app.get("/api/models/download")
def download_model():
    _require_artifacts()
    return FileResponse(
        path=MODEL_PATH,
        filename="predictwell_model.pkl",
        media_type="application/octet-stream",
    )


# --------------------------------------------------------------------------
# PDF Report Export
# --------------------------------------------------------------------------


@app.get("/api/reports/{prediction_id}")
def export_report(prediction_id: str):
    entry = history.get_entry(prediction_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Prediction not found in history")

    pdf_bytes = generate_prediction_report(entry)
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=burnout_report_{prediction_id[:8]}.pdf"},
    )


# --------------------------------------------------------------------------
# Misc
# --------------------------------------------------------------------------


@app.get("/api/models/list")
def list_models():
    return {"success": True, "models": MODEL_DISPLAY_NAMES}

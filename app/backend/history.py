import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock

HISTORY_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "prediction_history.json"
MAX_HISTORY_ENTRIES = 200

_lock = Lock()


def _read_all():
    if not HISTORY_PATH.exists():
        return []
    try:
        with open(HISTORY_PATH) as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


def _write_all(entries):
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORY_PATH, "w") as f:
        json.dump(entries, f, indent=2)


def add_entry(employee: dict, result: dict) -> dict:
    entry = {
        "id": str(uuid.uuid4()),
        "employee": employee,
        "risk_level": result["risk_level"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],
        "recommendations": result["recommendations"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    with _lock:
        entries = _read_all()
        entries.insert(0, entry)  # newest first
        entries = entries[:MAX_HISTORY_ENTRIES]
        _write_all(entries)

    return entry


def get_history(limit: int = 50):
    with _lock:
        return _read_all()[:limit]


def get_entry(entry_id: str):
    with _lock:
        for entry in _read_all():
            if entry["id"] == entry_id:
                return entry
    return None


def clear_history():
    with _lock:
        _write_all([])

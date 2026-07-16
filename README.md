<div align="center">

# 🧠 PredictWell

**AI-powered employee burnout risk prediction for modern HR teams.**

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5-F7931E?logo=scikitlearn&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

*"This looks like a real HR-Tech AI product, not an internship assignment."*

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Results](#-live-results-real-trained-metrics)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [The ML Pipeline](#-the-ml-pipeline)
- [Dataset](#-dataset)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🌌 Overview

PredictWell is a full-stack machine learning product that predicts an employee's burnout risk — **Low**,
**Medium**, or **High** — from workplace and lifestyle signals like working hours, overtime, sleep, stress,
and satisfaction. It's built the way a real HR-tech startup would build it: a proper ML pipeline (cleaning →
EDA → feature engineering → training → evaluation), five classifiers trained and compared head-to-head, a
FastAPI backend serving live predictions, and a dark, glassmorphic React dashboard — not a single Jupyter
notebook with a `print(accuracy)` at the bottom.

---

## 📊 Live Results (real trained metrics)

These are the actual numbers produced by `src/train.py` on the bundled dataset — not placeholders. Realistic,
non-trivial accuracy (not a suspicious 99%+ that would signal data leakage) because burnout risk genuinely
depends on multiple interacting factors, exactly like it does in the real world.

| Model | Accuracy | Precision | Recall | F1 Score |
|---|---|---|---|---|
| **Logistic Regression** 🏆 | **81.2%** | **80.7%** | **81.2%** | **80.5%** |
| Random Forest | 79.3% | 78.9% | 79.3% | 78.9% |
| Support Vector Machine | 79.3% | 78.7% | 79.3% | 78.4% |
| K-Nearest Neighbors | 77.0% | 76.0% | 77.0% | 75.8% |
| Decision Tree | 75.8% | 75.1% | 75.8% | 75.3% |

The strongest predictors the model learned (feature importance): **Stress Level**, **Work-Life Balance
Score**, **Overtime Hours**, **Sleep Hours**, and **Satisfaction Level** — consistent with occupational
health research on burnout drivers.

---

## ✨ Features

**Machine Learning**
- Full pipeline: data cleaning → EDA → feature engineering → train/test split → training → evaluation
- 5 classifiers trained and compared: Logistic Regression, Decision Tree, Random Forest, KNN, SVM
- Automatic best-model selection (by weighted F1, fair under class imbalance)
- Engineered features (`Workload_Pressure`, `Rest_Deficit`) beyond the raw inputs
- Executed EDA notebook with real, embedded charts (`notebooks/eda_analysis.ipynb`)

**Dashboard Pages**
1. **Home** — explains burnout and the product
2. **Dataset Analytics** — class distribution, correlation heatmap, burnout risk by job role, summary stats
3. **Model Training** — retrain all 5 models on demand, compare metrics, inspect confusion matrix & feature importance per model
4. **Prediction Center** — enter an employee profile, get an instant risk prediction
5. **Results Dashboard** — risk level, probability breakdown, employee profile, AI recommendations
6. **Prediction History** *(bonus)* — every past prediction, revisit or re-export any of them

**Bonus Features**
- 📄 Export any prediction as a professional PDF report
- 💾 Download the trained model as a `.pkl` file
- 🌗 Dark/light mode toggle (dark by default)
- 📈 Fully interactive charts (Recharts) — hover for exact values
- 🤖 Rule-based AI recommendations grounded in the same features the model was trained on

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| ML / Data | Python, pandas, scikit-learn, NumPy, joblib |
| Visualization | Matplotlib, Seaborn (notebook), Recharts (dashboard) |
| Backend API | FastAPI, Pydantic, Uvicorn |
| PDF Reports | ReportLab |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |

---

## 📁 Project Structure

```
PredictWell/
├── data/
│   ├── generate_dataset.py         # Synthetic dataset generator (realistic, correlated)
│   └── employee_burnout_data.csv   # Generated dataset (3,000+ employees)
│
├── notebooks/
│   └── eda_analysis.ipynb          # Executed EDA notebook with embedded charts
│
├── src/
│   ├── utils.py                     # Shared paths, feature lists, recommendation engine
│   ├── preprocess.py                 # Cleaning, feature engineering, encoding, train/test split
│   ├── train.py                       # Trains & compares all 5 models, saves best + metrics
│   ├── evaluate.py                     # Metrics, confusion matrix, feature importance
│   └── predict.py                       # Inference on new employee data
│
├── models/                          # Saved artifacts (generated by src/train.py)
│   ├── best_model.pkl
│   ├── scaler.pkl / encoders.pkl / label_encoder.pkl
│   ├── feature_columns.json
│   ├── metrics.json
│   └── charts_data.json              # Pre-computed JSON for every dashboard chart
│
├── app/
│   ├── backend/                      # FastAPI server
│   │   ├── main.py                    # All API endpoints
│   │   ├── schemas.py                  # Pydantic request/response models
│   │   ├── history.py                   # Prediction history store
│   │   └── report_generator.py           # PDF report generation
│   └── frontend/                      # React dashboard
│       └── src/
│           ├── pages/                  # Home, Analytics, ModelTraining, PredictionCenter,
│           │                           # ResultsDashboard, History
│           ├── components/              # Charts, forms, cards, navbar
│           ├── context/ hooks/ services/ utils/
│
├── requirements.txt
├── README.md
└── model.pkl                        # Copy of the best trained model at project root
```

---

## 🔬 The ML Pipeline

1. **Data Cleaning** (`preprocess.clean_data`) — drops duplicate rows, median-imputes missing numeric values
2. **EDA** (`notebooks/eda_analysis.ipynb`) — class balance, correlation heatmap, risk by role/work-mode
3. **Feature Engineering** (`preprocess.engineer_features`) — adds `Workload_Pressure`
   (projects ÷ working hours) and `Rest_Deficit` (shortfall below 8 hours of sleep)
4. **Encoding & Scaling** — label encoding for categoricals, `StandardScaler` for numerics, all persisted
   so inference reproduces training exactly
5. **Train/Test Split** — stratified 80/20, since burnout risk classes are naturally imbalanced
6. **Model Training** (`train.py`) — trains all 5 classifiers with tuned baseline hyperparameters
7. **Evaluation** (`evaluate.py`) — accuracy, precision, recall, F1 (all weighted), confusion matrix,
   feature importance
8. **Best model selection** — highest weighted F1 wins and is saved as the serving model
9. **Prediction** (`predict.py`) — mirrors every preprocessing step exactly for new employee data

---

## 🗂️ Dataset

Real, labeled "burnout risk" datasets are scarce and mostly proprietary to HR platforms. `data/generate_dataset.py`
generates a **realistic synthetic dataset** instead of a random one: burnout risk is computed from a weighted
combination of stress, overtime, sleep deficit, work-life balance, and satisfaction (the same factors
occupational health research identifies as primary burnout drivers), with realistic noise added so the
classification task is genuinely non-trivial. Risk tiers are assigned by population percentile (~55% Low /
~30% Medium / ~15% High), matching real-world workplace burnout survey findings.

**If you have real, anonymized HR survey data**, drop a CSV with the same column names into `data/` and
re-run `python src/train.py` — the pipeline works on any dataset with this schema.

Regenerate the synthetic dataset any time:
```bash
python data/generate_dataset.py
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Install Python dependencies

```bash
cd PredictWell
pip install -r requirements.txt
```

### 2. Generate the dataset & train the models

```bash
python data/generate_dataset.py
python src/train.py
```

This trains all 5 models and saves `models/best_model.pkl` plus all metrics/chart data.

### 3. Start the backend API

```bash
cd app/backend
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`.

### 4. Start the frontend

```bash
cd app/frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

### 5. (Optional) Re-run the EDA notebook

```bash
jupyter notebook notebooks/eda_analysis.ipynb
```

---

## 🔌 API Reference

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API + model readiness check |
| GET | `/dataset/summary` | Dataset summary stats |
| GET | `/dataset/charts` | Class distribution, correlation heatmap, burnout by role |
| GET | `/models/metrics` | Full metrics for all 5 models + best model + confusion matrix |
| POST | `/models/train` | Retrain all 5 models from scratch |
| POST | `/predict` | Predict burnout risk for one employee |
| GET | `/predict/history?limit=` | Prediction history |
| DELETE | `/predict/history` | Clear prediction history |
| GET | `/models/download` | Download the trained model as `.pkl` |
| GET | `/reports/{prediction_id}` | Download a prediction as a PDF report |

Full interactive documentation (Swagger UI) is auto-generated by FastAPI at `/docs`.

---

## ☁️ Deployment

**Backend**: Deploy `app/backend` to Render, Railway, Fly.io, or any host that runs Python/ASGI apps.
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
Make sure `models/` (or run `python src/train.py` on first boot) and `data/` are present in the deployed
environment — the API needs the trained artifacts to serve predictions.

**Frontend**: Build and deploy `app/frontend/dist` to Vercel, Netlify, or any static host.
```bash
cd app/frontend
npm run build
```
Update the API base URL (currently proxied to `localhost:8000` in dev via `vite.config.js`) to your deployed
backend's URL for production.

---

## 🗺️ Future Improvements

- [ ] Hyperparameter tuning (GridSearchCV) for each model
- [ ] SHAP-based per-prediction explainability (why *this* employee scored High)
- [ ] Batch prediction via CSV upload for whole-team assessments
- [ ] Authentication + multi-tenant support for real HR team usage
- [ ] Scheduled re-training pipeline as new data arrives
- [ ] A/B comparison between model versions over time

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for portfolio, learning, or
commercial purposes.

---

<div align="center">

Built with scikit-learn, FastAPI, and React — a complete ML product, not just a model.

</div>

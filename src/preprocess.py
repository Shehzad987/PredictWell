import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

from utils import (
    RAW_DATA_PATH,
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES,
    TARGET_COLUMN,
    RISK_ORDER,
    SCALER_PATH,
    ENCODERS_PATH,
    LABEL_ENCODER_PATH,
    FEATURE_COLUMNS_PATH,
    save_artifact,
    save_json,
)


def load_raw_data(path=RAW_DATA_PATH):
    return pd.read_csv(path)


def clean_data(df):
    """Removes exact duplicate rows and imputes missing numeric values."""
    before = len(df)
    df = df.drop_duplicates().reset_index(drop=True)
    removed = before - len(df)

    for col in NUMERIC_FEATURES:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())

    df = df.dropna(subset=[TARGET_COLUMN]).reset_index(drop=True)

    print(f"🧹 Cleaning: removed {removed} duplicate rows, imputed missing numeric values with median.")
    return df


def engineer_features(df):
    """
    Adds two derived features that are well-established burnout signals in
    occupational health research, giving tree-based models useful splits
    beyond the raw inputs:
      - Workload_Pressure: projects handled per working hour
      - Rest_Deficit: how far below the 8-hour sleep guideline the employee is
    """
    df = df.copy()
    df["Workload_Pressure"] = (df["Number_of_Projects"] / df["Working_Hours_Per_Day"].replace(0, 1)).round(3)
    df["Rest_Deficit"] = (8 - df["Sleep_Hours"]).clip(lower=0).round(2)
    return df


def encode_features(df, fit=True):
    """
    Label-encodes categorical features and the target. When fit=True,
    fits new encoders and persists them; when fit=False, loads the
    previously-fitted encoders (used during inference on new data).
    """
    df = df.copy()

    if fit:
        encoders = {}
        for col in CATEGORICAL_FEATURES:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            encoders[col] = le
        save_artifact(encoders, ENCODERS_PATH)

        target_le = LabelEncoder()
        target_le.fit(RISK_ORDER)  # fixed order so class indices are stable & meaningful
        df[TARGET_COLUMN] = target_le.transform(df[TARGET_COLUMN].astype(str))
        save_artifact(target_le, LABEL_ENCODER_PATH)
    else:
        from utils import load_artifact

        encoders = load_artifact(ENCODERS_PATH)
        for col in CATEGORICAL_FEATURES:
            df[col] = encoders[col].transform(df[col].astype(str))

    return df


def scale_features(X_train, X_test=None, fit=True):
    engineered_numeric = NUMERIC_FEATURES + ["Workload_Pressure", "Rest_Deficit"]

    if fit:
        scaler = StandardScaler()
        X_train = X_train.copy()
        X_train[engineered_numeric] = scaler.fit_transform(X_train[engineered_numeric])
        save_artifact(scaler, SCALER_PATH)

        if X_test is not None:
            X_test = X_test.copy()
            X_test[engineered_numeric] = scaler.transform(X_test[engineered_numeric])
            return X_train, X_test
        return X_train
    else:
        from utils import load_artifact

        scaler = load_artifact(SCALER_PATH)
        X_train = X_train.copy()
        X_train[engineered_numeric] = scaler.transform(X_train[engineered_numeric])
        return X_train


def run_preprocessing_pipeline(test_size=0.2, random_state=42):
    """
    Runs the full pipeline end-to-end and returns train/test splits ready
    for model training. Also persists the fitted encoders/scaler and the
    final feature column order so predict.py can reproduce it exactly.
    """
    df = load_raw_data()
    df = clean_data(df)
    df = engineer_features(df)
    df = encode_features(df, fit=True)

    feature_columns = NUMERIC_FEATURES + ["Workload_Pressure", "Rest_Deficit"] + CATEGORICAL_FEATURES
    save_json(feature_columns, FEATURE_COLUMNS_PATH)

    X = df[feature_columns]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    X_train, X_test = scale_features(X_train, X_test, fit=True)

    print(f"✅ Preprocessing complete: {len(X_train)} train rows, {len(X_test)} test rows, {len(feature_columns)} features.")
    return X_train, X_test, y_train, y_test, feature_columns


if __name__ == "__main__":
    run_preprocessing_pipeline()

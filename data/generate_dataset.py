import numpy as np
import pandas as pd
from pathlib import Path

RANDOM_SEED = 42
N_SAMPLES = 3000

np.random.seed(RANDOM_SEED)

OUTPUT_PATH = Path(__file__).parent / "employee_burnout_data.csv"

JOB_ROLES = [
    "Software Engineer",
    "Data Analyst",
    "Product Manager",
    "Sales Executive",
    "HR Specialist",
    "Customer Support",
    "Marketing Executive",
    "Operations Manager",
    "Finance Analyst",
    "Designer",
]

GENDERS = ["Male", "Female", "Other"]
WORK_MODES = ["Remote", "Onsite", "Hybrid"]


def generate_dataset(n=N_SAMPLES, seed=RANDOM_SEED):
    rng = np.random.default_rng(seed)

    age = rng.integers(21, 60, size=n)
    gender = rng.choice(GENDERS, size=n, p=[0.48, 0.48, 0.04])
    job_role = rng.choice(JOB_ROLES, size=n)
    years_experience = np.clip((age - 21) * rng.uniform(0.2, 0.9, size=n), 0, 35).round(1)

    working_hours_per_day = np.clip(rng.normal(8.5, 1.8, size=n), 4, 14).round(1)
    num_projects = np.clip(rng.poisson(3, size=n), 1, 10)
    overtime_hours = np.clip((working_hours_per_day - 8) * rng.uniform(1.5, 3.5, size=n) + rng.normal(0, 1.5, size=n), 0, 25).round(1)

    sleep_hours = np.clip(8.2 - 0.28 * overtime_hours + rng.normal(0, 0.9, size=n), 3, 9.5).round(1)
    work_life_balance_score = np.clip(
        10 - 0.35 * overtime_hours - 0.5 * (working_hours_per_day - 8).clip(min=0) + rng.normal(0, 1.2, size=n), 1, 10
    ).round(1)

    stress_level = np.clip(
        3 + 0.35 * overtime_hours + 0.4 * num_projects - 0.5 * sleep_hours + rng.normal(0, 1.3, size=n), 1, 10
    ).round(1)

    remote_or_onsite = rng.choice(WORK_MODES, size=n, p=[0.35, 0.4, 0.25])
    remote_bonus = np.where(remote_or_onsite == "Remote", 0.4, np.where(remote_or_onsite == "Hybrid", 0.2, 0))

    satisfaction_level = np.clip(
        6.5 - 0.3 * stress_level + 0.4 * work_life_balance_score + remote_bonus + rng.normal(0, 1.0, size=n), 1, 10
    ).round(1)

    # ---- Composite burnout score (the "ground truth" generating process) ----
    # Weighted combination of the strongest real-world burnout predictors,
    # normalized, plus noise — this is what makes the classification task
    # realistic rather than a deterministic lookup.
    burnout_score = (
        0.28 * (stress_level / 10)
        + 0.22 * (overtime_hours / 25)
        + 0.18 * (1 - sleep_hours / 9.5)
        + 0.17 * (1 - work_life_balance_score / 10)
        + 0.15 * (1 - satisfaction_level / 10)
    )
    burnout_score += rng.normal(0, 0.06, size=n)  # measurement noise
    burnout_score = np.clip(burnout_score, 0, 1)

    # Convert the continuous score into 3 risk tiers using percentile cut
    # points (rather than fixed absolute thresholds). This keeps the class
    # balance realistic — most employees are Low risk, a meaningful minority
    # are Medium, and a smaller "at-risk" group is High — mirroring typical
    # workplace burnout survey findings (~55% / ~30% / ~15%) regardless of
    # the exact shape of the underlying score distribution.
    low_cutoff, medium_cutoff = np.percentile(burnout_score, [55, 85])
    burnout_risk = pd.cut(
        burnout_score,
        bins=[-0.01, low_cutoff, medium_cutoff, 1.01],
        labels=["Low", "Medium", "High"],
    )

    df = pd.DataFrame(
        {
            "Age": age,
            "Gender": gender,
            "Job_Role": job_role,
            "Working_Hours_Per_Day": working_hours_per_day,
            "Number_of_Projects": num_projects,
            "Sleep_Hours": sleep_hours,
            "Work_Life_Balance_Score": work_life_balance_score,
            "Stress_Level": stress_level,
            "Overtime_Hours": overtime_hours,
            "Years_of_Experience": years_experience,
            "Satisfaction_Level": satisfaction_level,
            "Remote_or_Onsite": remote_or_onsite,
            "Burnout_Risk": burnout_risk,
        }
    )

    # Inject a small amount of realistic messiness: a few missing values and
    # duplicate rows, so the "Data Cleaning" step in the pipeline has real
    # work to do rather than being a no-op.
    missing_idx = rng.choice(df.index, size=int(n * 0.015), replace=False)
    missing_cols = rng.choice(
        ["Sleep_Hours", "Satisfaction_Level", "Work_Life_Balance_Score"], size=len(missing_idx)
    )
    for idx, col in zip(missing_idx, missing_cols):
        df.loc[idx, col] = np.nan

    duplicate_rows = df.sample(n=int(n * 0.01), random_state=seed)
    df = pd.concat([df, duplicate_rows], ignore_index=True)

    return df.sample(frac=1, random_state=seed).reset_index(drop=True)


if __name__ == "__main__":
    dataset = generate_dataset()
    dataset.to_csv(OUTPUT_PATH, index=False)
    print(f"✅ Generated {len(dataset)} rows -> {OUTPUT_PATH}")
    print("\nBurnout Risk distribution:")
    print(dataset["Burnout_Risk"].value_counts())

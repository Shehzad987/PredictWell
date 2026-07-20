from typing import Optional
from pydantic import BaseModel, Field


class EmployeeInput(BaseModel):
    Age: int = Field(..., ge=18, le=75)
    Gender: str
    Job_Role: str
    Working_Hours_Per_Day: float = Field(..., ge=1, le=16)
    Number_of_Projects: int = Field(..., ge=1, le=15)
    Sleep_Hours: float = Field(..., ge=0, le=12)
    Work_Life_Balance_Score: float = Field(..., ge=1, le=10)
    Stress_Level: float = Field(..., ge=1, le=10)
    Overtime_Hours: float = Field(..., ge=0, le=30)
    Years_of_Experience: float = Field(..., ge=0, le=45)
    Satisfaction_Level: float = Field(..., ge=1, le=10)
    Remote_or_Onsite: str

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 34,
                "Gender": "Female",
                "Job_Role": "Software Engineer",
                "Working_Hours_Per_Day": 9.5,
                "Number_of_Projects": 4,
                "Sleep_Hours": 6.0,
                "Work_Life_Balance_Score": 5.0,
                "Stress_Level": 7.0,
                "Overtime_Hours": 5.0,
                "Years_of_Experience": 6,
                "Satisfaction_Level": 5.5,
                "Remote_or_Onsite": "Onsite",
            }
        }


class PredictionResponse(BaseModel):
    id: str
    risk_level: str
    confidence: float
    probabilities: dict
    recommendations: list[str]
    employee: dict
    created_at: str


class TrainRequest(BaseModel):
    # Reserved for future use (e.g. selecting a specific algorithm to
    # highlight); training always runs the full comparison suite so the
    # dashboard's model comparison chart stays complete and up to date.
    notes: Optional[str] = None

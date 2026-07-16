"""
================================================================================
 PredictWell — PDF Report Generator
================================================================================
Builds a clean, professional one-page PDF summary of a single prediction:
employee inputs, predicted risk level, class probabilities, and AI
recommendations. Used by the "Export Prediction Reports (.pdf)" feature.
================================================================================
"""

import io
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

RISK_COLORS = {
    "Low": colors.HexColor("#10B981"),
    "Medium": colors.HexColor("#F59E0B"),
    "High": colors.HexColor("#EF4444"),
}

BRAND_PURPLE = colors.HexColor("#8B5CF6")
DARK_TEXT = colors.HexColor("#0F172A")


def generate_prediction_report(entry: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleStyle", parent=styles["Title"], textColor=BRAND_PURPLE, fontSize=22)
    heading_style = ParagraphStyle("HeadingStyle", parent=styles["Heading2"], textColor=DARK_TEXT, spaceBefore=14, spaceAfter=6)
    body_style = ParagraphStyle("BodyStyle", parent=styles["Normal"], fontSize=10.5, leading=15)
    risk_style = ParagraphStyle(
        "RiskStyle",
        parent=styles["Title"],
        fontSize=28,
        textColor=RISK_COLORS.get(entry["risk_level"], DARK_TEXT),
        spaceBefore=4,
        spaceAfter=4,
    )

    elements = []

    elements.append(Paragraph("PredictWell", title_style))
    elements.append(Paragraph("Employee Burnout Risk Report", styles["Heading3"]))
    elements.append(
        Paragraph(
            f"Generated {datetime.fromisoformat(entry['created_at']).strftime('%B %d, %Y at %I:%M %p UTC')}",
            body_style,
        )
    )
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", color=colors.HexColor("#E2E8F0")))
    elements.append(Spacer(1, 10))

    # ---- Prediction result ----
    elements.append(Paragraph("Predicted Burnout Risk", heading_style))
    elements.append(Paragraph(f"{entry['risk_level']} Risk", risk_style))
    elements.append(Paragraph(f"Model confidence: {entry['confidence'] * 100:.1f}%", body_style))

    prob_rows = [["Risk Level", "Probability"]]
    for level in ["Low", "Medium", "High"]:
        prob_rows.append([level, f"{entry['probabilities'].get(level, 0) * 100:.1f}%"])

    prob_table = Table(prob_rows, colWidths=[8 * cm, 6 * cm])
    prob_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
            ]
        )
    )
    elements.append(Spacer(1, 8))
    elements.append(prob_table)

    # ---- Employee profile ----
    elements.append(Paragraph("Employee Profile", heading_style))
    emp = entry["employee"]
    profile_rows = [
        ["Age", emp.get("Age"), "Job Role", emp.get("Job_Role")],
        ["Gender", emp.get("Gender"), "Work Mode", emp.get("Remote_or_Onsite")],
        ["Working Hours/Day", emp.get("Working_Hours_Per_Day"), "Overtime Hours", emp.get("Overtime_Hours")],
        ["Sleep Hours", emp.get("Sleep_Hours"), "Number of Projects", emp.get("Number_of_Projects")],
        ["Work-Life Balance", emp.get("Work_Life_Balance_Score"), "Stress Level", emp.get("Stress_Level")],
        ["Years of Experience", emp.get("Years_of_Experience"), "Satisfaction Level", emp.get("Satisfaction_Level")],
    ]
    profile_table = Table(profile_rows, colWidths=[4.5 * cm, 3 * cm, 4.5 * cm, 3 * cm])
    profile_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#64748B")),
                ("TEXTCOLOR", (2, 0), (2, -1), colors.HexColor("#64748B")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ]
        )
    )
    elements.append(Spacer(1, 8))
    elements.append(profile_table)

    # ---- Recommendations ----
    elements.append(Paragraph("AI Recommendations", heading_style))
    for i, rec in enumerate(entry["recommendations"], 1):
        elements.append(Paragraph(f"{i}. {rec}", body_style))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", color=colors.HexColor("#E2E8F0")))
    elements.append(Spacer(1, 6))
    elements.append(
        Paragraph(
            "This report is generated by an automated machine learning model and is intended to support, "
            "not replace, professional HR and clinical judgment.",
            ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=colors.HexColor("#94A3B8")),
        )
    )

    doc.build(elements)
    buffer.seek(0)
    return buffer.read()

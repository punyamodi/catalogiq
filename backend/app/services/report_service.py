import io
from datetime import datetime
from typing import Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT


def _score_color(score: float):
    if score >= 75:
        return colors.HexColor("#22c55e")
    if score >= 50:
        return colors.HexColor("#f59e0b")
    return colors.HexColor("#ef4444")


def generate_report(analysis_data: Dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("Title", parent=styles["Heading1"], alignment=TA_CENTER, fontSize=20, spaceAfter=6)
    subtitle_style = ParagraphStyle("Subtitle", parent=styles["Normal"], alignment=TA_CENTER, fontSize=11, textColor=colors.grey, spaceAfter=20)
    heading_style = ParagraphStyle("Heading", parent=styles["Heading2"], fontSize=13, spaceBefore=14, spaceAfter=6)
    body_style = styles["BodyText"]

    elements = []

    elements.append(Paragraph("CatalogIQ Analysis Report", title_style))
    elements.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y at %H:%M')}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0")))
    elements.append(Spacer(1, 0.2 * inch))

    scores = analysis_data.get("scores", {})
    overall = scores.get("overall_score", 0)

    elements.append(Paragraph(f"Overall Score: {overall:.1f} / 100", heading_style))
    elements.append(Paragraph(analysis_data.get("summary", ""), body_style))
    elements.append(Spacer(1, 0.2 * inch))

    score_rows = [
        ["Dimension", "Score", "Grade"],
        ["Content Quality", f"{scores.get('content_score', 0):.1f}", _grade(scores.get('content_score', 0))],
        ["Readability", f"{scores.get('readability_score', 0):.1f}", _grade(scores.get('readability_score', 0))],
        ["Structure & Organization", f"{scores.get('structure_score', 0):.1f}", _grade(scores.get('structure_score', 0))],
        ["Product Information", f"{scores.get('product_info_score', 0):.1f}", _grade(scores.get('product_info_score', 0))],
        ["Formatting Quality", f"{scores.get('formatting_score', 0):.1f}", _grade(scores.get('formatting_score', 0))],
    ]

    table = Table(score_rows, colWidths=[3 * inch, 1.5 * inch, 1.5 * inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e293b")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 0.2 * inch))

    strengths = analysis_data.get("strengths", [])
    if strengths:
        elements.append(Paragraph("Strengths", heading_style))
        for s in strengths:
            elements.append(Paragraph(f"• {s}", body_style))
        elements.append(Spacer(1, 0.1 * inch))

    weaknesses = analysis_data.get("weaknesses", [])
    if weaknesses:
        elements.append(Paragraph("Weaknesses", heading_style))
        for w in weaknesses:
            elements.append(Paragraph(f"• {w}", body_style))
        elements.append(Spacer(1, 0.1 * inch))

    recommendations = analysis_data.get("recommendations", [])
    if recommendations:
        elements.append(Paragraph("Recommendations", heading_style))
        for r in recommendations:
            elements.append(Paragraph(f"• {r}", body_style))
        elements.append(Spacer(1, 0.1 * inch))

    issues = analysis_data.get("issues", [])
    if issues:
        elements.append(Paragraph("Issues Found", heading_style))
        for issue in issues:
            severity = issue.get("severity", "low").upper()
            cat = issue.get("category", "")
            desc = issue.get("description", "")
            sug = issue.get("suggestion", "")
            elements.append(Paragraph(f"[{severity}] {cat}: {desc}", body_style))
            if sug:
                elements.append(Paragraph(f"  Suggestion: {sug}", body_style))
            elements.append(Spacer(1, 0.05 * inch))

    doc.build(elements)
    return buffer.getvalue()


def _grade(score: float) -> str:
    if score >= 90:
        return "A+"
    if score >= 80:
        return "A"
    if score >= 70:
        return "B"
    if score >= 60:
        return "C"
    if score >= 50:
        return "D"
    return "F"

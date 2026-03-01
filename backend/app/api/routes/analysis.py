from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import io

from app.database import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse, AnalysisListItem, CompareRequest
from app.services.pdf_service import extract_pdf_text, get_pdf_metadata
from app.services.analyzer import analyze_catalog
from app.services.report_service import generate_report
from app.config import settings

router = APIRouter()


def _format_response(a: Analysis) -> dict:
    return {
        "id": a.id,
        "filename": a.filename,
        "file_size": a.file_size,
        "page_count": a.page_count,
        "word_count": a.word_count,
        "scores": {
            "content_score": a.content_score or 0.0,
            "readability_score": a.readability_score or 0.0,
            "structure_score": a.structure_score or 0.0,
            "product_info_score": a.product_info_score or 0.0,
            "formatting_score": a.formatting_score or 0.0,
            "overall_score": a.overall_score or 0.0,
        },
        "summary": a.summary or "",
        "strengths": a.strengths or [],
        "weaknesses": a.weaknesses or [],
        "recommendations": a.recommendations or [],
        "issues": a.issues or [],
        "llm_provider": a.llm_provider or "",
        "llm_model": a.llm_model or "",
        "created_at": a.created_at,
    }


def _active_model() -> str:
    if settings.LLM_PROVIDER == "openai":
        return settings.OPENAI_MODEL
    if settings.LLM_PROVIDER == "ollama":
        return settings.OLLAMA_MODEL
    return settings.HUGGINGFACE_MODEL


@router.post("/", response_model=AnalysisResponse)
async def create_analysis(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()

    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.MAX_FILE_SIZE_MB} MB limit.")

    metadata = get_pdf_metadata(content)
    text = extract_pdf_text(content)

    if not text.strip():
        raise HTTPException(status_code=422, detail="No extractable text found in this PDF.")

    result = analyze_catalog(text)

    record = Analysis(
        filename=file.filename,
        file_size=len(content),
        page_count=metadata.get("page_count"),
        word_count=len(text.split()),
        overall_score=result["overall_score"],
        content_score=result["content_score"],
        readability_score=result["readability_score"],
        structure_score=result["structure_score"],
        product_info_score=result["product_info_score"],
        formatting_score=result["formatting_score"],
        summary=result.get("summary", ""),
        strengths=result.get("strengths", []),
        weaknesses=result.get("weaknesses", []),
        recommendations=result.get("recommendations", []),
        issues=result.get("issues", []),
        llm_provider=settings.LLM_PROVIDER,
        llm_model=_active_model(),
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return _format_response(record)


@router.get("/", response_model=List[AnalysisListItem])
def list_analyses(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return (
        db.query(Analysis)
        .order_by(Analysis.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return _format_response(record)


@router.delete("/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully."}


@router.post("/compare")
def compare_analyses(request: CompareRequest, db: Session = Depends(get_db)):
    a1 = db.query(Analysis).filter(Analysis.id == request.analysis_id_1).first()
    a2 = db.query(Analysis).filter(Analysis.id == request.analysis_id_2).first()

    if not a1 or not a2:
        raise HTTPException(status_code=404, detail="One or both analyses not found.")

    diff_keys = ["overall_score", "content_score", "readability_score", "structure_score", "product_info_score", "formatting_score"]
    comparison = {}
    for key in diff_keys:
        v1 = getattr(a1, key) or 0
        v2 = getattr(a2, key) or 0
        comparison[key.replace("_score", "_diff")] = round(v2 - v1, 2)

    comparison["winner"] = a1.filename if (a1.overall_score or 0) >= (a2.overall_score or 0) else a2.filename

    return {
        "analysis_1": _format_response(a1),
        "analysis_2": _format_response(a2),
        "comparison": comparison,
    }


@router.get("/{analysis_id}/report")
def download_report(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    data = _format_response(record)
    pdf_bytes = generate_report(data)

    filename = record.filename.replace(".pdf", "") + "_report.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ScoreBreakdown(BaseModel):
    content_score: float
    readability_score: float
    structure_score: float
    product_info_score: float
    formatting_score: float
    overall_score: float


class AnalysisIssue(BaseModel):
    category: str
    severity: str
    description: str
    suggestion: str


class AnalysisResponse(BaseModel):
    id: int
    filename: str
    file_size: Optional[int] = None
    page_count: Optional[int] = None
    word_count: Optional[int] = None
    scores: ScoreBreakdown
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    issues: List[AnalysisIssue]
    llm_provider: str
    llm_model: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalysisListItem(BaseModel):
    id: int
    filename: str
    overall_score: float
    page_count: Optional[int] = None
    word_count: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class CompareRequest(BaseModel):
    analysis_id_1: int
    analysis_id_2: int


class SettingsUpdate(BaseModel):
    llm_provider: Optional[str] = None
    huggingface_api_token: Optional[str] = None
    huggingface_model: Optional[str] = None
    openai_api_key: Optional[str] = None
    openai_model: Optional[str] = None
    ollama_base_url: Optional[str] = None
    ollama_model: Optional[str] = None

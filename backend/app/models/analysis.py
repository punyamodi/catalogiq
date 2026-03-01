from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer)
    page_count = Column(Integer)
    word_count = Column(Integer)

    overall_score = Column(Float)
    content_score = Column(Float)
    readability_score = Column(Float)
    structure_score = Column(Float)
    product_info_score = Column(Float)
    formatting_score = Column(Float)

    summary = Column(Text)
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    recommendations = Column(JSON)
    issues = Column(JSON)

    llm_provider = Column(String(50))
    llm_model = Column(String(100))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

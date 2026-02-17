"""Standardized response models for predictable outputs."""
from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime
import uuid


class SuccessResponse(BaseModel):
    """Standard success response schema."""
    status: str = "success"
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    data: Any


class ErrorResponse(BaseModel):
    """Standard error response schema."""
    status: str = "error"
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    error: str
    detail: Optional[str] = None


class AnalysisResponse(BaseModel):
    """Schema for analysis endpoint response."""
    analysis: str = Field(..., description="Charter-compliant pedagogical analysis")
    pedagogical_score: int = Field(..., description="Quality score 0-100", ge=0, le=100)
    score_reasoning: str = Field(..., description="Brief explanation of the score")
    processing_time_seconds: float = Field(..., description="Total processing time")
    review_ratio: Optional[float] = Field(None, description="Review keywords ratio 0-100")
    question_velocity: Optional[float] = Field(None, description="Questions per 10 min")
    wait_time: Optional[float] = Field(None, description="Avg silence after question in seconds")
    teacher_talking_time: Optional[float] = Field(None, description="Teacher voice % 0-100")
    hinglish_fluency: Optional[float] = Field(None, description="Code-switching accuracy 0-100")

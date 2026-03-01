from fastapi import APIRouter
from app.config import settings

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "llm_provider": settings.LLM_PROVIDER,
    }


@router.get("/config")
def get_config():
    return {
        "llm_provider": settings.LLM_PROVIDER,
        "llm_model": _active_model(),
        "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
    }


def _active_model() -> str:
    if settings.LLM_PROVIDER == "openai":
        return settings.OPENAI_MODEL
    if settings.LLM_PROVIDER == "ollama":
        return settings.OLLAMA_MODEL
    return settings.HUGGINGFACE_MODEL

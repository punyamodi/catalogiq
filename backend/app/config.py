from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "CatalogIQ API"
    VERSION: str = "2.0.0"
    DESCRIPTION: str = "AI-powered catalog quality analysis platform"

    DATABASE_URL: str = "sqlite:///./catalogiq.db"

    LLM_PROVIDER: str = "huggingface"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    HUGGINGFACE_API_TOKEN: str = ""
    HUGGINGFACE_MODEL: str = "mistralai/Mistral-7B-Instruct-v0.2"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"

    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    MAX_FILE_SIZE_MB: int = 50

    class Config:
        env_file = ".env"


settings = Settings()

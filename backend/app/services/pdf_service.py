import io
from typing import Dict, Any
import pdfplumber


def extract_pdf_text(content: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def get_pdf_metadata(content: bytes) -> Dict[str, Any]:
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        return {
            "page_count": len(pdf.pages),
            "metadata": pdf.metadata or {},
        }

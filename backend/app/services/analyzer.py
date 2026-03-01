import json
import re
from typing import Dict, Any
from app.config import settings


ANALYSIS_PROMPT = """You are an expert catalog quality analyst. Analyze the catalog text below and return a JSON quality assessment.

Score each dimension from 0 to 100:
- content_score: Grammar, accuracy, completeness of information
- readability_score: Reading ease, sentence clarity, language quality
- structure_score: Logical organization, section flow, categorization
- product_info_score: Completeness of product details, specs, pricing
- formatting_score: Consistency, layout coherence, visual presentation

Return ONLY valid JSON in this exact format with no other text:
{{
  "content_score": <number>,
  "readability_score": <number>,
  "structure_score": <number>,
  "product_info_score": <number>,
  "formatting_score": <number>,
  "summary": "<2-3 sentence quality overview>",
  "strengths": ["<strength>", "<strength>", "<strength>"],
  "weaknesses": ["<weakness>", "<weakness>"],
  "recommendations": ["<rec>", "<rec>", "<rec>"],
  "issues": [
    {{
      "category": "<category>",
      "severity": "<high|medium|low>",
      "description": "<description>",
      "suggestion": "<how to fix>"
    }}
  ]
}}

Catalog text:
{text}"""


def _get_llm():
    if settings.LLM_PROVIDER == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.2,
        )
    elif settings.LLM_PROVIDER == "ollama":
        from langchain_community.llms import Ollama
        return Ollama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL)
    else:
        from langchain_community.llms import HuggingFaceHub
        return HuggingFaceHub(
            repo_id=settings.HUGGINGFACE_MODEL,
            huggingfacehub_api_token=settings.HUGGINGFACE_API_TOKEN,
            model_kwargs={"temperature": 0.2, "max_new_tokens": 2048},
        )


def _extract_json(text: str) -> dict:
    match = re.search(r'\{[\s\S]*\}', text)
    if not match:
        return {}
    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return {}


def _clamp_score(value: Any) -> float:
    try:
        return round(max(0.0, min(100.0, float(value))), 2)
    except (TypeError, ValueError):
        return 50.0


def _fallback_analysis() -> Dict[str, Any]:
    return {
        "content_score": 0.0,
        "readability_score": 0.0,
        "structure_score": 0.0,
        "product_info_score": 0.0,
        "formatting_score": 0.0,
        "overall_score": 0.0,
        "summary": "Analysis could not be completed due to a processing error.",
        "strengths": [],
        "weaknesses": ["Analysis failed — check LLM configuration."],
        "recommendations": ["Verify your API key and LLM provider settings."],
        "issues": [
            {
                "category": "System",
                "severity": "high",
                "description": "LLM returned an unparseable response.",
                "suggestion": "Check API keys and model availability in Settings.",
            }
        ],
    }


def analyze_catalog(text: str) -> Dict[str, Any]:
    truncated = text[:6000] + "\n...[truncated]" if len(text) > 6000 else text
    prompt = ANALYSIS_PROMPT.format(text=truncated)

    try:
        llm = _get_llm()
        raw = llm.invoke(prompt)
        response_text = raw.content if hasattr(raw, "content") else str(raw)
    except Exception:
        return _fallback_analysis()

    data = _extract_json(response_text)
    if not data:
        return _fallback_analysis()

    score_keys = ["content_score", "readability_score", "structure_score", "product_info_score", "formatting_score"]
    for key in score_keys:
        data[key] = _clamp_score(data.get(key, 50))

    scores = [data[k] for k in score_keys]
    data["overall_score"] = round(sum(scores) / len(scores), 2)

    data.setdefault("summary", "")
    data.setdefault("strengths", [])
    data.setdefault("weaknesses", [])
    data.setdefault("recommendations", [])
    data.setdefault("issues", [])

    return data

"""
interfaces/api.py
=================
FastAPI REST API for VistaSecure AI.

Endpoints
---------
POST /analyze           – analyse a single prompt
POST /analyze-multi     – analyse a text file (one prompt per line)
GET  /health            – health check
GET  /categories        – list all 14 OWASP LLM vulnerability categories
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from core.scoring import ScoringEngine, ALL_CATEGORIES, _slug_to_display

app = FastAPI(
    title="VistaSecure AI",
    description=(
        "AI Prompt Security Analyzer — evaluates prompts against all 14 "
        "OWASP LLM vulnerability categories."
    ),
    version="1.0.0",
)

# Single shared engine instance (all state is read-only after init)
_scoring_engine = ScoringEngine()


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="The prompt text to analyse.")
    include_engine_breakdown: bool = Field(
        False,
        description="If true, includes per-engine raw scores in the response.",
    )


class ThreatItem(BaseModel):
    category: str
    display_name: str
    score: float


class AnalyzeResponse(BaseModel):
    overall_score: int
    risk_level: str
    top_threats: list[ThreatItem]
    engine_breakdown: Optional[dict[str, dict[str, float]]] = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.post("/analyze", response_model=AnalyzeResponse, tags=["Analysis"])
def analyze_prompt(req: AnalyzeRequest) -> AnalyzeResponse:
    """
    Analyse a single prompt for AI security risks.

    Returns an overall risk score (0-100), risk level, and top threats.
    """
    result = _scoring_engine.analyze(req.prompt)

    if not req.include_engine_breakdown:
        result.pop("engine_breakdown", None)
    
    result.pop("category_scores", None)

    return AnalyzeResponse(**result)


@app.post("/analyze-multi", tags=["Analysis"])
async def analyze_multi(file: UploadFile = File(...)):
    """
    Upload a UTF-8 text file containing prompts (one per line).

    Returns a list of analysis results plus aggregate statistics.
    """
    contents = await file.read()
    try:
        text = contents.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid file encoding. Only UTF-8 text files are supported.",
            )

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        raise HTTPException(status_code=400, detail="File is empty or has no valid lines.")

    results = []
    total_score = 0
    max_score = 0
    max_prompt = ""

    for line in lines:
        analysis = _scoring_engine.analyze(line)
        analysis.pop("engine_breakdown", None)   # keep response lean
        analysis.pop("category_scores", None)
        analysis["prompt"] = line
        results.append(analysis)

        score = analysis["overall_score"]
        total_score += score
        if score > max_score:
            max_score = score
            max_prompt = line

    avg_score = round(total_score / len(lines), 2)

    return {
        "filename": file.filename,
        "total_prompts": len(lines),
        "max_score": max_score,
        "max_score_prompt": max_prompt,
        "average_score": avg_score,
        "overall_risk_level": _classify_batch(avg_score, max_score),
        "results": results,
    }


@app.get("/categories", tags=["Meta"])
def list_categories():
    """List all 14 OWASP LLM vulnerability categories that VistaSecure analyses."""
    return {
        "categories": [
            {"slug": slug, "display_name": _slug_to_display(slug)}
            for slug in ALL_CATEGORIES
        ]
    }


@app.get("/health", tags=["Meta"])
def health_check():
    """Basic health check endpoint."""
    return {"status": "healthy", "engine_count": 3}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _classify_batch(avg: float, maximum: float) -> str:
    """Batch risk = driven by max score but tempered by average."""
    blended = maximum * 0.7 + avg * 0.3
    if blended >= 80:
        return "Critical"
    elif blended >= 55:
        return "High"
    elif blended >= 25:
        return "Medium"
    return "Low"

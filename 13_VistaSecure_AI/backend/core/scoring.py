"""
scoring.py
==========
Central scoring orchestrator.

Design goals
------------
1. **Layered analysis** — runs Layer 1 (problem-specific heuristics & rules),
   then Layer 2 (ML model), and evaluates/aggregates them in Layer 3.

2. **Sum-based aggregation per category** — each category's final score is
   the sum of all engine scores for that category, capped at 100.  This
   means a prompt that triggers both heuristics AND rules ranks higher than
   one that only triggers one engine, which is exactly the desired behaviour.

3. **14 OWASP LLM category coverage** — every engine must return a dict
   keyed by the 14 canonical category slugs defined in ALL_CATEGORIES.

4. **Structured output** — the final result includes:
     - overall_score (0-100)  ← weighted average of top-N category scores
     - risk_level (Low / Medium / High / Critical)
     - top_threats (top-3 flagged categories)
     - category_scores (full per-category dict)
     - engine_breakdown (per-engine raw scores, for debugging)
"""

from __future__ import annotations

from core.problems import analyze_problems
from core.ml_engine import MLEngine

# ---------------------------------------------------------------------------
# Canonical categories (OWASP LLM Top 14)
# ---------------------------------------------------------------------------

ALL_CATEGORIES: list[str] = [
    "direct_prompt_injection",
    "indirect_prompt_injection",
    "training_data_poisoning",
    "model_poisoning",
    "sensitive_information_disclosure",
    "excessive_agency",
    "insecure_plugin_design",
    "insecure_output_handling",
    "model_denial_of_service",
    "supply_chain_vulnerabilities",
    "system_prompt_leakage",
    "vector_embedding_weaknesses",
    "overreliance_hallucination",
    "model_theft_extraction",
]


# ---------------------------------------------------------------------------
# Risk classification
# ---------------------------------------------------------------------------

def _classify_risk(score: float) -> str:
    if score >= 80:
        return "Critical"
    elif score >= 55:
        return "High"
    elif score >= 25:
        return "Medium"
    else:
        return "Low"


# ---------------------------------------------------------------------------
# ScoringEngine
# ---------------------------------------------------------------------------

class ScoringEngine:
    """
    Orchestrates Layer 1 (Modular Problems) and Layer 2 (ML Model) to evaluate overall risk.
    """

    def __init__(self):
        self._ml_engine = MLEngine()

    def analyze(self, prompt: str) -> dict:
        """
        Analyze a prompt and return a comprehensive risk report.
        """
        # Layer 1: Heuristic & Rule analysis for each problem
        problems_results = analyze_problems(prompt)

        # Layer 2: Model (ML Engine) analysis on the prompt
        ml_results = self._ml_engine.analyze(prompt)

        # Structure individual engine outputs for breakdown
        engine_results = {
            "heuristic": {
                cat: float(problems_results.get(cat, {}).get("heuristic", 0.0))
                for cat in ALL_CATEGORIES
            },
            "rule_engine": {
                cat: float(problems_results.get(cat, {}).get("rules", 0.0))
                for cat in ALL_CATEGORIES
            },
            "ml_engine": {
                cat: float(ml_results.get(cat, 0.0))
                for cat in ALL_CATEGORIES
            }
        }

        # Step 2: Aggregate per-category (weighted sum, capped at 100)
        weights = {
            "heuristic": 1.0,
            "rule_engine": 1.2,
            "ml_engine": 0.8
        }
        total_weight = sum(weights.values())

        category_scores: dict[str, float] = {}
        for cat in ALL_CATEGORIES:
            weighted_sum = (
                engine_results["heuristic"][cat] * weights["heuristic"] +
                engine_results["rule_engine"][cat] * weights["rule_engine"] +
                engine_results["ml_engine"][cat] * weights["ml_engine"]
            )
            normalised_score = weighted_sum / total_weight
            category_scores[cat] = round(min(normalised_score, 100.0), 2)

        # Step 3: Overall score = weighted average of all category scores
        if category_scores:
            sorted_scores = sorted(category_scores.values(), reverse=True)
            n = len(sorted_scores)
            avg_weights = [1.0 / (i + 1) for i in range(n)]   # 1, 0.5, 0.33, ...
            total_w = sum(avg_weights)
            overall = sum(s * w for s, w in zip(sorted_scores, avg_weights)) / total_w
        else:
            overall = 0.0

        overall_score = min(int(round(overall)), 100)

        # Step 4: Top threats
        top_threats = [
            {
                "category": cat,
                "display_name": _slug_to_display(cat),
                "score": category_scores[cat],
            }
            for cat in sorted(category_scores, key=category_scores.get, reverse=True)[:3]
        ]

        return {
            "overall_score": overall_score,
            "risk_level": _classify_risk(overall_score),
            "top_threats": top_threats,
            "category_scores": category_scores,
            "engine_breakdown": engine_results,
        }


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_DISPLAY_NAMES: dict[str, str] = {
    "direct_prompt_injection":          "Direct Prompt Injection",
    "indirect_prompt_injection":        "Indirect Prompt Injection",
    "training_data_poisoning":          "Training Data Poisoning",
    "model_poisoning":                  "Model Poisoning",
    "sensitive_information_disclosure": "Sensitive Information Disclosure",
    "excessive_agency":                 "Excessive Agency",
    "insecure_plugin_design":           "Insecure Plugin Design",
    "insecure_output_handling":         "Insecure Output Handling",
    "model_denial_of_service":          "Model Denial of Service (DoS)",
    "supply_chain_vulnerabilities":     "Supply Chain Vulnerabilities",
    "system_prompt_leakage":            "System Prompt Leakage",
    "vector_embedding_weaknesses":      "Vector and Embedding Weaknesses",
    "overreliance_hallucination":       "Overreliance and Hallucination",
    "model_theft_extraction":           "Model Theft and Extraction",
}


def _slug_to_display(slug: str) -> str:
    return _DISPLAY_NAMES.get(slug, slug.replace("_", " ").title())


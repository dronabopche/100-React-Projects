"""
core/__init__.py
================
Public surface of the core analysis package.

Exports:
  - ScoringEngine   – main orchestrator used by the API layer
  - ALL_CATEGORIES  – list of 14 OWASP LLM category slugs
  - analyse()       – convenience one-shot analysis function
"""

from core.scoring import ScoringEngine, ALL_CATEGORIES

_engine = ScoringEngine()


def analyse(prompt: str) -> dict:
    """
    One-shot convenience wrapper around ScoringEngine.

    Parameters
    ----------
    prompt : str
        The text to analyse.

    Returns
    -------
    Full risk report dict — same structure as ScoringEngine.analyze().
    """
    return _engine.analyze(prompt)


__all__ = ["ScoringEngine", "ALL_CATEGORIES", "analyse"]
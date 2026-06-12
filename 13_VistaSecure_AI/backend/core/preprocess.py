"""
preprocess.py
=============
Input preprocessing and normalisation utilities.

All engines call these helpers before analysis so every engine
sees the same cleaned representation of the prompt.
"""

import re
import unicodedata


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def normalize_text(text: str) -> str:
    """
    Normalize text:
      - NFKC unicode normalisation (handles fancy-quote attacks, zero-width chars…)
      - lowercase
      - collapse whitespace
    """
    text = unicodedata.normalize("NFKC", text)
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    return text


def remove_punctuation(text: str) -> str:
    """Remove all punctuation except hyphens (keeps 'zero-day' together)."""
    return re.sub(r"[^\w\s\-]", "", text)


def tokenize(text: str) -> list[str]:
    """
    Tokenize the input text into words.

    Pipeline:
      1. Normalize unicode + lowercase
      2. Strip punctuation (keep hyphens)
      3. Split on whitespace
      4. Drop empty tokens
    """
    normalized = normalize_text(text)
    cleaned = remove_punctuation(normalized)
    tokens = [t for t in cleaned.split() if t]
    return tokens


# Legacy alias used by heuristic.py
def tokenizer(text: str) -> list[str]:
    return tokenize(text)
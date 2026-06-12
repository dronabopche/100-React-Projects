from core.problems import evaluate_problem

KEYWORDS = [
    "infinite loop", "repeat forever", "keep saying", "flood",
    "overwhelm", "resource exhaustion", "recursive", "context window",
    "token bomb", "very long", "fill the context", "spam",
    "denial of service", "dos attack", "overload",
]

RULES = [
    {
        "pattern": r"\b(repeat|say|write|print)\s+(the\s+)?(following\s+)?\d{3,}\s+times\b",
        "severity": 85,
    },
    {
        "pattern": r"\b(infinite|endless|forever|non.stop)\b.{0,20}\b(loop|repeat|cycle)\b",
        "severity": 90,
    },
    {
        "pattern": r"\b(fill|max(imize)?|exhaust)\s+(the\s+)?(context|token|window)\b",
        "severity": 88,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

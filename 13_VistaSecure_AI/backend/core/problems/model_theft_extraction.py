from core.problems import evaluate_problem

KEYWORDS = [
    "replicate model", "steal model", "extract weights", "copy model",
    "clone model", "reverse engineer", "model extraction", "membership inference",
    "reconstruction attack", "invert model", "copy outputs", "distill model",
    "query model repeatedly", "steal training data",
]

RULES = [
    {
        "pattern": r"\b(extract|steal|copy|clone|replicate|distill)\s+(the\s+)?(model|weights?|parameters?)\b",
        "severity": 92,
    },
    {
        "pattern": r"\b(model\s+extraction|membership\s+inference|model\s+inversion)\b",
        "severity": 95,
    },
    {
        "pattern": r"\b(reverse\s+engineer)\s+(the\s+)?(model|ai|system)\b",
        "severity": 90,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

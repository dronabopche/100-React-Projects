from core.problems import evaluate_problem

KEYWORDS = [
    "make up", "hallucinate", "fabricate", "invent", "generate fake",
    "pretend you know", "make it sound real", "create false", "lie about",
    "fake citation", "false information", "misinformation", "incorrect fact",
    "confabulate", "wrong answer accepted",
]

RULES = [
    {
        "pattern": r"\b(make\s+up|fabricate|invent|hallucinate)\s+(an?\s+)?(answer|fact|citation|study|data)\b",
        "severity": 80,
    },
    {
        "pattern": r"\b(fake\s+(citation|reference|source|study)|false\s+information)\b",
        "severity": 85,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

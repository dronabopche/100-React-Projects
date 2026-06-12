from core.problems import evaluate_problem

KEYWORDS = [
    "embedding attack", "vector store", "nearest neighbor exploit",
    "semantic similarity attack", "adversarial query", "retrieval attack",
    "rag poisoning", "knowledge base injection", "retrieval manipulation",
    "embedding inversion", "vector database",
]

RULES = [
    {
        "pattern": r"\b(embedding\s+(attack|exploit|inversion)|vector\s+(store|database)\s+(poison|manipulate|exploit))\b",
        "severity": 88,
    },
    {
        "pattern": r"\b(rag\s+poison|retrieval\s+(manipulate|poison|attack))\b",
        "severity": 90,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

from core.problems import evaluate_problem

KEYWORDS = [
    "poisoned data", "backdoor trigger", "training data", "adversarial example",
    "corrupt dataset", "data manipulation", "inject training", "mislabeled",
    "trojan model", "hidden trigger", "model manipulation",
]

RULES = [
    {
        "pattern": r"\b(poison(ed|ing)?|corrupt)\s+(the\s+)?(training\s+)?(data|dataset|model)\b",
        "severity": 90,
    },
    {
        "pattern": r"\b(backdoor\s+trigger|hidden\s+trigger|trojan\s+model)\b",
        "severity": 95,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

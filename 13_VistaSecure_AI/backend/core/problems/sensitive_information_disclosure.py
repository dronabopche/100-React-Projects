from core.problems import evaluate_problem

KEYWORDS = [
    "password", "ssn", "social security", "credit card", "api key",
    "secret", "token", "private key", "credential", "pii",
    "personally identifiable", "phone number", "address", "email",
    "date of birth", "medical record", "confidential", "classified",
]

RULES = [
    {
        "pattern": r"\b(ssn|social.security.number)\b",
        "severity": 95,
    },
    {
        "pattern": r"\b(api[_\s]?key|secret[_\s]?key|access[_\s]?token|bearer[_\s]?token)\b",
        "severity": 90,
    },
    {
        "pattern": r"\b(password|passwd|credentials?)\b.{0,20}\b(is|are|=|:)\b",
        "severity": 85,
    },
    {
        "pattern": r"\b(bank\s+(details|account|statements?|credentials?)|routing\s+(number|details))\b",
        "severity": 95,
    },
    {
        "pattern": r"\b\d{16}\b",
        "severity": 95,
    },
    {
        "pattern": r"\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b",
        "severity": 95,
    },
    {
        "pattern": r"(?:\d{1,3}\.){3}\d{1,3}",
        "severity": 55,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

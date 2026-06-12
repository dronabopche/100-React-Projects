from core.problems import evaluate_problem

KEYWORDS = [
    "third party model", "untrusted package", "dependency", "pip install",
    "npm install", "supply chain", "compromised library", "malicious package",
    "outdated model", "unverified source", "model hub", "huggingface",
]

RULES = [
    {
        "pattern": r"\b(pip\s+install|npm\s+install|import)\s+[a-z0-9_\-]+\b",
        "severity": 60,
    },
    {
        "pattern": r"\b(untrusted|unverified|compromised)\s+(package|library|model|source)\b",
        "severity": 85,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

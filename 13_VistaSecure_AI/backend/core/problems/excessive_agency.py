from core.problems import evaluate_problem

KEYWORDS = [
    "execute", "run command", "delete", "send email", "book", "purchase",
    "transfer money", "access file", "modify", "deploy", "shutdown",
    "install", "write to disk", "act autonomously", "on my behalf",
    "without asking", "automatically", "take action",
]

RULES = [
    {
        "pattern": r"\b(send|draft|forward)\s+(an?\s+)?email\b",
        "severity": 75,
    },
    {
        "pattern": r"\b(delete|remove|wipe|format)\s+(the\s+)?(file|folder|directory|database|record)\b",
        "severity": 88,
    },
    {
        "pattern": r"\b(transfer|wire|move)\s+\$?\d+(\.\d{2})?\b",
        "severity": 90,
    },
    {
        "pattern": r"\b(without\s+(ask|confirm|permission|approval))\b",
        "severity": 80,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

from core.problems import evaluate_problem

KEYWORDS = [
    "what is your system prompt", "show system prompt", "reveal instructions",
    "print your prompt", "tell me your instructions", "what were you told",
    "initial instructions", "base instructions", "your rules",
    "what can you not do", "leak prompt", "dump prompt",
]

RULES = [
    {
        "pattern": r"\b(what|show|print|reveal|tell me|repeat)\s+.{0,30}\b(system\s+prompt|initial\s+prompt|your\s+(rules?|instructions?|guidelines?))\b",
        "severity": 92,
    },
    {
        "pattern": r"\b(leak|dump|output)\s+(your\s+)?(prompt|instructions?|context)\b",
        "severity": 90,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

from core.problems import evaluate_problem

KEYWORDS = [
    "ignore", "disregard", "override", "forget", "pretend", "jailbreak",
    "bypass", "simulate", "act as", "roleplay", "new instructions",
    "you are now", "as an ai", "system prompt", "previous instructions",
    "do not follow", "unlock", "unfiltered", "uncensored",
]

RULES = [
    {
        "pattern": r"\b(ignore|disregard|forget)\b.{0,30}\b(instructions?|rules?|guidelines?|constraints?)\b",
        "severity": 95,
    },
    {
        "pattern": r"\b(you are now|act as|pretend (you are|to be)|roleplay as)\b",
        "severity": 85,
    },
    {
        "pattern": r"\bjailbreak\b",
        "severity": 90,
    },
    {
        "pattern": r"\b(new|updated|revised)\s+(system\s+)?prompt\b",
        "severity": 80,
    },
    {
        "pattern": r"\b(hack|crack|exploit)\b.{0,30}\b(account|password|network|wifi|system|server)\b",
        "severity": 88,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

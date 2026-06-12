from core.problems import evaluate_problem

KEYWORDS = [
    "fine-tune attack", "fine tuning exploit", "weight injection",
    "model backdoor", "parameter manipulation", "supply chain model",
    "corrupt weights", "adversarial fine-tuning", "malicious adapter",
    "LoRA attack", "merge exploit",
]

RULES = [
    {
        "pattern": r"\b(fine.tun(e|ing)\s+(attack|exploit)|malicious\s+(adapter|lora|checkpoint))\b",
        "severity": 92,
    },
    {
        "pattern": r"\b(inject(ed)?\s+weight|manipulate\s+(parameter|weight))\b",
        "severity": 88,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

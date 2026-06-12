from core.problems import evaluate_problem

KEYWORDS = [
    "plugin", "tool call", "function call", "api call", "webhook",
    "invoke", "external service", "third party plugin", "agent action",
    "call tool", "use tool", "fetch data", "unvalidated input",
]

RULES = [
    {
        "pattern": r"\b(call|invoke|use)\s+(the\s+)?(plugin|tool|function|webhook)\b",
        "severity": 65,
    },
    {
        "pattern": r"\b(unvalidated|unfiltered|unsafe)\s+(input|parameter|data)\b",
        "severity": 80,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

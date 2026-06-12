from core.problems import evaluate_problem

KEYWORDS = [
    "hidden instructions", "embedded command", "base64", "url encoded",
    "in the document", "summarize this", "translate this", "from the page",
    "invisible text", "html comment", "injected", "hijack",
    "third-party content", "user-provided", "attacker-controlled",
]

RULES = [
    {
        "pattern": r"(summarize|translate|read|process)\s+(this|the)\s+(document|page|file|url|link)",
        "severity": 70,
    },
    {
        "pattern": r"<!--.*?-->",
        "severity": 80,
    },
    {
        "pattern": r"base64[,:\s]",
        "severity": 75,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

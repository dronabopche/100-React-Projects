from core.problems import evaluate_problem

KEYWORDS = [
    "xss", "cross site scripting", "html injection", "script tag",
    "eval", "exec", "os.system", "subprocess", "shell injection",
    "output rendered", "sql injection", "command injection",
    "unsafe output", "raw html",
]

RULES = [
    {
        "pattern": r"<script\b[^>]*>.*?</script>",
        "severity": 95,
    },
    {
        "pattern": r"\b(eval|exec|os\.system|subprocess\.run|shell=true)\b",
        "severity": 92,
    },
    {
        "pattern": r"\b(sql\s+inject|drop\s+table|select\s+.+from\s+.+where)\b",
        "severity": 95,
    },
]

def analyze(prompt: str) -> dict[str, float]:
    return evaluate_problem(prompt, KEYWORDS, RULES)

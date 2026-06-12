"""
ml_engine.py
============
Placeholder ML inference engine.

This module simulates an ML model that predicts risk across all 14 OWASP LLM
vulnerability categories.  Replace the placeholder logic inside each
`_infer_*` method with a real ONNX / transformers / sklearn model call when
you have the trained weights.

Architecture
------------
Each category has its own dedicated inference function.  The top-level
`MLEngine.analyze()` aggregates them into a unified score dict.

Adding a real model later
-------------------------
1. Load the model weights in `__init__`.
2. Replace the body of the relevant `_infer_*` method with a real call.
3. Nothing else needs to change — the scoring engine picks up the new scores
   automatically because it calls `analyze()` generically.
"""

import math
from core.preprocess import normalize_text, tokenize


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _keyword_density(text: str, keywords: list[str]) -> float:
    """
    Returns a 0-1 density score: fraction of keywords present in the text.
    Used by placeholder models to produce a realistic probability.
    """
    if not keywords:
        return 0.0
    hits = sum(1 for kw in keywords if kw in text)
    return hits / len(keywords)


def _sigmoid(x: float, midpoint: float = 0.3, steepness: float = 10.0) -> float:
    """Smooth sigmoid to map [0,1] density → [0,100] score."""
    return 100.0 / (1.0 + math.exp(-steepness * (x - midpoint)))


def _placeholder_score(text: str, tokens: list[str], keywords: list[str],
                        base_noise_factor: int = 0) -> float:
    """
    Generic placeholder inference using keyword density + a tiny deterministic
    fuzz so identical texts don't all output the same raw number.

    REPLACE THIS with real ML inference per category.
    """
    density = _keyword_density(text, keywords)
    raw = _sigmoid(density)
    # Deterministic fuzz based on text characteristics (simulates model variation)
    fuzz = ((len(text) + base_noise_factor) % 7) * 0.8
    return min(max(raw + fuzz, 0.0), 99.0)


# ---------------------------------------------------------------------------
# Per-category placeholder inference functions
# ---------------------------------------------------------------------------
# PLACEHOLDER: Each of these functions should eventually call a real model.
# Signature: (text: str, tokens: list[str]) -> float  (score 0-99)

def _infer_direct_prompt_injection(text: str, tokens: list[str]) -> float:
    """
    PLACEHOLDER — replace with a real binary classifier trained on
    prompt-injection vs. benign prompt pairs.
    """
    keywords = [
        "ignore", "disregard", "override", "forget", "pretend", "jailbreak",
        "bypass", "act as", "roleplay", "new instructions", "you are now",
        "system prompt", "previous instructions", "unlock", "unfiltered",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=1)


def _infer_indirect_prompt_injection(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with retrieval-context contamination classifier."""
    keywords = [
        "hidden instructions", "embedded command", "base64", "summarize this",
        "from the page", "invisible text", "injected", "hijack",
        "third-party content", "attacker-controlled",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=2)


def _infer_training_data_poisoning(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with data-integrity threat classifier."""
    keywords = [
        "poisoned data", "backdoor trigger", "training data", "adversarial example",
        "corrupt dataset", "mislabeled", "trojan model", "hidden trigger",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=3)


def _infer_model_poisoning(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with fine-tuning attack detector."""
    keywords = [
        "fine-tune attack", "weight injection", "model backdoor",
        "parameter manipulation", "corrupt weights", "malicious adapter",
        "lora attack", "merge exploit",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=4)


def _infer_sensitive_information_disclosure(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with PII / secret-extraction intent classifier."""
    keywords = [
        "password", "ssn", "social security", "credit card", "api key",
        "secret", "token", "private key", "credential", "pii",
        "phone number", "medical record", "confidential",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=5)


def _infer_excessive_agency(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with autonomous-action intent classifier."""
    keywords = [
        "execute", "run command", "delete", "send email", "purchase",
        "transfer money", "deploy", "shutdown", "install",
        "without asking", "automatically", "take action",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=6)


def _infer_insecure_plugin_design(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with tool/plugin-abuse intent classifier."""
    keywords = [
        "plugin", "tool call", "function call", "api call", "webhook",
        "invoke", "external service", "agent action", "call tool",
        "unvalidated input",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=7)


def _infer_insecure_output_handling(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with injection / unsafe-output classifier."""
    keywords = [
        "xss", "cross site scripting", "html injection", "script tag",
        "eval", "exec", "os.system", "subprocess", "shell injection",
        "sql injection", "command injection", "raw html",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=8)


def _infer_model_denial_of_service(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with resource-exhaustion intent classifier."""
    keywords = [
        "infinite loop", "repeat forever", "keep saying", "flood",
        "overwhelm", "resource exhaustion", "recursive",
        "token bomb", "fill the context", "denial of service", "overload",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=9)


def _infer_supply_chain_vulnerabilities(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with supply-chain threat intent classifier."""
    keywords = [
        "third party model", "untrusted package", "dependency",
        "supply chain", "compromised library", "malicious package",
        "outdated model", "unverified source",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=10)


def _infer_system_prompt_leakage(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with prompt-extraction intent classifier."""
    keywords = [
        "what is your system prompt", "show system prompt", "reveal instructions",
        "print your prompt", "tell me your instructions", "what were you told",
        "initial instructions", "base instructions", "your rules",
        "leak prompt", "dump prompt",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=11)


def _infer_vector_embedding_weaknesses(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with RAG/embedding-attack intent classifier."""
    keywords = [
        "embedding attack", "vector store", "nearest neighbor exploit",
        "adversarial query", "retrieval attack", "rag poisoning",
        "knowledge base injection", "embedding inversion",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=12)


def _infer_overreliance_hallucination(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with hallucination-elicitation intent classifier."""
    keywords = [
        "make up", "hallucinate", "fabricate", "invent", "generate fake",
        "pretend you know", "create false", "lie about",
        "fake citation", "false information", "misinformation",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=13)


def _infer_model_theft_extraction(text: str, tokens: list[str]) -> float:
    """PLACEHOLDER — replace with model-extraction attack intent classifier."""
    keywords = [
        "replicate model", "steal model", "extract weights", "copy model",
        "clone model", "reverse engineer", "model extraction",
        "membership inference", "reconstruction attack", "distill model",
    ]
    return _placeholder_score(text, tokens, keywords, base_noise_factor=14)


# ---------------------------------------------------------------------------
# Inference registry
# ---------------------------------------------------------------------------
# Map category name → inference function.
# To add a new ML model, just add an entry here + the function above.

_INFERENCE_REGISTRY: dict[str, callable] = {
    "direct_prompt_injection":          _infer_direct_prompt_injection,
    "indirect_prompt_injection":        _infer_indirect_prompt_injection,
    "training_data_poisoning":          _infer_training_data_poisoning,
    "model_poisoning":                  _infer_model_poisoning,
    "sensitive_information_disclosure": _infer_sensitive_information_disclosure,
    "excessive_agency":                 _infer_excessive_agency,
    "insecure_plugin_design":           _infer_insecure_plugin_design,
    "insecure_output_handling":         _infer_insecure_output_handling,
    "model_denial_of_service":          _infer_model_denial_of_service,
    "supply_chain_vulnerabilities":     _infer_supply_chain_vulnerabilities,
    "system_prompt_leakage":            _infer_system_prompt_leakage,
    "vector_embedding_weaknesses":      _infer_vector_embedding_weaknesses,
    "overreliance_hallucination":       _infer_overreliance_hallucination,
    "model_theft_extraction":           _infer_model_theft_extraction,
}


# ---------------------------------------------------------------------------
# MLEngine class
# ---------------------------------------------------------------------------

class MLEngine:
    """
    Runs all per-category ML inference functions and returns a structured
    scores dict.

    To plug in a real model:
      1. Load the model in __init__ (e.g., self.model = onnxruntime.InferenceSession(...))
      2. Replace the body of the relevant _infer_* function.
      That's it — the rest of the system auto-picks up the change.
    """

    def __init__(self):
        # ── Future: load real model weights here ──────────────────────────
        # Example:
        #   import onnxruntime as ort
        #   self.session = ort.InferenceSession("models/prompt_classifier.onnx")
        #
        # For now, we rely on keyword-density placeholders.
        self._registry = _INFERENCE_REGISTRY

    def analyze(self, prompt: str) -> dict[str, float]:
        """
        Run all registered inference functions.

        Returns:
            { "category_name": score_0_to_99, ... }
        """
        text = normalize_text(prompt)
        tokens = tokenize(prompt)

        scores: dict[str, float] = {}
        for category, infer_fn in self._registry.items():
            try:
                score = infer_fn(text, tokens)
            except Exception:
                # Fail gracefully so a broken placeholder doesn't kill the API
                score = 0.0
            scores[category] = round(min(max(score, 0.0), 99.0), 2)

        return scores

    # Backwards-compat wrapper
    def infer(self, prompt: str) -> float:
        """Legacy: returns the maximum score across all categories."""
        results = self.analyze(prompt)
        return max(results.values(), default=0.0)

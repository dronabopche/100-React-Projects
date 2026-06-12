"""
problems/__init__.py
====================
Exposes problem-specific analyzers for all 14 OWASP LLM risk categories.
Provides the base utility function to score heuristics and regex rules.
"""

import re
from core.preprocess import normalize_text, tokenize

def evaluate_problem(prompt: str, keywords: list[str], rules: list[dict]) -> dict[str, float]:
    """
    Evaluates a single problem category using its keywords and regex rules.
    Returns:
        {
            "heuristic": float (0-100),
            "rules": float (0-100)
        }
    """
    # 1. Heuristic evaluation
    tokens = tokenize(prompt)
    full_text = normalize_text(prompt)
    
    total_hits = 0.0
    if tokens:
        for token in tokens:
            for kw in keywords:
                if token == kw:
                    total_hits += 1.0
                elif kw in token:
                    total_hits += 0.7
                elif token.startswith(kw):
                    total_hits += 0.5
        token_score = (total_hits / len(tokens)) * 100.0
    else:
        token_score = 0.0
        
    phrase_hits = sum(1 for kw in keywords if " " in kw and kw in full_text)
    phrase_bonus = min(phrase_hits * 15.0, 40.0)
    heuristic_score = min(token_score + phrase_bonus, 100.0)
    
    # 2. Rule-based evaluation
    rule_score = 0.0
    for rule in rules:
        pattern = rule["pattern"]
        severity = rule["severity"]
        compiled = re.compile(pattern, re.IGNORECASE | re.DOTALL)
        if compiled.search(full_text):
            if severity > rule_score:
                rule_score = float(severity)
                
    return {
        "heuristic": heuristic_score,
        "rules": rule_score
    }

# Import all problem modules (they will be created next)
from core.problems import (
    direct_prompt_injection,
    indirect_prompt_injection,
    training_data_poisoning,
    model_poisoning,
    sensitive_information_disclosure,
    excessive_agency,
    insecure_plugin_design,
    insecure_output_handling,
    model_denial_of_service,
    supply_chain_vulnerabilities,
    system_prompt_leakage,
    vector_embedding_weaknesses,
    overreliance_hallucination,
    model_theft_extraction,
)

ALL_PROBLEMS = {
    "direct_prompt_injection": direct_prompt_injection,
    "indirect_prompt_injection": indirect_prompt_injection,
    "training_data_poisoning": training_data_poisoning,
    "model_poisoning": model_poisoning,
    "sensitive_information_disclosure": sensitive_information_disclosure,
    "excessive_agency": excessive_agency,
    "insecure_plugin_design": insecure_plugin_design,
    "insecure_output_handling": insecure_output_handling,
    "model_denial_of_service": model_denial_of_service,
    "supply_chain_vulnerabilities": supply_chain_vulnerabilities,
    "system_prompt_leakage": system_prompt_leakage,
    "vector_embedding_weaknesses": vector_embedding_weaknesses,
    "overreliance_hallucination": overreliance_hallucination,
    "model_theft_extraction": model_theft_extraction,
}

def analyze_problems(prompt: str) -> dict[str, dict[str, float]]:
    """
    Runs Layer 1 (Heuristic & Rules) across all 14 problem categories.
    Returns:
        {
            category_slug: {
                "heuristic": float,
                "rules": float
            }
        }
    """
    return {
        slug: problem.analyze(prompt)
        for slug, problem in ALL_PROBLEMS.items()
    }

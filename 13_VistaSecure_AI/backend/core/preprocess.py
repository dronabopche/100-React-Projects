# preprocess.py - Input preprocessing and normalization

def tokenizer(prompt: str):
    # Simple tokenization by splitting on whitespace
    tokens = prompt.split()
    return tokens
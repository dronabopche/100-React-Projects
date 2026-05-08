# heuristic.py - Heuristic analysis logic

"""
1. normalize prompt (we get from initial input)
2. tokenize → tokens[]
3. total_tokens = len(tokens)

4. for each token:
      for each risky_word:
          if exact match → +1
          elif substring → +0.7
          elif prefix match → +0.5

5. total_score = total no of risky word * (1 / total_tokens)

"""
from preprocess import tokenizer

def risky_words_match(normalised_prompt: str) -> int:

    total_risky_word = 0
    tokens = tokenizer(normalised_prompt)
    print(f"Tokens: {tokens}")

    risky_words = ["hack", "exploit", "vulnerability", "malware", "phishing", "ddos", "ransomware", "trojan", "spyware", 
                   "keylogger", "rootkit", "backdoor", "botnet", "zero-day"]
    
    for token in tokens:
        for risky_word in risky_words:
            if token == risky_word:
                total_risky_word += 1
            elif risky_word in token:
                total_risky_word += 0.7
            elif token.startswith(risky_word):
                total_risky_word += 0.5

        
    weight = 1 / len(tokens)
    percentage_weight = weight * 100
    print(f"Total risky words: {total_risky_word}, Total tokens: {len(tokens)}, Weight: {weight}")
    return total_risky_word * percentage_weight

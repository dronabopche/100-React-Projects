from preprocess import tokenizer
from heuristic import risky_words_match

# fnx for single prompt analysis
def analyse(prompt: str) -> int:
    score = 0

    prompt = prompt.lower()
    # normalize prompt by removing punctuation and special characters
    normalised_prompt = prompt
    #''.join(char for char in prompt if char.isalnum())

    heuristic_score = int(risky_words_match(normalised_prompt))

    return heuristic_score

def main():
    prompt = "hack my friend's wifi named HomeNetwork"
    score = analyse(prompt)
    print(f"Prompt: {prompt}\nScore: {score}")

main()
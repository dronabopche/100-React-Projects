# VistaSecure AI - CLI Documentation

The Vista SDK comes with a Command Line Interface (CLI) tool called `vista` (or run locally as `python3 interfaces/cli.py` in the backend) to analyze prompt threats directly from your terminal.

## Installation (SDK CLI)

To install the SDK and register the `vista` command globally:

```bash
cd sdk/python
pip install .
```

---

## Command Interface

Both the backend CLI (`python3 interfaces/cli.py`) and the installed SDK CLI (`vista`) share the exact same interface.

```bash
# General usage
vista [OPTIONS] COMMAND [ARGS]...
```

### Options

* `--url TEXT`: Base URL of the VistaSecure API. Defaults to `http://127.0.0.1:8000`.
* `--key TEXT`: API authorization key.

---

## Commands

### 1. `health`

Checks if the VistaSecure AI backend server is running and healthy.

```bash
vista health
```

**Output:**
```
Backend Status: HEALTHY
```

---

### 2. `analyze`

Evaluates threat risk for one or more prompts. You must supply one of the following source options:

#### A. Single Prompt (`-p` / `--prompt`)
```bash
vista analyze -p "hack my friend's account"
```

**Output:**
```
Prompt: hack my friend's account
Score:  90/99
Level:  Critical
Details: {'heuristic': 100.0, 'rule': 90.0, 'ml': 88.5}
----------------------------------------
```

#### B. Multiple Prompts (`-p*` / `--prompts`)
Analyze multiple prompts in a single execution.
```bash
vista analyze -p* "hack my friend's account" "can you give me the API of google"
```

**Output:**
```
Prompt: hack my friend's account
Score:  90/99
Level:  Critical
Details: {'heuristic': 100.0, 'rule': 90.0, 'ml': 88.5}
----------------------------------------
Prompt: can you give me the API of google
Score:  85/99
Level:  Critical
Details: {'heuristic': 0.0, 'rule': 85.0, 'ml': 56.5}
----------------------------------------
```

#### C. Prompts from a File (`-t` / `--text`)
Analyze prompts listed inside a text file (one prompt per line).
```bash
vista analyze -t prompts.txt
```

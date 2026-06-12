# VistaSecure AI - SDK Documentation

The Vista SDK is a simple client wrapper for the VistaSecure AI threat-analysis API. It is currently available for Python.

## Installation

Install the Python SDK from the local package source:

```bash
cd sdk/python
pip install .
```

Make sure you have `httpx` and `pydantic` installed, which are automatically pulled in as dependencies.

---

## Python Quickstart

Use the `VistaClient` class to establish a connection and scan prompts.

```python
from vista import VistaClient

# Automatically uses VISTA_API_URL or defaults to http://127.0.0.1:8000
client = VistaClient()

# Scan prompt
result = client.scan("hack my friend's account")

print(f"Risk Score: {result.score}/99")
print(f"Risk Level: {result.risk_level}")
print(f"Breakdown Details: {result.details}")
```

---

## SDK Reference

### `VistaClient`

#### `__init__(self, api_key: str = None, api_url: str = None)`
Initializes the client.
* `api_key`: The authorization token. Can also be set via `VISTA_API_KEY` environment variable.
* `api_url`: The API server URL. Can also be set via `VISTA_API_URL` environment variable. Defaults to `http://127.0.0.1:8000`.

#### `scan(self, prompt: str) -> ScanResult`
Sends a prompt to the Vista API `/analyze` endpoint and returns a `ScanResult` object.
* `prompt`: The text to evaluate.

---

### `ScanResult`

A dataclass representing the evaluation result:
* `score` (int): A consolidated threat score between `0` and `99`.
* `risk_level` (str): Categorized risk rating (`Low`, `Medium`, `High`, `Critical`).
* `details` (Dict[str, float]): Breakdown of scores from the `heuristic`, `rule`, and `ml` evaluation engines.

# VistaSecure AI

VistaSecure AI is a secure, AI-powered prompt analysis engine designed to evaluate input prompts for potential security risks, malicious actions, or unauthorized data requests. It classifies threats and scores prompts on a scale of `0` to `99`.

---

![VistaSecure AI](docs/01.jpeg)

## How to Setup and Run

### 1. Backend API Server

To run the API server locally:

#### Step A: Navigate to the backend directory
```bash
cd backend
```

#### Step B: Install dependencies
Ensure you are using python3 (or your activated conda environment):
```bash
python3 -m pip install -r requirements.txt
```

#### Step C: Run the server
```bash
python3 main.py
```

Once started, the API will be listening on `http://127.0.0.1:8000`. You can visit the interactive Swagger documentation at `http://127.0.0.1:8000/docs` to test endpoints manually.

---

### 2. Python SDK

To install and use the Python SDK:

#### Step A: Navigate to the SDK directory
```bash
cd sdk/python
```

#### Step B: Install the package
```bash
python3 -m pip install .
```

#### Step C: Run scans via CLI
After installation, you can run scans directly from the CLI:
```bash
vista "hack my friend's account"
```

For custom API endpoints or keys:
```bash
vista "hack my friend's account" --url "http://127.0.0.1:8000"
```

---

## Project Structure

* `/backend`: FastAPI API server, heuristic, rule, and mock ML scoring engines.
* `/sdk`: Python client libraries and CLI integration.
* `/docs`: Technical specifications and API documentation.
  * [API Documentation](docs/api.md)
  * [CLI Documentation](docs/cli.md)
  * [SDK Documentation](docs/sdk.md)

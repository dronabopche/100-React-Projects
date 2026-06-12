# VistaSecure AI - REST API Documentation

The VistaSecure AI Backend is a FastAPI service that evaluates prompt inputs for security risks.

## Base URL

By default, the server runs locally at:
```
http://127.0.0.1:8000
```

---

## Endpoints

### 1. Analyze Prompt

Analyzes a prompt using heuristic, rule, and machine learning models to determine a security risk score between `0` and `99`.

* **URL:** `/analyze`
* **Method:** `POST`
* **Headers:** 
  * `Content-Type: application/json`
* **Request Body:**

```json
{
  "prompt": "string"
}
```

* **Success Response (200 OK):**

```json
{
  "score": 90,
  "level": "Critical",
  "details": {
    "heuristic": 50.0,
    "rule": 90.0,
    "ml": 88.5
  }
}
```

* **Response Fields:**
  * `score` (integer, 0-99): Combined risk score.
  * `level` (string): Risk classification based on the score:
    * `0-19`: `Low`
    * `20-49`: `Medium`
    * `50-79`: `High`
    * `80-99`: `Critical`
  * `details` (object): Raw scores from individual evaluation engines:
    * `heuristic`: Keyword match percentage.
    * `rule`: Regex pattern severity matches.
    * `ml`: ML model mock probability evaluation.

#### Example Curl Command
```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "hack my friend wifi"}'
```

---

### 2. Analyze Prompt File

Uploads a plain text file containing a list of prompts (one prompt per line) and evaluates each prompt.

* **URL:** `/analyze-multi`
* **Method:** `POST`
* **Headers:**
  * `Content-Type: multipart/form-data`
* **Request Payload:**
  * `file`: File binary (supported: UTF-8 plain text files)
* **Success Response (200 OK):**

```json
{
  "filename": "prompts.txt",
  "results": [
    {
      "prompt": "hack my friends account",
      "score": 90,
      "level": "Critical",
      "details": {
        "heuristic": 100.0,
        "rule": 90.0,
        "ml": 88.5
      }
    },
    {
      "prompt": "hello there",
      "score": 5,
      "level": "Low",
      "details": {
        "heuristic": 0.0,
        "rule": 0.0,
        "ml": 5.0
      }
    }
  ],
  "max_score": 90,
  "average_score": 47.5
}
```

* **Response Fields:**
  * `filename` (string): Name of the uploaded file.
  * `results` (array): List of individual prompt analysis dictionaries (equivalent to the single `/analyze` endpoint response).
  * `max_score` (integer, 0-99): Highest risk score detected among all prompts in the file.
  * `average_score` (float): Average risk score computed across all analyzed prompts.

#### Example Curl Command
```bash
curl -X POST http://127.0.0.1:8000/analyze-multi \
  -F "file=@/path/to/prompts.txt"
```


---

### 3. Health Check

Checks the status of the API server.

* **URL:** `/health`
* **Method:** `GET`
* **Success Response (200 OK):**

```json
{
  "status": "healthy"
}
```

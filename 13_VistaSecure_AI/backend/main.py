"""
main.py
=======
Entry point for the VistaSecure AI backend.

Run with:
    cd backend
    python main.py

Or directly with uvicorn (recommended for development):
    cd backend
    uvicorn interfaces.api:app --host 127.0.0.1 --port 8000 --reload

Interactive API docs available at:
    http://127.0.0.1:8000/docs
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "interfaces.api:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info",
    )

import httpx
from .config import DEFAULT_API_URL, DEFAULT_API_KEY
from .types import ScanResult

class VistaClient:
    def __init__(self, api_key: str = None, api_url: str = None):
        self.api_key = api_key or DEFAULT_API_KEY
        self.api_url = api_url or DEFAULT_API_URL

    def scan(self, prompt: str) -> ScanResult:
        """
        Scan a prompt for security risks by querying the Vista API.
        """
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
            
        with httpx.Client(base_url=self.api_url) as client:
            response = client.post("/analyze", json={"prompt": prompt}, headers=headers)
            response.raise_for_status()
            data = response.json()
            return ScanResult(
                score=data["score"],
                risk_level=data["level"],
                details=data.get("details", {})
            )

    def scan_file(self, file_path: str) -> dict:
        """
        Scan a file containing multiple prompts by uploading it to the Vista API.
        """
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
            
        with open(file_path, "rb") as f:
            files = {"file": (file_path, f, "text/plain")}
            with httpx.Client(base_url=self.api_url) as client:
                response = client.post("/analyze-multi", files=files, headers=headers)
                response.raise_for_status()
                return response.json()


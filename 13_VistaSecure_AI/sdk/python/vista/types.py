# types.py - Response schemas and data models
from dataclasses import dataclass

@dataclass
class ScanResult:
    score: float
    risk_level: str
    flags: list

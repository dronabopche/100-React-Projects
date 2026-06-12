from dataclasses import dataclass, field
from typing import Dict, Any

@dataclass
class ScanResult:
    score: int
    risk_level: str
    details: Dict[str, float] = field(default_factory=dict)

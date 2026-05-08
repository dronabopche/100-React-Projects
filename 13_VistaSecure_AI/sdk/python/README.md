# Vista SDK

Python SDK for Vista Secure AI.

## Install
```bash
pip install vista
```

## Usage
```python
from vista import VistaClient

client = VistaClient(api_key="your-key")
result = client.scan("your input here")
print(result.risk_level)
```

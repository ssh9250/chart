import os
import requests
from typing import Any, Dict


BASE_STOCK_API = os.getenv("BASE_STOCK_API", "https://example-stock-api.local")


def fetch_price_history(symbol: str) -> Dict[str, Any]:
    url = f"{BASE_STOCK_API}/prices/{symbol}"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()



import os
import requests
from django.conf import settings
from typing import Any, Dict

API_KEY = os.getenv('STOCK_API_KEY')
BASE_URL = os.getenv('STOCK_API_BASE','https://www.alphavantage.co')
BASE_STOCK_API = os.getenv("BASE_STOCK_API", "https://example-stock-api.local")


def fetch_price_history(symbol: str) -> Dict[str, Any]:
    url = f"{BASE_STOCK_API}/prices/{symbol}"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()

def fetch_quote(symbol: str):
    # Alpha Vantage 예시: TIME_SERIES_INTRADAY 또는 GLOBAL_QUOTE
    if not API_KEY:
        return {'error':'API key not set'}
    url = f"{BASE_URL}/query"
    params = {'function':'GLOBAL_QUOTE','symbol':symbol,'apikey':API_KEY}
    r = requests.get(url, params=params, timeout=10)
    return r.json()

from django.urls import path
from django.http import JsonResponse, HttpRequest
from .services import fetch_price_history


def price_history_view(request: HttpRequest, symbol: str):
    data = fetch_price_history(symbol)
    return JsonResponse(data)


urlpatterns = [
    path("prices/<str:symbol>/", price_history_view, name="price-history"),
]



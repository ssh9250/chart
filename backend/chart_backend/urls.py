from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/community/", include("community.urls")),
    path("api/stocks/", include("stocks.urls")),
    path("api/analysis/", include("analysis.urls")),
]



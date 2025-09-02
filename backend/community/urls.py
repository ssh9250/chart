from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet


router = DefaultRouter()
router.register(r"posts", PostViewSet)
router.register(r"comments", CommentViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),  # simple login/logout endpoints
    path('api/stocks/', include('stocks.urls')),
]



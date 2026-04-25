from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import routers 
from django.urls import path, include
from account import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

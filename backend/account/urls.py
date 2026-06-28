from django.urls import path
from account import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/<str:uid>/<str:token>/', views.ResetPasswordView.as_view(), name='reset_password'),
    path('contact/', views.ContactMessageView.as_view(), name='contact'),       # ✅ new
    path('rate/', views.UserRatingView.as_view(), name='rate'),                 # ✅ new
]
from django.urls import path
from .views import Calculate_Footprint, FootprintHistory

urlpatterns = [
    path('calculate/', Calculate_Footprint.as_view(), name='calculate_footprint'),
    path('history/', FootprintHistory.as_view(), name='footprint_history'),
]
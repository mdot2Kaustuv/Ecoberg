from django.urls import path
from .views import  CalculateFootprint


urlpatterns = [ 
    path('calculate/', CalculateFootprint.as_view(), name='calculate_footprint'),
]
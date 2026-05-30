from django.urls import path
from .views import  Calculate_Footprint


urlpatterns = [ 
    path('calculate/', Calculate_Footprint.as_view(), name='calculate_footprint'),
]
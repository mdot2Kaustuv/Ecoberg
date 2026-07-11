from django.urls import path
from .calculator import company_emission

urlpatterns = [
    path('calculate/', company_emission, name='calculate_footprint'),

]
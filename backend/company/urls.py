from django.urls import path
from .views import company_emissions

urlpatterns = [
    path('calculate/', company_emissions.as_view(), name='calculate_footprint'),

]
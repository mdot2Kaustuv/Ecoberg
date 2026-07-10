from django.urls import path
from .views import company_emission

urlpatterns = [
    path('calculate/', company_emission, name='calculate_footprint'),

]
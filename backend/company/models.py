from django.db import models
from django.conf import settings
# Create your models here.

class Company(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    company_name = models.CharField(max_length=255)
    usage = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    freight_footprint = models.FloatField(default=0.0)
    hotel_footprint = models.FloatField(default=0.0)
    fuel_footprint = models.FloatField(default=0.0)
    travel_footprint = models.FloatField(default=0.0)
    electricity_footprint = models.FloatField(default=0.0)
    total_footprint = models.FloatField(default=0.0)
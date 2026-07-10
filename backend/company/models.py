from django.db import models
from django.conf import settings
# Create your models here.

class Company(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    freight_footprint = models.FloatField(default=0.0)
    hotel_footprint = models.FloatField(default=0.0)
    fuel_footprint = models.FloatField(default=0.0)
    travel_footprint = models.FloatField(default=0.0)
    electricity_footprint = models.FloatField(default=0.0)
    total_footprint = models.FloatField(default=0.0)
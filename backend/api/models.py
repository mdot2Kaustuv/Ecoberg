from django.db import models
from django.contrib.postgres.fields import JSONField
from django.utils import timezone
from django.conf import settings


class FootprintCalculation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    quiz_input = models.JSONField()
    totalfootprint = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    sustainability = models.IntegerField()
    
    food_footprint = models.FloatField()
    transportation_footprint = models.FloatField()
    energy_footprint = models.FloatField()
    shopping_footprint = models.FloatField()


    
    

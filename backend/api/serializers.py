from rest_framework import serializers
from .models import FootprintCalculation

class FootprintResultSerializer(serializers.ModelSerializer):

    inputs = serializers.JSONField(write_only=True)

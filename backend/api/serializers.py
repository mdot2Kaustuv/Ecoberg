from rest_framework import serializers
from .models import FootprintCalculation

class FootprintResultSerializer(serializers.ModelSerializer):

    inputs = serializers.JSONField(write_only=True)


    class Meta:
        model = FootprintCalculation
        fields = ['id', 'inputs', 'totalfootprint', 'sustainability', 'food_footprint','transportation_footprint', 'energy_footprint','shopping_footprint', 'created_at']
        read_only_fields = ['id', 'totalfootprint', 'sustainability', 'food_footprint', 'transportation_footprint', 'energy_footprint', 'shopping_footprint', 'created_at']

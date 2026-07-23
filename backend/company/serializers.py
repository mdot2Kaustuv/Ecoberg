from rest_framework import serializers 
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id', 'user',
            'freight_origin_country', 'freight_destination_country', 'freight_weight',
            'travel_mode', 'hotel_nights', 'electricity_kwh', 'fuel_amount',
            'freight_footprint', 'hotel_footprint',
            'fuel_footprint', 'travel_footprint',
            'electricity_footprint', 'total_footprint'
        ]
        read_only_fields = [
            'id', 'user', 
            'freight_footprint', 'hotel_footprint',
            'fuel_footprint', 'travel_footprint',
            'electricity_footprint', 'total_footprint'
        ]
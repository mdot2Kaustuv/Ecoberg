from rest_framework import serializers 
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id', 'user', 'company_name', 'usage',
            'freight_footprint', 'hotel_footprint',
            'fuel_footprint', 'travel_footprint',
            'electricity_footprint', 'total_footprint', 'created_at'
        ]
        read_only_fields = [
            'id', 'user', 'freight_footprint',
            'hotel_footprint', 'fuel_footprint',
            'travel_footprint', 'electricity_footprint',
            'total_footprint',
            'created_at'
        ]
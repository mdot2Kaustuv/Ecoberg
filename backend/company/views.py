from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated , AllowAny
from django.http import JsonResponse
from.calculator import (
    freight_emission,
    travel_emission,
    hotel_emission,
    electricity_emission,
    fuel_emission,
)
from .serializers import CompanySerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def company_emission(request):
    serializer = CompanySerializer(data=request.data)

    if not serializer.is_valid():
        return JsonResponse({"error": serializer.errors}, status=400)

    # Use validated_data instead of raw request.data for security and safety
    data = serializer.validated_data

    freight = freight_emission(data, 0.0)
    travel = travel_emission(data, 0.0)
    hotel = hotel_emission(data, 0.0)
    electricity = electricity_emission(data, 0.0)
    fuel = fuel_emission(data, 0.0)

    company = serializer.save(
        user=request.user,
        freight_footprint=freight,
        travel_footprint=travel,
        hotel_footprint=hotel,
        electricity_footprint=electricity,
        fuel_footprint=fuel,
        total_footprint=freight + travel + hotel + electricity + fuel,
    )

    return JsonResponse({"company": CompanySerializer(company).data}, status=201)
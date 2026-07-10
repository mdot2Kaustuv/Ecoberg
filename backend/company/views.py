from django.http import JsonResponse
import requests
from decouple import config
from rest_framework.permissions import IsAuthenticated
from .models import Company
from .serializers import CompanySerializer 

#Function to get freight emissions
def freight_emission(request):
    api_key = config('EMISSION_DEV_API_KEY')
    headers = {
        'Authorization': f'Bearer {api_key}',
    }
    params = {
        'origin_country': request.GET.get('origin_country', 'NP'),
        'destination_country': request.GET.get('destination_country', 'NP'),
        'origin_location': request.GET.get('origin_location', 'Kathmandu'),
        'destination_location': request.GET.get('destination_location', 'Kathmandu'),
        'weight': request.GET.get('weight', 1000), 
    }

    try:
        response = requests.get(
            'https://api.emissions.dev/v1/freight/emissions',
            headers=headers,
            params=params,
        )
        response.raise_for_status()
    
    except requests.exceptions.HTTPError as e :
        error = e.response.json()
        print(f"HTTP error occurred: {e.response.status_code} - {error}")
        return JsonResponse({'error': error}, status=e.response.status_code)
    
    except requests.exceptions.RequestException as e:
         print(f"Request error occurred: {e}")
         return JsonResponse({'error': 'Request error occurred'}, status=500)
    
    data = response.json()
    return JsonResponse({'data': data})

#Function to get flight emissions
def travel_emission(request):
  api_key = config('EMISSION_DEV_API_KEY')
  
  headers = {
        'Authorization': f'Bearer {api_key}',
    }
  
  params = {
        'origin_location': request.GET.get('origin_location', 'Kathmandu'),
        'destination_location': request.GET.get('destination_location', 'Kathmandu'),
        'transport_mode' : request.GET.get('transport_mode','car'),
        'return_trip' : request.GET.get('return_trip', 'false'),
        'passengers' : request.GET.get('passengers', 1),
        }
  
  if request.GET.get('transport_mode') == 'car':
      params['vehicle_type'] = request.GET.get('vehicle_type', 'diesel')


  if request.GET.get('transport_mode') == 'flight':
      params['cabin_class'] = request.GET.get('cabin_class', 'economy') 

  try:
    response = requests.get(
        "https://api.emissions.dev/v1/flight/emissions",
        headers=headers,
        params=params,
    )
    response.raise_for_status()

  except requests.exceptions.HTTPError as e:
    error = e.response.json()
    print(f"HTTP error occurred: {e.response.status_code} - {error}")
    return JsonResponse({"error": error}, status=e.response.status_code)

  except requests.exceptions.RequestException as e:
    print(f"Request error occurred: {e}")
    return JsonResponse({"error": "Request error occurred"}, status=500)

  data = response.json()
  return JsonResponse({"data": data})



def hotel_emission(request):
  api_key = config('EMISSION_DEV_API_KEY')
  
  headers = {
        'Authorization': f'Bearer {api_key}',
    }
  
  params = {
        'country_code': request.GET.get('country_code', 'NP'),
        'nights': request.GET.get('nights', 1),
        'rooms': request.GET.get('rooms', 1)
        }
  try:
    response = requests.get(
        "https://api.emissions.dev/v1/hotel/emissions",
        headers=headers,
        params=params,
    )
    response.raise_for_status()

  except requests.exceptions.HTTPError as e:
    error = e.response.json()
    print(f"HTTP error occurred: {e.response.status_code} - {error}")
    return JsonResponse({"error": error}, status=e.response.status_code)

  except requests.exceptions.RequestException as e:
    print(f"Request error occurred: {e}")
    return JsonResponse({"error": "Request error occurred"}, status=500)

  data = response.json()
  return JsonResponse({"data": data})


def electricity_emission(request) :
    api_key = config('EMISSION_DEV_API_KEY')
  
    headers = {
        'Authorization': f'Bearer {api_key}',
    }
  
    params = {
        'unit': request.GET.get('unit', 'kWh'),
        'kwh': request.GET.get('kwh', 100),
        'country_code': request.GET.get('country_code', 'NP'),
        'cloud_provider': request.GET.get('cloud_provider', 'aws'),
        }
    

    try:
        response = requests.get(
            "https://api.emissions.dev/v1/electricity/emissions",
            headers=headers,
            params=params,
        )
        response.raise_for_status()

    except requests.exceptions.HTTPError as e:
        error = e.response.json()
        print(f"HTTP error occurred: {e.response.status_code} - {error}")
        return JsonResponse({"error": error}, status=e.response.status_code)

    except requests.exceptions.RequestException as e:
        print(f"Request error occurred: {e}")
        return JsonResponse({"error": "Request error occurred"}, status=500)

    data = response.json()
    return JsonResponse({"data": data})
        

def fuel_emission(request) :
    api_key = config('EMISSION_DEV_API_KEY')
  
    headers = {
        'Authorization': f'Bearer {api_key}',
    }
  
    params = {
        'fuel_type': request.GET.get('fuel_type', 'liquid'),
        'unit': request.GET.get('unit'),
        'amount': request.GET.get('amount'),
        }
    
    if params['fuel_type'] == 'liquid':
       params['unit'] = request.GET.get('unit', 'liters')

    if params['fuel_type'] == 'gas':
        params['unit'] = request.GET.get('unit', 'kwh')  
    
    if params['fuel_type'] == 'solid':
        params['unit'] = request.GET.get('unit', 'kg')

    if params['fuel_type'] == 'biofuel':
        params['unit'] = request.GET.get('unit', 'liters')


    try:
        response = requests.get(
            "https://api.emissions.dev/v1/fuel/emissions",
            headers=headers,
            params=params,
        )
        response.raise_for_status()

    except requests.exceptions.HTTPError as e:
        error = e.response.json()
        print(f"HTTP error occurred: {e.response.status_code} - {error}")
        return JsonResponse({"error": error}, status=e.response.status_code)

    except requests.exceptions.RequestException as e:
        print(f"Request error occurred: {e}")
        return JsonResponse({"error": "Request error occurred"}, status=500)

    data = response.json()
    return JsonResponse({"data": data})


def company_emission(request) :
   permission_class = [IsAuthenticated]
   
   def post(self , request) :
      serializer = CompanySerializer(data=request.data)

      if serializer.is_valid():
           freight = freight_emission(request.data)
           travel = travel_emission(request.data)
           hotel = hotel_emission(request.data)
           electricity = electricity_emission(request.data)
           fuel = fuel_emission(request.data)

           company = serializer.save(
               user=request.user,
                freight_footprint=freight ,
                travel_footprint=travel,
                hotel_footprint=hotel,
                electricity_footprint=electricity,
                fuel_footprint=fuel
              )
      return JsonResponse({"company": CompanySerializer(company).data}, status=201)
   
   return JsonResponse({"error": "Invalid data"}, status=400)
import requests
from decouple import config


def _headers():
    return {"Authorization": f"Bearer {config('EMISSION_DEV_API_KEY')}"}


def freight_emission(data, default=0.0):
    params = {
        "origin_country": data.get("freight_origin_country", "NP"),
        "destination_country": data.get("freight_destination_country", "NP"),
        "origin_location": data.get("freight_origin_location", "Kathmandu"),
        "destination_location": data.get("freight_destination_location", "Kathmandu"),
        "weight": data.get("freight_weight", 1000),
    }
    try:
        response = requests.get(
            "https://api.emissions.dev/v1/freight/emissions", headers=_headers(), params=params
        )
        response.raise_for_status()
        result = response.json()
        return result["data"]["attributes"]["emissions"]["co2e"]
    except (requests.exceptions.RequestException, KeyError, TypeError) as e:
        print(f"freight_emission failed, using default: {e}")
        return default


def travel_emission(data, default=0.0):
    mode = data.get("travel_mode", "car")
    params = {
        "origin_location": data.get("travel_origin_location", "Kathmandu"),
        "destination_location": data.get("travel_destination_location", "Kathmandu"),
        "transport_mode": mode,
        "return_trip": data.get("travel_return_trip", "false"),
        "passengers": data.get("travel_passengers", 1),
    }
    if mode == "car":
        params["vehicle_type"] = data.get("travel_vehicle_type", "diesel")
    if mode == "flight":
        params["cabin_class"] = data.get("travel_cabin_class", "economy")

    try:
        response = requests.get(
            "https://api.emissions.dev/v1/travel/emissions", headers=_headers(), params=params
        )
        response.raise_for_status()
        result = response.json()
        return result["data"]["attributes"]["emissions"]["co2e"]
    except (requests.exceptions.RequestException, KeyError, TypeError) as e:
        print(f"travel_emission failed, using default: {e}")
        return default


def hotel_emission(data, default=0.0):
    params = {
        "country_code": data.get("hotel_country_code", "NP"),
        "nights": data.get("hotel_nights", 1),
        "rooms": data.get("hotel_rooms", 1),
    }
    try:
        response = requests.get(
            "https://api.emissions.dev/v1/hotel/emissions", headers=_headers(), params=params
        )
        response.raise_for_status()
        result = response.json()
        return result["data"]["attributes"]["emissions"]["co2e"]
    except (requests.exceptions.RequestException, KeyError, TypeError) as e:
        print(f"hotel_emission failed, using default: {e}")
        return default


def electricity_emission(data, default=0.0):
    params = {
        "unit": data.get("electricity_unit", "kWh"),
        "kwh": data.get("electricity_kwh", 100),
        "country_code": data.get("electricity_country_code", "NP"),
        "cloud_provider": data.get("electricity_cloud_provider", "aws"),
    }
    try:
        response = requests.get(
            "https://api.emissions.dev/v1/electricity/emissions", headers=_headers(), params=params
        )
        response.raise_for_status()
        result = response.json()
        return result["data"]["attributes"]["emissions"]["co2e"]
    except (requests.exceptions.RequestException, KeyError, TypeError) as e:
        print(f"electricity_emission failed, using default: {e}")
        return default


def fuel_emission(data, default=0.0):
    params = {
        "fuel_type": data.get("fuel_type", "natural_gas"),
        "amount": data.get("fuel_amount", 0),
        "unit": data.get("fuel_unit", "kwh"),
        "include_wtt": data.get("fuel_include_wtt", "true"),
    }
    try:
        response = requests.get(
            "https://api.emissions.dev/v1/fuel/emissions", headers=_headers(), params=params
        )
        response.raise_for_status()
        result = response.json()
        return result["data"]["attributes"]["emissions"]["co2e"]
    except (requests.exceptions.RequestException, KeyError, TypeError) as e:
        print(f"fuel_emission failed, using default: {e}")
        return default
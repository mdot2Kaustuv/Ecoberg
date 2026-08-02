import requests
from decouple import config


def _headers():
    return {"Authorization": f"Bearer {config('EMISSION_DEV_API_KEY')}"}

def _log_http_error(name, e):
    try:
        detail = e.response.json()
    except ValueError:
        detail = e.response.text
    print(f"{name} failed ({e.response.status_code}), using default: {detail}")

_WEIGHT_TO_KG = {
    "kg": 1,
    "g": 0.001,
    "lb": 0.453592,
    "tonne": 1000,
}
 
def freight_emission(data, default=0.0):
    raw_weight = float(data.get("freight_weight", 1000) or 0)
    weight_unit = data.get("freight_weight_unit", "kg")
    weight_kg = raw_weight * _WEIGHT_TO_KG.get(weight_unit, 1)
 
    params = {
        "origin_country": data.get("freight_origin_country", "NP"),
        "destination_country": data.get("freight_destination_country", "NP"),
        "origin_location": data.get("freight_origin_location", "Kathmandu"),
        "destination_location": data.get("freight_destination_location", "Kathmandu"),
        "weight": weight_kg,
        "unit": "kg",  # the API rejects 'tonne' despite the docs listing it as valid; kg is confirmed to work
        "fuel_source": data.get("freight_fuel_source", "diesel"),
    }
    transport_mode = data.get("freight_transport_mode")
    if transport_mode:
        params["transport_mode"] = transport_mode
 
    try:
        response = requests.get(
            "https://api.emissions.dev/v1/freight/emissions", headers=_headers(), params=params
        )
        response.raise_for_status()
        result = response.json()
        return result["data"]["attributes"]["emissions"]["co2e"]
    except requests.exceptions.HTTPError as e:
        _log_http_error("freight_emission", e)
        return default
    except (requests.exceptions.RequestException, KeyError, TypeError) as e:
        print(f"freight_emission failed, using default: {e}")
        return default

def travel_emission(data, default=0.0):
    mode = data.get("travel_mode", "car")
    params = {
        "origin_country": data.get("travel_origin_country", "NP"),
        "destination_country": data.get("travel_destination_country", "NP"),
        "origin_location": data.get("travel_origin_location", "Kathmandu"),
        "destination_location": data.get("travel_destination_location", "Kathmandu"),
        "transport_mode": mode,
        "return_trip": data.get("travel_return_trip", "false"),
        "passengers": data.get("travel_passengers", 1),
    }
    if mode in ("car", "taxi"):
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
        "country": data.get("hotel_country_code", "NP"),
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
        "kwh": data.get("electricity_kwh", 100),
        "unit": data.get("electricity_unit", "kwh"),
        "country": data.get("electricity_country_code", "NP"),
        "include_wtt": data.get("electricity_include_wtt", "true"),
        "include_td_losses": data.get("electricity_include_td_losses", "false"),
    }

    state = data.get("electricity_state")
    if state:
        params["state"] = state

    cloud_provider = data.get("electricity_cloud_provider")
    cloud_region = data.get("electricity_cloud_region")
    if cloud_provider:
        params["cloud_provider"] = cloud_provider
    if cloud_region:
        params["cloud_region"] = cloud_region

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
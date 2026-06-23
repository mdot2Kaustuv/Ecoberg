from wsgiref import headers

import requests
from decouple import config
from django.http import JsonResponse
import pandas as pd
import pycountry
import io
import re
import unicodedata 

def NewsList(request):
    access_key = config('YOUR_ACCESS_KEY')

    parameters = {
   'access_key': access_key,
    'languages': 'en',
    'keywords': 'climate', 
    'limit': 15
    }



    r = requests.get(
        'https://api.mediastack.com/v1/news',
        params=parameters
    )
    

    res = r.json()
    data = res['data']
    author = []
    title = []
    description = []
    image = []
    url = []
    source = []
    date = []

    news_list = []


    for i in data:
        news_list.append({
            'title': i['title'],
            'description': i['description'],
            'image': i['image'],
            'url': i['url'],
            'author': i['author'],
            'source': i['source'],
            'date': i['published_at']
        })

    news = zip(title, description, image, url, author, source, date)

    return JsonResponse({'news': news_list})


def clean_change_value(val):
    """Normalize any unicode minus/dash variants to ASCII hyphen-minus."""
    if pd.isna(val):
        return None

    s = str(val)
    s = unicodedata.normalize('NFKC', s)
    minus_variants = [
        '\u2212',       # − MINUS SIGN
        '\u2013',       # – EN DASH
        '\u2014',       # — EM DASH
        '\u2010',       # ‐ HYPHEN
        '\u00ad',       # ­ SOFT HYPHEN
        '\xad',         # same, latin-1
        'â\x88\x92',   # UTF-8 bytes of − misread as latin-1
    ]
    for char in minus_variants:
        s = s.replace(char, '-')


    s = re.sub(r'[^\d.%\-]', '', s)

    return s if s else None


def get_country_code(country_name):
    if pd.isna(country_name):
        return None
    try:
        return pycountry.countries.lookup(country_name).alpha_3
    except LookupError:
        mapping = {
            "United States": "USA",
            "United Kingdom": "GBR",
            "Russia": "RUS",
            "South Korea": "KOR",
            "Iran": "IRN",
            "Vietnam": "VNM",
            "Syria": "SYR",
            "Venezuela": "VEN",
            "DR Congo": "COD",
            "Congo": "COG",
            "Cote d'Ivoire": "CIV",
            "Czech Republic (Czechia)": "CZE",
            "State of Palestine": "PSE",
            "Taiwan": "TWN",
            "Tanzania": "TZA",
            "Laos": "LAO",
            "Moldova": "MDA",
            "Bolivia": "BOL",
            "Brunei": "BRN",
        }
        return mapping.get(country_name, None)


def scraper(request):
    url = "https://www.worldometers.info/greenhouse-gas-emissions/greenhouse-gas-emissions-by-country/"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers)
    response.encoding = 'utf-8'

    tables = pd.read_html(io.StringIO(response.text))

    print(f"Found {len(tables)} tables")

    if not tables:
        return JsonResponse({"error": "No tables found on page"}, status=502)

    df = tables[0]

    df.columns = ['index', 'country', 'total_emissions', 'one_year_change', 'per_capita', 'share']

    df['total_emissions'] = pd.to_numeric(
        df['total_emissions'].astype(str).str.replace(',', ''), errors='coerce'
    )
    df['per_capita'] = pd.to_numeric(
        df['per_capita'].astype(str).str.replace(',', ''), errors='coerce'
    )

    df['code'] = df['country'].apply(get_country_code)
    df['one_year_change'] = df['one_year_change'].apply(clean_change_value)

    clean_records = []
    for _, row in df.iterrows():
        total = int(row["total_emissions"]) if pd.notna(row["total_emissions"]) else 0
        per_capita = float(row["per_capita"]) if pd.notna(row["per_capita"]) else 0.0
        code = row["code"] if pd.notna(row["code"]) else None
        country = row["country"] if pd.notna(row["country"]) else None
        share = row["share"] if pd.notna(row["share"]) else None
        one_year_change = row["one_year_change"] if pd.notna(row["one_year_change"]) else None

        clean_records.append({
            "code": code,
            "country": country,
            "total": total,
            "per_capita": per_capita,
            "one_year_change": one_year_change,
            "share": share
        })

    return JsonResponse(clean_records, safe=False)


def local_scraper(requests) :

    url = "https://www.worldometers.info/greenhouse-gas-emissions/nepal-greenhouse-gas-emissions/"

    header = {
        "User-Agent": "Mozilla/5.0"
    }

   
    response = requests.get(url, headers=headers)
    response.encoding = 'utf-8'

    tables = pd.read_html(io.StringIO(response.text))

    print(f"Found {len(tables)} tables")

    if not tables:
        return JsonResponse({"error": "No tables found on page"}, status=502)
    

    df = tables[0]

    df.columns = ['year', 'ghg', 'co2', 'ch4', 'n02', 'per capita','change','global share']

    df['ghg'] = pd.to_numeric(
        df['ghg'].astype(str).str.replace(',', ''), errors='coerce'
    )
    df['co2'] = pd.to_numeric(
        df['co2'].astype(str).str.replace(',', ''), errors='coerce'
    )
    df['ch4'] = pd.to_numeric(
        df['ch4'].astype(str).str.replace(',', ''), errors='coerce'
    )
    df['n02'] = pd.to_numeric(
        df['n02'].astype(str).str.replace(',', ''), errors='coerce'
    )
    df['per capita'] = pd.to_numeric(
        df['per capita'].astype(str).str.replace(',', ''), errors='coerce'
    )
    df['change'] = pd.to_numeric(
        df['change'].astype(str).str.replace(',', ''), errors='coerce'
    )
    df['global share'] = pd.to_numeric(
        df['global share'].astype(str).str.replace(',', ''), errors='coerce'
    )       


    clean_records = []

    for _, row in df.iterrows():
        year = int(row["year"]) if pd.notna(row["year"]) else None
        ghg = float(row["ghg"]) if pd.notna(row["ghg"]) else 0.0
        co2 = float(row["co2"]) if pd.notna(row["co2"]) else 0.0
        ch4 = float(row["ch4"]) if pd.notna(row["ch4"]) else 0.0
        n02 = float(row["n02"]) if pd.notna(row["n02"]) else 0.0
        per_capita = float(row["per capita"]) if pd.notna(row["per capita"]) else 0.0
        change = float(row["change"]) if pd.notna(row["change"]) else 0.0
        global_share = float(row["global share"]) if pd.notna(row["global share"]) else 0.0

        clean_records.append({
            "year": year,
            "ghg": ghg,
            "co2": co2,
            "ch4": ch4,
            "n02": n02,
            "per_capita": per_capita,
            "change": change,
            "global_share": global_share
        })


    return JsonResponse(clean_records, safe=False)
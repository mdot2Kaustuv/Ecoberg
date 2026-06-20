import requests
from decouple import config
from django.http import JsonResponse
import pandas as pd
import pycountry
import io

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


def scraper(request):
    url = "https://www.worldometers.info/greenhouse-gas-emissions/greenhouse-gas-emissions-by-country/"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)

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

    df['code'] = df['country'].apply(get_country_code)

    clean_records = []
    for _, row in df.iterrows():
        total = (
            int(row["total_emissions"])
            if pd.notna(row["total_emissions"])
            else 0
        )
        per_capita = (
            float(row["per_capita"]) if pd.notna(row["per_capita"]) else 0.0
        )
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
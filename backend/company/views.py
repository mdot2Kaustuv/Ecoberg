import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry 
from django.http import JsonResponse
from decouple import config
import pandas as pd 


def company_carbon_footprint(request) :
   API_KEY = config('COMPANY_CARBON_DATA')
   authorization_headers = {"Authorization":f"Bearer{API_KEY}"}
   url = "https://api.climatiq.io/data/v1/estimate"
   session = requests.Session()
   data_version = "^3"
   adapter = HTTPAdapter(max_retries=Retry)
   session.mount('http://', adapter)
   session.mount('https://', adapter)


   filters = {
    "data_version" : "^21",
    "query" :"",
    "activity_id" : "",
    "category" : "",
    "sector" : "",
    "region" : "",
    "source" : "",
    "year" : "",
    "unit_type" : "",

}
   

   query = "?results_per_page=500"
   for attribute, value in filters.items():
      if (value != ""):
         query = query + "&" + attribute + "=" + value

   no_of_pages = 1
   current_page = 1
   results = pd.DataFrame()

   while current_page <= no_of_pages:
      response = session.get(url+query+"&page="+str(current_page), headers=authorization_headers)
      data = response.json()
      current_page = current_page+1
      no_of_pages = data["last_page"]

      query_results = pd.DataFrame.from_records(data["results"])
      results = pd.concat([results, query_results])

 
   results.to_csv('Climatiq_Emission_Factor_Database.csv', index=False)

   shortened_results = results[['activity_id', 'name', 'category', 'sector', 'source', 'unit_type']].drop_duplicates()
   final = shortened_results.groupby(['activity_id', 'name', 'category', 'sector'])['source'].apply(','.join).reset_index()
   final ["unit_type"] = shortened_results.groupby(['activity_id', 'name', 'category', 'sector'])['unit_type'].apply(','.join).reset_index()['unit_type']


   final.to_csv('Climatiq_Emission_Factor_Database_GroupedByActivityIDs.csv', index=False)


      

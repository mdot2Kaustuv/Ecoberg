import requests
from decouple import config
from django.http import JsonResponse

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
    print("debug: ", r.status_code)
    print(res)

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
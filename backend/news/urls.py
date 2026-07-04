
from django.urls import path
from . import views


urlpatterns = [
   path('int/', views.NewsList, name='news-list'),
   path('scraper/', views.scraper, name='news-scraper'),
   path ('dynamic/', views.dynamic_scraper, name='news-dynamic-scraper'),
   path('localscraper/', views.local_scraper, name='news-local-scraper')
]
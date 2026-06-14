
from django.urls import path
from . import views


urlpatterns = [
   path('', views.NewsList, name='news-list'),
]
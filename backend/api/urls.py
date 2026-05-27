
from django.urls import path
from .views import *

urlpatterns = [
    path('dashboard', dashboard),
    path('dashboard/', dashboard),
    path('explorer', explorer),
    path('explorer/', explorer),
    path('compare', compare),
    path('compare/', compare),
    path('per-capita', per_capita),
    path('per-capita/', per_capita),
    path('sources', sources),
    path('sources/', sources),
    path('admin', admin),
    path('admin/', admin),
    path('contact', contact),
    path('contact/', contact),
]

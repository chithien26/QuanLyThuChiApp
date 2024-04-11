from django.contrib import admin
from django.urls import path, include, re_path
# from .admin import admin_site
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
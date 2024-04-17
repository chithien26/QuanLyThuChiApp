from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .admin import admin_site
from . import views


router = DefaultRouter()
router.register('users', views.UserViewSet, basename='users')


urlpatterns = [
    path('', include(router.urls)),
]
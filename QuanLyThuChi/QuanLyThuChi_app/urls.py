from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .admin import admin_site
from . import views


router = DefaultRouter()
# router.register('user', views.UserViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin_site.urls)
]
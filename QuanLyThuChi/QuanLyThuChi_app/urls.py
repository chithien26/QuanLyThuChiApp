from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .admin import admin_site
from . import views


router = DefaultRouter()
router.register('users', views.UserViewSet, basename='users')
router.register('groups', views.GroupViewSet, basename='groups')
router.register('category_self', views.TransactionCategorySelfViewSet, basename='category_self')
router.register('category_group', views.TransactionCategoryGroupViewSet, basename='category_group')
router.register('transaction_self', views.TransactionSelfViewSet, basename='transaction_self')
router.register('transaction_group', views.TransactionGroupViewSet, basename='transaction_group')
router.register('freetime_option', views.FreetimeOptionViewSet, basename='freetime_option')
router.register('survey', views.SurveyViewSet, basename='survey')



urlpatterns = [
    path('', include(router.urls)),
]
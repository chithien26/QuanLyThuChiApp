from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('user', views.UserViewSet, basename='user')
router.register('group', views.GroupViewSet, basename='group')
router.register('group_member', views.GroupMemberViewSet, basename='group_member')
router.register('category_self', views.TransactionCategorySelfViewSet, basename='category_self')
router.register('category_group', views.TransactionCategoryGroupViewSet, basename='category_group')
router.register('transaction_self', views.TransactionSelfViewSet, basename='transaction_self')
router.register('transaction_group', views.TransactionGroupViewSet, basename='transaction_group')
router.register('freetime_option', views.FreetimeOptionViewSet, basename='freetime_option')
router.register('survey', views.SurveyViewSet, basename='survey')


urlpatterns = [
    path('', include(router.urls)),
]
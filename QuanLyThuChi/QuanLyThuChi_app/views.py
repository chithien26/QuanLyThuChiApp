from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from .serializers import *
from .models import *
# Create your views here.


def index(request):
    return HttpResponse("trang chu")


# class UserViewSet(viewsets.ViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer






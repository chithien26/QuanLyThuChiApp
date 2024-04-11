from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from .models import *
from django.db.models import Count
# Create your views here.
def index(request):
    return HttpResponse("trang chu")






from django.http import HttpResponse
from django.db.models import Count
from .serializers import *
from .models import *
from .paginators import *
from rest_framework import viewsets, generics
from rest_framework.decorators import action
# Create your views here.


def index(request):
    return HttpResponse("trang chu")


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer








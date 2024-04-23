from django.http import HttpResponse
from django.db.models import Count
from .serializers import *
from .models import *
from .paginators import *
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action, api_view
from rest_framework.parsers import MultiPartParser
# Create your views here.


def index(request):
    return HttpResponse("trang chu")


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]
    permission_classes = [permissions.IsAuthenticated]


    # @api_view(['GET'])
    # @permission_classes([permissions.IsAuthenticated])
    # def get_permissions(self):
    #     if request.user.account_type == 'admin':
    #         return self.permission_classes == [permissions.AllowAny]



class GroupViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer












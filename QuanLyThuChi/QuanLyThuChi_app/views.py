from django.http import HttpResponse
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from QuanLyThuChi_app import serializers
from .serializers import *


# Create your views here.


def index(request):
    return HttpResponse("trang chu")


class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]
    permission_classes = [permissions.IsAuthenticated]

    # def has_permisson(self, request):
    #     user = request.user
    #     if user.account_type == 'Admin':
    #         return [permissions.AllowAny()]
    #     return [permissions.IsAuthenticated()]

    @action(methods=['get'], url_path='transaction_category', detail=True)
    def get_transaction_category_self(self, request, pk):
        transaction_category = self.get_object().transactioncategoryself_set.filter(active=True)

        return Response(serializers.TransactionCategorySelfSerializer(transaction_category, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='add_transaction_category', detail=True)
    def add_transaction(self, request, pk):
        tc = self.get_object().transactionself_set.create(name=request.data.get('name'),
                                                         icon=request.data.get('icon'),
                                                         color=request.data.get('color'),
                                                         transaction_type=request.data.get('transaction_type'),
                                                         user=request.user)
        return Response(serializers.TransactionCategorySelfSerializer(tc).data, status=status.HTTP_201_CREATED)


class GroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Group.objects.filter(active=True)
    serializer_class = GroupSerializer


class TransactionCategorySelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionCategorySelf.objects.filter(active=True)
    serializer_class = TransactionCategorySelfSerializer

    @action(methods=['post'], url_path='add_transaction', detail=True)
    def add_transaction(self, request, pk):
        t = self.get_object().transactionself_set.create(name=request.data.get('name'),
                                                         amount=request.data.get('amount'),
                                                         description=request.data.get('description'),
                                                         transaction_category=request.data.get('transaction_category'))
        return Response(serializers.TransactionSelfSerializer(t).data, status=status.HTTP_201_CREATED)


class TransactionCategoryGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionCategoryGroup.objects.filter(active=True)
    serializer_class = TransactionCategoryGroupSerializer


class TransactionSelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionSelf.objects.filter(active=True)
    serializer_class = TransactionSelfSerializer


class TransactionGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionGroup.objects.filter(active=True)
    serializer_class = TransactionSelfSerializer


class FreetimeOptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = FreetimeOption.objects.filter(active=True)
    serializer_class = FreetimeOptionSerializer


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Survey.objects.filter(active=True)
    serializer_class = SurveySerializer

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


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView, generics.ListAPIView):
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

    @action(methods=['get'], url_path='transaction', detail=True)
    def get_transaction_self(self, request, pk):
        transaction = self.get_object().transactionself_set.filter(active=True)

        return Response(serializers.TransactionSelfSerializer(transaction, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='add_transaction_category', detail=True)
    def add_transaction_category(self, request, pk):
        tc = self.get_object().transactioncategoryself_set.create(name=request.data.get('name'),
                                                                  icon=request.data.get('icon'),
                                                                  color=request.data.get('color'),
                                                                  transaction_type=request.data.get('transaction_type'),
                                                                  user=request.user)
        return Response(serializers.TransactionCategorySelfSerializer(tc).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='statistics', detail=True)
    def statistics(self, request, pk):
        t = self.get_object().transactionself_set.filter(created_date__month=5)

        return Response(serializers.TransactionSelfSerializer(t).data, status=status.HTTP_200_OK)


class GroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Group.objects.prefetch_related('users').filter(active=True)
    serializer_class = GroupSerializer

    @action(methods=['post'], url_name='add_member', detail=True)
    def add_member(self, request, pk):
        group = self.get_object()
        user = request.data.get('user_id')
        if group.users.filter(id=user.id).exists():
            return Response({'detail': 'Tag already exists in lesson.'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        group.users.add(user)
        return Response({'detail': 'Tag added to lesson.'}, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='transaction_category', detail=True)
    def get_transaction_category_group(self, request, pk):
        transaction_category = self.get_object().transactioncategorygroup_set.filter(active=True)

        return Response(serializers.TransactionCategoryGroupSerializer(transaction_category, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='transaction', detail=True)
    def get_transaction_group(self, request, pk):
        transaction = self.get_object().transactiongroup_set.filter(active=True)

        return Response(serializers.TransactionGroupSerializer(transaction, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='add_transaction_category', detail=True)
    def add_transaction_category(self, request, pk):
        tc = self.get_object().transactioncategorygroup_set.create(name=request.data.get('name'),
                                                                   icon=request.data.get('icon'),
                                                                   color=request.data.get('color'),
                                                                   transaction_type=request.data.get(
                                                                       'transaction_type'),
                                                                   group=request.group)
        return Response(serializers.TransactionCategoryGrouopSerializer(tc).data, status=status.HTTP_201_CREATED)


class TransactionCategorySelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionCategorySelf.objects.filter(active=True)
    serializer_class = TransactionCategorySelfSerializer

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type')
        if type:
            queryset = queryset.filter(transaction_type__icontains=type)
        return queryset

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

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type')
        if type:
            queryset = queryset.filter(transaction_type__icontains=type)
        return queryset

    @action(methods=['post'], url_path='add_transaction', detail=True)
    def add_transaction(self, request, pk):
        t = self.get_object().transactionself_set.create(name=request.data.get('name'),
                                                         amount=request.data.get('amount'),
                                                         description=request.data.get('description'),
                                                         transaction_category=request.data.get('transaction_category'))
        return Response(serializers.TransactionSelfSerializer(t).data, status=status.HTTP_201_CREATED)


class TransactionSelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionSelf.objects.filter(active=True)
    serializer_class = TransactionSelfSerializer

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type')
        if type:
            queryset = queryset.filter(transaction_category__transaction_type__icontains=type)
        return queryset


class TransactionGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionGroup.objects.filter(active=True)
    serializer_class = TransactionSelfSerializer

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type')
        if type:
            queryset = queryset.filter(transaction_category__transaction_type__icontains=type)
        return queryset


class FreetimeOptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = FreetimeOption.objects.filter(active=True)
    serializer_class = FreetimeOptionSerializer


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Survey.objects.filter(active=True)
    serializer_class = SurveySerializer

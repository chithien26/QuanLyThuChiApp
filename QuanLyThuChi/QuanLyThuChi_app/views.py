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


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]
    permission_classes = [permissions.IsAuthenticated]

    # def get_permissons_admin(self, request):
    #     user = request.user
    #     if user.account_type == 'Admin':
    #         return [permissions.AllowAny()]
    #     return [permissions.IsAuthenticated]
    #
    # def get_permissions(self):
    #     if self.action in ['get_current_user']:
    #         return [permissions.IsAuthenticated()]
    #
    #     return [permissions.AllowAny()]
    #
    # @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    # def get_current_user(self, request):
    #     user = request.user
    #     if request.method.__eq__('PATCH'):
    #         for k, v in request.data.items():
    #             setattr(user, k, v)
    #         user.save()
    #
    #     return Response(serializers.UserSerializer(user).data)
    #
    # @action(methods=['get'], url_path='transaction_category', detail=True)
    # def get_transaction_category_self(self, request, pk):
    #     transaction_category = self.get_object().transactioncategoryself_set.filter(active=True)
    #
    #     return Response(serializers.TransactionCategorySelfSerializer(transaction_category, many=True).data,
    #                     status=status.HTTP_200_OK)
    #
    # @action(methods=['get'], url_path='transaction', detail=True)
    # def get_transaction_self(self, request, pk):
    #     transaction = self.get_object().transactionself_set.filter(active=True)
    #
    #     return Response(serializers.TransactionSelfSerializer(transaction, many=True).data,
    #                     status=status.HTTP_200_OK)
    #
    # @action(methods=['post'], url_path='add_transaction_category', detail=True)
    # def add_transaction_category(self, request, pk):
    #     tc = self.get_object().transactioncategoryself_set.create(name=request.data.get('name'),
    #                                                               icon=request.data.get('icon'),
    #                                                               transaction_type=request.data.get('transaction_type'),
    #                                                               user=request.user)
    #     return Response(serializers.TransactionCategorySelfSerializer(tc).data, status=status.HTTP_201_CREATED)

    # @action(methods=['get'], url_path='statistics', detail=True)
    # def statistics(self, request, pk):
    #     queryset = self.get_object().transactionself_set.filter(active=True)
    #     # month = self.request.query_params.get('month')
    #     # date_now = date.today
    #     # if month:
    #     #     queryset = queryset.filter(created_date__month=month)
    #     # else:
    #     #     month = date_now
    #     #     queryset = queryset.filter(created_date__month=month)
    #
    #     return Response(serializers.TransactionSelfSerializer(queryset).data, status=status.HTTP_200_OK)


class GroupViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Group.objects.filter(active=True)
    serializer_class = GroupSerializer



    # @action(methods=['post'], url_name='add_member', detail=True)
    # def add_member(self, request, pk):
    #     data = request.data
    #     user = data.get('user')
    #     group = data.get('group')
    #     is_leader = False
    #     member = self.get_object().groupmember_set.create(user=user,
    #                                                       group=group,
    #                                                       is_leader=is_leader)
    #     return Response(serializers.GroupMemberSerializer(member).data, status=status.HTTP_201_CREATED)
    #
    # @action(methods=['get'], url_path='transaction_category', detail=True)
    # def get_transaction_category_group(self, request, pk):
    #     transaction_category = self.get_object().transactioncategorygroup_set.filter(active=True)
    #
    #     return Response(serializers.TransactionCategoryGroupSerializer(transaction_category, many=True).data,
    #                     status=status.HTTP_200_OK)
    #
    # @action(methods=['get'], url_path='transaction', detail=True)
    # def get_transaction_group(self, request, pk):
    #     transaction = self.get_object().transactiongroup_set.filter(active=True)
    #
    #     return Response(serializers.TransactionGroupSerializer(transaction, many=True).data,
    #                     status=status.HTTP_200_OK)
    #
    # @action(methods=['post'], url_path='add_transaction_category', detail=True)
    # def add_transaction_category(self, request, pk):
    #     tc = self.get_object().transactioncategorygroup_set.create(name=request.data.get('name'),
    #                                                                icon=request.data.get('icon'),
    #                                                                transaction_type=request.data.get(
    #                                                                    'transaction_type'),
    #                                                                group=request.group)
    #     return Response(serializers.TransactionCategoryGroupSerializer(tc).data, status=status.HTTP_201_CREATED)

class GroupViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = GroupMember.objects.filter(active=True)
    serializer_class = GroupMemberSerializer
class TransactionCategorySelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionCategorySelf.objects.filter(active=True)
    serializer_class = TransactionCategorySelfSerializer

    # def get_queryset(self):
    #     queryset = self.queryset
    #     type = self.request.query_params.get('type')
    #     if type:
    #         queryset = queryset.filter(transaction_type__icontains=type)
    #     return queryset
    #
    # @action(methods=['post'], url_path='add_transaction', detail=True)
    # def add_transaction(self, request, pk):
    #     t = self.get_object().transactionself_set.create(name=request.data.get('name'),
    #                                                      amount=request.data.get('amount'),
    #                                                      description=request.data.get('description'),
    #                                                      transaction_category=request.data.get('transaction_category'))
    #     return Response(serializers.TransactionSelfSerializer(t).data, status=status.HTTP_201_CREATED)


class TransactionCategoryGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionCategoryGroup.objects.filter(active=True)
    serializer_class = TransactionCategoryGroupSerializer

    # def get_queryset(self):
    #     queryset = self.queryset
    #     type = self.request.query_params.get('type')
    #     if type:
    #         queryset = queryset.filter(transaction_type__icontains=type)
    #     return queryset
    #
    # @action(methods=['post'], url_path='add_transaction', detail=True)
    # def add_transaction(self, request, pk):
    #     t = self.get_object().transactionself_set.create(name=request.data.get('name'),
    #                                                      amount=request.data.get('amount'),
    #                                                      description=request.data.get('description'),
    #                                                      transaction_category=request.data.get('transaction_category'))
    #     return Response(serializers.TransactionSelfSerializer(t).data, status=status.HTTP_201_CREATED)


class TransactionSelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionSelf.objects.filter(active=True)
    serializer_class = TransactionSelfSerializer

    # def get_queryset(self):
    #     queryset = self.queryset
    #     type = self.request.query_params.get('type')
    #     if type:
    #         queryset = queryset.filter(transaction_category__transaction_type__icontains=type)
    #     return queryset


class TransactionGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionGroup.objects.filter(active=True)
    serializer_class = TransactionGroupSerializer

    # def get_queryset(self):
    #     queryset = self.queryset
    #     type = self.request.query_params.get('type')
    #     if type:
    #         queryset = queryset.filter(transaction_category__transaction_type__icontains=type)
    #     return queryset


class FreetimeOptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = FreetimeOption.objects.filter(active=True)
    serializer_class = FreetimeOptionSerializer


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Survey.objects.filter(active=True)
    serializer_class = SurveySerializer

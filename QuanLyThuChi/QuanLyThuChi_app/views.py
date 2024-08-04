import json
import os

from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from QuanLyThuChi import settings
from QuanLyThuChi_app import serializers, perm
from .paginators import TransactionCategoryGroupPagination
from .serializers import *


# Create your views here.


def index(request):
    return HttpResponse("trang chu")


class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # if self.action in ['list']:
        #     return [perm.AdminAuthenticated()]
        if self.action in ['register']:
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated()]

    # def get_permissions(self):
    #     if self.action in ['register']:
    #         return [permissions.AllowAny()]
    #     return [permissions.IsAuthenticated()]

    @action(methods=['post'], detail=False, url_path='register', permission_classes=[permissions.AllowAny])
    def register(self, request):

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()

                    # Đọc file JSON
                    file_path = os.path.join(settings.BASE_DIR,
                                             'QuanLyThuChi_App/static/data/default_category_self.json')
                    with open(file_path, 'r', encoding='utf-8') as file:
                        default_category_self = json.load(file)

                    # Tạo danh mục có sẵn cho user
                    for c in default_category_self:
                        TransactionCategorySelf.objects.create(
                            name=c['name'],
                            transaction_type=c['transaction_type'],
                            icon=c['icon'],
                            user=user
                        )
                return Response({'status': 'user created', 'user': UserSerializer(user).data},
                                status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def login(self, request, *args, **kwargs):
    #     user = authen
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
    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)


class GroupViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Group.objects.filter(active=True)
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        if self.action.__eq__('list'):
            queryset = queryset.filter(groupmember__user=user)

        return queryset

    @action(methods=['post'], url_path='create', detail=False)
    def create_group(self, request):
        create_by = request.user
        name = request.data.get('name')
        group = Group.objects.create(name=name, create_by=create_by)
        GroupMember.objects.create(user=create_by, group=group, is_leader=True)
        # Đọc file JSON
        file_path = os.path.join(settings.BASE_DIR,
                                 'QuanLyThuChi_App/static/data/default_category_self.json')
        with open(file_path, 'r', encoding='utf-8') as file:
            default_category_self = json.load(file)

        # Tạo danh mục có sẵn cho group
        for c in default_category_self:
            TransactionCategoryGroup.objects.create(
                name=c['name'],
                transaction_type=c['transaction_type'],
                icon=c['icon'],
                group=group
            )
        return Response(serializers.GroupSerializer(group).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='members', detail=True)
    def get_member_list(self, request, pk):
        user = request.user
        member = GroupMember.objects.filter(user=user, group__id=pk)
        if member.exists():
            members = GroupMember.objects.filter(group__id=pk)
            return Response(serializers.GroupMemberSerializer(members, many=True).data, status=status.HTTP_200_OK)
        return Response({'error': 'Not found group'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_name='add_member', detail=True)
    def add_member(self, request, pk):
        user_add = request.user
        member = GroupMember.objects.filter(user=user_add, group__id=pk)
        if member.exists():
            user_id = request.data.get('user_id')
            user = User.objects.get(pk=user_id)
            group = Group.objects.get(pk=pk)
            user_in_group = GroupMember.objects.filter(user=user, group=group)
            if user_in_group.exists():
                return Response({'error': 'User in group'}, status=status.HTTP_404_NOT_FOUND)
            else:
                is_leader = request.data.get('is leader', False)
                member = self.get_object().groupmember_set.create(user=user, group=group, is_leader=is_leader)
                return Response(serializers.GroupMemberSerializer(member).data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Not found group'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_path='delete_member', detail=True)
    def delete_member(self, request, pk):
        data = request.data
        user_id = data.get('user_id')
        user = User.objects.get(pk=user_id)
        group = Group.objects.get(pk=pk)
        member = GroupMember.objects.filter(user=user, group=group)
        member.delete()
        return Response({"message": "User removed from group"}, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='transaction_category', detail=True)
    def get_transaction_category_group(self, request, pk):
        transaction_category = self.get_object().transactioncategorygroup_set.filter(active=True)
        type = request.query_params.get('type')
        if type:
            transaction_category = TransactionCategoryGroup.objects.filter(Q(group__id=pk) & Q(transaction_type=type))
        paginator = TransactionCategoryGroupPagination()
        result_page = paginator.paginate_queryset(transaction_category, request)
        serializer = serializers.TransactionCategoryGroupSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
        # return Response(serializers.TransactionCategoryGroupSerializer(transaction_category, many=True).data,
        #                 status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='transaction', detail=True)
    def get_transaction_group(self, request, pk):
        transaction = self.get_object().transactiongroup_set.filter(active=True)
        type = request.query_params.get('type')
        if type:
            transaction = TransactionGroup.objects.filter(
                Q(group__id=pk) & Q(transaction_category__transaction_type=type))
        return Response(serializers.TransactionGroupSerializer(transaction, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='add_category', detail=True)
    def add_category(self, request, pk):
        name = request.data.get('name')
        icon = request.data.get('icon')
        transaction_type = request.data.get('transaction_type')
        group = Group.objects.get(id=pk)
        if not name or not transaction_type:
            return Response({'error': 'Name and transaction_type are required.'}, status=status.HTTP_400_BAD_REQUEST)
        tc = TransactionCategoryGroup.objects.create(name=name, icon=icon, transaction_type=transaction_type,
                                                     group=group)
        return Response(serializers.TransactionCategoryGroupSerializer(tc).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='add_transaction', detail=True)
    def add_transaction(self, request, pk):
        data = request.data
        name = data.get('name')
        amount = data.get('amount')
        timestamp = data.get('timestamp')
        description = data.get('description')
        id = data.get('transaction_category_id')
        transaction_category = TransactionCategoryGroup.objects.get(id=id)
        user = request.user
        group = Group.objects.get(id=pk)
        accept = request.data.get('accept')
        if accept:
            if accept.lower() == 'true':
                accept=True
            else:
                accept=False
        else:
            accept = False

        if not name or not transaction_category:
            return Response({'error': 'Name and transaction_type are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        t = TransactionGroup.objects.create(name=name, amount=amount, timestamp=timestamp,
                                            transaction_category=transaction_category, description=description,
                                            user=user, group=group, accept=accept)
        return Response(serializers.TransactionGroupSerializer(t).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='create_survey', detail=True)
    def create_survey(self, request, pk):
        name = request.data.get('name')
        user = request.user
        group = Group.objects.get(pk=pk)
        is_member = GroupMember.objects.filter(Q(group=group) & Q(user=user)).exists()
        if is_member:
            creator = user

        else:
            return Response({'error': 'Not a member'}, status=status.HTTP_400_BAD_REQUEST)
        if not name:
            return Response({'error': 'Not found name'}, status=status.HTTP_400_BAD_REQUEST)

        s = Survey.objects.create(name=name, creator=creator, group=group)
        return Response(serializers.SurveySerializer(s).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='survey', detail=True)
    def get_survey(self, request, pk):
        group = Group.objects.get(pk=pk)
        s = Survey.objects.filter(group=group)

        return Response(serializers.SurveySerializer(s, many=True).data, status=status.HTTP_200_OK)


class GroupMemberViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = GroupMember.objects.filter(active=True)
    serializer_class = GroupMemberSerializer
    permission_classes = [IsAuthenticated, ]


class TransactionCategorySelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView,
                                     generics.DestroyAPIView):
    queryset = TransactionCategorySelf.objects.filter(active=True)
    serializer_class = TransactionCategorySelfSerializer
    permission_classes = [perm.OwnerAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        if self.action.__eq__('list'):
            queryset = queryset.filter(user=user)
            type = self.request.query_params.get('type')
            if type:
                queryset = queryset.filter(transaction_type__icontains=type)
        return queryset

    @action(methods=['post'], url_path='add', detail=False)
    def add_transaction_category(self, request):
        data = request.data
        name = data.get('name')
        icon = data.get('icon')
        transaction_type = data.get('transaction_type')
        user = request.user
        if not name or not transaction_type:
            return Response({'error': 'Name and transaction_type are required.'}, status=status.HTTP_400_BAD_REQUEST)

        tc = TransactionCategorySelf.objects.create(name=name, icon=icon, transaction_type=transaction_type, user=user)
        return Response(serializers.TransactionCategorySelfSerializer(tc).data, status=status.HTTP_201_CREATED)

    @action(methods=['put'], url_path='update', detail=True)
    def update_category(self, request, pk):
        try:
            transaction_category = TransactionCategorySelf.objects.get(pk=pk)
        except TransactionCategorySelf.DoesNotExist:
            return Response({"error": "Transaction category self not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TransactionCategorySelfSerializer(transaction_category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionCategoryGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView,
                                      generics.DestroyAPIView):
    queryset = TransactionCategoryGroup.objects.filter(active=True)
    serializer_class = TransactionCategoryGroupSerializer
    permission_classes = [perm.OwnerAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type')
        if type:
            queryset = queryset.filter(transaction_type=type)
        return queryset

    @action(methods=['put'], url_path='update', detail=True)
    def update_category(self, request, pk):
        try:
            transaction_category = TransactionCategoryGroup.objects.get(pk=pk)
        except TransactionCategoryGroup.DoesNotExist:
            return Response({"error": "Transaction category group not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TransactionCategoryGroupSerializer(transaction_category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionSelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.DestroyAPIView):
    queryset = TransactionSelf.objects.filter(active=True)
    serializer_class = TransactionSelfSerializer
    permission_classes = [perm.OwnerAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        if self.action.__eq__('list'):
            queryset = queryset.filter(user=user).order_by('timestamp')
            type = self.request.query_params.get('type')
            month = self.request.query_params.get('month')
            year = self.request.query_params.get('year')
            if type:
                queryset = queryset.filter(transaction_category__transaction_type__icontains=type)
            if month:
                queryset = queryset.filter(timestamp__month=month)
            if year:
                queryset = queryset.filter(timestamp__year=year)

        return queryset

    @action(methods=['post'], url_path='add', detail=False)
    def add_transaction(self, request):
        data = request.data
        name = data.get('name')
        amount = data.get('amount')
        timestamp = data.get('timestamp')
        id = data.get('transaction_category_id')
        description =data.get('description')
        transaction_category = TransactionCategorySelf.objects.get(id=id)
        user = request.user
        if not name or not transaction_category:
            return Response({'error': 'Name and transaction_type are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        t = TransactionSelf.objects.create(name=name, amount=amount, timestamp=timestamp,
                                           transaction_category=transaction_category,
                                           user=user, description=description)
        return Response(serializers.TransactionSelfSerializer(t).data, status=status.HTTP_201_CREATED)

    @action(methods=['put'], url_path='update', detail=True)
    def update_transaction(self, request, pk):
        try:
            transaction = TransactionSelf.objects.get(pk=pk)
        except TransactionSelf.DoesNotExist:
            return Response({"error": "Transaction self not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TransactionSelfSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView,
                              generics.DestroyAPIView):
    queryset = TransactionGroup.objects.filter(active=True)
    serializer_class = TransactionGroupSerializer
    permission_classes = [perm.IsGroupCreatorOrLeader]


    def get_queryset(self):
        queryset = self.queryset
        queryset = queryset.order_by('timestamp')
        type = self.request.query_params.get('type')
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        if type:
            queryset = queryset.filter(transaction_category__transaction_type__icontains=type)
        if month:
            queryset = queryset.filter(timestamp__month=month)
        if year:
            queryset = queryset.filter(timestamp__year=year)
        return queryset

    @action(methods=['put'], url_path='update', detail=True)
    def update_transaction(self, request, pk):
        try:
            transaction = TransactionGroup.objects.get(pk=pk)
        except TransactionGroup.DoesNotExist:
            return Response({"error": "Transaction group not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TransactionGroupSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['put'], url_path='accept', detail=True)
    def accept_transaction(self, request, pk):

        transaction = TransactionGroup.objects.get(id=pk)
        # id = transaction.group.id
        # group = Group.objects.filter(pk=id)

        transaction.accept = True
        transaction.save()

        serializer = TransactionGroupSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FreetimeOptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = FreetimeOption.objects.filter(active=True)
    serializer_class = FreetimeOptionSerializer
    permission_classes = [IsAuthenticated, ]


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Survey.objects.filter(active=True)
    serializer_class = SurveySerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['post'], url_path='create_option', detail=True)
    def create_option(self, request, pk):
        date = request.data.get('date')
        time_of_day = request.data.get('time_of_day')
        user = request.user
        survey = Survey.objects.get(pk=pk)

        if not date or not time_of_day:
            return Response({'error: date and time_of_date are required'}, status=status.HTTP_400_BAD_REQUEST)

        option = FreetimeOption.objects.create(date=date, time_of_day=time_of_day, user=user, survey=survey)
        return Response(serializers.FreetimeOptionSerializer(option).data, status=status.HTTP_201_CREATED)
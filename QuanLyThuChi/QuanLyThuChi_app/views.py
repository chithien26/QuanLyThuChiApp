from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from QuanLyThuChi_app import serializers, perm
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
        if self.action in ['list']:
            return [perm.AdminAuthenticated()]
        elif self.action in ['register']:
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
            user = serializer.save()
            # tạo danh mục có sẵn cho user
            # TransactionCategorySelf.objects.create(name='Ăn uống', transaction_type='expense', user=user)
            # TransactionCategorySelf.objects.create(name='Mua sắm', transaction_type='expense', user=user)
            # TransactionCategorySelf.objects.create(name='đi chơi', transaction_type='expense', user=user)
            return Response({'status': 'user created', 'user': UserSerializer(user).data},
                            status=status.HTTP_201_CREATED)
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

    @action(methods=['get'], url_path='groups', detail=False)
    def groups(self, request):
        user = request.user
        groups = Group.objects.filter(groupmember__user=user)
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        transaction_category = TransactionCategorySelf.objects.filter(Q(user=user) & Q(active=True))
        type = request.query_params.get('type')
        if type:
            transaction_category = TransactionCategorySelf.objects.filter(Q(user=user) & Q(transaction_type=type))

        return Response(serializers.TransactionCategorySelfSerializer(transaction_category, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='transactions', detail=False)
    def get_transaction_self(self, request):
        user = request.user
        transaction = TransactionSelf.objects.filter(Q(active=True) & Q(user=user))
        type = request.query_params.get('type')
        if type:
            transaction = TransactionSelf.objects.filter(Q(user=user) & Q(transaction_category__transaction_type=type))
        return Response(serializers.TransactionSelfSerializer(transaction, many=True).data,
                        status=status.HTTP_200_OK)



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
    permission_classes = [IsAuthenticated, ]

    @action(methods=['get'], url_path='members', detail=True)
    def get_member_list(self, request, pk):
        members = GroupMember.objects.filter(group__id=pk)
        return Response(serializers.GroupMemberSerializer(members, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='members', detail=True)
    def get_member_list(self, request, pk):
        members = GroupMember.objects.filter(group__id=pk)
        return Response(serializers.GroupMemberSerializer(members, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_name='add_member', detail=True)
    def add_member(self, request, pk):
        data = request.data
        user_id = data.get('user_id')
        user = User.objects.get(pk=user_id)
        group = Group.objects.get(pk=pk)
        # is_leader = False
        member = self.get_object().groupmember_set.create(user=user, group=group)
        return Response(serializers.GroupMemberSerializer(member).data, status=status.HTTP_201_CREATED)

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

        return Response(serializers.TransactionCategoryGroupSerializer(transaction_category, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='transaction', detail=True)
    def get_transaction_group(self, request, pk):
        transaction = self.get_object().transactiongroup_set.filter(active=True)
        type = request.query_params.get('type')
        if type:
            transaction = TransactionGroup.objects.filter(
                Q(group__id=pk) & Q(transaction_category__transaction_type=type))
        return Response(serializers.TransactionGroupSerializer(transaction, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='add_transaction_category', detail=True)
    def add_transaction_category(self, request, pk):
        name = request.data.get('name')
        icon = request.data.get('icon')
        transaction_type = request.data.get('transaction_type')
        group = self.get_object()
        if not name or not transaction_type:
            return Response({'error': 'Name and transaction_type are required.'}, status=status.HTTP_400_BAD_REQUEST)

        tc = TransactionCategorySelf.objects.create(name=name, icon=icon, transaction_type=transaction_type,
                                                    group=group)
        return Response(serializers.TransactionCategorySelfSerializer(tc).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='add_transaction', detail=False)
    def add_transaction(self, request):
        data = request.data
        name = data.get('name')
        amount = data.get('amount')
        timestamp = data.get('timestamp')
        transaction_category = data.get('transaction_category')
        user = request.user
        group = self.get_object()
        if not name or not transaction_category:
            return Response({'error': 'Name and transaction_type are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        tc = TransactionSelf.objects.create(name=name, amount=amount, timestamp=timestamp,
                                            transaction_category=transaction_category,
                                            user=user, group=group)
        return Response(serializers.TransactionSelfSerializer(tc).data, status=status.HTTP_201_CREATED)


class GroupMemberViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = GroupMember.objects.filter(active=True)
    serializer_class = GroupMemberSerializer
    permission_classes = [IsAuthenticated, ]


class TransactionCategorySelfViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionCategorySelf.objects.filter(active=True)
    serializer_class = TransactionCategorySelfSerializer

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        if self.action.__eq__('list'):
            queryset = queryset.filter(user=user)
            type = self.request.query_params.get('type')
            if type:
                queryset = queryset.filter(transaction_type=type)
        return queryset

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


class TransactionCategoryGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionCategoryGroup.objects.filter(active=True)
    serializer_class = TransactionCategoryGroupSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type')
        if type:
            queryset = queryset.filter(transaction_type__icontains=type)
        return queryset

    @action(methods=['put'], url_path='update', detail=True)
    def update_category(self, request, pk):
        try:
            transaction_category = TransactionCategoryGroup.objects.get(pk=pk)
        except TransactionCategorySelf.DoesNotExist:
            return Response({"error": "Transaction category group not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TransactionCategoryGroupSerializer(transaction_category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        if self.action.__eq__('list'):
            queryset = queryset.filter(user=user)
            type = self.request.query_params.get('type')
            if type:
                queryset = queryset.filter(transaction_type=type)
        return queryset

    @action(methods=['post'], url_path='add', detail=False)
    def add_transaction(self, request):
        data = request.data
        name = data.get('name')
        amount = data.get('amount')
        timestamp = data.get('timestamp')
        transaction_category = data.get('transaction_category')
        user = request.user
        if not name or not transaction_category:
            return Response({'error': 'Name and transaction_type are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        tc = TransactionSelf.objects.create(name=name, amount=amount, timestamp=timestamp,
                                            transaction_category=transaction_category,
                                            user=user)
        return Response(serializers.TransactionSelfSerializer(tc).data, status=status.HTTP_201_CREATED)

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


class TransactionGroupViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TransactionGroup.objects.filter(active=True)
    serializer_class = TransactionGroupSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type')
        if type:
            queryset = queryset.filter(transaction_category__transaction_type__icontains=type)
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


class FreetimeOptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = FreetimeOption.objects.filter(active=True)
    serializer_class = FreetimeOptionSerializer
    permission_classes = [IsAuthenticated, ]


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Survey.objects.filter(active=True)
    serializer_class = SurveySerializer
    permission_classes = [permissions.IsAuthenticated]




# class o(viewsets.ViewSet):
#     @action(methods=['post'], detail=False, url_path='token')
#     def login(self, request):
#         username = request.data.get("username")
#         password = request.data.get("password")
#         user = authenticate(username=username, password=password)
#
#         if not user:
#             return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
#
#         try:
#             application = Application.objects.get(client_id='your_client_id')
#         except Application.DoesNotExist:
#             return Response({"error": "Application does not exist"}, status=status.HTTP_400_BAD_REQUEST)
#
#         oauthlib_core = get_oauthlib_core()
#         headers, body, status_code = oauthlib_core.create_token_response(
#             request._request,
#             grant_type='password',
#             client_id=application.client_id,
#             client_secret=application.client_secret,
#             username=username,
#             password=password,
#         )
#
#         if status_code == 200:
#             return JsonResponse(json.loads(body))
#         else:
#             return Response(json.loads(body), status=status_code)


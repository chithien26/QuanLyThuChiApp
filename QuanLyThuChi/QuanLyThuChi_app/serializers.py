from rest_framework.serializers import ModelSerializer
from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class GroupSerializer(ModelSerializer):
    # leader = User.objects.filter(Membership__role_name='leader')
    users = UserSerializer(many=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'created_date', 'users']
        # fields = ['id', 'name', 'created_date', 'leader', 'users']


class TransactionCategorySelfSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TransactionSelf
        fields = ['id', 'name', 'description', 'transaction_type', 'created_date', 'user']


class TransactionCategoryGroupSerializer(ModelSerializer):
    Group = GroupSerializer()

    class Meta:
        model = TransactionGroup
        fields = ['id', 'name', 'description', 'transaction_type', 'created_date', 'group']


class TransactionSelf(ModelSerializer):
    user = UserSerializer()
    category = TransactionCategorySelfSerializer()

    class Meta:
        model = TransactionSelf
        fields = ['id', 'name', 'amount', 'created_date', 'category', 'user']


class TransactionGroup(ModelSerializer):
    group = GroupSerializer()
    category = TransactionCategoryGroupSerializer()

    class Meta:
        model = TransactionGroup
        fields = ['id', 'name', 'amount', 'created_date', 'transaction_category', 'group']



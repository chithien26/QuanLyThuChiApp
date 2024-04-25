from rest_framework.serializers import ModelSerializer
from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data["password"])
        user.save()

        return user

# class UsernameSerializer(ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username']
class GroupSerializer(ModelSerializer):
    users = UserSerializer(many=True)
    class Meta:
        model = Group
        fields = ['id', 'name', 'created_date', 'users']


class TransactionCategorySelfSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TransactionCategorySelf
        fields = ['id', 'name', 'transaction_type', 'created_date', 'user']


class TransactionCategoryGroupSerializer(ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = TransactionCategoryGroup
        fields = ['id', 'name', 'transaction_type', 'created_date', 'group']


class TransactionSelf(ModelSerializer):
    user = UserSerializer()
    category = TransactionCategorySelfSerializer()

    class Meta:
        model = TransactionSelf
        fields = ['id', 'name', 'amount', 'description', 'created_date', 'category', 'user']


class TransactionGroup(ModelSerializer):
    group = GroupSerializer()
    category = TransactionCategoryGroupSerializer()

    class Meta:
        model = TransactionGroup
        fields = ['id', 'name', 'amount', 'description', 'created_date', 'category', 'group']



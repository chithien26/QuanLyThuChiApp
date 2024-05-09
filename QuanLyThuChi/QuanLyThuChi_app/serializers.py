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


class GroupSerializer(ModelSerializer):
    users = UserSerializer(many=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'created_date', 'users']


class TransactionCategorySelfSerializer(ModelSerializer):

    class Meta:
        model = TransactionCategorySelf
        fields = ['id', 'name', 'transaction_type', 'created_date', 'user']
        extra_kwargs = {
            'user': {
                'write_only': True
            }
        }


class TransactionCategoryGroupSerializer(ModelSerializer):

    class Meta:
        model = TransactionCategoryGroup
        fields = ['id', 'name', 'transaction_type', 'created_date', 'group']

    extra_kwargs = {
        'group': {
            'write_only': True
        }
    }

class TransactionSelfSerializer(ModelSerializer):
    transaction_category = TransactionCategorySelfSerializer()
    class Meta:
        model = TransactionSelf
        fields = ['id', 'name', 'amount', 'description', 'created_date', 'transaction_category', 'user']
        extra_kwargs = {
            'user': {
                'write_only': True
            }
        }

class TransactionGroupSerializer(ModelSerializer):
    transaction_category = TransactionCategoryGroupSerializer()

    class Meta:
        model = TransactionGroup
        fields = ['id', 'name', 'amount', 'description', 'created_date', 'transaction_category', 'group']
        extra_kwargs = {
            'group': {
                'write_only': True
            }
        }

class FreetimeOptionSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = FreetimeOption
        fields = ['date', 'time_of_day', 'user']


class SurveySerializer(ModelSerializer):
    group = GroupSerializer()
    options = FreetimeOptionSerializer(many=True)
    class Meta:
        model = Survey
        fields = ['options', 'group']

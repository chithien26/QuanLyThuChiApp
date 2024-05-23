from rest_framework.serializers import ModelSerializer

from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar', 'account_type']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'account_type': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(user.password)
        user.save()
        return user


class GroupSerializer(ModelSerializer):
    create_by = UserSerializer()

    class Meta:
        model = Group
        fields = ['id', 'name', 'created_date', 'create_by']

    # def create(self, validated_data):
    #     group = Group(**validated_data)
    #     user = self.context['request'].user
    #     if group.create_by == user.pk:
    #         GroupMember.objects.create(group=group, user=user, is_leader=True)
    #     else:
    #         GroupMember.objects.create(group=group, user=user, is_leader=False)
    #     group.save()
    #
    #     return group


class GroupMemberSerializer(ModelSerializer):
    class Meta:
        model = GroupMember
        fields = ['id', 'group', 'user', 'is_leader']


class TransactionCategorySelfSerializer(ModelSerializer):
    class Meta:
        model = TransactionCategorySelf
        fields = ['id', 'name', 'transaction_type', 'created_date', 'user']
        # extra_kwargs = {
        #     'user': {
        #         'write_only': True
        #     }
        # }

        def create(self, validated_data):
            user = self.context['request'].user
            category = TransactionCategorySelf.objects.create(user=user, **validated_data)
            return category


class TransactionCategoryGroupSerializer(ModelSerializer):
    class Meta:
        model = TransactionCategoryGroup
        fields = ['id', 'name', 'transaction_type', 'created_date', 'group']

    # extra_kwargs = {
    #     'group': {
    #         'write_only': True
    #     }
    # }


class TransactionSelfSerializer(ModelSerializer):
    class Meta:
        model = TransactionSelf
        fields = ['id', 'name', 'amount', 'timestamp', 'description', 'created_date', 'transaction_category', 'user']
        # extra_kwargs = {
        #     'user': {
        #         'write_only': True
        #
        #     }
        # }


class TransactionGroupSerializer(ModelSerializer):
    class Meta:
        model = TransactionGroup
        fields = ['id', 'name', 'amount', 'timestamp', 'description', 'created_date', 'transaction_category', 'group', 'user', 'accept']
        # extra_kwargs = {
        #     'group': {
        #         'write_only': True
        #     }
        # }


class FreetimeOptionSerializer(ModelSerializer):
    # user = UserSerializer()

    class Meta:
        model = FreetimeOption
        fields = ['id', 'date', 'time_of_day', 'user', 'survey']


class SurveySerializer(ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = Survey
        fields = ['id', 'name', 'creator', 'group']
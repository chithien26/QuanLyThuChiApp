from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class BaseModel(models.Model):
    class Meta:
        abstract = True

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)


class UserCategory(BaseModel):
    name = models.CharField(max_length=20, unique=True, default='user')

    def __str__(self):
        return self.name


class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/user/%Y/%m/%d/', null=True)
    userCategory = models.ForeignKey(UserCategory, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.username


class Group(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    users = models.ManyToManyField(User, related_name='group', through='Membership')


class Role(BaseModel):
    roleName = models.CharField(max_length=30, unique=True, default='member')

    def __str__(self):
        return self.roleName


class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.SET("UNKNOW"), default="member")


class TransactionType(models.Model):
    type = models.CharField(max_length=30, unique=True, default='income')

    def __str__(self):
        return self.type


class BaseModel_transaction_category(BaseModel):
    class Meta:
        abstract = True

    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='images/icon/', null=True)
    color = models.CharField(max_length=30, default='black')
    type = models.ForeignKey(TransactionType, on_delete=models.SET("UNKNOW"))


class TransactionCategory_self(BaseModel_transaction_category):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class TransactionCategory_group(BaseModel_transaction_category):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class BaseModel_transaction(BaseModel):
    class Meta:
        abstract = True
        ordering = ["amount"]

    name = models.CharField(max_length=50, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class Transaction_self(BaseModel_transaction):
    transactionCategory_self = models.ForeignKey(TransactionCategory_self, related_name='transaction_self',
                                                 on_delete=models.SET("Không có"))

    def __str__(self):
        return self.name


class Transaction_group(BaseModel_transaction):
    transactionCategory_group = models.ForeignKey(TransactionCategory_group, related_name='transaction_group',
                                                  on_delete=models.SET("Không có"))

    def __str__(self):
        return self.name


#TẠO GIÁ TRỊ MẶC ĐỊNH CHO LOẠI TÀI KHOẢN (UserCategory)
default_userCategory1 = UserCategory.objects.get_or_create(name='PERSONAL')
default_userCategory2 = UserCategory.objects.get_or_create(name='GROUP')

User.add_to_class('userCategory',
                  models.ForeignKey(UserCategory, on_delete=models.CASCADE, default=default_userCategory1))
User.add_to_class('userCategory',
                  models.ForeignKey(UserCategory, on_delete=models.CASCADE, default=default_userCategory2))


#TẠO GIÁ TRỊ MẶC ĐỊNH CHO CHỨC VỤ (Role)
default_role1 = Role.objects.get_or_create(name='LEADER')
default_role2 = Role.objects.get_or_create(name='MEMBER')

Membership.add_to_class('role',
                  models.ForeignKey(Role, on_delete=models.CASCADE, default=default_role1))
Membership.add_to_class('role',
                  models.ForeignKey(Role, on_delete=models.CASCADE, default=default_role2))

#TẠO GIÁ TRỊ MẶC ĐỊNH CHO LOẠI GIAO DỊCH (TransactionType)
default_transactionType1 = TransactionType.objects.get_or_create(name='IMCOME')
default_transactionType2 = TransactionType.objects.get_or_create(name='EXPENSE')

BaseModel_transaction_category.add_to_class('type',
                  models.ForeignKey(TransactionType, on_delete=models.CASCADE, default=default_transactionType1))
BaseModel_transaction_category.add_to_class('type',
                  models.ForeignKey(TransactionType, on_delete=models.CASCADE, default=default_transactionType2))
from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import request


# Create your models here.
class BaseModel(models.Model):
    class Meta:
        abstract = True

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)


class User(AbstractUser):
    ACCOUNT_TYPES = (
        ('personal', 'Personal'),
        ('group', 'Group'),
    )

    avatar = models.ImageField(upload_to='images/user/%Y/%m/%d/', null=True)
    # account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, default='Personal')

    def __str__(self):
        return self.username


class Group(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    users = models.ManyToManyField(User, related_name='group', through='Membership')


class Membership(models.Model):
    ROLE = (
        ('leader', 'Leader'),
        ('member', 'Member'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role_name = models.CharField(max_length=20, choices=ROLE, default='Member')


class BaseModelTransactionCategory(BaseModel):
    class Meta:
        abstract = True

    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='images/icon/', null=True)
    color = models.CharField(max_length=30, default='black')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, default='Income')


class TransactionCategorySelf(BaseModelTransactionCategory):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class TransactionCategoryGroup(BaseModelTransactionCategory):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class BaseModelTransaction(BaseModel):
    class Meta:
        abstract = True
        ordering = ["amount"]

    name = models.CharField(max_length=50, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class TransactionSelf(BaseModelTransaction):
    transaction_Category_self = models.ForeignKey(TransactionCategorySelf, related_name='transaction_self',
                                                 on_delete=models.SET("Không có"))

    def __str__(self):
        return self.name


class TransactionGroup(BaseModelTransaction):
    transactionCategory_group = models.ForeignKey(TransactionCategoryGroup, related_name='transaction_group',
                                                  on_delete=models.SET("Không có"))

    def __str__(self):
        return self.name



from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class BaseModel(models.Model):
    class Meta:
        abstract = True

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)


class Group(BaseModel):
    name = models.CharField(max_length=50, unique=True)


class UserCategory(BaseModel):
    ADMIN = 1
    PERSONAL = 2

    def __str__(self):
        if self == UserCategory.PERSONAL:
            return self.PERSONAL
        elif self == UserCategory.ADMIN:
            return self.ADMIN
        else:
            return "UNKNOW"

class User(AbstractUser):
    avatar = models.ImageField(upload_to='user/%Y/%m/%d/', null=True)
    userCategory = models.ForeignKey(UserCategory, on_delete=models.CASCADE, default=UserCategory.PERSONAL)
    groups = models.ManyToManyField(Group, related_name='users')

    def __str__(self):
        return self.username


class BaseModel_transaction_category(BaseModel):
    class Meta:
        abstract = True

    name = models.CharField(max_length=50, unique=True)
    icon = models.ImageField(upload_to='icon/', null=True)
    color = models.CharField(max_length=30, default='black')


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
    TransactionCategory_self = models.ForeignKey(TransactionCategory_self, related_name='transaction_self',
                                                 on_delete=models.SET('Không có'))

    def __str__(self):
        return self.name


class Transaction_group(BaseModel_transaction):
    TransactionCategory_group = models.ForeignKey(TransactionCategory_group, related_name='transaction_self',
                                                  on_delete=models.SET('Không có'))

    def __str__(self):
        return self.name

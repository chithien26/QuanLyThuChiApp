from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(upload_to='/user/%Y/%m/%d')


class BaseModel(models.Model):
    class Meta:
        abstract = True

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)


class BaseModelCategory(BaseModel):
    class Meta:
        abstract = True

    name = models.CharField(max_length=50, unique=True)
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=30)
    user = models.ForeignKey('User', on_delete=models.CASCADE)

class BaseModelFinancials(BaseModel):
    class Meta:
        abstract = True

    description = models.CharField(max_length=50, blank=True)
    money = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey('User', on_delete=models.CASCADE)


class IncomeCategory(BaseModelCategory):
    pass


class ExpenseCategory(BaseModelCategory):
    pass


class Income(BaseModelFinancials):
    incomeCategory = models.ForeignKey('IncomeCategory', on_delete=models.SET('Không có'))


class Expense(BaseModelFinancials):
    expenseCategory = models.ForeignKey('ExpenseCategory', on_delete=models.SET('Không có'))


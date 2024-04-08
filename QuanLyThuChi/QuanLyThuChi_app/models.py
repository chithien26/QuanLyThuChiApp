from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(upload_to='user/%Y/%m/%d/', null=True)

    def __str__(self):
        return self.username


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
    icon = models.ImageField(upload_to='icon/', null=True)
    color = models.CharField(max_length=30, default='black')
    user = models.ForeignKey('User', on_delete=models.CASCADE)


class IncomeCategory(BaseModelCategory):
    pass

    def __str__(self):
        return self.name


class ExpenseCategory(BaseModelCategory):
    pass

    def __str__(self):
        return self.name


class BaseModelFinancials(BaseModel):
    class Meta:
        abstract = True
        ordering = ["amount"]

    description = models.CharField(max_length=50, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey('User', on_delete=models.CASCADE)


class Income(BaseModelFinancials):
    incomeCategory = models.ForeignKey('IncomeCategory', related_name='income', on_delete=models.SET('Không có'))

    def __str__(self):
        return self.description


class Expense(BaseModelFinancials):
    expenseCategory = models.ForeignKey('ExpenseCategory', related_name='expense', on_delete=models.SET('Không có'))

    def __str__(self):
        return self.description

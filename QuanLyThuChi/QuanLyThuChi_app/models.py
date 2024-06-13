from datetime import date

from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField


# Create your models here.
class BaseModel(models.Model):
    class Meta:
        abstract = True

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)


class User(AbstractUser):
    ACCOUNT_TYPES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )

    avatar = CloudinaryField('image')
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)

    def __str__(self):
        return self.username


class Group(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    create_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class GroupMember(BaseModel):
    class Meta:
        unique_together = ('group', 'user')

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    is_leader = models.BooleanField(default=False)


class BaseModelTransactionCategory(BaseModel):
    class Meta:
        abstract = True

    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    name = models.CharField(max_length=50, unique=True)
    icon = avatar = CloudinaryField('image')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, default='Expense')


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
    timestamp = models.DateField(default=date.today())
    description = models.TextField(blank=True, null=True)


class TransactionSelf(BaseModelTransaction):
    transaction_category = models.ForeignKey(TransactionCategorySelf, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class TransactionGroup(BaseModelTransaction):
    transaction_category = models.ForeignKey(TransactionCategoryGroup, on_delete=models.SET_NULL, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accept = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Survey(BaseModel):
    name = models.CharField(max_length=20)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class FreetimeOption(BaseModel):
    class Meta:
        ordering = ["date"]

    TIME_OF_DAY = (
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('all day', 'All day')
    )
    date = models.DateField()
    time_of_day = models.CharField(max_length=20, choices=TIME_OF_DAY)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.date} - {self.time_of_day}'

# Generated by Django 4.2.11 on 2024-04-14 13:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('QuanLyThuChi_app', '0002_alter_transactioncategory_group_transaction_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='account_type',
        ),
    ]

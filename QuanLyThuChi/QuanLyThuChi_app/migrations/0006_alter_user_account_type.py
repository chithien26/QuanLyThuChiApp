# Generated by Django 4.2.11 on 2024-04-18 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('QuanLyThuChi_app', '0005_user_account_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='account_type',
            field=models.CharField(choices=[('personal', 'Personal'), ('admin', 'Admin')], max_length=20),
        ),
    ]
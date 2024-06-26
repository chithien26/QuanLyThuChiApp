# Generated by Django 4.2.11 on 2024-05-10 02:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('QuanLyThuChi_app', '0018_alter_transactioncategorygroup_transaction_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='survey',
            name='group',
        ),
        migrations.RemoveField(
            model_name='survey',
            name='options',
        ),
        migrations.AddField(
            model_name='survey',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='survey',
            name='name',
            field=models.CharField(default=1, max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='survey',
            name='option',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='QuanLyThuChi_app.freetimeoption'),
            preserve_default=False,
        ),
    ]

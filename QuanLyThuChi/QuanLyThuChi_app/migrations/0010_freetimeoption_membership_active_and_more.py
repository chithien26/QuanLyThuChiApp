# Generated by Django 4.2.11 on 2024-04-26 21:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('QuanLyThuChi_app', '0009_alter_user_avatar'),
    ]

    operations = [
        migrations.CreateModel(
            name='FreetimeOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('date', models.DateTimeField()),
                ('time_of_day', models.CharField(choices=[('morning', 'Morning'), ('afternoon', 'Afternoon'), ('all day', 'All day')], max_length=20)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['date'],
            },
        ),
        migrations.AddField(
            model_name='membership',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='membership',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='membership',
            name='updated_date',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.CreateModel(
            name='Survey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='QuanLyThuChi_app.group')),
                ('options', models.ManyToManyField(to='QuanLyThuChi_app.freetimeoption')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.urls import path

from .models import *


###Inline Admin###

class TransactionSelfInlineAdmin(admin.StackedInline):
    model = TransactionSelf


class TransactionGroupInlineAdmin(admin.StackedInline):
    model = TransactionGroup


class GroupMemberInlineAdmin(admin.StackedInline):
    model = GroupMember


class FreetimeOptionInlineAdmin(admin.StackedInline):
    model = FreetimeOption


###Admin###
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'first_name', 'last_name', 'date_joined', 'email']


class GroupAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'create_by', 'created_date', 'active']
    inlines = [GroupMemberInlineAdmin]


class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'group', 'is_leader']


class TransactionCategorySelfAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_date', 'transaction_type', 'user']
    inlines = [TransactionSelfInlineAdmin]


class TransactionCategoryGroupAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_date', 'transaction_type', 'group']
    inlines = [TransactionGroupInlineAdmin]


class TransactionSelfAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'amount', 'timestamp', 'transaction_category', 'user']


class TransactionGroupAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'amount', 'timestamp', 'transaction_category', 'group']


class FreetimeOptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'date', 'time_of_day', 'created_date', 'survey', 'active']
    ordering = ["date"]


class SurveyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'creator', 'group']
    inlines = [FreetimeOptionInlineAdmin]


class MyAdminSite(admin.AdminSite):
    site_header = 'Hệ thống quản lý thu chi'

    def get_urls(self):
        return [
            path('group-stats/', self.stats_view)
        ] + super().get_urls()

    def stats_view(self, request):
        group_count = Group.objects.filter(active=True).count()

        stats = Group.objects.annotate(user_count=Count('users__id')).values('id', 'name', 'user_count')
        return TemplateResponse(request, 'admin/group-stats.html', {
            'group_count': group_count,
            'group_stats': stats
        })


admin_site = MyAdminSite('my')

admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
admin_site.register(GroupMember, GroupMemberAdmin)
admin_site.register(TransactionCategoryGroup, TransactionCategoryGroupAdmin)
admin_site.register(TransactionCategorySelf, TransactionCategorySelfAdmin)
admin_site.register(TransactionSelf, TransactionSelfAdmin)
admin_site.register(TransactionGroup, TransactionGroupAdmin)
admin_site.register(FreetimeOption, FreetimeOptionAdmin)
admin_site.register(Survey, SurveyAdmin)

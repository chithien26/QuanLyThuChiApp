from django.contrib import admin
from .models import *


class MyAdminSite(admin.AdminSite):
    site_header = 'Hệ thống quản lý thu chi'


admin_site = MyAdminSite('my')


admin_site.register(User)
admin_site.register(Group)
admin_site.register(Membership)
admin_site.register(TransactionCategoryGroup)
admin_site.register(TransactionCategorySelf)
admin_site.register(TransactionSelf)
admin_site.register(TransactionGroup)

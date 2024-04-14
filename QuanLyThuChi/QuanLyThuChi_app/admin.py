from django.contrib import admin
from .models import *



# Register your models here.

# INLINE
# class TransactionGroupInlineAdmin(admin.StackedInline):
#     model = Transaction_group
#     fk_name = 'transaction_group'
#
#
# class TransactionSelfInlineAdmin(admin.StackedInline):
#     model = Transaction_self
#     fk_name = 'transaction_self'
#
#
# class UserInlineAdmin(admin.StackedInline):
#     model = User
#     fk_name = 'group'


# ADMIN
class UserAdmin(admin.ModelAdmin):
    pass


class GroupAdmin(admin.ModelAdmin):
    pass
    # inlines = [UserInlineAdmin]


class TransactionCategoryGroupAdmin(admin.ModelAdmin):
    pass
    # inlines = [TransactionGroupInlineAdmin]


class TransactionCategorySelfAdmin(admin.ModelAdmin):
    pass
    # inlines = [TransactionSelfInlineAdmin]


class TransactionGroupAdmin(admin.ModelAdmin):
    pass


class TransactionSelfAdmin(admin.ModelAdmin):
    pass


class MyAdminSite(admin.AdminSite):
    site_header = 'Hệ thống quản lý thu chi'


admin_site = MyAdminSite('my')


admin_site.register(User)
admin_site.register(Group)
admin_site.register(TransactionCategory_group)
admin_site.register(TransactionCategory_self)
admin_site.register(Transaction_self)
admin_site.register(Transaction_group)

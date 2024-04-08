from django.contrib import admin
from .models import *
from django.template.response import TemplateResponse
from django.db.models import Count
from django.urls import path
# Register your models here.


class IncomeInlineAdmin(admin.StackedInline):
    model = Income
    fk_name = 'incomeCategory'
class IncomeCategoryAdmin(admin.ModelAdmin):
    inlines = [IncomeInlineAdmin]

class ExpenseCategoryAdmin(admin.ModelAdmin):
    pass

class IncomeAdmin(admin.ModelAdmin):
    pass

class ExpenseAdmin(admin.ModelAdmin):
    pass


class MyAdminSite(admin.AdminSite):
    site_header = 'Hệ thống quản lý thu chi'

    def get_urls(self):
        return [
            path('stats/', self.thuchi_stats)
        ] + super().get_urls()

    def thuchi_stats(self, request):
        count = IncomeCategory.objects.filter(active=True).count()
        stats = IncomeCategory.objects.annotate(income_count = Count('income')).values('id', 'name', 'income_count')

        return TemplateResponse(request,'admin/IncomeCategory-stats.html',
                        {
                                'incomeCategory_count' : count,
                                'incomeCategory_stats': stats,
                                })




admin_site = MyAdminSite('my')
admin_site.register(User)
admin_site.register(IncomeCategory, IncomeCategoryAdmin)
admin_site.register(ExpenseCategory, ExpenseCategoryAdmin)
admin_site.register(Income, IncomeAdmin)
admin_site.register(Expense, ExpenseAdmin)

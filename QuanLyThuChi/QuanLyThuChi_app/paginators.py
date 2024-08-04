from rest_framework import pagination
class TransactionCategoryGroupPagination(pagination.PageNumberPagination):
    page_size = 20

# class TransactionCategoryPagination(pagination.PageNumberPagination):
#     page_size = 20
#
#
# class TransactionPagination(pagination.PageNumberPagination):
#     page_size = 20

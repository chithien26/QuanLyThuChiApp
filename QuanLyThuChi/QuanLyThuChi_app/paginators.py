from rest_framework import pagination


class TransactionCategoryPagination(pagination.PageNumberPagination):
    page_size = 5


class TransactionPagination(pagination.PageNumberPagination):
    page_size = 5

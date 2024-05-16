from rest_framework import pagination


class TransactionCategoryPagination(pagination.PageNumberPagination):
    page_size = 20


class TransactionPagination(pagination.PageNumberPagination):
    page_size = 20

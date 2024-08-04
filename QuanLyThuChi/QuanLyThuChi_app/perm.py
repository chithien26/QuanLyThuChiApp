from rest_framework import permissions

from QuanLyThuChi_app.models import GroupMember


class OwnerAuthenticated(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view) and request.user == obj.user

class AdminAuthenticated(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return request.user.account_type == 'admin'

class OwnerOrAdminAuthenticated(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view) and (
                    request.user == obj.user or request.user.account_type == 'admin')
class IsGroupCreatorOrLeader(permissions.BasePermission):
    """
    Custom permission to only allow creators and leaders of a group to delete a transaction.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the creator of the group
        if obj.group.create_by == request.user:
            return True

        # Check if the user is a leader of the group
        try:
            group_member = GroupMember.objects.get(group=obj.group, user=request.user)
            if group_member.is_leader:
                return True
        except GroupMember.DoesNotExist:
            return False

        return False
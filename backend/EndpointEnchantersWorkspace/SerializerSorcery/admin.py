from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model


class CustomUserAdmin(UserAdmin):
    model = get_user_model()
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('info', 'tablename', 'role', 'externalpublications')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('info', 'tablename', 'role', 'externalpublications')}),
    )


admin.site.register(get_user_model(), CustomUserAdmin)

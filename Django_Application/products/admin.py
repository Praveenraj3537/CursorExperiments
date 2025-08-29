from django.contrib import admin
from .models import Product, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'rating', 'is_active', 'is_in_stock', 'created_at']
    list_filter = ['category', 'is_active', 'created_at', 'updated_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'is_in_stock']
    list_editable = ['price', 'stock', 'is_active']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category', 'image')
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'stock', 'rating')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

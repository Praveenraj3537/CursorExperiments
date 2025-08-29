from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total_amount', 'item_count']
    list_filter = ['status', 'updated_at']
    search_fields = ['order_number', 'user__username', 'shipping_address']
    ordering = ['-created_at']
    readonly_fields = ['order_number', 'total_amount', 'created_at', 'updated_at', 'item_count']
    list_editable = ['status']
    
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'total_amount')
        }),
        ('Customer Details', {
            'fields': ('shipping_address', 'billing_address', 'phone_number', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order__status']
    search_fields = ['order__order_number', 'product__name']
    readonly_fields = ['total_price']

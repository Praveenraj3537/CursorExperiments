from rest_framework import serializers
from .models import Medicine, Order, OrderItem


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ['id', 'name', 'content', 'price', 'stock', 'is_active']


class OrderItemSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'medicine', 'quantity', 'price_each']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'customer_name', 'customer_phone', 'customer_upi', 'total_amount', 'paid', 'payment_reference', 'items']

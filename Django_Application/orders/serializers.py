from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.username')
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'total_amount', 'shipping_address',
            'billing_address', 'phone_number', 'notes', 'created_at', 'updated_at',
            'items', 'item_count'
        ]
        read_only_fields = ['order_number', 'total_amount', 'created_at', 'updated_at']

    def create(self, validated_data):
        # This would typically be handled in the view with proper business logic
        return super().create(validated_data)


class OrderListSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'status', 'total_amount', 'item_count', 'created_at']


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']

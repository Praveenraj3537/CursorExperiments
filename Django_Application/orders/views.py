from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer, OrderListSerializer, OrderStatusUpdateSerializer,
    OrderItemSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order model with full CRUD operations
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'user']
    ordering_fields = ['created_at', 'total_amount', 'order_number']
    ordering = ['-created_at']

    def get_queryset(self):
        # Users can only see their own orders unless they're staff
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        elif self.action == 'update_status':
            return OrderStatusUpdateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status (admin/staff only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can update order status'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        order = self.get_object()
        serializer = self.get_serializer(order, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def items(self, request, pk=None):
        """Get all items in a specific order"""
        order = self.get_object()
        items = order.items.all()
        serializer = OrderItemSerializer(items, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        orders = Order.objects.filter(user=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Get orders by status"""
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = self.get_queryset().filter(status=status_filter)
        else:
            queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class OrderItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for OrderItem model
    """
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see items from their own orders unless they're staff
        if self.request.user.is_staff:
            return OrderItem.objects.all()
        return OrderItem.objects.filter(order__user=self.request.user)

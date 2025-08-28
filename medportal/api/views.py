from decimal import Decimal
from io import BytesIO

from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
import qrcode

from .models import Medicine, Order, OrderItem
from .serializers import MedicineSerializer, OrderSerializer


class MedicineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Medicine.objects.filter(is_active=True).order_by('name')
    serializer_class = MedicineSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(name__icontains=q)
        return qs


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-id')
    serializer_class = OrderSerializer

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        data = request.data
        items = data.get('items', [])
        customer_name = data.get('customer_name', '')
        customer_phone = data.get('customer_phone', '')
        customer_upi = data.get('customer_upi', '')

        if not items:
            return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate items and enforce max 10 quantity overall
        total_quantity = 0
        calculated_total = Decimal('0.00')
        expanded_items = []
        for item in items:
            med_id = item.get('medicine_id')
            qty = int(item.get('quantity', 0))
            if qty <= 0:
                return Response({'detail': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)
            total_quantity += qty
            if total_quantity > 10:
                return Response({'detail': 'Maximum of 10 units per order allowed'}, status=status.HTTP_400_BAD_REQUEST)
            medicine = get_object_or_404(Medicine, pk=med_id, is_active=True)
            if qty > medicine.stock:
                return Response({'detail': f'Only {medicine.stock} units of {medicine.name} available'}, status=status.HTTP_400_BAD_REQUEST)
            line_total = Decimal(qty) * medicine.price
            calculated_total += line_total
            expanded_items.append((medicine, qty, medicine.price))

        # Create order and items, decrement stock
        order = Order.objects.create(
            customer_name=customer_name,
            customer_phone=customer_phone,
            customer_upi=customer_upi,
            total_amount=calculated_total,
            paid=False,
        )
        for medicine, qty, price in expanded_items:
            OrderItem.objects.create(order=order, medicine=medicine, quantity=qty, price_each=price)
            medicine.stock -= qty
            medicine.save(update_fields=['stock'])

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        order = self.get_object()
        payment_ref = request.data.get('payment_reference', '')
        if not payment_ref:
            return Response({'detail': 'payment_reference is required'}, status=status.HTTP_400_BAD_REQUEST)
        order.paid = True
        order.payment_reference = payment_ref
        order.save(update_fields=['paid', 'payment_reference'])
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['get'])
    def upi_qr(self, request, pk=None):
        order = self.get_object()
        upi_id = order.customer_upi or request.query_params.get('upi_id')
        if not upi_id:
            return Response({'detail': 'Provide customer_upi on order or upi_id query param'}, status=status.HTTP_400_BAD_REQUEST)
        # Create standardized UPI payment URI (simplified)
        upi_uri = f"upi://pay?pa={upi_id}&pn={order.customer_name}&am={order.total_amount}&cu=INR&tn=Order%20{order.id}"
        img = qrcode.make(upi_uri)
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return HttpResponse(buffer.read(), content_type='image/png')


@api_view(['GET'])
def availability_message(request):
    # returns generic SLA message for out-of-stock items
    return Response({'message': 'If a medicine is not available, it will take up to 2 working days to be available.'})

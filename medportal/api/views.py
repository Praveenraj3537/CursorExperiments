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
from .mongo import get_db, get_next_id


class MedicineViewSet(viewsets.ViewSet):
    def list(self, request):
        db = get_db()
        q = request.query_params.get('q', '')
        filter_q = {'is_active': True}
        if q:
            filter_q['name'] = {'$regex': q, '$options': 'i'}
        meds = list(db.medicines.find(filter_q, {'_id': 0}).sort('name', 1))
        return Response(meds)

    def retrieve(self, request, pk=None):
        db = get_db()
        med = db.medicines.find_one({'id': int(pk)}, {'_id': 0})
        if not med:
            return Response({'detail': 'Not found'}, status=404)
        return Response(med)


class OrderViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        db = get_db()
        order = db.orders.find_one({'id': int(pk)}, {'_id': 0})
        if not order:
            return Response({'detail': 'Not found'}, status=404)
        return Response(order)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        db = get_db()
        data = request.data
        items = data.get('items', [])
        customer_name = data.get('customer_name', '')
        customer_phone = data.get('customer_phone', '')
        customer_upi = data.get('customer_upi', '')

        if not items:
            return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total_quantity = 0
        calculated_total = Decimal('0.00')
        expanded_items = []
        for item in items:
            med_id = int(item.get('medicine_id'))
            qty = int(item.get('quantity', 0))
            if qty <= 0:
                return Response({'detail': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)
            total_quantity += qty
            if total_quantity > 10:
                return Response({'detail': 'Maximum of 10 units per order allowed'}, status=status.HTTP_400_BAD_REQUEST)
            med = db.medicines.find_one({'id': med_id, 'is_active': True})
            if not med:
                return Response({'detail': 'Medicine not found'}, status=404)
            if qty > int(med.get('stock', 0)):
                return Response({'detail': f"Only {med.get('stock', 0)} units of {med.get('name')} available"}, status=status.HTTP_400_BAD_REQUEST)
            price = Decimal(str(med.get('price')))
            line_total = Decimal(qty) * price
            calculated_total += line_total
            expanded_items.append((med, qty, price))

        order_id = get_next_id('orders')
        order_doc = {
            'id': order_id,
            'customer_name': customer_name,
            'customer_phone': customer_phone,
            'customer_upi': customer_upi,
            'total_amount': float(calculated_total),
            'paid': False,
            'payment_reference': '',
            'items': [],
        }
        for med, qty, price in expanded_items:
            order_doc['items'].append({
                'id': get_next_id('order_items'),
                'medicine': {k: med[k] for k in ['id', 'name', 'content', 'price', 'stock', 'is_active'] if k in med},
                'quantity': qty,
                'price_each': float(price),
            })
            db.medicines.update_one({'id': med['id']}, {'$inc': {'stock': -qty}})
        db.orders.insert_one(order_doc)
        order_doc.pop('_id', None)
        return Response(order_doc, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        db = get_db()
        payment_ref = request.data.get('payment_reference', '')
        if not payment_ref:
            return Response({'detail': 'payment_reference is required'}, status=status.HTTP_400_BAD_REQUEST)
        updated = db.orders.find_one_and_update({'id': int(pk)}, {'$set': {'paid': True, 'payment_reference': payment_ref}}, return_document=True)
        if not updated:
            return Response({'detail': 'Not found'}, status=404)
        updated.pop('_id', None)
        return Response(updated)

    @action(detail=True, methods=['get'])
    def upi_qr(self, request, pk=None):
        db = get_db()
        order = db.orders.find_one({'id': int(pk)})
        if not order:
            return Response({'detail': 'Not found'}, status=404)
        upi_id = order.get('customer_upi') or request.query_params.get('upi_id')
        if not upi_id:
            return Response({'detail': 'Provide customer_upi on order or upi_id query param'}, status=status.HTTP_400_BAD_REQUEST)
        upi_uri = f"upi://pay?pa={upi_id}&pn={order.get('customer_name')}&am={order.get('total_amount')}&cu=INR&tn=Order%20{order.get('id')}"
        img = qrcode.make(upi_uri)
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return HttpResponse(buffer.read(), content_type='image/png')


@api_view(['GET'])
def availability_message(request):
    # returns generic SLA message for out-of-stock items
    return Response({'message': 'If a medicine is not available, it will take up to 2 working days to be available.'})

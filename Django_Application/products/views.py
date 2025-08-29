from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Product, Category
from .serializers import ProductSerializer, ProductListSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category model with full CRUD operations
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get all products in a specific category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product model with full CRUD operations
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_active', 'is_in_stock']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'rating', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer

    @action(detail=False, methods=['get'])
    def in_stock(self, request):
        """Get only products that are in stock"""
        products = Product.objects.filter(stock__gt=0, is_active=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_price_range(self, request):
        """Get products within a specific price range"""
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        
        queryset = Product.objects.filter(is_active=True)
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        """Update product stock"""
        product = self.get_object()
        new_stock = request.data.get('stock')
        
        if new_stock is None:
            return Response(
                {'error': 'Stock value is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_stock < 0:
            return Response(
                {'error': 'Stock cannot be negative'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        product.stock = new_stock
        product.save()
        serializer = self.get_serializer(product)
        return Response(serializer.data)

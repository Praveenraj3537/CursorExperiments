from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, OrderViewSet, availability_message


router = DefaultRouter()
router.register(r'medicines', MedicineViewSet, basename='medicine')
router.register(r'orders', OrderViewSet, basename='order')


urlpatterns = [
    path('', include(router.urls)),
    path('availability/', availability_message, name='availability-message'),
]

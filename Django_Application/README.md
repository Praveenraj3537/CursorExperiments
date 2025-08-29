# Django Ecommerce Backend

A robust Django REST API backend for an ecommerce application with full CRUD operations for products, categories, and orders.

## Features

- **Products Management**: Full CRUD operations for products with categories, stock management, and image uploads
- **Categories Management**: Organize products into categories with descriptions
- **Order Management**: Complete order lifecycle from creation to delivery
- **User Authentication**: Secure user registration and login system
- **RESTful API**: Clean, well-documented API endpoints
- **Admin Interface**: Powerful Django admin for content management
- **Image Handling**: Product image upload and management
- **Stock Management**: Real-time stock tracking and validation

## Technology Stack

- **Django 4.2.7**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database (can be easily changed to PostgreSQL/MySQL)
- **Pillow**: Image processing
- **django-cors-headers**: Cross-origin resource sharing

## Project Structure

```
Django_Application/
├── ecommerce/                 # Main project settings
│   ├── __init__.py
│   ├── settings.py           # Django settings
│   ├── urls.py               # Main URL configuration
│   ├── wsgi.py               # WSGI configuration
│   └── asgi.py               # ASGI configuration
├── products/                  # Products app
│   ├── __init__.py
│   ├── models.py             # Product and Category models
│   ├── serializers.py        # REST API serializers
│   ├── views.py              # API views and ViewSets
│   ├── urls.py               # Product URLs
│   └── admin.py              # Admin interface configuration
├── orders/                    # Orders app
│   ├── __init__.py
│   ├── models.py             # Order and OrderItem models
│   ├── serializers.py        # Order serializers
│   ├── views.py              # Order views and ViewSets
│   ├── urls.py               # Order URLs
│   └── admin.py              # Order admin configuration
├── manage.py                  # Django management script
└── requirements.txt           # Python dependencies
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Django_Application
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (admin account)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

## API Endpoints

### Products

- `GET /api/products/` - List all products
- `POST /api/products/` - Create a new product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product
- `GET /api/products/in_stock/` - Get products in stock
- `GET /api/products/by_price_range/` - Filter by price range

### Categories

- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create a new category
- `GET /api/categories/{id}/` - Get category details
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category
- `GET /api/categories/{id}/products/` - Get products in category

### Orders

- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create a new order
- `GET /api/orders/{id}/` - Get order details
- `PUT /api/orders/{id}/` - Update order
- `DELETE /api/orders/{id}/` - Delete order
- `PATCH /api/orders/{id}/update_status/` - Update order status
- `GET /api/orders/my_orders/` - Get current user's orders

## Admin Interface

Access the Django admin interface at `http://localhost:8000/admin/` using your superuser credentials.

### Admin Features

- **Products Management**: Add, edit, and delete products with image uploads
- **Categories Management**: Organize products into categories
- **Order Management**: View and update order statuses
- **User Management**: Manage user accounts and permissions

## Database Models

### Product Model
- Name, description, price
- Category relationship
- Stock quantity and availability
- Image upload support
- Rating system
- Active/inactive status
- Timestamps

### Category Model
- Name and description
- Timestamps

### Order Model
- User relationship
- Order number (auto-generated)
- Status tracking (pending, processing, shipped, delivered, cancelled)
- Shipping and billing addresses
- Total amount calculation
- Timestamps

### OrderItem Model
- Order relationship
- Product relationship
- Quantity and pricing
- Total price calculation

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### CORS Settings

The backend is configured to allow requests from the React frontend running on `http://localhost:3000`.

## Development

### Adding New Features

1. Create new models in the appropriate app
2. Add serializers for API responses
3. Create views/ViewSets for CRUD operations
4. Update URL configurations
5. Add admin interface configurations
6. Run migrations

### Running Tests

```bash
python manage.py test
```

### Code Quality

- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Handle exceptions appropriately

## Deployment

### Production Settings

1. Set `DEBUG = False`
2. Configure a production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure environment variables
5. Use a production WSGI server (Gunicorn)
6. Set up reverse proxy (Nginx)

### Environment Variables for Production

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Troubleshooting

### Common Issues

1. **Migration errors**: Delete migration files and database, then recreate
2. **Image upload issues**: Ensure media directory has proper permissions
3. **CORS errors**: Check CORS settings in settings.py
4. **Database connection**: Verify database configuration

### Getting Help

- Check Django documentation
- Review Django REST Framework documentation
- Check the Django admin interface for data validation

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions, please open an issue in the repository.

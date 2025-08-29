# Ecommerce Application with Django Backend and React Frontend

A complete ecommerce solution built with Django REST API backend and React frontend, featuring full CRUD operations, user authentication, shopping cart functionality, and order management.

## ⚡ Quick Start (MongoDB Setup)

**For Windows users:**
```bash
# Double-click this file or run from command prompt:
setup_mongodb.bat

# Or use PowerShell (run as Administrator):
.\setup_mongodb.ps1
```

**For Linux/macOS users:**
```bash
chmod +x setup_mongodb.sh
./setup_mongodb.sh
```

**What happens automatically:**
- ✅ Installs MongoDB packages
- ✅ Configures database connection
- ✅ Sets up virtual environment
- ✅ Runs all migrations
- ✅ Tests database connectivity

📖 **See [QUICK_START.md](QUICK_START.md) for detailed setup instructions**

---

## 🚀 Quick Start

### Backend Setup (Django)

```bash
# Navigate to Django directory
cd Django_Application

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend will be running at: http://localhost:8000

### Frontend Setup (React)

```bash
# Navigate to frontend directory
cd Django_Application/front

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be running at: http://localhost:3000

## 🏗️ Architecture

```
├── Django_Application/          # Django Backend
│   ├── ecommerce/              # Main project
│   ├── products/               # Products app
│   ├── orders/                 # Orders app
│   └── requirements.txt        # Python dependencies
├── front/                      # React Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # State management
│   │   └── services/           # API services
│   └── package.json            # Node dependencies
└── README.md                   # This file
```

## ✨ Features

### Backend (Django)
- **RESTful API** with Django REST Framework
- **Product Management** with categories and images
- **Order Management** with status tracking
- **User Authentication** system
- **Admin Interface** for content management
- **Image Upload** support
- **Stock Management** with validation

### Frontend (React)
- **Responsive Design** using Bootstrap 5
- **Product Catalog** with search and filtering
- **Shopping Cart** with localStorage persistence
- **User Authentication** forms
- **Order History** and tracking
- **Real-time Updates** and state management

## 🔧 API Endpoints

- `GET /api/products/` - List products
- `POST /api/products/` - Create product
- `GET /api/categories/` - List categories
- `GET /api/orders/` - User orders
- `POST /api/orders/` - Create order

## 🎯 Key Components

- **Products**: Full CRUD operations with image support
- **Categories**: Product organization system
- **Orders**: Complete order lifecycle management
- **Authentication**: Secure user login/registration
- **Cart**: Persistent shopping cart functionality

## 🛠️ Technology Stack

### Backend
- Django 4.2.7
- Django REST Framework
- SQLite (easily configurable for production)
- Pillow (image processing)
- django-cors-headers

### Frontend
- React 18.2.0
- React Router 6
- Bootstrap 5
- Axios (HTTP client)
- Context API (state management)

## 📱 Screenshots

The application features a modern, responsive design with:
- Clean product grid layout
- Intuitive navigation
- Mobile-friendly interface
- Smooth animations and transitions
- Professional admin interface

## 🚀 Getting Started

1. **Clone the repository**
2. **Set up Django backend** (see Django_Application/README.md)
3. **Set up React frontend** (see front/README.md)
4. **Start both servers**
5. **Access the application**

## 📚 Documentation

- [Django Backend Documentation](Django_Application/README.md)
- [React Frontend Documentation](front/README.md)
- [API Documentation](Django_Application/README.md#api-endpoints)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create new issue with detailed description

## 🔮 Future Enhancements

- Payment gateway integration
- Real-time notifications
- Advanced search functionality
- Multi-language support
- PWA capabilities
- Advanced analytics

---

**Happy Coding! 🎉**

# MongoDB Setup Guide for Django Ecommerce Application

This guide will help you set up MongoDB for your Django ecommerce application.

## Prerequisites

- Python 3.8+
- MongoDB Community Server
- pip (Python package manager)

## Step 1: Install MongoDB

### Windows
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and will start automatically

### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Step 2: Verify MongoDB Installation

```bash
# Check MongoDB version
mongod --version

# Connect to MongoDB shell
mongosh
```

## Step 3: Install Python Dependencies

```bash
# Navigate to Django directory
cd Django_Application

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install MongoDB packages
pip install -r requirements.txt
```

## Step 4: Configure Django Settings

The `settings.py` file has been updated with MongoDB configuration:

```python
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'ecommerce_db',
        'ENFORCE_SCHEMA': True,
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
        }
    }
}
```

## Step 5: Run Migrations

```bash
# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

## Step 6: Create Superuser

```bash
python manage.py createsuperuser
```

## Step 7: Start the Application

```bash
# Start Django server
python manage.py runserver

# In another terminal, start React frontend
cd front
npm start
```

## MongoDB Connection Options

### Local Development (Default)
```python
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'ecommerce_db',
        'ENFORCE_SCHEMA': True,
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
        }
    }
}
```

### MongoDB Atlas (Cloud)
```python
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'your_database_name',
        'ENFORCE_SCHEMA': True,
        'CLIENT': {
            'host': 'your_cluster_url.mongodb.net',
            'port': 27017,
            'username': 'your_username',
            'password': 'your_password',
            'authSource': 'admin',
            'authMechanism': 'SCRAM-SHA-1'
        }
    }
}
```

### Environment Variables (Recommended for Production)
```python
import os
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': config('MONGODB_NAME', default='ecommerce_db'),
        'ENFORCE_SCHEMA': True,
        'CLIENT': {
            'host': config('MONGODB_HOST', default='localhost'),
            'port': int(config('MONGODB_PORT', default=27017)),
            'username': config('MONGODB_USERNAME', default=''),
            'password': config('MONGODB_PASSWORD', default=''),
            'authSource': config('MONGODB_AUTH_SOURCE', default='admin'),
            'authMechanism': config('MONGODB_AUTH_MECHANISM', default='SCRAM-SHA-1')
        }
    }
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MongoDB service is running
   - Check if port 27017 is available
   - Verify firewall settings

2. **Authentication Failed**
   - Check username/password
   - Verify authSource and authMechanism
   - Ensure user has proper permissions

3. **Import Errors**
   - Make sure all packages are installed: `pip install -r requirements.txt`
   - Check Python version compatibility

### MongoDB Commands

```bash
# Start MongoDB service
sudo systemctl start mongod

# Stop MongoDB service
sudo systemctl stop mongod

# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## Performance Tips

1. **Indexing**: Create indexes on frequently queried fields
2. **Connection Pooling**: Use connection pooling for better performance
3. **Sharding**: Consider sharding for large datasets
4. **Monitoring**: Use MongoDB Compass for database monitoring

## Security Considerations

1. **Network Security**: Restrict MongoDB access to trusted networks
2. **Authentication**: Always use authentication in production
3. **Authorization**: Implement proper user roles and permissions
4. **Encryption**: Use TLS/SSL for data in transit
5. **Backup**: Regular database backups

## Next Steps

After setting up MongoDB:
1. Test your application thoroughly
2. Set up proper indexes for your models
3. Configure backup strategies
4. Monitor database performance
5. Consider using MongoDB Compass for database management

## Support

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Djongo Documentation](https://nesdis.github.io/djongo/)
- [Django Documentation](https://docs.djangoproject.com/)

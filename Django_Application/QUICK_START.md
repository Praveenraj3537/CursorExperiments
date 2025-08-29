# Quick Start Guide - MongoDB Setup

This guide provides quick setup instructions for switching from SQLite3 to MongoDB in your Django ecommerce application.

## 🚀 One-Click Setup (Windows)

### Option 1: Batch Script (Recommended)
```bash
# Double-click or run from command prompt
setup_mongodb.bat
```

### Option 2: PowerShell Script
```powershell
# Run as Administrator for best results
.\setup_mongodb.ps1

# Or with options:
.\setup_mongodb.ps1 -SkipMongoCheck
.\setup_mongodb.ps1 -SkipMigrations
```

## 🚀 One-Click Setup (Linux/macOS)

```bash
# Make script executable (first time only)
chmod +x setup_mongodb.sh

# Run the setup script
./setup_mongodb.sh
```

## 📋 What the Setup Scripts Do

The setup scripts automatically:

1. ✅ Check Python installation
2. ✅ Create/activate virtual environment
3. ✅ Install Python dependencies (including MongoDB packages)
4. ✅ Check MongoDB installation
5. ✅ Install MongoDB (if not present)
6. ✅ Start MongoDB service
7. ✅ Test database connection
8. ✅ Run Django migrations
9. ✅ Set up database structure

## 🔧 Manual Setup (Alternative)

If you prefer manual setup, follow the detailed guide in [MONGODB_SETUP.md](MONGODB_SETUP.md).

## 📁 Files Created/Modified

- `requirements.txt` - Added MongoDB packages
- `ecommerce/settings.py` - Updated database configuration
- `setup_mongodb.bat` - Windows batch setup script
- `setup_mongodb.ps1` - Windows PowerShell setup script
- `setup_mongodb.sh` - Linux/macOS setup script
- `MONGODB_SETUP.md` - Detailed setup documentation

## 🎯 After Setup

Once the setup is complete:

1. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

2. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

3. **Start React frontend (in another terminal):**
   ```bash
   cd front
   npm start
   ```

4. **Access your application:**
   - Django Admin: http://localhost:8000/admin/
   - API: http://localhost:8000/api/
   - React Frontend: http://localhost:3000

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB not starting:**
   - Check if MongoDB service is running
   - Verify port 27017 is not blocked
   - Check firewall settings

2. **Permission errors:**
   - Run PowerShell script as Administrator
   - Check file permissions on Linux/macOS

3. **Connection refused:**
   - Ensure MongoDB is running
   - Check if another process is using port 27017

### Getting Help

- Check the detailed guide: [MONGODB_SETUP.md](MONGODB_SETUP.md)
- Review error messages in the setup output
- Ensure all prerequisites are met

## 🔄 Updating Existing Data

If you have existing data in SQLite3:

1. **Export data** (optional):
   ```bash
   python manage.py dumpdata > data_backup.json
   ```

2. **Run setup scripts** to create MongoDB structure

3. **Import data** (if needed):
   ```bash
   python manage.py loaddata data_backup.json
   ```

## 🎉 Success!

Your Django application is now running with MongoDB! The setup scripts have:

- ✅ Installed all necessary packages
- ✅ Configured MongoDB connection
- ✅ Set up database structure
- ✅ Applied all migrations
- ✅ Verified database connectivity

You're ready to develop and deploy with MongoDB! 🚀

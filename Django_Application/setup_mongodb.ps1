# MongoDB Setup for Django Ecommerce App
# Run this script as Administrator for best results

param(
    [switch]$SkipMongoCheck,
    [switch]$SkipMigrations
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MongoDB Setup for Django Ecommerce App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
if (-not (Test-Command "python")) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python is installed: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to get Python version" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if virtual environment exists
Write-Host "Checking if virtual environment exists..." -ForegroundColor Yellow
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    try {
        python -m venv venv
        Write-Host "Virtual environment created ✓" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Virtual environment already exists ✓" -ForegroundColor Green
}
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
try {
    & "venv\Scripts\Activate.ps1"
    Write-Host "Virtual environment activated ✓" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to activate virtual environment" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
try {
    pip install -r requirements.txt
    Write-Host "Dependencies installed ✓" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check MongoDB installation (unless skipped)
if (-not $SkipMongoCheck) {
    Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
    if (-not (Test-Command "mongod")) {
        Write-Host ""
        Write-Host "WARNING: MongoDB is not installed or not in PATH" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please install MongoDB Community Server:" -ForegroundColor White
        Write-Host "1. Download from: https://www.mongodb.com/try/download/community" -ForegroundColor White
        Write-Host "2. Run the installer" -ForegroundColor White
        Write-Host "3. Restart this script after installation" -ForegroundColor White
        Write-Host ""
        $openBrowser = Read-Host "Open MongoDB download page? (y/n)"
        if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
            Start-Process "https://www.mongodb.com/try/download/community"
        }
        Write-Host ""
        Write-Host "After installing MongoDB, please restart this script" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "MongoDB is installed ✓" -ForegroundColor Green
    Write-Host ""

    # Check MongoDB service status
    Write-Host "Checking MongoDB service status..." -ForegroundColor Yellow
    try {
        $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        if ($service -and $service.Status -eq "Running") {
            Write-Host "MongoDB service is running ✓" -ForegroundColor Green
        } else {
            Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
            try {
                Start-Service -Name "MongoDB" -ErrorAction Stop
                Write-Host "MongoDB service started ✓" -ForegroundColor Green
            } catch {
                Write-Host "WARNING: Could not start MongoDB service" -ForegroundColor Yellow
                Write-Host "Please start MongoDB manually or check service configuration" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "You can try:" -ForegroundColor White
                Write-Host "1. Open Services (services.msc)" -ForegroundColor White
                Write-Host "2. Find 'MongoDB' service" -ForegroundColor White
                Write-Host "3. Right-click and select 'Start'" -ForegroundColor White
                Write-Host ""
                Read-Host "Press Enter to continue anyway"
            }
        }
    } catch {
        Write-Host "WARNING: Could not check MongoDB service" -ForegroundColor Yellow
        Write-Host "Continuing with manual MongoDB startup..." -ForegroundColor Yellow
    }
    Write-Host ""

    # Wait for MongoDB to be ready
    Write-Host "Waiting for MongoDB to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Write-Host ""

    # Test MongoDB connection
    Write-Host "Testing MongoDB connection..." -ForegroundColor Yellow
    try {
        $testScript = @"
import pymongo
try:
    client = pymongo.MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    client.server_info()
    print('MongoDB connection successful ✓')
    client.close()
except Exception as e:
    print(f'Connection failed: {e}')
    exit(1)
"@
        $testScript | python
        if ($LASTEXITCODE -eq 0) {
            Write-Host "MongoDB connection successful ✓" -ForegroundColor Green
        } else {
            throw "Connection test failed"
        }
    } catch {
        Write-Host "ERROR: Could not connect to MongoDB" -ForegroundColor Red
        Write-Host "Please ensure MongoDB is running and accessible on localhost:27017" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
}

# Create database directory
Write-Host "Creating database directory..." -ForegroundColor Yellow
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Name "data" | Out-Null
}
Write-Host "Database directory ready ✓" -ForegroundColor Green
Write-Host ""

# Run Django migrations (unless skipped)
if (-not $SkipMigrations) {
    Write-Host "Running Django migrations..." -ForegroundColor Yellow
    try {
        python manage.py makemigrations
        if ($LASTEXITCODE -ne 0) {
            Write-Host "WARNING: Failed to create migrations" -ForegroundColor Yellow
            Write-Host "This might be normal if no models have changed" -ForegroundColor Yellow
        }
        Write-Host ""

        python manage.py migrate
        if ($LASTEXITCODE -ne 0) {
            throw "Migration failed"
        }
        Write-Host "Migrations applied successfully ✓" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to apply migrations" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Create a superuser: python manage.py createsuperuser" -ForegroundColor White
Write-Host "2. Start Django server: python manage.py runserver" -ForegroundColor White
Write-Host "3. Start React frontend: cd front && npm start" -ForegroundColor White
Write-Host ""
Write-Host "Django will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "React frontend will be at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Script options:" -ForegroundColor Yellow
Write-Host "-SkipMongoCheck: Skip MongoDB installation check" -ForegroundColor Gray
Write-Host "-SkipMigrations: Skip Django migrations" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"

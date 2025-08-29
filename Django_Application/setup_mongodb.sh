#!/bin/bash

# MongoDB Setup for Django Ecommerce App
# Run this script with appropriate permissions

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}========================================"
    echo -e "MongoDB Setup for Django Ecommerce App"
    echo -e "========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}$1 ✓${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

print_info() {
    echo -e "${YELLOW}$1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command_exists apt-get; then
            echo "ubuntu"
        elif command_exists yum; then
            echo "centos"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Function to install MongoDB based on OS
install_mongodb() {
    local os=$(detect_os)
    
    case $os in
        "ubuntu")
            print_info "Installing MongoDB on Ubuntu..."
            wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
            sudo apt-get update
            sudo apt-get install -y mongodb-org
            sudo systemctl enable mongod
            sudo systemctl start mongod
            ;;
        "centos")
            print_info "Installing MongoDB on CentOS..."
            sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo << EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
            sudo yum install -y mongodb-org
            sudo systemctl enable mongod
            sudo systemctl start mongod
            ;;
        "macos")
            print_info "Installing MongoDB on macOS..."
            if command_exists brew; then
                brew tap mongodb/brew
                brew install mongodb-community
                brew services start mongodb/brew/mongodb-community
            else
                print_error "Homebrew not found. Please install Homebrew first:"
                echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
            ;;
        *)
            print_error "Unsupported operating system: $os"
            print_info "Please install MongoDB manually from: https://www.mongodb.com/try/download/community"
            exit 1
            ;;
    esac
}

# Main setup function
main() {
    print_status
    
    # Check Python installation
    print_info "Checking Python installation..."
    if ! command_exists python3 && ! command_exists python; then
        print_error "Python is not installed"
        print_info "Please install Python 3.8+ from https://python.org"
        exit 1
    fi
    
    # Determine Python command
    if command_exists python3; then
        PYTHON_CMD="python3"
    else
        PYTHON_CMD="python"
    fi
    
    PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
    print_success "Python is installed: $PYTHON_VERSION"
    echo ""
    
    # Check if virtual environment exists
    print_info "Checking if virtual environment exists..."
    if [ ! -d "venv" ]; then
        print_info "Creating virtual environment..."
        $PYTHON_CMD -m venv venv
        print_success "Virtual environment created"
    else
        print_success "Virtual environment already exists"
    fi
    echo ""
    
    # Activate virtual environment
    print_info "Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
    echo ""
    
    # Install Python dependencies
    print_info "Installing Python dependencies..."
    pip install -r requirements.txt
    print_success "Dependencies installed"
    echo ""
    
    # Check MongoDB installation
    print_info "Checking MongoDB installation..."
    if ! command_exists mongod; then
        print_warning "MongoDB is not installed"
        echo ""
        read -p "Would you like to install MongoDB automatically? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_mongodb
        else
            print_info "Please install MongoDB manually from: https://www.mongodb.com/try/download/community"
            print_info "After installation, restart this script"
            exit 1
        fi
    fi
    print_success "MongoDB is installed"
    echo ""
    
    # Check MongoDB service status
    print_info "Checking MongoDB service status..."
    if command_exists systemctl; then
        if sudo systemctl is-active --quiet mongod; then
            print_success "MongoDB service is running"
        else
            print_info "Starting MongoDB service..."
            sudo systemctl start mongod
            print_success "MongoDB service started"
        fi
    elif command_exists brew; then
        if brew services list | grep -q "mongodb.*started"; then
            print_success "MongoDB service is running"
        else
            print_info "Starting MongoDB service..."
            brew services start mongodb/brew/mongodb-community
            print_success "MongoDB service started"
        fi
    else
        print_warning "Could not check MongoDB service status"
        print_info "Please ensure MongoDB is running manually"
    fi
    echo ""
    
    # Wait for MongoDB to be ready
    print_info "Waiting for MongoDB to be ready..."
    sleep 5
    echo ""
    
    # Test MongoDB connection
    print_info "Testing MongoDB connection..."
    if python -c "
import pymongo
try:
    client = pymongo.MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    client.server_info()
    print('MongoDB connection successful ✓')
    client.close()
except Exception as e:
    print(f'Connection failed: {e}')
    exit(1)
"; then
        print_success "MongoDB connection successful"
    else
        print_error "Could not connect to MongoDB"
        print_info "Please ensure MongoDB is running and accessible on localhost:27017"
        exit 1
    fi
    echo ""
    
    # Create database directory
    print_info "Creating database directory..."
    mkdir -p data
    print_success "Database directory ready"
    echo ""
    
    # Run Django migrations
    print_info "Running Django migrations..."
    if $PYTHON_CMD manage.py makemigrations; then
        print_success "Migrations created"
    else
        print_warning "Failed to create migrations (this might be normal)"
    fi
    echo ""
    
    if $PYTHON_CMD manage.py migrate; then
        print_success "Migrations applied successfully"
    else
        print_error "Failed to apply migrations"
        exit 1
    fi
    echo ""
    
    # Setup complete
    echo ""
    echo -e "${BLUE}========================================"
    echo -e "Setup Complete! ✓"
    echo -e "========================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create a superuser: $PYTHON_CMD manage.py createsuperuser"
    echo "2. Start Django server: $PYTHON_CMD manage.py runserver"
    echo "3. Start React frontend: cd front && npm start"
    echo ""
    echo -e "${BLUE}Django will be available at: http://localhost:8000${NC}"
    echo -e "${BLUE}React frontend will be at: http://localhost:3000${NC}"
    echo ""
}

# Run main function
main "$@"

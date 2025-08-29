# React Ecommerce Frontend

A modern, responsive React frontend for the Django ecommerce application with full CRUD operations, shopping cart functionality, and user authentication.

## Features

- **Responsive Design**: Mobile-first design using Bootstrap 5
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login, registration, and profile management
- **Order Management**: View order history and track status
- **Real-time Updates**: Live cart updates and stock checking
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## Technology Stack

- **React 18.2.0**: Frontend framework
- **React Router 6**: Client-side routing
- **Bootstrap 5**: CSS framework for responsive design
- **React Bootstrap**: Bootstrap components for React
- **Axios**: HTTP client for API communication
- **React Icons**: Icon library
- **Formik & Yup**: Form handling and validation
- **Context API**: State management

## Project Structure

```
front/
├── public/
│   └── index.html              # Main HTML file
├── src/
│   ├── components/             # React components
│   │   ├── Navigation.js       # Navigation bar
│   │   ├── Home.js            # Home page
│   │   ├── ProductList.js     # Product listing
│   │   ├── ProductDetail.js   # Product details
│   │   ├── Cart.js            # Shopping cart
│   │   ├── Orders.js          # Order management
│   │   ├── Login.js           # Login form
│   │   └── Register.js        # Registration form
│   ├── context/               # React Context providers
│   │   ├── AuthContext.js     # Authentication state
│   │   └── CartContext.js     # Shopping cart state
│   ├── services/              # API services
│   │   └── api.js             # API endpoints and configuration
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Installation

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Setup Steps

1. **Navigate to the frontend directory**
   ```bash
   cd Django_Application/front
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

The frontend will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Configuration

### API Configuration

The frontend is configured to communicate with the Django backend running on `http://localhost:8000`. Update the API base URL in `src/services/api.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Proxy Configuration

The `package.json` includes a proxy configuration to avoid CORS issues during development:

```json
{
  "proxy": "http://localhost:8000"
}
```

## Component Overview

### Core Components

- **Navigation**: Header with navigation links, cart icon, and user menu
- **Home**: Landing page with hero section and featured products
- **ProductList**: Product grid with filtering, search, and pagination
- **ProductDetail**: Detailed product view with add to cart functionality
- **Cart**: Shopping cart management with quantity controls
- **Orders**: Order history and status tracking
- **Login/Register**: User authentication forms

### Context Providers

- **AuthContext**: Manages user authentication state
- **CartContext**: Manages shopping cart state and localStorage persistence

### API Services

- **productsAPI**: Product-related API calls
- **categoriesAPI**: Category management
- **ordersAPI**: Order operations
- **authAPI**: Authentication endpoints

## Features in Detail

### Product Management

- **Product Listing**: Grid view with responsive design
- **Search & Filtering**: By name, category, price range
- **Sorting**: By price, rating, date, name
- **Pagination**: Server-side pagination for large datasets
- **Product Details**: Full product information with images

### Shopping Cart

- **Add/Remove Items**: Add products to cart with quantity selection
- **Quantity Management**: Increase/decrease quantities
- **Persistent Storage**: Cart data saved in localStorage
- **Real-time Updates**: Cart badge updates automatically
- **Checkout Flow**: Seamless transition to order creation

### User Authentication

- **Login System**: Secure user authentication
- **Registration**: User account creation with validation
- **Protected Routes**: Secure access to user-specific features
- **Session Management**: Automatic token handling

### Order Management

- **Order History**: Complete order tracking
- **Status Updates**: Real-time order status
- **Order Details**: Comprehensive order information
- **Responsive Tables**: Mobile-friendly order display

## Styling and UI

### Bootstrap Integration

- **Responsive Grid**: Mobile-first responsive design
- **Component Library**: Pre-built Bootstrap components
- **Custom CSS**: Additional custom styles in `index.css`
- **Icon Integration**: Font Awesome icons via React Icons

### Custom Styling

- **Product Cards**: Hover effects and smooth transitions
- **Cart Badge**: Dynamic cart item count display
- **Status Indicators**: Color-coded order status badges
- **Form Validation**: Visual feedback for form errors

## State Management

### Context API Usage

- **Global State**: Authentication and cart state
- **Local State**: Component-specific state
- **State Persistence**: Cart data in localStorage
- **Real-time Updates**: Automatic UI updates

### Data Flow

1. User interactions trigger state changes
2. Context providers update global state
3. Components re-render with new data
4. API calls update backend data
5. UI reflects current application state

## API Integration

### RESTful Communication

- **HTTP Methods**: GET, POST, PUT, DELETE operations
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during API calls
- **Authentication**: Token-based authentication

### Data Synchronization

- **Real-time Updates**: Live data from backend
- **Optimistic Updates**: Immediate UI feedback
- **Error Recovery**: Graceful error handling
- **Data Validation**: Client-side and server-side validation

## Responsive Design

### Mobile-First Approach

- **Breakpoints**: Bootstrap responsive breakpoints
- **Touch-Friendly**: Mobile-optimized interactions
- **Performance**: Optimized for mobile devices
- **Accessibility**: Screen reader and keyboard navigation support

### Cross-Platform Compatibility

- **Browser Support**: Modern browser compatibility
- **Device Support**: Mobile, tablet, and desktop
- **Performance**: Optimized rendering and loading
- **Accessibility**: WCAG compliance considerations

## Development Guidelines

### Code Structure

- **Component Organization**: Logical component hierarchy
- **File Naming**: Descriptive file and component names
- **Import Organization**: Clean import statements
- **Code Comments**: Clear documentation

### Best Practices

- **Functional Components**: Modern React patterns
- **Hooks Usage**: useState, useEffect, useContext
- **Error Boundaries**: Graceful error handling
- **Performance Optimization**: Memoization and lazy loading

## Testing

### Testing Strategy

- **Unit Tests**: Component testing
- **Integration Tests**: API integration testing
- **User Testing**: User experience validation
- **Cross-browser Testing**: Browser compatibility

### Running Tests

```bash
npm test
```

## Deployment

### Build Process

1. **Production Build**
   ```bash
   npm run build
   ```

2. **Static Files**: Generated in `build/` directory
3. **Server Configuration**: Configure server for SPA routing
4. **Environment Variables**: Set production API endpoints

### Deployment Options

- **Static Hosting**: Netlify, Vercel, AWS S3
- **Server Deployment**: Nginx, Apache configuration
- **CDN Integration**: Content delivery network setup
- **SSL Configuration**: HTTPS setup for security

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **API Connection**: Verify backend server is running
3. **Build Errors**: Check Node.js version compatibility
4. **Routing Issues**: Configure server for SPA routing

### Debug Tools

- **React Developer Tools**: Browser extension
- **Console Logging**: Debug information in browser console
- **Network Tab**: API request/response monitoring
- **State Inspection**: Context state debugging

## Performance Optimization

### Optimization Techniques

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images and lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Browser and API caching

### Monitoring

- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: User error reporting
- **Analytics**: User behavior tracking
- **Performance Profiling**: React Profiler usage

## Security Considerations

### Frontend Security

- **Input Validation**: Client-side form validation
- **XSS Prevention**: Safe HTML rendering
- **CSRF Protection**: Token-based protection
- **Secure Storage**: Safe localStorage usage

### Authentication Security

- **Token Management**: Secure token storage
- **Session Handling**: Proper session management
- **Route Protection**: Secure route access
- **Data Encryption**: Sensitive data protection

## Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Code Standards

- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit validation
- **Code Review**: Peer review process

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review existing issues
- Create new issue with detailed description
- Contact the development team

## Roadmap

### Future Features

- **Advanced Search**: Elasticsearch integration
- **Payment Integration**: Stripe/PayPal support
- **Real-time Chat**: Customer support chat
- **Advanced Analytics**: User behavior tracking
- **PWA Support**: Progressive web app features
- **Multi-language**: Internationalization support

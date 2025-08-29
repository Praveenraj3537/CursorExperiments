import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  getInStock: () => api.get('/products/in_stock/'),
  getByPriceRange: (minPrice, maxPrice) => 
    api.get('/products/by_price_range/', { 
      params: { min_price: minPrice, max_price: maxPrice } 
    }),
  updateStock: (id, stock) => api.post(`/products/${id}/update_stock/`, { stock }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
  getProducts: (id) => api.get(`/categories/${id}/products/`),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders/', { params }),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  update: (id, data) => api.patch(`/orders/${id}/`, data),
  delete: (id) => api.delete(`/orders/${id}/`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/update_status/`, { status }),
  getItems: (id) => api.get(`/orders/${id}/items/`),
  getMyOrders: () => api.get('/orders/my_orders/'),
  getByStatus: (status) => api.get('/orders/by_status/', { params: { status } }),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
};

export default api;

import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: '', // Using the Vite proxy, so empty base URL targets current origin (/api)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling automatic token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      const email = localStorage.getItem('email');
      
      if (refreshToken && email) {
        try {
          // Attempt token refresh
          const response = await axios.post('/api/users/refreshToken', {
            email,
            refreshToken,
          });
          
          if (response.data && response.data.token) {
            const newToken = response.data.token;
            const newRefreshToken = response.data.RefreshToken || response.data.refreshToken;
            
            localStorage.setItem('token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and force logout / redirect
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/users/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.RefreshToken || response.data.refreshToken);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('email', response.data.email);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  },
  getMe: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  getProfile: async (userId) => {
    const response = await api.get(`/api/users/profile/${userId}`);
    return response.data;
  },
  getUserCount: async () => {
    const response = await api.get('/api/users/count');
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/api/users/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (email, token, newPassword) => {
    const response = await api.post('/api/users/reset-password', { email, token, newPassword });
    return response.data;
  }
};

// Catalog endpoints
export const catalogService = {
  getAllItems: async (category = null, ownerUserId = null) => {
    const params = {};
    if (category && category !== 'Tümü') params.category = category;
    if (ownerUserId) params.ownerUserId = ownerUserId;
    const response = await api.get('/api/catalog/items', { params });
    // Catalog Service returns a paged object like { content: [...] } instead of a direct array
    return response.data && Array.isArray(response.data.content)
      ? response.data.content
      : (Array.isArray(response.data) ? response.data : []);
  },
  getItemById: async (id) => {
    const response = await api.get(`/api/catalog/items/${id}`);
    return response.data;
  },
  createItem: async (itemData) => {
    const response = await api.post('/api/catalog/items', itemData);
    return response.data;
  },
  updateItem: async (id, itemData) => {
    const response = await api.put(`/api/catalog/items/${id}`, itemData);
    return response.data;
  },
  deleteItem: async (id) => {
    const response = await api.delete(`/api/catalog/items/${id}`);
    return response.data;
  }
};

// Rental endpoints
export const rentalService = {
  createRental: async (rentalData) => {
    const response = await api.post('/api/rentals', rentalData);
    return response.data;
  },
  getRentals: async ({ renterUserId, ownerUserId, itemId, status } = {}) => {
    const params = {};
    if (renterUserId) params.renterUserId = renterUserId;
    if (ownerUserId) params.ownerUserId = ownerUserId;
    if (itemId) params.itemId = itemId;
    if (status && status !== 'ALL') params.status = status;
    const response = await api.get('/api/rentals', { params });
    return response.data;
  },
  getRentalById: async (id) => {
    const response = await api.get(`/api/rentals/${id}`);
    return response.data;
  },
  updateRental: async (id, rentalData) => {
    const response = await api.put(`/api/rentals/${id}`, rentalData);
    return response.data;
  },
  deleteRental: async (id) => {
    const response = await api.delete(`/api/rentals/${id}`);
    return response.data;
  }
};

// Review endpoints
export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },
  getReviewsForUser: async (userId) => {
    const response = await api.get(`/api/reviews/user/${userId}`);
    return response.data;
  },
  getReviewsByReviewer: async (reviewerId) => {
    const response = await api.get(`/api/reviews/reviewer/${reviewerId}`);
    return response.data;
  },
  getReviewsForItem: async (itemId) => {
    const response = await api.get(`/api/reviews/item/${itemId}`);
    return response.data;
  },
  getAverageRatingForUser: async (userId) => {
    const response = await api.get(`/api/reviews/user/${userId}/average`);
    return response.data;
  },
  deleteReview: async (id) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  }
};

export default api;

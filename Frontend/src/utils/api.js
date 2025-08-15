// src/utils/api.js - Enhanced API configuration and helper functions
import axios from 'axios';

// Token management functions
let authToken = localStorage.getItem('authToken') || null; // Load from localStorage on init

export const getAuthToken = () => authToken || localStorage.getItem('authToken');
export const setAuthToken = (token) => { 
  authToken = token; 
  if (token) {
    localStorage.setItem('authToken', token); 
  } else {
    localStorage.removeItem('authToken');
  }
};
export const clearAuthToken = () => { 
  authToken = null; 
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log('API Request:', config.method?.toUpperCase(), config.url, token ? 'with token' : 'no token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Store token if provided in response
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing token and redirecting');
      clearAuthToken();
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/home/Login') {
        window.location.href = '/home/Login';
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        isNetworkError: true,
      });
    }

    return Promise.reject(error);
  }
);

// Helper function to format API responses
const formatApiResponse = (response) => {
  if (response.data?.status === 'success') {
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
    };
  } else {
    return {
      success: false,
      error: response.data || { message: 'Unknown error occurred' },
    };
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.isNetworkError) {
    return {
      success: false,
      error: {
        message: error.message,
        isNetworkError: true,
      },
    };
  }

  if (error.response?.data) {
    return {
      success: false,
      error: {
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors || [],
        status: error.response.status,
      },
    };
  }

  return {
    success: false,
    error: {
      message: error.message || 'Unknown error occurred',
    },
  };
};

// Auth API functions
export const authAPI = {
registerPatient: async (patientData) => {
  try {
    console.log('=== API Call Debug ===');
    console.log('Endpoint: /api/auth/signup/patient');
    console.log('Method: POST');
    console.log('Data being sent:', patientData);
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken() || 'No token'}`
    });
    
    const response = await api.post('/api/auth/signup/patient', patientData);
    
    console.log('=== API Response Debug ===');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    return formatApiResponse(response);
  } catch (error) {
    console.error('=== API Error Debug ===');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error headers:', error.response?.headers);
    console.error('Full error:', error);
    
    return handleApiError(error);
  }
},

  registerDoctor: async (doctorData) => {
    try {
      const response = await api.post('/api/auth/signup/doctor', doctorData);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  login: async (credentials) => {
    try {
      console.log('Making login request to:', '/api/auth/login');
      const response = await api.post('/api/auth/login', credentials);
      console.log('Login response received:', response.status, response.data);
      
      // Handle successful login and store token
      if (response.data?.token || response.data?.data?.token) {
        const token = response.data.token || response.data.data.token;
        setAuthToken(token);
        console.log('Token saved successfully');
      }
      
      return formatApiResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      return handleApiError(error);
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      clearAuthToken();
      return formatApiResponse(response);
    } catch (error) {
      clearAuthToken();
      return handleApiError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/api/auth/verify-email/${token}`);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.patch(`/api/auth/reset-password/${token}`, { password });
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await api.post('/api/auth/resend-verification', { email });
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Patient API functions
export const patientAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/patients/profile');
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/api/patients/profile', profileData);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getDashboard: async () => {
    try {
      const response = await api.get('/api/patients/dashboard');
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  addMedicalHistory: async (historyData) => {
    try {
      const response = await api.post('/api/patients/medical-history', historyData);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Doctor API functions
export const doctorAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/doctors/profile');
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/api/doctors/profile', profileData);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getDashboard: async () => {
    try {
      console.log('Making dashboard request with token:', getAuthToken() ? 'present' : 'missing');
      const response = await api.get('/api/doctors/my/dashboard');
      return formatApiResponse(response);
    } catch (error) {
      console.error('Dashboard request failed:', error);
      return handleApiError(error);
    }
  },

  toggleOnlineStatus: async () => {
    try {
      const response = await api.patch('/api/doctors/toggle-online');
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Appointment API functions
export const appointmentAPI = {
  bookAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/api/appointments/book', appointmentData);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getMyAppointments: async () => {
    try {
      console.log('Making appointments request with token:', getAuthToken() ? 'present' : 'missing');
      const response = await api.get('/api/appointments/my-appointments');
      return formatApiResponse(response);
    } catch (error) {
      console.error('Appointments request failed:', error);
      return handleApiError(error);
    }
  },

  getAppointmentDetails: async (appointmentId) => {
    try {
      const response = await api.get(`/api/appointments/${appointmentId}`);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      const response = await api.patch(`/api/appointments/${appointmentId}/cancel`);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  confirmAppointment: async (appointmentId) => {
    try {
      const response = await api.patch(`/api/appointments/${appointmentId}/confirm`);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getDoctorAvailability: async (doctorId) => {
    try {
      const response = await api.get(`/api/appointments/doctor/${doctorId}/availability`);
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Search API functions
export const searchAPI = {
  searchDoctors: async (searchParams) => {
    try {
      const response = await api.get('/api/search/doctors', { params: searchParams });
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getSearchSuggestions: async () => {
    try {
      const response = await api.get('/api/search/suggestions');
      return formatApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Utility functions
export const utils = {
  formatNepalPhoneNumber: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10 && !cleaned.startsWith('977')) {
      return `+977${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('977')) {
      return `+${cleaned}`;
    }
    return phone;
  },

  isValidNepalPhone: (phone) => {
    const phoneRegex = /^(\+977)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.errors && Array.isArray(error.errors)) {
      return error.errors.join(', ');
    }
    return 'An unexpected error occurred';
  },

  isAuthenticated: () => {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      clearAuthToken();
      return false;
    }
  },

  getUserRole: () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || payload.userType;
    } catch {
      return null;
    }
  },

  getUserId: () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  },

  formatCurrency: (amount, currency = '₹') => {
    return `${currency}${amount.toLocaleString()}`;
  },

  formatDate: (date, options = {}) => {
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  },

  formatDateTime: (date, options = {}) => {
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleString('en-US', { ...defaultOptions, ...options });
  },

  calculateAge: (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// Export default axios instance for custom use
export { handleApiError };
export default api;
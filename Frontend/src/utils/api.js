// src/utils/api.js - API configuration and helper functions

// For development with Vite proxy, keep API_BASE_URL empty or "/"
const API_BASE_URL =
  import.meta.env.VITE_API_URL || // you can define this as empty in your .env
  process.env.REACT_APP_API_URL || // fallback for CRA
  ''; // <-- changed from 'http://localhost:8000' to '' for proxy

// API configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  // Build URL relative to current origin
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...apiConfig,
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  // Get token from localStorage if it exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.ok) {
      // Store token if provided in response
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: {
        message: 'Network error. Please check your connection.',
        details: error.message,
      },
    };
  }
};

// Auth API functions
export const authAPI = {
  registerPatient: async (patientData) => {
    return apiRequest('/api/auth/signup/patient', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },
  registerDoctor: async (doctorData) => {
    return apiRequest('/api/auth/signup/doctor', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  },
  login: async (credentials) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  logout: async () => {
    const result = await apiRequest('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
    return result;
  },
  verifyEmail: async (token) => {
    return apiRequest(`/api/auth/verify-email/${token}`, { method: 'GET' });
  },
  forgotPassword: async (email) => {
    return apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  resetPassword: async (token, password) => {
    return apiRequest(`/api/auth/reset-password/${token}`, {
      method: 'PATCH',
      body: JSON.stringify({ password }),
    });
  },
  getCurrentUser: async () => {
    return apiRequest('/api/auth/me', { method: 'GET' });
  },
  resendVerification: async (email) => {
    return apiRequest('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Patient API functions
export const patientAPI = {
  getProfile: async () => {
    return apiRequest('/api/patients/profile', { method: 'GET' });
  },
  updateProfile: async (profileData) => {
    return apiRequest('/api/patients/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },
  getDashboard: async () => {
    return apiRequest('/api/patients/dashboard', { method: 'GET' });
  },
  addMedicalHistory: async (historyData) => {
    return apiRequest('/api/patients/medical-history', {
      method: 'POST',
      body: JSON.stringify(historyData),
    });
  },
};

// Utility functions (unchanged)
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
    return phoneRegex.test(phone);
  },
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.join(', ');
    }
    return 'An unexpected error occurred';
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  getUserRole: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || payload.userType;
    } catch {
      return null;
    }
  },
};

// Error handler (unchanged)
export const handleApiError = (error, setErrors) => {
  console.error('API Error:', error);

  if (error.errors && Array.isArray(error.errors)) {
    const formErrors = {};
    error.errors.forEach((err) => {
      const errorMsg = err.toLowerCase();
      if (errorMsg.includes('email')) formErrors.email = err;
      else if (errorMsg.includes('phone')) formErrors.phoneNumber = err;
      else if (errorMsg.includes('password')) formErrors.password = err;
      else if (errorMsg.includes('first name')) formErrors.firstName = err;
      else if (errorMsg.includes('last name')) formErrors.lastName = err;
      else if (errorMsg.includes('license')) formErrors.licenseNumber = err;
      else if (errorMsg.includes('nmc')) formErrors.nmc_registration = err;
      else formErrors.general = err;
    });
    setErrors(formErrors);
  } else {
    setErrors({ general: utils.formatErrorMessage(error) });
  }
};

export default apiRequest;

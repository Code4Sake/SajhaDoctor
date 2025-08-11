import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('nepalcare_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUserType(authData.userType);
        setUser(authData.user);
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('nepalcare_auth');
      }
    }
  }, []);

  const login = async (credentials, type = 'patient') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: credentials.name || 'User',
        email: credentials.email,
        userType: type,
        avatar: credentials.name ? credentials.name.charAt(0).toUpperCase() : 'U'
      };

      setIsAuthenticated(true);
      setUserType(type);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('nepalcare_auth', JSON.stringify({
        userType: type,
        user: userData
      }));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, type = 'patient') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        userType: type,
        avatar: userData.firstName ? userData.firstName.charAt(0).toUpperCase() : 'U'
      };

      setIsAuthenticated(true);
      setUserType(type);
      setUser(newUser);

      // Save to localStorage
      localStorage.setItem('nepalcare_auth', JSON.stringify({
        userType: type,
        user: newUser
      }));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType('patient');
    setUser(null);
    localStorage.removeItem('nepalcare_auth');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('nepalcare_auth', JSON.stringify({
      userType,
      user: updatedUser
    }));
  };

  const value = {
    isAuthenticated,
    userType,
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
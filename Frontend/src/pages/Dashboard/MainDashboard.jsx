// MainDashboard.jsx - Fixed Version with Better Error Handling
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Heart, Search, Calendar, MessageCircle, Video, Phone, User, Star, Clock, MapPin,
  Stethoscope, Pill, AlertCircle, ChevronRight, Bell, Settings, Home, Users, Activity,
  TrendingUp, Shield, Award, Menu, X, CheckCircle, PlayCircle, FileText, DollarSign,
  BarChart3, UserPlus, Zap, Eye, Download, Send, Edit3, Plus, Filter, MoreVertical,
  ChevronLeft, Target, Minus, ArrowUp, ArrowDown, RefreshCw, Trash2, RotateCcw,
  XCircle, CheckCircle2, Pause, Mail, Globe, Power, AlertTriangle, BookOpen
} from 'lucide-react';

// Import your actual API functions
import { doctorAPI, appointmentAPI } from '../../utils/api'; // Adjust path as needed

// Enhanced utility functions
const utils = {
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    console.log('🔑 Auth check - token exists:', !!token);
    return !!token;
  },
  getToken: () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  },
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }
};

// Context for dashboard state
const DoctorDashboardContext = createContext();

// Provider Component
const DoctorDashboardProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Enhanced authentication check
      console.log('=== ENHANCED AUTH DEBUG ===');
      const token = utils.getToken();
      console.log('🔑 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('🔑 Token type:', typeof token);
      console.log('🔑 Is authenticated:', utils.isAuthenticated());
      
      // Check both possible token storage keys
      const authToken = localStorage.getItem('authToken');
      const regularToken = localStorage.getItem('token');
      console.log('🔑 authToken exists:', !!authToken);
      console.log('🔑 token exists:', !!regularToken);
      console.log('===============================');

      if (!utils.isAuthenticated()) {
        console.log('❌ Authentication failed - redirecting to login');
        setError('Authentication required. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      console.log('✅ Authentication passed - loading dashboard data...');

      // Enhanced API debugging
      console.log('=== ENHANCED API DEBUG ===');
      console.log('🔧 doctorAPI object:', doctorAPI);
      console.log('🔧 doctorAPI methods:', Object.keys(doctorAPI || {}));
      console.log('🔧 getDashboard method:', typeof doctorAPI?.getDashboard);
      console.log('🔧 appointmentAPI object:', appointmentAPI);
      console.log('🔧 appointmentAPI methods:', Object.keys(appointmentAPI || {}));
      console.log('==============================');

      let dashboardResult = null;
      let dashboardError = null;

      // Try to fetch dashboard data with enhanced error handling
      try {
        console.log('📡 Calling doctorAPI.getDashboard()...');
        dashboardResult = await doctorAPI.getDashboard();
        console.log('📊 Dashboard API Response received');
        console.log('📊 Response type:', typeof dashboardResult);
        console.log('📊 Response keys:', Object.keys(dashboardResult || {}));
        console.log('📊 Response status:', dashboardResult?.status);
        console.log('📊 Response success:', dashboardResult?.success);
        console.log('📊 Response data:', dashboardResult?.data);
      } catch (err) {
        console.error('❌ Dashboard API call failed:', err);
        console.error('❌ Error response:', err.response);
        console.error('❌ Error status:', err.response?.status);
        console.error('❌ Error data:', err.response?.data);
        dashboardError = err;
      }

      // Try to fetch appointments with enhanced error handling
      let appointmentsResult = null;
      try {
        console.log('📅 Calling appointmentAPI.getMyAppointments()...');
        appointmentsResult = await appointmentAPI.getMyAppointments({ 
          upcoming: 'true', 
          limit: 5 
        });
        console.log('📅 Appointments API Response:', appointmentsResult);
      } catch (err) {
        console.warn('⚠️ Appointments API failed:', err);
        // Continue without appointments - not critical
      }

      // Process dashboard data with fallback handling
      console.log('🔄 Processing dashboard data...');
      
      if (dashboardResult && (dashboardResult.status === 'success' || dashboardResult.success === true)) {
        const doctorData = dashboardResult.data?.doctor;
        const statsData = dashboardResult.data?.stats || {};
        
        console.log('👨‍⚕️ Processed doctor data:', doctorData);
        console.log('📈 Processed stats data:', statsData);
        
        setDashboardData({
          doctor: doctorData,
          stats: statsData
        });
        setDoctor(doctorData);
        
        console.log('✅ Dashboard data set successfully');
      } else if (dashboardError) {
        // Handle the dashboard API error
        throw dashboardError;
      } else {
        console.error('❌ Dashboard API returned unexpected format');
        console.error('❌ Dashboard result:', dashboardResult);
        
        // Try to create fallback data from user info in localStorage
        const fallbackData = createFallbackDashboardData();
        if (fallbackData) {
          console.log('🔄 Using fallback dashboard data');
          setDashboardData(fallbackData);
          setDoctor(fallbackData.doctor);
        } else {
          throw new Error(dashboardResult?.message || 'Failed to load dashboard data');
        }
      }

      // Process appointments data
      if (appointmentsResult && appointmentsResult.status === 'success') {
        const appointmentsData = appointmentsResult.data?.appointments || [];
        setAppointments(appointmentsData);
        console.log('✅ Appointments data set:', appointmentsData.length, 'appointments');
      } else {
        console.log('ℹ️ No appointments data available');
        setAppointments([]);
      }

      console.log('✅ Dashboard loading completed successfully');
      setRetryCount(0); // Reset retry count on success

    } catch (err) {
      console.error('=== ENHANCED ERROR DEBUG ===');
      console.error('❌ Dashboard load error:', err);
      console.error('❌ Error name:', err.name);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error response status:', err.response?.status);
      console.error('❌ Error response data:', err.response?.data);
      console.error('❌ Error code:', err.code);
      console.error('❌ Retry count:', retryCount);
      console.error('================================');
      
      // Enhanced error handling
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('🔐 Handling authentication error');
        utils.clearAuth();
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.status === 404) {
        console.log('🔍 Handling 404 - endpoint not found');
        setError('Dashboard endpoint not available. Please contact support.');
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        console.log('🌐 Handling network error');
        setError('Cannot connect to server. Please check your internet connection and try again.');
      } else if (err.response?.status >= 500) {
        console.log('🔥 Handling server error');
        setError('Server error. Please try again in a few moments.');
      } else {
        console.log('❓ Handling generic error');
        const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
        setError(errorMessage);
      }
    } finally {
      console.log('🏁 Dashboard loading finished, setting loading to false');
      setLoading(false);
    }
  };

  // Create fallback dashboard data from localStorage if available
  const createFallbackDashboardData = () => {
    try {
      const userStr = localStorage.getItem('user');
      const userType = localStorage.getItem('userType');
      
      if (userStr && userType === 'doctor') {
        const user = JSON.parse(userStr);
        console.log('🔄 Creating fallback data from localStorage user:', user);
        
        return {
          doctor: {
            _id: user._id || user.id,
            user: user,
            userId: user,
            isOnline: false, // Default to offline
            primarySpecialization: user.specialization || user.specialty || 'Medical Professional',
            specialization: user.specialization || user.specialty || 'Medical Professional'
          },
          stats: {
            todayAppointments: 0,
            totalConsultations: 0,
            totalEarnings: 0,
            averageRating: 0
          }
        };
      }
    } catch (e) {
      console.error('❌ Failed to create fallback data:', e);
    }
    return null;
  };

  const toggleOnlineStatus = async () => {
    try {
      setError(null);
      console.log('🔄 Toggling online status...');
      
      const result = await doctorAPI.toggleOnline();
      console.log('✅ Toggle online result:', result);
      
      if (result && (result.status === 'success' || result.success === true)) {
        const newStatus = result.data?.isOnline;
        
        setDoctor(prev => ({
          ...prev,
          isOnline: newStatus
        }));
        
        console.log('✅ Online status updated to:', newStatus);
      } else {
        setError(result?.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('❌ Failed to toggle online status:', err);
      setError(err.response?.data?.message || `Failed to update status: ${err.message}`);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      setError(null);
      console.log('✅ Confirming appointment:', appointmentId);
      
      const result = await appointmentAPI.confirmAppointment(appointmentId);
      console.log('✅ Confirm appointment result:', result);
      
      if (result && result.status === 'success') {
        setAppointments(prev => prev.map(apt =>
          apt._id === appointmentId ? { ...apt, status: 'confirmed' } : apt
        ));
        console.log('✅ Appointment confirmed successfully');
      } else {
        setError(result?.message || 'Failed to confirm appointment');
      }
    } catch (err) {
      console.error('❌ Failed to confirm appointment:', err);
      setError(err.response?.data?.message || `Failed to confirm appointment: ${err.message}`);
    }
  };

  const cancelAppointment = async (appointmentId, reason) => {
    try {
      setError(null);
      console.log('❌ Cancelling appointment:', appointmentId, 'Reason:', reason);
      
      const result = await appointmentAPI.cancelAppointment(appointmentId, reason);
      console.log('✅ Cancel appointment result:', result);
      
      if (result && result.status === 'success') {
        setAppointments(prev => prev.map(apt =>
          apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        ));
        console.log('✅ Appointment cancelled successfully');
      } else {
        setError(result?.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('❌ Failed to cancel appointment:', err);
      setError(err.response?.data?.message || `Failed to cancel appointment: ${err.message}`);
    }
  };

  const retryLoadData = () => {
    setRetryCount(prev => prev + 1);
    loadDashboardData();
  };

  return (
    <DoctorDashboardContext.Provider value={{
      activeTab,
      setActiveTab,
      sidebarOpen,
      setSidebarOpen,
      isMobile,
      loading,
      doctor,
      dashboardData,
      appointments,
      error,
      retryCount,
      loadDashboardData: retryLoadData,
      toggleOnlineStatus,
      confirmAppointment,
      cancelAppointment
    }}>
      {children}
    </DoctorDashboardContext.Provider>
  );
};

// Custom hook to use the context
const useDoctorDashboard = () => {
  const context = useContext(DoctorDashboardContext);
  if (!context) {
    throw new Error('useDoctorDashboard must be used within a DoctorDashboardProvider');
  }
  return context;
};

// Enhanced Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      <p className="text-gray-400 text-sm mt-2">Connecting to server...</p>
    </div>
  </div>
);

// Enhanced Error Display Component
const ErrorDisplay = ({ error, onRetry, retryCount = 0 }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full mx-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Issue</h2>
        <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-red-700 text-sm">{error}</p>
          {retryCount > 0 && (
            <p className="text-red-500 text-xs mt-2">Retry attempt: {retryCount}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <User className="w-4 h-4 mr-2" />
            Go to Login
          </button>
          
          <div className="text-xs text-gray-500 mt-4">
            <p>If the problem persists:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Clear browser cache</li>
              <li>Contact support if issue continues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Card Component
const DashboardCard = ({ title, children, className = "", delay = 0, action, icon: Icon }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-500 ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-6 h-6 text-blue-600" />}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-3">
          {action}
          <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    )}
    {children}
  </div>
);

// Enhanced Doctor Profile Header Component
const DoctorProfileHeader = () => {
  const { doctor, toggleOnlineStatus } = useDoctorDashboard();

  if (!doctor) return null;

  // Helper function to get doctor's full name
  const getDoctorFullName = () => {
    const firstName = doctor?.user?.firstName || doctor?.userId?.firstName || doctor?.firstName || '';
    const lastName = doctor?.user?.lastName || doctor?.userId?.lastName || doctor?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Doctor';
  };

  // Helper function to get initials for avatar
  const getInitials = () => {
    const firstName = doctor?.user?.firstName || doctor?.userId?.firstName || doctor?.firstName || '';
    const lastName = doctor?.user?.lastName || doctor?.userId?.lastName || doctor?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'DR';
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6 mb-8">
      <div className="flex items-center space-x-6">
        {/* Profile Picture or Avatar */}
        <div className="relative">
          {doctor?.user?.profilePicture || doctor?.userId?.profilePicture ? (
            <img
              src={doctor?.user?.profilePicture || doctor?.userId?.profilePicture}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-2xl font-bold">{getInitials()}</span>
            </div>
          )}
          {/* Online status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
            doctor?.isOnline ? 'bg-green-400' : 'bg-gray-400'
          }`}></div>
        </div>

        {/* Doctor Information */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Dr. {getDoctorFullName()}
          </h1>
          <p className="text-lg text-blue-600 font-medium mb-2">
            {doctor?.primarySpecialization || doctor?.specialization || 'Medical Professional'}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {(doctor?.user?.email || doctor?.userId?.email) && (
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{doctor?.user?.email || doctor?.userId?.email}</span>
              </div>
            )}
            {(doctor?.user?.phoneNumber || doctor?.userId?.phoneNumber) && (
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{doctor?.user?.phoneNumber || doctor?.userId?.phoneNumber}</span>
              </div>
            )}
            <div className={`flex items-center space-x-1 ${doctor?.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${doctor?.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="font-medium">{doctor?.isOnline ? 'Available Now' : 'Currently Offline'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleOnlineStatus}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              doctor?.isOnline 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Power className="w-4 h-4 inline mr-2" />
            {doctor?.isOnline ? 'Go Offline' : 'Go Online'}
          </button>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium">
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  const { doctor, sidebarOpen, setSidebarOpen, isMobile, error } = useDoctorDashboard();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-2xl">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TeleHealth Pro
                </h1>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Right side - notifications */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Error notification */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Rest of the components remain the same (Sidebar, DashboardContent, etc.)
// ... [Include all other components from your original file]

// Sidebar Component
const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile } = useDoctorDashboard();

  const navigationItems = [
    { icon: Home, label: "Dashboard", key: "dashboard" },
    { icon: Users, label: "Patients", key: "patients" },
    { icon: Calendar, label: "Appointments", key: "appointments" },
    { icon: MessageCircle, label: "Consultations", key: "consultations" },
    { icon: FileText, label: "Prescriptions", key: "prescriptions" },
    { icon: BarChart3, label: "Analytics", key: "analytics" },
    { icon: DollarSign, label: "Revenue", key: "revenue" },
    { icon: Settings, label: "Settings", key: "settings" }
  ];

  const handleLinkClick = (key) => {
    setActiveTab(key);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const NavLink = ({ icon: Icon, label, itemKey, isActive }) => (
    <button
      onClick={() => handleLinkClick(itemKey)}
      className={`relative flex items-center space-x-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group text-sm ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (isMobile && !sidebarOpen) return null;

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-40' : ''}`}>
      {isMobile && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`${
        isMobile
          ? 'fixed left-0 top-0 h-full w-80 bg-white shadow-2xl'
          : 'w-72 sticky top-28'
      }`}>
        <nav className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 space-y-3 h-fit border border-gray-200/50">
          <div className="mb-8">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Navigation
            </h3>
            <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>

          {navigationItems.map((item) => (
            <NavLink
              key={item.key}
              icon={item.icon}
              label={item.label}
              itemKey={item.key}
              isActive={item.key === activeTab}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  const { doctor, dashboardData, appointments } = useDoctorDashboard();

  if (!dashboardData && !doctor) {
    return (
      <DashboardCard title="Dashboard" icon={Home}>
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </DashboardCard>
    );
  }

  // Get stats from dashboardData or provide defaults
  const stats = dashboardData?.stats || {};
  
  // Helper function to get doctor's first name for greeting
  const getDoctorFirstName = () => {
    const firstName = doctor?.user?.firstName || doctor?.userId?.firstName || doctor?.firstName;
    return firstName && firstName !== 'Doctor' ? firstName : 'Doctor';
  };
  
  // Helper function to get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Doctor Profile Header */}
      <DoctorProfileHeader />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-2">
            {getGreeting()}, Dr. {getDoctorFirstName()}! 👨‍⚕️
          </h2>
          <p className="text-blue-100 text-lg">
            {appointments?.length > 0 
              ? `You have ${appointments.length} upcoming appointments`
              : `You have ${stats.todayAppointments || 0} appointments scheduled today`
            }
          </p>
          {(doctor?.primarySpecialization || doctor?.specialization) && (
            <p className="text-blue-200 text-sm mt-2">
              {doctor?.primarySpecialization || doctor?.specialization} • {doctor?.isOnline ? 'Available' : 'Offline'}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {stats.todayAppointments || 0}
          </h3>
          <p className="text-sm font-medium opacity-80">Today's Patients</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            Rs. {stats.totalEarnings?.toLocaleString() || '0'}
          </h3>
          <p className="text-sm font-medium opacity-80">Total Earnings</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {stats.totalConsultations || 0}
          </h3>
          <p className="text-sm font-medium opacity-80">Total Consultations</p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {stats.averageRating?.toFixed(1) || "0.0"}
          </h3>
          <p className="text-sm font-medium opacity-80">Average Rating</p>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      {appointments && appointments.length > 0 && (
        <DashboardCard title="Upcoming Appointments" icon={Calendar}>
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment, index) => (
              <div key={appointment._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {appointment.patientName || appointment.patient?.name || 'Patient'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {appointment.date} at {appointment.time}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {appointment.type === 'video' && <Video className="w-5 h-5 text-blue-600" />}
                  {appointment.type === 'audio' && <Phone className="w-5 h-5 text-green-600" />}
                  {appointment.type === 'chat' && <MessageCircle className="w-5 h-5 text-purple-600" />}
                </div>
              </div>
            ))}
            {appointments.length > 3 && (
              <div className="text-center">
                <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                  View all {appointments.length} appointments
                </button>
              </div>
            )}
          </div>
        </DashboardCard>
      )}

      {/* Quick Actions */}
      <DashboardCard title="Quick Actions" icon={Zap}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group border border-blue-200">
            <div className="bg-blue-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">View All Patients</p>
              <p className="text-sm text-gray-600">Manage patient records</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl hover:from-green-100 hover:to-emerald-200 transition-all duration-300 group border border-green-200">
            <div className="bg-green-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Create Prescription</p>
              <p className="text-sm text-gray-600">Write new prescription</p>
            </div>
          </button>
        </div>
      </DashboardCard>

      {/* Recent Activity */}
      <DashboardCard title="Recent Activity" icon={Activity}>
        <div className="space-y-4">
          {appointments && appointments.length > 0 ? (
            appointments.slice(0, 3).map((appointment, index) => (
              <div key={appointment._id || index} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {appointment.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  ) : appointment.status === 'confirmed' ? (
                    <Calendar className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.status === 'completed' ? 'Consultation completed' : 
                     appointment.status === 'confirmed' ? 'Appointment confirmed' : 
                     'New appointment scheduled'} with {appointment.patientName || 'Patient'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};

// Content renderer for different tabs
const ContentRenderer = () => {
  const { activeTab } = useDoctorDashboard();

  switch(activeTab) {
    case 'dashboard':
      return <DashboardContent />;
    case 'patients':
      return (
        <DashboardCard title="Patient Management" icon={Users}>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Records</h3>
            <p className="text-gray-600">Manage your patient database.</p>
          </div>
        </DashboardCard>
      );
    case 'appointments':
      return (
        <DashboardCard title="Appointment Manager" icon={Calendar}>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Appointments</h3>
            <p className="text-gray-600">Schedule and manage appointments.</p>
          </div>
        </DashboardCard>
      );
    case 'consultations':
      return (
        <DashboardCard title="Video Consultations" icon={Video}>
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Telemedicine</h3>
            <p className="text-gray-600">Start and manage video consultations.</p>
          </div>
        </DashboardCard>
      );
    case 'prescriptions':
      return (
        <DashboardCard title="Prescription Manager" icon={FileText}>
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Prescriptions</h3>
            <p className="text-gray-600">Create and manage patient prescriptions.</p>
          </div>
        </DashboardCard>
      );
    case 'analytics':
      return (
        <DashboardCard title="Analytics Dashboard" icon={BarChart3}>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-gray-600">Track your performance metrics and insights.</p>
          </div>
        </DashboardCard>
      );
    case 'revenue':
      return (
        <DashboardCard title="Revenue Dashboard" icon={DollarSign}>
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Overview</h3>
            <p className="text-gray-600">Track earnings and financial reports.</p>
          </div>
        </DashboardCard>
      );
    case 'settings':
      return (
        <DashboardCard title="Account Settings" icon={Settings}>
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Manage your account preferences.</p>
          </div>
        </DashboardCard>
      );
    default:
      return <DashboardContent />;
  }
};

// Main Dashboard Component
const DoctorDashboard = () => {
  const { loading, error, loadDashboardData, retryCount } = useDoctorDashboard();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={loadDashboardData} retryCount={retryCount} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <Sidebar />
          <div className="flex-1 space-y-8">
            <ContentRenderer />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Provider
export default function App() {
  return (
    <DoctorDashboardProvider>
      <DoctorDashboard />
    </DoctorDashboardProvider>
  );
}
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Heart, Search, Calendar, MessageCircle, Video, Phone, User, Star, Clock, MapPin,
  Stethoscope, Pill, AlertCircle, ChevronRight, Bell, Settings, Home, Users, Activity,
  TrendingUp, Shield, Award, Menu, X, CheckCircle, PlayCircle, FileText, DollarSign,
  BarChart3, UserPlus, Zap, Eye, Download, Send, Edit3, Plus, Filter, MoreVertical,
  ChevronLeft, Target, Minus, ArrowUp, ArrowDown, RefreshCw, Trash2, RotateCcw,
  XCircle, CheckCircle2, Pause, Mail, Globe, Power, AlertTriangle, BookOpen
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:5173'; // Adjust this to your backend URL

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Network error. Please check your connection.',
        details: error.message,
      },
    };
  }
};

// Doctor API functions
const doctorAPI = {
  getDashboard: async () => {
    return apiRequest('/api/doctors/my/dashboard', { method: 'GET' });
  },
  updateProfile: async (profileData) => {
    return apiRequest('/api/doctors/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },
  toggleOnline: async () => {
    return apiRequest('/api/doctors/toggle-online', { method: 'PATCH' });
  },
  getAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/appointments/my-appointments${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
  },
  confirmAppointment: async (appointmentId) => {
    return apiRequest(`/api/appointments/${appointmentId}/confirm`, { method: 'PATCH' });
  },
  cancelAppointment: async (appointmentId, reason) => {
    return apiRequest(`/api/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ cancellationReason: reason }),
    });
  },
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
      const [dashboardResult, appointmentsResult] = await Promise.all([
        doctorAPI.getDashboard(),
        doctorAPI.getAppointments({ upcoming: 'true', limit: 5 })
      ]);

      if (dashboardResult.success) {
        setDashboardData(dashboardResult.data);
        setDoctor(dashboardResult.data.data?.doctor);
      } else {
        setError(dashboardResult.error?.message || 'Failed to load dashboard data');
      }

      if (appointmentsResult.success) {
        setAppointments(appointmentsResult.data.data?.appointments || []);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const result = await doctorAPI.toggleOnline();
      if (result.success) {
        setDoctor(prev => ({
          ...prev,
          isOnline: result.data.isOnline
        }));
      }
    } catch (err) {
      console.error('Failed to toggle online status:', err);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      const result = await doctorAPI.confirmAppointment(appointmentId);
      if (result.success) {
        setAppointments(prev => prev.map(apt =>
          apt._id === appointmentId ? { ...apt, status: 'confirmed' } : apt
        ));
      }
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
    }
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
      loadDashboardData,
      toggleOnlineStatus,
      confirmAppointment
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

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading your dashboard...</p>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full mx-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
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

// Header Component
const Header = () => {
  const { doctor, sidebarOpen, setSidebarOpen, isMobile, toggleOnlineStatus, dashboardData } = useDoctorDashboard();

  if (!doctor) return null;

  const stats = dashboardData?.stats || {};

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

          {/* Right side - status */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className={`flex items-center space-x-2 mb-2 ${doctor?.isOnline ? 'text-green-600' : 'text-gray-600'}`}>
                <div className={`w-2 h-2 rounded-full ${doctor?.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-semibold">
                  {doctor?.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <button
                onClick={toggleOnlineStatus}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Toggle Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile, dashboardData } = useDoctorDashboard();

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
  const { doctor, dashboardData } = useDoctorDashboard();

  if (!dashboardData) {
    return (
      <DashboardCard title="Dashboard" icon={Home}>
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </DashboardCard>
    );
  }

  const stats = dashboardData.stats || {};

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-2">
            Good afternoon, Dr. {doctor?.user?.firstName || doctor?.firstName}! 👨‍⚕️
          </h2>
          <p className="text-blue-100 text-lg">
            You have {stats.todayAppointments || 0} appointments scheduled today
          </p>
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
          <h3 className="text-3xl font-bold mb-1">{stats.todayAppointments || 0}</h3>
          <p className="text-sm font-medium opacity-80">Today's Patients</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">₹{stats.totalEarnings || 0}</h3>
          <p className="text-sm font-medium opacity-80">Total Earnings</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalConsultations || 0}</h3>
          <p className="text-sm font-medium opacity-80">Total Consultations</p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.averageRating?.toFixed(1) || "4.9"}</h3>
          <p className="text-sm font-medium opacity-80">Average Rating</p>
        </div>
      </div>

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
  const { loading, error, loadDashboardData } = useDoctorDashboard();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={loadDashboardData} />;

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

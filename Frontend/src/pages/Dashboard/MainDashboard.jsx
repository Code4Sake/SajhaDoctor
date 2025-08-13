import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Heart,
  Search,
  Calendar,
  MessageCircle,
  Video,
  Phone,
  User,
  Star,
  Clock,
  MapPin,
  Stethoscope,
  Pill,
  AlertCircle,
  ChevronRight,
  Bell,
  Settings,
  Home,
  Users,
  Activity,
  TrendingUp,
  Shield,
  Award,
  Menu,
  X,
  CheckCircle,
  PlayCircle,
  FileText,
  DollarSign,
  BarChart3,
  UserPlus,
  Zap,
  Eye,
  Download,
  Send,
  Edit3,
  Plus,
  Filter,
  MoreVertical,
  ChevronLeft,
  Target,
  Minus,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Trash2,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Pause,
  Mail,
  Globe,
  Power,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

// API Configuration (matches your api.js)
const API_BASE_URL = '';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();


    if (response.ok) {
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

// Doctor API functions
const doctorAPI = {
  getDashboard: async () => {
    return apiRequest('/api/doctors/my/dashboard', { method: 'GET', withCredentials:true });
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
  getAppointments: async () => {
  return apiRequest('/api/appointments/my-appointments', {
    method: 'GET',
    withCredentials: true
  });
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
        console.log(dashboardResult.data.data.doctor);

        setDashboardData(dashboardResult.data);
        setDoctor(dashboardResult.data.data.doctor);


      } else {
        setError(dashboardResult.error?.message || 'Failed to load dashboard data');
      }

      if (appointmentsResult.success) {
        setAppointments(appointmentsResult.data.data.appointments || []);
        console.log(appointmentsResult.data.data.appointments);

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
      console.log(result.data.isOnline);

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

// Enhanced Card Component
const DashboardCard = ({ title, children, className = "", delay = 0, action, icon: Icon }) => (
  <div
    className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-500 ${className}`}
    style={{
      animationDelay: `${delay}ms`,
      animation: 'slideInUp 0.6s ease-out forwards'
    }}
  >
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

  const kpiData = [
    {
      icon: Users,
      title: "Today's Patients",
      value: stats.todayAppointments?.toString() || "0",
      change: "+3",
      trend: "up",
      color: "blue"
    },
    {
      icon: DollarSign,
      title: "Total Earnings",
      value: `₹${stats.totalEarnings || 0}`,
      change: "+15%",
      trend: "up",
      color: "green"
    },
    {
      icon: Calendar,
      title: "Total Consultations",
      value: stats.totalConsultations?.toString() || "0",
      change: "+8.1%",
      trend: "up",
      color: "purple"
    },
    {
      icon: Star,
      title: "Average Rating",
      value: stats.averageRating?.toFixed(1) || "4.9",
      change: "+0.2",
      trend: "up",
      color: "orange"
    },
    {
      icon: MessageCircle,
      title: "Reviews",
      value: stats.totalReviews?.toString() || "0",
      change: "+12",
      trend: "up",
      color: "indigo"
    },
    {
      icon: Target,
      title: "Success Rate",
      value: "94.2%",
      change: "-1.1%",
      trend: "down",
      color: "red"
    }
  ];

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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.slice(0, 4).map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <stat.icon className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-blue-100 mb-1">{stat.title}</p>
                <p className="text-xs text-blue-200">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

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

// Patient Card Component
const PatientCard = ({ patient }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center space-x-4">
        {console.log(patient)}
      <img
        src={patient.profilePicture || "https://placehold.co/50x50"}
        alt={patient.firstName}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h4 className="font-bold">{patient.firstName} {patient.lastName}</h4>
        <p className="text-sm text-gray-600">{patient.phoneNumber}</p>
      </div>
    </div>
  </div>
);

// Patients Content
const PatientsContent = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      const result = await doctorAPI.getAppointments({ limit: 1000 });
      console.log(result);

      if (result.success) {
        const allAppointments = result.data.data.appointments || [];
        const uniquePatients = allAppointments.reduce((acc, apt) => {
          const patient = apt.patientId;
          if (patient && !acc.find(p => p._id === patient._id)) {
            acc.push(patient);
          }
          return acc;
        }, []);
        setPatients(uniquePatients);
      }
      setLoading(false);
    };
    fetchPatients();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardCard title="Patient Management" icon={Users}>
      <div className="space-y-4">
        {patients.length > 0 ? (
          patients.map(patient => <PatientCard key={patient._id} patient={patient} />)
        ) : (
          <p className="text-center text-gray-600">No patients found</p>
        )}
      </div>
    </DashboardCard>
  );
};

// Appointments Content
const AppointmentsContent = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      setLoading(true);
      const result = await doctorAPI.getAppointments({ limit: 100 });

console.log(result.data.data.appointments);


      if (result.success) {
        setAllAppointments(result.data.data.appointments || []);
      }
      setLoading(false);
    };
    fetchAllAppointments();
  }, []);

  if (loading) return <LoadingSpinner />;
  console.log(allAppointments.length);





  return (
    <DashboardCard title="Appointment Manager" icon={Calendar}>
      <div className="space-y-4">
        {allAppointments.length > 0 ? (
          allAppointments.map((appointment, idx) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onAction={() => {}} // Add proper handler if needed
              delay={idx * 100}
            />
          ))
        ) : (
          <p className="text-center text-gray-600">No appointments found</p>
        )}
      </div>
    </DashboardCard>
  );
};

const ConsultationsContent = () => (
  <DashboardCard title="Video Consultations" icon={Video}>
    <div className="text-center py-12">
      <Video className="w-16 h-16 text-purple-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Telemedicine</h3>
      <p className="text-gray-600">Start and manage video consultations.</p>
    </div>
  </DashboardCard>
);

// Settings Content
const SettingsContent = () => {
  const { doctor } = useDoctorDashboard();
  const [bio, setBio] = useState('');
  const [consultationFee, setConsultationFee] = useState({ video: 0, audio: 0, chat: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (doctor) {
      setBio(doctor.bio || '');
      setConsultationFee(doctor.consultationFee || { video: 0, audio: 0, chat: 0 });
    }
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const profileData = { bio, consultationFee };
    const result = await doctorAPI.updateProfile(profileData);
    if (result.success) {
      // Update local state or reload
    }
    setSaving(false);
  };

  return (
    <DashboardCard title="Account Settings" icon={Settings}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Video Fee</label>
          <input
            type="number"
            value={consultationFee.video}
            onChange={(e) => setConsultationFee(prev => ({ ...prev, video: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Audio Fee</label>
          <input
            type="number"
            value={consultationFee.audio}
            onChange={(e) => setConsultationFee(prev => ({ ...prev, audio: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chat Fee</label>
          <input
            type="number"
            value={consultationFee.chat}
            onChange={(e) => setConsultationFee(prev => ({ ...prev, chat: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </DashboardCard>
  );
};

// Main Dashboard Component
const DoctorDashboard = () => {
  const { activeTab, loading, error, loadDashboardData } = useDoctorDashboard();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={loadDashboardData} />;

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'patients':
        return <PatientsContent />;
      case 'appointments':
        return <AppointmentsContent />;
      case 'consultations':
        return <ConsultationsContent />;
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
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <style jsx global>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <Sidebar />
          <div className="flex-1 space-y-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile, dashboardData } = useDoctorDashboard();

  const navigationItems = [
    { icon: Home, label: "Dashboard", key: "dashboard" },
    { icon: Users, label: "Patients", key: "patients", badge: dashboardData?.stats?.totalConsultations || "0" },
    { icon: Calendar, label: "Appointments", key: "appointments", badge: "5" },
    { icon: MessageCircle, label: "Consultations", key: "consultations", badge: "2" },
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

  const NavLink = ({ icon: Icon, label, itemKey, isActive, badge }) => (
    <button
      onClick={() => handleLinkClick(itemKey)}
      className={`relative flex items-center space-x-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group text-sm ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`} />
      <span className="font-medium">{label}</span>
      {badge && (
        <span className={`absolute right-3 text-xs px-2 py-1 rounded-full font-bold ${
          isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
        }`}>
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      )}
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
              badge={item.badge}
            />
          ))}

          {dashboardData && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Today's Summary</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Appointments</span>
                    <span className="font-semibold text-blue-600">{dashboardData.stats?.todayAppointments || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultations</span>
                    <span className="font-semibold text-green-600">{dashboardData.stats?.totalConsultations || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating</span>
                    <span className="font-semibold text-purple-600">{dashboardData.stats?.averageRating || '4.9'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ title, value, change, trend, icon: Icon, color, delay = 0 }) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700"
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div
      className={`bg-gradient-to-r ${colorClasses[color]} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInScale 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm">
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm font-medium opacity-80">{title}</p>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, onAction, delay = 0 }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'scheduled': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'completed': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4 text-blue-600" />;
      case 'audio': return <Phone className="w-4 h-4 text-green-600" />;
      case 'chat': return <MessageCircle className="w-4 h-4 text-purple-600" />;
      default: return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
console.log(appointment.patientId);

  return (
    <div
      className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300"
      style={{
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={appointment.patientId?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
            alt={`${appointment.patientId?.firstName} ${appointment.patientId?.lastName}`}
            className="w-14 h-14 rounded-xl object-cover shadow-sm"
          />
          <div>
            <h4 className="font-bold text-gray-900 text-lg">
              {appointment.patientId?.firstName} {appointment.patientId?.lastName}
            </h4>
            <p className="text-gray-600 text-sm mb-1">{appointment.reason}</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              <div className="flex items-center space-x-1 text-gray-500">
                {getTypeIcon(appointment.consultationType)}
                <span className="text-xs">{appointment.consultationType}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold text-gray-900">{formatDate(appointment.scheduledDateTime)}</p>
          <p className="text-sm text-blue-600 font-semibold">₹{appointment.consultationFee}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>30 min</span>
        </div>
        <div className="flex items-center space-x-2">
          {appointment.status === 'scheduled' && (
            <button
              onClick={() => onAction('confirm', appointment._id)}
              className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm</span>
            </button>
          )}
          {appointment.status === 'confirmed' && (
            <button
              onClick={() => onAction('start', appointment._id)}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Content
const DashboardContent = () => {
  const { doctor, dashboardData, appointments, confirmAppointment, toggleOnlineStatus } = useDoctorDashboard();

  if (!dashboardData) return null;

  const stats = dashboardData.stats || {};
  const upcomingAppointments = appointments.slice(0, 3);

  const kpiData = [
    {
      icon: Users,
      title: "Today's Patients",
      value: stats.todayAppointments?.toString() || "0",
      change: "+3",
      trend: "up",
      color: "blue"
    },
    {
      icon: DollarSign,
      title: "Total Earnings",
      value: `₹${stats.totalEarnings || 0}`,
      change: "+15%",
      trend: "up",
      color: "green"
    },
    {
      icon: Calendar,
      title: "Total Consultations",
      value: stats.totalConsultations?.toString() || "0",
      change: "+8.1%",
      trend: "up",
      color: "purple"
    },
    {
      icon: Star,
      title: "Average Rating",
      value: stats.averageRating?.toFixed(1) || "4.9",
      change: "+0.2",
      trend: "up",
      color: "orange"
    },
    {
      icon: MessageCircle,
      title: "Reviews",
      value: stats.totalReviews?.toString() || "0",
      change: "+12",
      trend: "up",
      color: "indigo"
    },
    {
      icon: Target,
      title: "Success Rate",
      value: "94.2%",
      change: "-1.1%",
      trend: "down",
      color: "red"
    }
  ];

  const handleAppointmentAction = (action, appointmentId) => {
    switch(action) {
      case 'confirm':
        confirmAppointment(appointmentId);
        break;
      case 'start':
        console.log('Starting consultation for appointment:', appointmentId);
        break;
      default:
        console.log(`${action} appointment:`, appointmentId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Good afternoon, Dr. {doctor?.user?.firstName}! 👨‍⚕️
              </h2>
              <p className="text-blue-100 text-lg">
                You have {stats.todayAppointments || 0} appointments scheduled today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className={`flex items-center space-x-2 mb-2 ${doctor?.isOnline ? 'text-green-200' : 'text-gray-300'}`}>
                  <div className={`w-2 h-2 rounded-full ${doctor?.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-semibold">
                    {doctor?.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="font-bold text-xl">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs text-gray-200 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <button
                  onClick={toggleOnlineStatus}
                  className="mt-2 px-3 py-1 bg-white/30 rounded-lg text-sm hover:bg-white/40"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiData.map((kpi, idx) => (
          <KPICard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={kpi.icon}
            color={kpi.color}
            delay={idx * 50}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <DashboardCard
          title="Upcoming Appointments"
          icon={Calendar}
          delay={200}
          action={
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          }
        >
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, idx) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  onAction={handleAppointmentAction}
                  delay={idx * 100}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            )}

            <div className="text-center pt-4 border-t border-gray-100">
              <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold py-3 px-6 rounded-2xl hover:bg-blue-50 transition-all duration-200">
                <Calendar className="w-5 h-5" />
                <span>Manage Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions" icon={Zap} delay={300}>
          <div className="space-y-4">
            <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group border border-blue-200">
              <div className="bg-blue-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">View All Patients</p>
                <p className="text-sm text-gray-600">Manage patient records</p>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl hover:from-green-100 hover:to-emerald-200 transition-all duration-300 group border border-green-200">
              <div className="bg-green-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Create Prescription</p>
                <p className="text-sm text-gray-600">Write new prescription</p>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group border border-purple-200">
              <div className="bg-purple-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">Performance insights</p>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 group border border-orange-200">
              <div className="bg-orange-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Update Availability</p>
                <p className="text-sm text-gray-600">Manage your schedule</p>
              </div>
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <DashboardCard title="Recent Activity" icon={Activity} delay={400}>
          <div className="space-y-4">
            {[
              { icon: CheckCircle, color: "emerald", title: "Consultation completed", subtitle: "with Patient #PT001", time: "30 min ago", bg: "from-emerald-50 to-emerald-100" },
              { icon: Calendar, color: "blue", title: "New appointment scheduled", subtitle: "Video consultation", time: "1 hour ago", bg: "from-blue-50 to-blue-100" },
              { icon: Star, color: "orange", title: "5-star review received", subtitle: "Patient feedback", time: "2 hours ago", bg: "from-orange-50 to-orange-100" },
              { icon: FileText, color: "purple", title: "Prescription sent", subtitle: "Digital prescription", time: "3 hours ago", bg: "from-purple-50 to-purple-100" }
            ].map((activity, idx) => (
              <div key={idx} className={`flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r ${activity.bg} border border-gray-100`}>
                <div className={`bg-white p-2 rounded-xl shadow-sm border border-${activity.color}-200`}>
                  <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-gray-600 text-sm">{activity.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Performance Summary */}
        <DashboardCard title="Performance Summary" icon={TrendingUp} delay={500}>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-2xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-green-900">Patient Satisfaction</h4>
                <span className="text-green-600 font-bold text-xl">{stats.averageRating?.toFixed(1) || "4.9"}/5</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${((stats.averageRating || 4.9) / 5) * 100}%` }}></div>
              </div>
              <p className="text-sm text-green-800 mt-2">Based on {stats.totalReviews || 0} reviews</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-blue-900">Monthly Progress</h4>
                <span className="text-blue-600 font-bold text-xl">+18%</span>
              </div>
              <p className="text-sm text-blue-800">
                {stats.totalConsultations || 0} consultations this month
              </p>
              <p className="text-xs text-blue-600 mt-1">12 more than last month</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-purple-900">Revenue Growth</h4>
                <span className="text-purple-600 font-bold text-xl">₹{stats.totalEarnings || 0}</span>
              </div>
              <p className="text-sm text-purple-800">Total earnings</p>
              <p className="text-xs text-purple-600 mt-1">15% increase this month</p>
            </div>
          </div>
        </DashboardCard>
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

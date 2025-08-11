import React, { useState, useEffect } from 'react';
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
  MoreVertical
} from 'lucide-react';

// Enhanced Card Component
const DashboardCard = ({ title, children, className = "", delay = 0, action }) => (
  <div 
    className={`bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-500 ${className}`}
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'slideInUp 0.6s ease-out forwards'
    }}
  >
    {title && (
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-3">
          {action}
          <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    )}
    {children}
  </div>
);

// Quick Stats Card
const StatsCard = ({ icon: Icon, title, value, change, color, delay = 0 }) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700"
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
        <span className="text-sm font-medium opacity-80">{change}</span>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm font-medium opacity-80">{title}</p>
    </div>
  );
};

// Patient Card Component
const PatientCard = ({ patient, onViewDetails, delay = 0 }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInRight 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={patient.avatar} 
            alt={patient.name} 
            className="w-12 h-12 rounded-xl object-cover shadow-sm" 
          />
          <div>
            <h4 className="font-bold text-gray-900">{patient.name}</h4>
            <p className="text-sm text-gray-600">{patient.age} years • {patient.condition}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
          {patient.priority}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{patient.appointmentTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{patient.date}</span>
          </div>
        </div>
        <button 
          onClick={() => onViewDetails(patient)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, onAction, delay = 0 }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-emerald-600 bg-emerald-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
            src={appointment.patientAvatar} 
            alt={appointment.patientName} 
            className="w-14 h-14 rounded-xl object-cover shadow-sm" 
          />
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h4>
            <p className="text-gray-600 text-sm mb-1">{appointment.patientAge} years • {appointment.reason}</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              <div className="flex items-center space-x-1 text-gray-500">
                {getTypeIcon(appointment.type)}
                <span className="text-xs">{appointment.type}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-gray-900">{appointment.time}</p>
          <p className="text-sm text-gray-600">{appointment.date}</p>
          <p className="text-sm text-blue-600 font-semibold">₹{appointment.fee}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{appointment.duration} min</span>
        </div>
        <div className="flex items-center space-x-2">
          {appointment.status === 'confirmed' && (
            <button 
              onClick={() => onAction('start', appointment)}
              className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start</span>
            </button>
          )}
          <button 
            onClick={() => onAction('reschedule', appointment)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Revenue Chart Component (Simplified)
const RevenueChart = () => (
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-bold text-gray-900">Monthly Revenue</h4>
      <TrendingUp className="w-5 h-5 text-green-600" />
    </div>
    <div className="flex items-end space-x-2 h-32 mb-4">
      {[40, 60, 45, 80, 65, 90, 75].map((height, idx) => (
        <div key={idx} className="bg-green-500 rounded-t-lg flex-1 transition-all duration-500 hover:bg-green-600" style={{ height: `${height}%` }}></div>
      ))}
    </div>
    <div className="flex justify-between text-sm text-gray-600">
      <span>Jan</span>
      <span>Jul</span>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Handle tab change
  const handleTabChange = (tabKey) => {
    if (tabKey === activeTab) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tabKey);
      setIsLoading(false);
      setSidebarOpen(false);
    }, 150);
  };

  // Sample data
  const todayStats = [
    { icon: Users, title: "Today's Patients", value: "12", change: "+3 vs yesterday", color: "blue" },
    { icon: DollarSign, title: "Revenue", value: "₹8,500", change: "+15% vs last week", color: "green" },
    { icon: Clock, title: "Hours Worked", value: "6.5", change: "2.5 hrs remaining", color: "purple" },
    { icon: Star, title: "Rating", value: "4.9", change: "98% satisfaction", color: "orange" }
  ];

  const upcomingPatients = [
    {
      id: 1,
      name: "Ramesh Thapa",
      age: 45,
      condition: "Hypertension",
      appointmentTime: "2:30 PM",
      date: "Today",
      priority: "medium",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sita Sharma",
      age: 32,
      condition: "Diabetes",
      appointmentTime: "3:15 PM",
      date: "Today",
      priority: "high",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332b265?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Kumar Rai",
      age: 28,
      condition: "Anxiety",
      appointmentTime: "4:00 PM",
      date: "Today",
      priority: "urgent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const todayAppointments = [
    {
      id: 1,
      patientName: "Ramesh Thapa",
      patientAge: 45,
      reason: "Follow-up consultation",
      time: "2:30 PM",
      date: "Today",
      duration: 30,
      type: "video",
      status: "confirmed",
      fee: 800,
      patientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      patientName: "Sita Sharma",
      patientAge: 32,
      reason: "Diabetes management",
      time: "3:15 PM",
      date: "Today",
      duration: 45,
      type: "video",
      status: "confirmed",
      fee: 1200,
      patientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b332b265?w=100&h=100&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    const handleClickOutside = (event) => {
      if (profileDropdown && !event.target.closest('.profile-dropdown')) {
        setProfileDropdown(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdown]);

  // Enhanced Navigation Button
  const NavButton = ({ icon: Icon, label, tabKey, isActive, onClick, badge }) => (
    <button
      onClick={() => onClick(tabKey)}
      className={`relative flex items-center space-x-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group text-sm ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {badge && (
        <span className="absolute right-3 top-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
      )}
    </button>
  );

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    console.log('Viewing patient:', patient.name);
  };

  const handleAppointmentAction = (action, appointment) => {
    console.log(`${action} appointment for:`, appointment.patientName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <style jsx>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .sidebar-animate { animation: slideInLeft 0.3s ease-out forwards; }
        .mobile-nav-safe { padding-bottom: 5rem; }
      `}</style>

      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-200" />
                  ) : (
                    <Menu className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                  )}
                </button>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Doctor Portal
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Professional Healthcare Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer group">
                  <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                </div>
              </div>
              
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="relative"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face" 
                    alt="Dr. Profile" 
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-white hover:border-blue-200 transition-colors" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </button>
                
                {profileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face" 
                          alt="Dr. Profile" 
                          className="w-12 h-12 rounded-full shadow-md" 
                        />
                        <div>
                          <p className="font-bold text-gray-900">Dr. Rajesh Sharma</p>
                          <p className="text-sm text-gray-600">Cardiologist</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full font-medium">
                            Verified Doctor
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">View Profile</span>
                      </button>
                      
                      <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">Account Settings</span>
                      </button>
                      
                      <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                        <BarChart3 className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">Analytics</span>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button className="w-full px-6 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="text-sm text-red-600 font-medium">Log Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Enhanced Sidebar */}
          {(!isMobile || sidebarOpen) && (
            <div className={`${isMobile ? 'fixed inset-0 z-40' : ''}`}>
              {isMobile && (
                <div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              <div className={`${
                isMobile 
                  ? 'fixed left-0 top-0 h-full w-80 bg-white shadow-2xl sidebar-animate' 
                  : 'w-72 sticky top-28'
              }`}>
                <nav className="bg-white rounded-3xl shadow-sm p-6 space-y-3 h-fit border border-gray-100">
                  <div className="mb-8">  
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Doctor Portal</h3>
                    <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>
                  
                  <NavButton icon={Home} label="Dashboard" tabKey="dashboard" isActive={activeTab === 'dashboard'} onClick={handleTabChange} />
                  <NavButton icon={Users} label="Patients" tabKey="patients" isActive={activeTab === 'patients'} onClick={handleTabChange} badge="5" />
                  <NavButton icon={Calendar} label="Appointments" tabKey="appointments" isActive={activeTab === 'appointments'} onClick={handleTabChange} badge="12" />
                  <NavButton icon={MessageCircle} label="Consultations" tabKey="consultations" isActive={activeTab === 'consultations'} onClick={handleTabChange} />
                  <NavButton icon={FileText} label="Prescriptions" tabKey="prescriptions" isActive={activeTab === 'prescriptions'} onClick={handleTabChange} />
                  <NavButton icon={BarChart3} label="Analytics" tabKey="analytics" isActive={activeTab === 'analytics'} onClick={handleTabChange} />
                  <NavButton icon={DollarSign} label="Revenue" tabKey="revenue" isActive={activeTab === 'revenue'} onClick={handleTabChange} />
                  <NavButton icon={Settings} label="Settings" tabKey="settings" isActive={activeTab === 'settings'} onClick={handleTabChange} />
                </nav>
              </div>
            </div>
          )}

          {/* Enhanced Main Content */}
          <div className={`flex-1 space-y-8 ${isMobile ? 'mobile-nav-safe' : ''}`}>
            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-center mt-4 font-semibold text-gray-700">Loading...</p>
                </div>
              </div>
            )}

            {/* Enhanced Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-bold mb-2">Good afternoon, Dr. Rajesh! 👨‍⚕️</h2>
                    <p className="text-blue-100 text-lg">You have 5 appointments scheduled today</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <Clock className="w-8 h-8 mb-2" />
                      <p className="font-bold text-xl">2:25 PM</p>
                      <p className="text-sm text-blue-100">Current Time</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {todayStats.map((stat, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                      <stat.icon className="w-8 h-8 mb-3 opacity-80" />
                      <p className="text-3xl font-bold mb-1">{stat.value}</p>
                      <p className="text-sm text-blue-100 mb-2">{stat.title}</p>
                      <p className="text-xs text-blue-200">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="grid lg:grid-cols-1 gap-8">
              {/* Next Patients */}
              <DashboardCard 
                title="Next Patients" 
                delay={200}
                action={
                  <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                }
              >
                <div className="space-y-4">
                  {upcomingPatients.map((patient, idx) => (
                    <PatientCard 
                      key={patient.id} 
                      patient={patient} 
                      onViewDetails={handleViewPatientDetails} 
                      delay={idx * 100} 
                    />
                  ))}
                  
                  <div className="text-center pt-4 border-t border-gray-100">
                    <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold py-3 px-6 rounded-2xl hover:bg-blue-50 transition-all duration-200">
                      <Users className="w-5 h-5" />
                      <span>View All Patients</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </DashboardCard>

              {/* Today's Appointments */}
              <DashboardCard 
                title="Today's Appointments" 
                delay={300}
                action={
                  <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                }
              >
                <div className="space-y-4">
                  {todayAppointments.map((appointment, idx) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onAction={handleAppointmentAction} 
                      delay={idx * 100} 
                    />
                  ))}
                  
                  <div className="text-center pt-4 border-t border-gray-100">
                    <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold py-3 px-6 rounded-2xl hover:bg-blue-50 transition-all duration-200">
                      <Calendar className="w-5 h-5" />
                      <span>Manage Schedule</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </div>

            {/* Analytics & Insights */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Revenue Chart */}
              <DashboardCard title="Revenue Trends" delay={400} className="lg:col-span-2">
                <RevenueChart />
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">₹45,200</p>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-xs text-green-600 font-semibold">+18% vs last month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-sm text-gray-600">Consultations</p>
                    <p className="text-xs text-blue-600 font-semibold">+12 this week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">4.9</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-xs text-orange-600 font-semibold">98% satisfied</p>
                  </div>
                </div>
              </DashboardCard>

              {/* Quick Actions */}
              <DashboardCard title="Quick Actions" delay={500}>
                <div className="space-y-4">
                  <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group border border-blue-200">
                    <div className="bg-blue-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Add New Patient</p>
                      <p className="text-sm text-gray-600">Register a new patient</p>
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
                      <p className="font-semibold text-gray-900">Availability</p>
                      <p className="text-sm text-gray-600">Manage schedule</p>
                    </div>
                  </button>
                </div>
              </DashboardCard>
            </div>

            {/* Recent Activity & Notifications */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <DashboardCard title="Recent Activity" delay={600}>
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, color: "emerald", title: "Consultation completed", subtitle: "with Ramesh Thapa", time: "30 min ago", bg: "from-emerald-50 to-emerald-100" },
                    { icon: FileText, color: "blue", title: "Prescription sent", subtitle: "to Sita Sharma", time: "1 hour ago", bg: "from-blue-50 to-blue-100" },
                    { icon: Calendar, color: "purple", title: "Appointment scheduled", subtitle: "with Kumar Rai", time: "2 hours ago", bg: "from-purple-50 to-purple-100" },
                    { icon: Star, color: "orange", title: "5-star review received", subtitle: "from Priya Thapa", time: "3 hours ago", bg: "from-orange-50 to-orange-100" }
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

              {/* Important Notifications */}
              <DashboardCard title="Important Notifications" delay={700}>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-2xl border border-red-200">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-900">Urgent: Patient needs attention</h4>
                        <p className="text-red-800 text-sm">Kumar Rai reported severe anxiety symptoms. Please review immediately.</p>
                        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                          Review Now
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-900">Schedule Update</h4>
                        <p className="text-blue-800 text-sm">Your 4:30 PM appointment has been rescheduled to 5:00 PM.</p>
                        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                          View Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-2xl border border-green-200">
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-green-900">Achievement Unlocked!</h4>
                        <p className="text-green-800 text-sm">You've maintained a 4.9+ rating for 3 consecutive months!</p>
                        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                          View Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Navigation - Mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-2 py-4 z-40 shadow-2xl">
          <div className="flex justify-around items-center max-w-sm mx-auto">
            {[
              { icon: Home, label: "Dashboard", key: "dashboard" },
              { icon: Users, label: "Patients", key: "patients", badge: "5" },
              { icon: Calendar, label: "Schedule", key: "appointments", badge: "12" },
              { icon: MessageCircle, label: "Chat", key: "consultations" },
              { icon: BarChart3, label: "Analytics", key: "analytics" }
            ].map((nav, idx) => (
              <button
                key={nav.key}
                onClick={() => handleTabChange(nav.key)}
                className={`relative flex flex-col items-center space-y-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 ${
                  activeTab === nav.key 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <nav.icon className="w-5 h-5" />
                  {nav.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {nav.badge}
                    </span>
                  )}
                  {activeTab === nav.key && (
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium truncate">{nav.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
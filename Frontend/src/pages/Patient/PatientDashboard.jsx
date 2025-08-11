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
  PlayCircle
} from 'lucide-react';

// Enhanced Card Component with animations
const DashboardCard = ({ title, children, className = "", delay = 0 }) => (
  <div 
    className={`bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${className}`}
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'slideInUp 0.6s ease-out forwards'
    }}
  >
    {title && (
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
    )}
    {children}
  </div>
);

// Enhanced Quick Action Button
const QuickActionButton = ({ icon: Icon, title, subtitle, onClick, color = "blue", delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25",
    green: "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-500/25",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25"
  };

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group w-full p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden`}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInScale 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <Icon className={`w-12 h-12 mx-auto mb-4 transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`} />
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-sm opacity-90">{subtitle}</p>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
    </button>
  );
};

// Premium Appointment Card
const AppointmentCard = ({ appointment, onJoin, delay = 0 }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-5 h-5 text-blue-600" />;
      case 'audio': return <Phone className="w-5 h-5 text-green-600" />;
      case 'chat': return <MessageCircle className="w-5 h-5 text-purple-600" />;
      default: return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div 
      className="group relative bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInRight 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={appointment.avatar} 
                alt={appointment.doctor} 
                className="w-16 h-16 rounded-2xl object-cover shadow-lg" 
              />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                {getTypeIcon(appointment.type)}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{appointment.doctor}</h4>
              <p className="text-gray-600 text-sm mb-2">{appointment.specialization}</p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{appointment.date}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{appointment.time}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
              {appointment.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
              {appointment.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Ready to join</span>
          </div>
          <button 
            onClick={() => onJoin(appointment)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Join Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Premium Doctor Card
const DoctorCard = ({ doctor, onBook, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInRight 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={doctor.avatar} 
                alt={doctor.name} 
                className="w-16 h-16 rounded-2xl object-cover shadow-lg" 
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md ${doctor.isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{doctor.name}</h4>
              <p className="text-gray-600 text-sm mb-1">{doctor.specialization}</p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">{doctor.rating}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">{doctor.experience}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">₹{doctor.consultationFee}</p>
            <p className="text-xs text-gray-500">per consultation</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {doctor.consultationModes.map((mode, idx) => (
              <div key={idx} className="flex items-center px-3 py-2 rounded-xl text-xs bg-gray-50 text-gray-700 border border-gray-200">
                {mode === 'video' && <Video className="w-3 h-3 mr-1 text-blue-600" />}
                {mode === 'audio' && <Phone className="w-3 h-3 mr-1 text-green-600" />}
                {mode === 'chat' && <MessageCircle className="w-3 h-3 mr-1 text-purple-600" />}
                <span className="font-medium capitalize">{mode}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => onBook(doctor)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAIChat, setShowAIChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  // Handle tab change with loading state
  const handleTabChange = (tabKey) => {
    if (tabKey === activeTab) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tabKey);
      setIsLoading(false);
      setSidebarOpen(false);
    }, 150);
  };

  // Sample data with enhanced structure
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Rajesh Sharma",
      specialization: "Cardiologist",
      date: "Today",
      time: "2:30 PM",
      type: "video",
      status: "confirmed",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      doctor: "Dr. Priya Thapa",
      specialization: "General Medicine",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "audio",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Anjana Poudel",
      specialization: "Dermatologist",
      rating: 4.8,
      experience: "8 years",
      consultationFee: 800,
      isOnline: true,
      consultationModes: ["video", "chat"],
      avatar: "https://images.unsplash.com/photo-1594824750103-34b3c9e19bb8?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Suresh Karki",
      specialization: "Orthopedic",
      rating: 4.6,
      experience: "12 years",
      consultationFee: 1200,
      isOnline: true,
      consultationModes: ["video", "audio"],
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const quickStats = [
    { label: "Total Consultations", value: "23", change: "+5 this month", icon: Activity, color: "blue" },
    { label: "Upcoming Appointments", value: "2", change: "Next: Today 2:30 PM", icon: Calendar, color: "green" },
    { label: "Health Score", value: "85%", change: "Good condition", icon: TrendingUp, color: "purple" },
    { label: "Saved Amount", value: "₹12,500", change: "vs hospital visits", icon: Shield, color: "orange" }
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
  const NavButton = ({ icon: Icon, label, tabKey, isActive, onClick }) => (
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
      {isActive && (
        <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
      )}
    </button>
  );

  const handleQuickAction = (action) => {
    if (action === 'ai-symptom') {
      setShowAIChat(true);
    }
    console.log(`Quick action: ${action}`);
  };

  const handleBookDoctor = (doctor) => {
    console.log(`Booking appointment with ${doctor.name}`);
  };

  const handleJoinAppointment = (appointment) => {
    console.log(`Joining appointment with ${appointment.doctor}`);
  };

  if (showAIChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setShowAIChat(false)}
            className="mb-4 px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span>Back to Dashboard</span>
          </button>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">AI Symptom Checker</h2>
            <p className="text-center text-gray-600 mb-8">Describe your symptoms and get instant medical insights</p>
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <Stethoscope className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">AI Symptom Checker would be integrated here...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .mobile-nav-safe {
          padding-bottom: 5rem;
        }
        
        .sidebar-animate {
          animation: slideInLeft 0.3s ease-out forwards;
        }
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
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    HealthCare
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Premium Healthcare Experience</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="relative">
                <div className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer group">
                  <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
              </div>
              
              <div className="relative profile-dropdown cursor-pointer">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="relative"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-white hover:border-blue-200 transition-colors cursor-pointer  " 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </button>
                
                {/* Profile Dropdown */}
                {profileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-74 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full shadow-md" 
                        />
                        <div>
                          <p className="font-bold text-gray-900">Ramesh Thapa</p>
                          <p className="text-sm text-gray-600">rohitpoudel020@gmail.com</p>
                          
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 cursor-pointer">
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">View Profile</span>
                      </button>
                      
                      <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 cursor-pointer">
                        <Settings className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">Account Settings</span>
                      </button>
                      
                      <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 cursor-pointer">
                        <Shield className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">Privacy & Security</span>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button className="w-full px-6 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 cursor-pointer">
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Navigation</h3>
                    <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 "></div>
                  </div>
                  <NavButton icon={Home} label="Dashboard" tabKey="dashboard" isActive={activeTab === 'dashboard'} onClick={handleTabChange} />
                  <NavButton icon={Search} label="Find Doctors" tabKey="doctors" isActive={activeTab === 'doctors'} onClick={handleTabChange} />
                  <NavButton icon={Calendar} label="Appointments" tabKey="appointments" isActive={activeTab === 'appointments'} onClick={handleTabChange} />
                  <NavButton icon={MessageCircle} label="Consultations" tabKey="consultations" isActive={activeTab === 'consultations'} onClick={handleTabChange} />
                  <NavButton icon={Stethoscope} label="AI Symptom Checker" tabKey="symptoms" isActive={activeTab === 'symptoms'} onClick={handleTabChange} />
                  <NavButton icon={Pill} label="Prescriptions" tabKey="prescriptions" isActive={activeTab === 'prescriptions'} onClick={handleTabChange} />
                  <NavButton icon={Activity} label="Health Records" tabKey="records" isActive={activeTab === 'records'} onClick={handleTabChange} />
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
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">Welcome back, Ramesh! 👋</h2>
                <p className="text-blue-100 mb-8 text-lg">Your health is our priority. How can we help you today?</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickStats.map((stat, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: `${idx * 100}ms` }}>
                      <stat.icon className="w-8 h-8 mb-3 opacity-80" />
                      <p className="text-3xl font-bold mb-1">{stat.value}</p>
                      <p className="text-sm text-blue-100 mb-2">{stat.label}</p>
                      <p className="text-xs text-blue-200">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <DashboardCard title="Quick Actions" delay={100}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 ">
                <QuickActionButton
                  icon={Search}
                  title="Find Doctor"
                  subtitle="Book consultation instantly"
                  onClick={() => handleQuickAction('find-doctor')}
                  color="blue"
                  delay={0}
                />
                <QuickActionButton
                  icon={Stethoscope}
                  title="AI Diagnosis"
                  subtitle="Smart symptom analysis"
                  onClick={() => handleQuickAction('ai-symptom')}
                  color="purple"
                  delay={100}
                />
                <QuickActionButton
                  icon={AlertCircle}
                  title="Emergency"
                  subtitle="24/7 urgent care"
                  onClick={() => handleQuickAction('emergency')}
                  color="orange"
                  delay={200}
                />
                <QuickActionButton
                  icon={Pill}
                  title="Pharmacy"
                  subtitle="Order medicines online"
                  onClick={() => handleQuickAction('pharmacy')}
                  color="green"
                  delay={300}
                />
              </div>
            </DashboardCard>

            <div className="grid lg:grid-cols-1 gap-8">
              {/* Premium Upcoming Appointments */}
              <DashboardCard title="Upcoming Appointments" delay={200}>
                <div className="space-y-6">
                  {upcomingAppointments.map((appointment, idx) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onJoin={handleJoinAppointment} 
                      delay={idx * 100} 
                    />
                  ))}
                  
                  <div className="text-center pt-4 border-t border-gray-100">
                    <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold py-3 px-6 rounded-2xl hover:bg-blue-50 transition-all duration-200">
                      <Calendar className="w-5 h-5" />
                      <span>View All Appointments</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </DashboardCard>

              
              
            </div>

            {/* Enhanced Activity & Insights */}
            <div className="grid lg:grid-cols-2 gap-8">
              <DashboardCard title="Recent Activity" delay={400}>
                <div className="space-y-6">
                  {[
                    { icon: Video, color: "emerald", title: "Video consultation completed", subtitle: "with Dr. Rajesh Sharma", time: "2 hours ago", bg: "from-emerald-50 to-emerald-100" },
                    { icon: Pill, color: "blue", title: "E-prescription received", subtitle: "Medication for blood pressure", time: "Yesterday", bg: "from-blue-50 to-blue-100" },
                    { icon: Stethoscope, color: "purple", title: "AI symptom check used", subtitle: "Headache analysis completed", time: "3 days ago", bg: "from-purple-50 to-purple-100" }
                  ].map((activity, idx) => (
                    <div key={idx} className={`flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r ${activity.bg} border border-gray-100 hover:shadow-md transition-all duration-300`}>
                      <div className={`bg-white p-3 rounded-2xl shadow-sm border border-${activity.color}-200`}>
                        <activity.icon className={`w-6 h-6 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-1">{activity.title}</p>
                        <p className="text-gray-600 text-sm mb-2">{activity.subtitle}</p>
                        <p className="text-xs text-gray-500 font-medium">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard title="Health Insights" delay={500}>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Medication Reminder
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed">Don't forget to take your blood pressure medication at 8:00 PM today.</p>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                      Mark as Taken
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                    <h4 className="font-bold text-emerald-900 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Health Progress
                    </h4>
                    <p className="text-emerald-800 text-sm leading-relaxed">Your consultation frequency has improved your health score by 15% this month.</p>
                    <div className="mt-3 bg-emerald-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Checkup Reminder
                    </h4>
                    <p className="text-amber-800 text-sm leading-relaxed">Your annual health checkup is due next month. Book an appointment now.</p>
                    <button className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer">
                      Schedule Now
                    </button>
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
              { icon: Home, label: "Home", key: "dashboard" },
              { icon: Search, label: "Find", key: "doctors" },
              { icon: Calendar, label: "Appointments", key: "appointments" },
              { icon: MessageCircle, label: "Chat", key: "consultations" },
              { icon: User, label: "Profile", key: "settings" }
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
                  {activeTab === nav.key && (
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium truncate">{nav.label}</span>
                {activeTab === nav.key && (
                  <div className="absolute -top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Search,
  Stethoscope,
  AlertCircle,
  Pill,
  Video,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
  Bell,
  TrendingUp,
  Activity,
  ChevronRight,
  Menu,
  Users,
  Settings as SettingsIcon,
  Home,
} from "lucide-react";
import { Settings,LogOut,X } from "lucide-react";
import { patientAPI, utils } from '../../utils/api';


// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const links = [
    { label: "Home", to: "/home/PatientDashboard", icon: Home },
    { label: "Appointments", to: "/home/PatientDashboard/Appointment", icon: Calendar },
    { label: "Find Doctors", to: "/home/PatientDashboard/FindDoctors", icon: Stethoscope },
    { label: "Settings", to: "/home/PatientDashboard/Settings", icon: Settings },
    { label: "Logout", to: "/logout", icon: LogOut },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static lg:shadow-none`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-700">HealthApp</h2>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <nav className="mt-6">
        <ul className="flex flex-col space-y-2 px-4">
          {links.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  location.pathname === to
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
                onClick={toggleSidebar}
              >
                <Icon className="w-5 h-5 mr-3" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Header Component
const Header = ({ toggleSidebar, user }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
      <h1 className="text-xl font-bold text-blue-700">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
        <div className="flex items-center space-x-2 cursor-pointer">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="font-medium text-gray-700">
            {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
          </span>
        </div>
      </div>
    </header>
  );
};

// Mobile Bottom Navigation
const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/home/PatientDashboard", icon: Home },
    { label: "Appointments", to: "/home/PatientDashboard/Appointment", icon: Calendar },
    { label: "Doctors", to: "/home/PatientDashboard/FindDoctors", icon: Stethoscope },
    { label: "Settings", to: "/home/PatientDashboard/Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner flex justify-around items-center lg:hidden z-50">
      {navItems.map(({ label, to, icon: Icon }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium ${
              active ? "text-blue-700" : "text-gray-600 hover:text-blue-700"
            }`}
          >
            <Icon
              className={`w-6 h-6 mb-1 ${active ? "text-blue-700" : "text-gray-600"}`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

const DashboardCard = ({ title, children, className = "", delay = 0 }) => (
  <div 
    className={`bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100/50 p-4 lg:p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${className}`}
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'slideInUp 0.6s ease-out forwards'
    }}
  >
    {title && (
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h3>
        <div className="w-6 lg:w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
    )}
    {children}
  </div>
);

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
      className={`relative group w-full p-3 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg lg:shadow-xl transition-all duration-300 transform hover:-translate-y-1 lg:hover:-translate-y-2 lg:hover:scale-105 overflow-hidden`}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInScale 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <Icon className={`w-6 h-6 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-4 transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`} />
        <h4 className="font-semibold lg:font-bold text-sm lg:text-lg mb-1 lg:mb-2">{title}</h4>
        <p className="text-xs lg:text-sm opacity-90 leading-tight">{subtitle}</p>
      </div>
      <div className="absolute top-0 right-0 w-12 lg:w-20 h-12 lg:h-20 bg-white/10 rounded-full -translate-y-6 lg:-translate-y-10 translate-x-6 lg:translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
    </button>
  );
};

const AppointmentCard = ({ appointment, onJoin, delay = 0 }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />;
      case 'audio': return <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />;
      case 'chat': return <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />;
      default: return <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />;
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
      className="group relative bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl lg:rounded-2xl border border-gray-100 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInRight 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 lg:mb-4">
          <div className="flex items-center space-x-3 lg:space-x-4 flex-1">
            <div className="relative">
              <img 
                src={appointment.avatar} 
                alt={appointment.doctor} 
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl object-cover shadow-lg" 
              />
              <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 bg-white rounded-full p-0.5 lg:p-1 shadow-md">
                {getTypeIcon(appointment.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold lg:font-bold text-gray-900 text-sm lg:text-lg truncate">{appointment.doctor}</h4>
              <p className="text-gray-600 text-xs lg:text-sm mb-1 lg:mb-2">{appointment.specialization}</p>
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-1 lg:space-y-0">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm font-medium">{appointment.date}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm font-medium">{appointment.time}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right ml-2">
            <span className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
              {appointment.status === 'confirmed' && <CheckCircle className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />}
              {appointment.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs lg:text-sm text-gray-600">Ready to join</span>
          </div>
          <button 
            onClick={() => onJoin(appointment)}
            className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg lg:rounded-xl font-medium text-xs lg:text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md lg:shadow-lg hover:shadow-xl cursor-pointer"
          >
            <PlayCircle className="w-3 h-3 lg:w-4 lg:h-4" />
            <span>Join Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!utils.isAuthenticated()) {
        navigate('/login');
        return;
      }

      // Fetch dashboard data
      const response = await patientAPI.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.error?.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    // Handle navigation based on action
    switch (action) {
      case 'find-doctor':
        navigate('/home/PatientDashboard/FindDoctors');
        break;
      case 'prescriptions':
        // Navigate to prescriptions page when implemented
        break;
      case 'video-call':
        // Handle video call functionality
        break;
      case 'alerts':
        // Navigate to alerts/notifications page
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleJoinAppointment = (appointment) => {
    console.log(`Joining appointment with ${appointment.doctor}`);
    // Handle appointment joining logic
    // This would typically open a video/audio call interface
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  if (!dashboardData) {
    return <ErrorMessage message="No dashboard data available" onRetry={fetchDashboardData} />;
  }

  const { patient, stats, upcomingAppointments, quickStats, recentActivities } = dashboardData;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-auto pb-16">
        <Header toggleSidebar={toggleSidebar} user={patient?.userId} />

        <main className="p-3 lg:p-6 space-y-4 lg:space-y-8 overflow-auto">
          {/* Enhanced Welcome Section */}
          <div id="home" className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl lg:rounded-3xl text-white p-4 lg:p-8 relative overflow-hidden shadow-xl lg:shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 lg:w-64 h-32 lg:h-64 bg-white/10 rounded-full -translate-y-16 lg:-translate-y-32 translate-x-16 lg:translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-24 lg:w-48 h-24 lg:h-48 bg-white/10 rounded-full translate-y-12 lg:translate-y-24 -translate-x-12 lg:-translate-x-24"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4">
                Welcome back, {patient?.userId?.firstName || 'Patient'}! 👋
              </h2>
              <p className="text-blue-100 mb-4 lg:mb-8 text-sm lg:text-lg">Your health is our priority. How can we help you today?</p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {quickStats?.map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: `${idx * 100}ms` }}>
                    <Activity className="w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-3 opacity-80" />
                    <p className="text-xl lg:text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-blue-100 mb-1 lg:mb-2 leading-tight">{stat.label}</p>
                    <p className="text-xs text-blue-200 leading-tight">{stat.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <DashboardCard title="Quick Actions" delay={100}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <QuickActionButton
                icon={Search}
                title="Find Doctor"
                subtitle="Book consultation instantly"
                onClick={() => handleQuickAction('find-doctor')}
                color="blue"
                delay={100}
              />
              <QuickActionButton
                icon={Pill}
                title="Prescriptions"
                subtitle="Check medications"
                onClick={() => handleQuickAction('prescriptions')}
                color="green"
                delay={200}
              />
              <QuickActionButton
                icon={Video}
                title="Video Call"
                subtitle="Connect with doctor"
                onClick={() => handleQuickAction('video-call')}
                color="purple"
                delay={300}
              />
              <QuickActionButton
                icon={AlertCircle}
                title="Health Alerts"
                subtitle="Stay updated"
                onClick={() => handleQuickAction('alerts')}
                color="orange"
                delay={400}
              />
            </div>
          </DashboardCard>

          {/* Upcoming Appointments */}
          <DashboardCard title="Upcoming Appointments" delay={300}>
            <div className="space-y-4 lg:space-y-6">
              {upcomingAppointments?.map((appt, idx) => (
                <AppointmentCard 
                  key={appt.id} 
                  appointment={appt} 
                  onJoin={handleJoinAppointment}
                  delay={idx * 200}
                />
              ))}
            </div>
          </DashboardCard>

          {/* Activity & Insights */}
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
            <DashboardCard title="Recent Activity" delay={400}>
              <div className="space-y-3 lg:space-y-6">
                {recentActivities?.map((activity, idx) => {
                  const IconComponent = activity.icon === 'Video' ? Video : activity.icon === 'Pill' ? Pill : Stethoscope;
                  const colorClass = activity.type === 'consultation' ? 'emerald' : activity.type === 'prescription' ? 'blue' : 'purple';
                  const bgClass = activity.type === 'consultation' ? 'from-emerald-50 to-emerald-100' : activity.type === 'prescription' ? 'from-blue-50 to-blue-100' : 'from-purple-50 to-purple-100';
                  
                  return (
                    <div key={idx} className={`flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r ${bgClass} border border-gray-100 hover:shadow-md transition-all duration-300`}>
                      <div className={`bg-white p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-sm border border-${colorClass}-200`}>
                        <IconComponent className={`w-4 h-4 lg:w-6 lg:h-6 text-${colorClass}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold lg:font-bold text-gray-900 mb-1 text-sm lg:text-base">{activity.title}</p>
                        <p className="text-gray-600 text-xs lg:text-sm mb-1 lg:mb-2 leading-tight">{activity.subtitle}</p>
                        <p className="text-xs text-gray-500 font-medium">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashboardCard>

            <DashboardCard title="Health Insights" delay={500}>
              <div className="space-y-3 lg:space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                  <h4 className="font-semibold lg:font-bold text-blue-900 mb-2 lg:mb-3 flex items-center text-sm lg:text-base">
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Health Summary
                  </h4>
                  {patient?.bloodGroup && (
                    <p className="text-blue-800 text-xs lg:text-sm mb-2">Blood Group: {patient.bloodGroup}</p>
                  )}
                  {patient?.bmi && (
                    <p className="text-blue-800 text-xs lg:text-sm mb-2">BMI: {patient.bmi}</p>
                  )}
                  <p className="text-blue-800 text-xs lg:text-sm">Health Score: {patient?.healthScore || 85}%</p>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-emerald-200">
                  <h4 className="font-semibold lg:font-bold text-emerald-900 mb-2 lg:mb-3 flex items-center text-sm lg:text-base">
                    <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Health Progress
                  </h4>
                  <p className="text-emerald-800 text-xs lg:text-sm leading-relaxed mb-2 lg:mb-3">
                    {stats?.totalConsultations > 0 
                      ? `You've completed ${stats.totalConsultations} consultations. Keep up the good work!`
                      : "Start your health journey by booking your first consultation."
                    }
                  </p>
                  <div className="bg-emerald-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-amber-200">
                  <h4 className="font-semibold lg:font-bold text-amber-900 mb-2 lg:mb-3 flex items-center text-sm lg:text-base">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Next Steps
                  </h4>
                  <p className="text-amber-800 text-xs lg:text-sm leading-relaxed mb-2 lg:mb-3">
                    {upcomingAppointments?.length > 0
                      ? `You have ${upcomingAppointments.length} upcoming appointments.`
                      : "Consider booking a consultation to maintain your health."
                    }
                  </p>
                  <button className="px-3 lg:px-4 py-2 bg-amber-600 text-white rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer">
                    {upcomingAppointments?.length > 0 ? 'View Appointments' : 'Book Consultation'}
                  </button>
                </div>
              </div>
            </DashboardCard>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Dashboard;
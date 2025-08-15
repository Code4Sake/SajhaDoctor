import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageCircle, 
  User,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Download,
  PlayCircle,
  Edit,
  Trash2,
  MoreVertical,
  Calendar as CalendarIcon,
  Users,
  RefreshCw,
  Menu,
  Bell,
  Home,
  Stethoscope,
  Settings,
  LogOut,
  X
} from 'lucide-react';

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
const Header = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
      <h1 className="text-xl font-bold text-blue-700">Appointments</h1>
      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=32&h=32&fit=crop&crop=face"
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover shadow-sm"
          />
          <span className="font-medium text-gray-700">Ramesh</span>
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

const Appointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');

  // Sample appointment data
  const appointments = {
    upcoming: [
      {
        id: 1,
        doctor: "Dr. Rajesh Sharma",
        specialization: "Cardiologist",
        date: "Today",
        time: "2:30 PM",
        type: "video",
        status: "confirmed",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
        location: "Norvic International Hospital",
        fee: 1200,
        duration: "30 mins",
        notes: "Follow-up consultation for heart condition"
      },
      {
        id: 2,
        doctor: "Dr. Priya Thapa",
        specialization: "General Medicine",
        date: "Tomorrow",
        time: "10:00 AM",
        type: "audio",
        status: "pending",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
        location: "Grande International Hospital",
        fee: 800,
        duration: "45 mins",
        notes: "General health checkup and consultation"
      },
      {
        id: 3,
        doctor: "Dr. Anjana Poudel",
        specialization: "Dermatologist",
        date: "Jan 15",
        time: "3:45 PM",
        type: "video",
        status: "confirmed",
        avatar: "https://images.unsplash.com/photo-1594824750103-34b3c9e19bb8?w=100&h=100&fit=crop&crop=face",
        location: "Patan Academy of Health Sciences",
        fee: 900,
        duration: "30 mins",
        notes: "Skin condition follow-up appointment"
      }
    ],
    past: [
      {
        id: 4,
        doctor: "Dr. Suresh Karki",
        specialization: "Orthopedic",
        date: "Jan 8",
        time: "11:30 AM",
        type: "video",
        status: "completed",
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
        location: "TU Teaching Hospital",
        fee: 1500,
        duration: "60 mins",
        notes: "Back pain consultation and treatment plan",
        rating: 5,
        feedback: "Excellent consultation, very thorough examination"
      },
      {
        id: 5,
        doctor: "Dr. Maya Gurung",
        specialization: "Pediatrics",
        date: "Jan 5",
        time: "9:15 AM",
        type: "audio",
        status: "completed",
        avatar: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop&crop=face",
        location: "Kanti Children's Hospital",
        fee: 700,
        duration: "30 mins",
        notes: "Child health checkup and vaccination",
        rating: 4,
        feedback: "Good consultation, doctor was very patient with my child"
      }
    ],
    cancelled: [
      {
        id: 6,
        doctor: "Dr. Bikash Adhikari",
        specialization: "ENT Specialist",
        date: "Jan 3",
        time: "2:00 PM",
        type: "video",
        status: "cancelled",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face",
        location: "B&B Hospital",
        fee: 1000,
        duration: "45 mins",
        notes: "Ear infection consultation",
        cancelReason: "Doctor unavailable due to emergency"
      }
    ]
  };

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
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
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
                <p className="text-gray-600 text-sm mb-1">{appointment.specialization}</p>
                <div className="flex items-center space-x-1 text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{appointment.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{appointment.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{appointment.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span className="ml-1 capitalize">{appointment.status}</span>
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600">₹{appointment.fee}</p>
              {showActions && (
                <div className="relative mt-2">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                      {appointment.status === 'confirmed' && (
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                          <PlayCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Join Now</span>
                        </button>
                      )}
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                        <Edit className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">Reschedule</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                        <Download className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">Download Receipt</span>
                      </button>
                      {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                        <button className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center space-x-3">
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Cancel</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700 font-medium mb-1">Appointment Notes:</p>
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>

          {appointment.status === 'completed' && appointment.rating && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Your Rating:</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < appointment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{appointment.feedback}</p>
            </div>
          )}

          {appointment.status === 'cancelled' && appointment.cancelReason && (
            <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
              <p className="text-sm font-semibold text-red-800 mb-1">Cancellation Reason:</p>
              <p className="text-sm text-red-700">{appointment.cancelReason}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            {appointment.status === 'confirmed' && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Ready to join</span>
                </div>
                <button 
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Join Now</span>
                </button>
              </>
            )}
            
            {appointment.status === 'pending' && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Awaiting confirmation</span>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                    Reschedule
                  </button>
                </div>
              </>
            )}

            {appointment.status === 'completed' && (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Consultation completed</span>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    Download Report
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200">
                    Book Again
                  </button>
                </div>
              </>
            )}

            {appointment.status === 'cancelled' && (
              <>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Appointment cancelled</span>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                  Book Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ label, count, isActive, onClick, icon: Icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
        isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
      }`}>
        {count}
      </span>
    </button>
  );

  const filteredAppointments = appointments[activeTab]?.filter(appointment => {
    const matchesSearch = appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && appointment.type === selectedFilter;
  }) || [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-auto pb-16"> {/* padding bottom for mobile nav */}
        <Header toggleSidebar={toggleSidebar} />

        <main className="p-6 space-y-8 overflow-auto">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">My Appointments 📅</h1>
              <p className="text-blue-100 text-lg mb-6">Manage all your healthcare appointments in one place</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Calendar className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-2xl font-bold">{appointments.upcoming.length}</p>
                  <p className="text-sm text-blue-100">Upcoming</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <CheckCircle className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-2xl font-bold">{appointments.past.length}</p>
                  <p className="text-sm text-blue-100">Completed</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Clock className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-2xl font-bold">₹{appointments.past.reduce((sum, apt) => sum + apt.fee, 0).toLocaleString()}</p>
                  <p className="text-sm text-blue-100">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 mb-6">
              <div className="flex flex-wrap gap-3">
                <TabButton 
                  label="Upcoming" 
                  count={appointments.upcoming.length}
                  icon={Clock}
                  isActive={activeTab === 'upcoming'} 
                  onClick={() => setActiveTab('upcoming')} 
                />
                <TabButton 
                  label="Past" 
                  count={appointments.past.length}
                  icon={CheckCircle}
                  isActive={activeTab === 'past'} 
                  onClick={() => setActiveTab('past')} 
                />
                <TabButton 
                  label="Cancelled" 
                  count={appointments.cancelled.length}
                  icon={XCircle}
                  isActive={activeTab === 'cancelled'} 
                  onClick={() => setActiveTab('cancelled')} 
                />
              </div>
              
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Book New Appointment</span>
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="video">Video Call</option>
                    <option value="audio">Audio Call</option>
                    <option value="chat">Chat</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                
                <button className="p-3 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-6">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment, index) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showActions={true}
                />
              ))
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Appointments Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery ? 
                    "No appointments match your search criteria. Try adjusting your search or filters." :
                    activeTab === 'upcoming' ? 
                      "You don't have any upcoming appointments. Book your first consultation today!" :
                      `No ${activeTab} appointments to display.`
                  }
                </p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>Book New Appointment</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {activeTab === 'past' && appointments.past.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Health Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <Users className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-3xl font-bold text-blue-900 mb-1">
                    {new Set(appointments.past.map(apt => apt.doctor)).size}
                  </p>
                  <p className="text-blue-700 font-medium">Doctors Consulted</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <Star className="w-8 h-8 text-green-600 mb-3" />
                  <p className="text-3xl font-bold text-green-900 mb-1">
                    {(appointments.past.reduce((sum, apt) => sum + (apt.rating || 0), 0) / appointments.past.length).toFixed(1)}
                  </p>
                  <p className="text-green-700 font-medium">Average Rating</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <Clock className="w-8 h-8 text-purple-600 mb-3" />
                  <p className="text-3xl font-bold text-purple-900 mb-1">
                    {appointments.past.reduce((sum, apt) => sum + parseInt(apt.duration), 0)}
                  </p>
                  <p className="text-purple-700 font-medium">Total Minutes</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                  <Video className="w-8 h-8 text-orange-600 mb-3" />
                  <p className="text-3xl font-bold text-orange-900 mb-1">
                    {appointments.past.filter(apt => apt.type === 'video').length}
                  </p>
                  <p className="text-orange-700 font-medium">Video Calls</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
};

export default Appointments;
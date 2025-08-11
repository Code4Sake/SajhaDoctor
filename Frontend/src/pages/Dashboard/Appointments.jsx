import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Video,
  Phone,
  MessageCircle,
  User,
  MapPin,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  PlayCircle,
  Pause,
  RotateCcw,
  Eye,
  Send
} from 'lucide-react';

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

// Appointment Card Component
const AppointmentCard = ({ appointment, onAction, delay = 0 }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'pending': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'completed': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      case 'rescheduled': return 'text-purple-700 bg-purple-100 border-purple-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4 text-blue-600" />;
      case 'audio': return <Phone className="w-4 h-4 text-green-600" />;
      case 'chat': return <MessageCircle className="w-4 h-4 text-purple-600" />;
      case 'in-person': return <User className="w-4 h-4 text-orange-600" />;
      default: return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50/50';
      case 'high': return 'border-l-orange-500 bg-orange-50/50';
      case 'medium': return 'border-l-blue-500 bg-blue-50/50';
      case 'low': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-300 bg-gray-50/50';
    }
  };

  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl border-l-4 ${getPriorityColor(appointment.priority)} border-r border-t border-b border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group`}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1">
          <img 
            src={appointment.patientAvatar} 
            alt={appointment.patientName} 
            className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white" 
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-bold text-lg text-gray-900">{appointment.patientName}</h4>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{appointment.patientAge} years • {appointment.reason}</p>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                {getTypeIcon(appointment.type)}
                <span className="capitalize">{appointment.type}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{appointment.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{appointment.location || 'Online'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">{appointment.time}</p>
            <p className="text-sm text-gray-600">{appointment.date}</p>
            <p className="text-sm text-blue-600 font-semibold">₹{appointment.fee}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-10 w-48">
                <button 
                  onClick={() => { onAction('view', appointment); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">View Details</span>
                </button>
                <button 
                  onClick={() => { onAction('edit', appointment); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Edit Appointment</span>
                </button>
                <button 
                  onClick={() => { onAction('reschedule', appointment); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Reschedule</span>
                </button>
                <button 
                  onClick={() => { onAction('cancel', appointment); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center space-x-2"
                >
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Priority: {appointment.priority}</span>
          <span>•</span>
          <span>Patient ID: {appointment.patientId}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {appointment.status === 'confirmed' && (
            <button 
              onClick={() => onAction('start', appointment)}
              className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start</span>
            </button>
          )}
          {appointment.status === 'pending' && (
            <button 
              onClick={() => onAction('confirm', appointment)}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm</span>
            </button>
          )}
          <button 
            onClick={() => onAction('message', appointment)}
            className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Calendar Component
const AppointmentCalendar = ({ appointments, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const formatDate = (day) => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  };
  
  const isToday = (day) => {
    const today = new Date();
    const date = formatDate(day);
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (day) => {
    if (!selectedDate) return false;
    const date = formatDate(day);
    return date.toDateString() === selectedDate.toDateString();
  };
  
  const hasAppointments = (day) => {
    const date = formatDate(day);
    return appointments.some(apt => 
      new Date(apt.fullDate).toDateString() === date.toDateString()
    );
  };
  
  const getAppointmentCount = (day) => {
    const date = formatDate(day);
    return appointments.filter(apt => 
      new Date(apt.fullDate).toDateString() === date.toDateString()
    ).length;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={index} className="h-12"></div>
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => onDateSelect(formatDate(day))}
            className={`relative h-12 rounded-xl text-sm font-medium transition-all duration-200 ${
              isSelected(day)
                ? 'bg-blue-600 text-white shadow-lg'
                : isToday(day)
                ? 'bg-blue-100 text-blue-600 font-bold'
                : hasAppointments(day)
                ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {day}
            {hasAppointments(day) && (
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                isSelected(day) ? 'bg-white text-blue-600' : 'bg-purple-500 text-white'
              }`}>
                {getAppointmentCount(day)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Sample appointment data
  const appointments = [
    {
      id: 1,
      patientName: "Ramesh Thapa",
      patientAge: 45,
      patientId: "PT001",
      reason: "Follow-up consultation for hypertension",
      time: "9:00 AM",
      date: "Today",
      fullDate: new Date(2025, 7, 11),
      duration: 30,
      type: "video",
      status: "confirmed",
      priority: "medium",
      fee: 800,
      location: "Online",
      patientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      patientName: "Sita Sharma",
      patientAge: 32,
      patientId: "PT002",
      reason: "Diabetes management and diet consultation",
      time: "10:30 AM",
      date: "Today",
      fullDate: new Date(2025, 7, 11),
      duration: 45,
      type: "video",
      status: "confirmed",
      priority: "high",
      fee: 1200,
      location: "Online",
      patientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b332b265?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      patientName: "Kumar Rai",
      patientAge: 28,
      patientId: "PT003",
      reason: "Mental health check-up and anxiety counseling",
      time: "2:00 PM",
      date: "Today",
      fullDate: new Date(2025, 7, 11),
      duration: 60,
      type: "video",
      status: "pending",
      priority: "urgent",
      fee: 1500,
      location: "Online",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      patientName: "Maya Gurung",
      patientAge: 38,
      patientId: "PT004",
      reason: "Routine checkup and prescription renewal",
      time: "11:00 AM",
      date: "Tomorrow",
      fullDate: new Date(2025, 7, 12),
      duration: 30,
      type: "in-person",
      status: "confirmed",
      priority: "low",
      fee: 600,
      location: "Clinic Room 1",
      patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesType = filterType === 'all' || appointment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const todaysAppointments = appointments.filter(apt => {
    const today = new Date();
    return new Date(apt.fullDate).toDateString() === today.toDateString();
  });

  const handleAppointmentAction = (action, appointment) => {
    console.log(`${action} action for appointment:`, appointment);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const appointmentStats = [
    { label: "Today's Appointments", value: todaysAppointments.length, color: "blue" },
    { label: "Confirmed", value: appointments.filter(a => a.status === 'confirmed').length, color: "green" },
    { label: "Pending", value: appointments.filter(a => a.status === 'pending').length, color: "yellow" },
    { label: "Completed", value: appointments.filter(a => a.status === 'completed').length, color: "purple" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Appointment Scheduler</h1>
              <p className="text-green-100 text-lg">Manage your daily appointments and consultations</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Calendar className="w-8 h-8 mb-2" />
                <p className="font-bold text-xl">{todaysAppointments.length}</p>
                <p className="text-sm text-green-100">Today's Appointments</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {appointmentStats.map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-green-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <AppointmentCalendar 
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <DashboardCard 
            title="Appointments" 
            icon={Calendar}
            delay={100}
            action={
              <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Appointment</span>
              </button>
            }
          >
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                  >
                    <option value="all">All Types</option>
                    <option value="video">Video Call</option>
                    <option value="audio">Audio Call</option>
                    <option value="chat">Chat</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {filteredAppointments.map((appointment, idx) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onAction={handleAppointmentAction}
                  delay={idx * 50}
                />
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No appointments found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
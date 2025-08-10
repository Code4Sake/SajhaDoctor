import React, { useState } from 'react';
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

import DashboardLayout from './DashboardLayout';

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

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    console.log('Viewing patient:', patient.name);
  };

  const handleAppointmentAction = (action, appointment) => {
    console.log(`${action} appointment for:`, appointment.patientName);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Header props
  const headerProps = {
    doctorName: "Dr. Rajesh Sharma",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
    notificationCount: 5
  };

  // Dashboard content based on active tab
  const renderDashboardContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
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
          </>
        );
      case 'patients':
        return (
          <DashboardCard title="Patient Management" delay={100}>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Management</h3>
              <p className="text-gray-600">Manage your patient records and information here.</p>
            </div>
          </DashboardCard>
        );
      case 'appointments':
        return (
          <DashboardCard title="Appointments" delay={100}>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Appointment Scheduler</h3>
              <p className="text-gray-600">View and manage your appointment schedule.</p>
            </div>
          </DashboardCard>
        );
      case 'consultations':
        return (
          <DashboardCard title="Consultations" delay={100}>
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Consultation Hub</h3>
              <p className="text-gray-600">Conduct video calls and chat consultations.</p>
            </div>
          </DashboardCard>
        );
      case 'prescriptions':
        return (
          <DashboardCard title="Prescriptions" delay={100}>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Prescription Manager</h3>
              <p className="text-gray-600">Create and manage patient prescriptions.</p>
            </div>
          </DashboardCard>
        );
      case 'analytics':
        return (
          <DashboardCard title="Analytics Dashboard" delay={100}>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">View detailed analytics and insights.</p>
            </div>
          </DashboardCard>
        );
      case 'revenue':
        return (
          <DashboardCard title="Revenue Management" delay={100}>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Revenue Tracking</h3>
              <p className="text-gray-600">Track earnings and financial reports.</p>
            </div>
          </DashboardCard>
        );
      case 'settings':
        return (
          <DashboardCard title="Settings" delay={100}>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Account Settings</h3>
              <p className="text-gray-600">Manage your account preferences and settings.</p>
            </div>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      headerProps={headerProps}
    >
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default MainDashboard;
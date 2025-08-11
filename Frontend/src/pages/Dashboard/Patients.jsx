import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  Heart,
  Activity,
  Clock,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Download,
  Upload,
  Users,
  TrendingUp,
  Star,
  CheckCircle2,
  XCircle,
  Menu,
  MessageCircle,
  BarChart3,
  DollarSign,
  Settings
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Sidebar = ({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  currentPage
}) => {
  const location = useLocation();

  const navigationItems = [
    { icon: Calendar, label: "Appointments", key: "appointments", badge: "12", path: "/home/Dashboard/Appointments" },
    { icon: MessageCircle, label: "Consultations", key: "consultations", path: "/home/Dashboard/Consultations" },
    { icon: FileText, label: "Prescriptions", key: "prescriptions", path: "/home/Dashboard/Prescriptions" },
    { icon: BarChart3, label: "Analytics", key: "analytics", path: "/home/Dashboard/Analytics" },
    { icon: DollarSign, label: "Revenue", key: "revenue", path: "/home/Dashboard/Revenue" },
    { icon: Settings, label: "Settings", key: "settings", path: "/home/Dashboard/Settings" }
  ];

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const NavLink = ({ icon: Icon, label, path, isActive, badge }) => (
    <div
      onClick={handleLinkClick}
      className={`relative flex items-center space-x-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group text-sm cursor-pointer ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`} />
      <span className="font-medium">{label}</span>
      {badge && (
        <span className={`absolute right-3 top-2 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ${
          isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
        }`}>
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      )}
    </div>
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
              isActive={item.key === currentPage}
              badge={item.badge}
            />
          ))}
          
          <div className="pt-6 mt-6 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Today's Summary</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Appointments</span>
                  <span className="font-semibold text-blue-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span>New Patients</span>
                  <span className="font-semibold text-green-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue</span>
                  <span className="font-semibold text-purple-600">₹8,500</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
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

// Patient Card Component
const PatientCard = ({ patient, onAction, delay = 0 }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'critical': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white" 
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(patient.status)} rounded-full border-2 border-white`}></div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900">{patient.name}</h4>
            <p className="text-gray-600 text-sm mb-1">{patient.age} years • {patient.gender}</p>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                {patient.priority} priority
              </span>
              <span className="text-xs text-gray-500">ID: {patient.id}</span>
            </div>
          </div>
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
                onClick={() => { onAction('view', patient); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm">View Details</span>
              </button>
              <button 
                onClick={() => { onAction('edit', patient); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Edit Patient</span>
              </button>
              <button 
                onClick={() => { onAction('history', patient); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Medical History</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50/80 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-gray-600">Condition</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{patient.condition}</p>
        </div>
        
        <div className="bg-gray-50/80 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-600">Last Visit</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{patient.lastVisit}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{patient.location}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onAction('call', patient)}
            className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onAction('message', patient)}
            className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onAction('appointment', patient)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Book Visit
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, change, color, trend, delay = 0 }) => {
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
        <div className="flex items-center space-x-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm font-medium opacity-80">{title}</p>
    </div>
  );
};

const PatientsWithSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample patient data
  const patients = [
    {
      id: 'PT001',
      name: "Ramesh Thapa",
      age: 45,
      gender: "Male",
      condition: "Hypertension",
      priority: "high",
      status: "active",
      phone: "+977-9841234567",
      email: "ramesh.thapa@email.com",
      location: "Kathmandu",
      lastVisit: "2 days ago",
      nextAppointment: "Tomorrow 2:30 PM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 'PT002',
      name: "Sita Sharma",
      age: 32,
      gender: "Female",
      condition: "Diabetes Type 2",
      priority: "medium",
      status: "active",
      phone: "+977-9841234568",
      email: "sita.sharma@email.com",
      location: "Lalitpur",
      lastVisit: "1 week ago",
      nextAppointment: "Today 3:15 PM",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332b265?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 'PT003',
      name: "Kumar Rai",
      age: 28,
      gender: "Male",
      condition: "Anxiety Disorder",
      priority: "critical",
      status: "critical",
      phone: "+977-9841234569",
      email: "kumar.rai@email.com",
      location: "Bhaktapur",
      lastVisit: "Yesterday",
      nextAppointment: "Today 4:00 PM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 'PT004',
      name: "Maya Gurung",
      age: 38,
      gender: "Female",
      condition: "Migraine",
      priority: "low",
      status: "active",
      phone: "+977-9841234570",
      email: "maya.gurung@email.com",
      location: "Kathmandu",
      lastVisit: "3 days ago",
      nextAppointment: "Next week",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  // Filter and search patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || patient.priority === filterBy || patient.status === filterBy;
    
    return matchesSearch && matchesFilter;
  });

  const handlePatientAction = (action, patient) => {
    console.log(`${action} action for patient:`, patient.name);
  };

  const patientStats = [
    { icon: Users, title: "Total Patients", value: "248", change: "+12%", color: "blue", trend: "up" },
    { icon: User, title: "New This Month", value: "23", change: "+8%", color: "green", trend: "up" },
    { icon: AlertTriangle, title: "Critical Cases", value: "5", change: "-2%", color: "red", trend: "down" },
    { icon: Activity, title: "Active Cases", value: "186", change: "+5%", color: "purple", trend: "up" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="patients"
        />

        {/* Main content */}
        <div className={`flex-1 p-6 ${!isMobile ? 'ml-6' : ''}`}>
          {/* Mobile header with menu button */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Patients</h1>
              <div className="w-10"></div> {/* Spacer */}
            </div>
          )}

          <div className="space-y-8">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Patient Management</h1>
                    <p className="text-blue-100 text-lg">Manage and monitor your patients' health records</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <Users className="w-8 h-8 mb-2" />
                      <p className="font-bold text-xl">{patients.length}</p>
                      <p className="text-sm text-blue-100">Total Patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {patientStats.map((stat, idx) => (
                <StatsCard
                  key={idx}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  color={stat.color}
                  trend={stat.trend}
                  delay={idx * 100}
                />
              ))}
            </div>

            {/* Search and Filter Section */}
            <DashboardCard 
              title="Patient Directory" 
              icon={Users}
              delay={100}
              action={
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Patient</span>
                </button>
              }
            >
              <div className="mb-6 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search patients by name, ID, or condition..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                    >
                      <option value="all">All Patients</option>
                      <option value="critical">Critical</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="priority">Sort by Priority</option>
                      <option value="lastVisit">Sort by Last Visit</option>
                      <option value="condition">Sort by Condition</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredPatients.length} of {patients.length} patients
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <Upload className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Patients Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPatients.map((patient, idx) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onAction={handlePatientAction}
                    delay={idx * 50}
                  />
                ))}
              </div>

              {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No patients found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsWithSidebar;
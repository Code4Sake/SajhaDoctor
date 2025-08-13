import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  FileText, 
  BarChart3,
  DollarSign, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ 
  isMobile, 
  sidebarOpen,  
  setSidebarOpen,
  navigationItems = [
    { icon: Home, label: "Dashboard", key: "dashboard", path: "/home/Dashboard" },
    { icon: Users, label: "Patients", key: "patients", badge: "5", path: "/home/Dashboard/Patients" },
    { icon: Calendar, label: "Appointments", key: "appointments", badge: "12", path: "/home/Dashboard/Appointments" },
    { icon: MessageCircle, label: "Consultations", key: "consultations", path: "/home/Dashboard/Consultations" },
    { icon: BarChart3, label: "Analytics", key: "analytics", path: "/home/Dashboard/Analytics" },
    { icon: Settings, label: "Settings", key: "settings", path: "/home/Dashboard/Settings" }
  ]
}) => {
  const location = useLocation();
  
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Navigation Link Component
  const NavLink = ({ icon: Icon, label, path, isActive, badge }) => (
    <Link
      to={path}
      onClick={handleLinkClick}
      className={`relative flex items-center space-x-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group text-sm no-underline ${
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
    </Link>
  );

  // Don't render sidebar on desktop if explicitly hidden, but show by default
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
          ? 'fixed left-0 top-0 h-full w-80 bg-white shadow-2xl sidebar-animate' 
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
              path={item.path}
              isActive={location.pathname === item.path} 
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

      <style jsx>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .sidebar-animate { 
          animation: slideInLeft 0.3s ease-out forwards; 
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
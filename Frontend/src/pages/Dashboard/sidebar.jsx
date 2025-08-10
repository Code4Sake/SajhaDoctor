import React from 'react';
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
  activeTab, 
  onTabChange, 
  isMobile, 
  sidebarOpen, 
  setSidebarOpen,
  navigationItems = [
    { icon: Home, label: "Dashboard", key: "dashboard" },
    { icon: Users, label: "Patients", key: "patients", badge: "5" },
    { icon: Calendar, label: "Appointments", key: "appointments", badge: "12" },
    { icon: MessageCircle, label: "Consultations", key: "consultations" },
    { icon: FileText, label: "Prescriptions", key: "prescriptions" },
    { icon: BarChart3, label: "Analytics", key: "analytics" },
    { icon: DollarSign, label: "Revenue", key: "revenue" },
    { icon: Settings, label: "Settings", key: "settings" }
  ]
}) => {
  
  const handleTabChange = (tabKey) => {
    onTabChange(tabKey);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Navigation Button Component
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

  if (!isMobile && !sidebarOpen && isMobile !== undefined) return null;
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
        <nav className="bg-white rounded-3xl shadow-sm p-6 space-y-3 h-fit border border-gray-100">
          <div className="mb-8">  
            <h3 className="text-lg font-bold text-gray-900 mb-2">Doctor Portal</h3>
            <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
          
          {navigationItems.map((item) => (
            <NavButton 
              key={item.key}
              icon={item.icon} 
              label={item.label} 
              tabKey={item.key} 
              isActive={activeTab === item.key} 
              onClick={handleTabChange}
              badge={item.badge}
            />
          ))}
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
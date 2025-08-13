import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Calendar, 
  MessageCircle, 
  Stethoscope, 
  Pill, 
  Activity, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ isMobile, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Find Doctors', path: '/doctors' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: MessageCircle, label: 'Consultations', path: '/consultations' },
    { icon: Stethoscope, label: 'AI Symptom Checker', path: '/symptoms' },
    { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
    { icon: Activity, label: 'Health Records', path: '/records' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const NavButton = ({ icon: Icon, label, path, isActive }) => (
    <button
      onClick={() => handleNavigation(path)}
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

  if (!isMobile) {
    // Desktop: always show sidebar regardless of sidebarOpen
    return (
      <div className="w-72 sticky top-28">
        <nav className="bg-white rounded-3xl shadow-sm p-6 space-y-3 h-fit border border-gray-100">
          <div className="mb-8">  
            <h3 className="text-lg font-bold text-gray-900 mb-2">Navigation</h3>
            <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
          {navigationItems.map((item) => (
            <NavButton 
              key={item.path}
              icon={item.icon} 
              label={item.label} 
              path={item.path}
              isActive={location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/')} 
            />
          ))}
        </nav>
      </div>
    );
  }

  if (isMobile && sidebarOpen) {
    // Mobile sidebar shown only if open
    return (
      <div className="fixed inset-0 z-40">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl sidebar-animate">
          <nav className="bg-white p-6 space-y-3 h-full overflow-auto">
            <div className="mb-8 pt-20">  
              <h3 className="text-lg font-bold text-gray-900 mb-2">Navigation</h3>
              <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
            {navigationItems.map((item) => (
              <NavButton 
                key={item.path}
                icon={item.icon} 
                label={item.label} 
                path={item.path}
                isActive={location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/')} 
              />
            ))}
          </nav>
        </div>

        <style>{`
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
  }

  return null;
};

export default Sidebar;

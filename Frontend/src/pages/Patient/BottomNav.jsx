import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Search, label: 'Find', path: '/doctors' },
    { icon: Calendar, label: 'Appointments', path: '/appointment' },
    { icon: MessageCircle, label: 'Chat', path: '/consultations' },
    { icon: User, label: 'Profile', path: '/settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-2 py-4 z-40 shadow-2xl">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {navigationItems.map((nav) => {
          const isActive = location.pathname === nav.path || (nav.path === '/dashboard' && location.pathname === '/');
          
          return (
            <button
              key={nav.path}
              onClick={() => handleNavigation(nav.path)}
              className={`relative flex flex-col items-center space-y-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <nav.icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-medium truncate">{nav.label}</span>
              {isActive && (
                <div className="absolute -top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
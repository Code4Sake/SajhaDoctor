import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  BarChart3 
} from 'lucide-react';

const MobileNavigation = ({ 
  currentTab, 
  navigationItems = [
    { icon: Home, label: "Dashboard", key: "dashboard", path: "/home/Dashboard" },
    { icon: Users, label: "Patients", key: "patients", badge: "5", path: "/home/Dashboard/Patients" },
    { icon: Calendar, label: "Schedule", key: "appointments", badge: "12", path: "/home/Dashboard/Appointments" },
    { icon: MessageCircle, label: "Chat", key: "consultations", path: "/home/Dashboard/Consultations" },
    { icon: BarChart3, label: "Analytics", key: "analytics", path: "/home/Dashboard/Analytics" }
  ]
}) => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-2 py-4 z-40 shadow-2xl">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {navigationItems.map((nav) => {
          const isActive = location.pathname === nav.path;
          
          return (
            <Link
              key={nav.key}
              to={nav.path}
              className={`relative flex flex-col items-center space-y-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 no-underline ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <nav.icon className="w-5 h-5" />
                {nav.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {nav.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-medium truncate">{nav.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
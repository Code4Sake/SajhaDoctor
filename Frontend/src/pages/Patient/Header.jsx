import React, { useState, useEffect } from 'react';
import { Heart, Bell, Menu, X, User, Settings, Shield, AlertCircle } from 'lucide-react';

const Header = ({ isMobile, sidebarOpen, setSidebarOpen }) => {
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdown && !event.target.closest('.profile-dropdown')) {
        setProfileDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdown]);

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 group"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-200" />
                ) : (
                  <Menu className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  HealthCare
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">Premium Healthcare Experience</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 cursor-pointer">
            {/* Notifications */}
            <div className="relative">
              <div className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown cursor-pointer">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full shadow-lg border-2 border-white hover:border-blue-200 transition-colors cursor-pointer" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </button>
              
              {profileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full shadow-md" 
                      />
                      <div>
                        <p className="font-bold text-gray-900">Ramesh Thapa</p>
                        <p className="text-sm text-gray-600">rohitpoudel020@gmail.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 cursor-pointer">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">View Profile</span>
                    </button>
                    
                    <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 cursor-pointer">
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">Account Settings</span>
                    </button>
                    
                    <button className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 cursor-pointer">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">Privacy & Security</span>
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button className="w-full px-6 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 cursor-pointer">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Heart, Phone, Clock, MapPin, Star, ArrowRight, Shield, Users, Menu, Stethoscope, Calendar, MessageCircle, Home, User, ChevronDown, X, Search, Filter, Video, FileText, CreditCard, Bell, Settings, LogOut, CheckCircle, Activity, Zap, Award, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import FloatingChatbaseChatbot from '../components/FloatingAIChatbot'; // Add this import

const Layout = ({ children, currentPage, isAuthenticated, userType, onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when navigating
  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  // Enhanced Header Component
  const Header = () => (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-md border-b border-gray-100'
    }`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavigate('home')}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Heart className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">NepalCare</h1>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">Healthcare at home</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 font-semibold text-gray-700 hover:text-emerald-600 transition-all duration-300 py-2 cursor-pointer">
                <span>Services</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-3">
                  <button onClick={() => handleNavigate('general-care')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 rounded-xl transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="w-5 h-5 text-emerald-500" />
                      <div>
                        <div className="font-semibold">General Medical Care</div>
                        <div className="text-xs text-gray-500">Common illnesses & checkups</div>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => handleNavigate('mental-health')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 rounded-xl transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">Mental Health</div>
                        <div className="text-xs text-gray-500">Therapy & counseling</div>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => handleNavigate('emergency')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 rounded-xl transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="font-semibold">Emergency Consultation</div>
                        <div className="text-xs text-gray-500">Urgent medical care</div>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => handleNavigate('specialists')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-xl transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-semibold">Specialist Care</div>
                        <div className="text-xs text-gray-500">Expert medical opinions</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => handleNavigate('how-it-works')} className="font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">How It Works</button>
            {isAuthenticated && (
              <button onClick={() => handleNavigate('doctors')} className="font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">Find Doctors</button>
            )}
            <button onClick={() => handleNavigate('about')} className="font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">About Us</button>
            
            <div className="flex items-center space-x-4 ml-8">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Bell className="w-6 h-6 text-gray-600 hover:text-emerald-600 cursor-pointer transition-colors duration-300" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {userType === 'patient' ? 'P' : 'D'}
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-2">
                        <button onClick={() => handleNavigate('profile')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2 cursor-pointer">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button onClick={() => handleNavigate('settings')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2 cursor-pointer">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <hr className="my-2" />
                        <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 cursor-pointer">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                <Link to="/home/Login">
  <button className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-300 cursor-pointer">Sign In</button>
</Link>
<Link to="/home/Register">
  <button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer">
    Sign Up
  </button>
</Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-xl">
            <div className="container mx-auto px-4 py-6 space-y-4">
              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full flex items-center justify-between py-3 text-left font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-300 cursor-pointer"
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isServicesOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <button onClick={() => handleNavigate('general-care')} className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">General Medical Care</button>
                    <button onClick={() => handleNavigate('mental-health')} className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">Mental Health</button>
                    <button onClick={() => handleNavigate('emergency')} className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">Emergency Consultation</button>
                    <button onClick={() => handleNavigate('specialists')} className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">Specialist Care</button>
                  </div>
                )}
              </div>
              <button onClick={() => handleNavigate('how-it-works')} className="block w-full py-3 text-left font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">How It Works</button>
              {isAuthenticated && (
                <button onClick={() => handleNavigate('doctors')} className="block w-full py-3 text-left font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">Find Doctors</button>
              )}
              
              <button onClick={() => handleNavigate('about')} className="block w-full py-3 text-left font-semibold text-gray-700 hover:text-emerald-600 transition-colors duration-300 cursor-pointer">About Us</button>
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link to="/Authpage">
                  <button onClick={() => handleNavigate('login')} className="block w-full py-3 text-left text-emerald-600 font-semibold cursor-pointer">Sign In</button>
                  </Link>
                  <button onClick={() => handleNavigate('register')} className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-xl font-semibold cursor-pointer">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // Bottom Navigation (Mobile Only)
  const BottomNav = () => (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-3 z-40 shadow-2xl">
      <div className="flex justify-around max-w-sm mx-auto">
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
            currentPage === 'home' 
              ? 'text-emerald-500 bg-emerald-50 shadow-lg' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          onClick={() => handleNavigate('doctors')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
            currentPage === 'doctors' 
              ? 'text-emerald-500 bg-emerald-50 shadow-lg' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span className="text-xs font-medium">Doctors</span>
        </button>
        <button
          onClick={() => handleNavigate('appointments')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
            currentPage === 'appointments' 
              ? 'text-emerald-500 bg-emerald-50 shadow-lg' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-xs font-medium">Appointments</span>
        </button>
        <button
          onClick={() => handleNavigate('chat')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
            currentPage === 'chat' 
              ? 'text-emerald-500 bg-emerald-50 shadow-lg' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button
          onClick={() => handleNavigate('profile')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
            currentPage === 'profile' 
              ? 'text-emerald-500 bg-emerald-50 shadow-lg' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );

 return (
  <>
    <Header />
    {children}
    {isAuthenticated && <BottomNav />}
    
    {/* Floating AI Chatbot - Available on all pages */}
    <FloatingChatbaseChatbot />
  </>
);
};

export default Layout;
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Stethoscope, 
  Shield, 
  Star,
  CheckCircle,
  X,
  Heart,
  Brain,
  Clock,
  Award,
  Users
} from 'lucide-react';

const AuthPage = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: '',
    specialization: '',
    licenseNumber: ''
  });
  const [errors, setErrors] = useState({});

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Smooth close animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  // Close on escape key and prevent background scrolling
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scrolling when modal closes
    };
  }, []);

  // Handle clicking outside modal to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (isSignUp) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
      if (userType === 'doctor') {
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Form submitted:', { ...formData, userType, isSignUp });
      handleClose();
    }, 2000);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    console.log('Google authentication initiated');
    setTimeout(() => {
      setIsLoading(false);
      handleClose();
    }, 1500);
  };

  const specializations = [
    'General Medicine', 'Internal Medicine', 'Family Medicine', 'Cardiology', 'Dermatology', 
    'Pediatrics', 'Orthopedics', 'Gynecology & Obstetrics', 'Psychiatry', 'Neurology', 
    'Dentistry', 'ENT (Otolaryngology)', 'Ophthalmology', 'Radiology', 'Anesthesiology',
    'Emergency Medicine', 'Gastroenterology', 'Nephrology', 'Pulmonology', 'Endocrinology',
    'Rheumatology', 'Urology', 'Oncology', 'Pathology', 'Surgery', 'Plastic Surgery',
    'Neurosurgery', 'Cardiac Surgery', 'Infectious Disease', 'Rehabilitation Medicine'
  ];

  const nepaliDistricts = [
    'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 
    'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitwan', 'Dadeldhura', 'Dailekh', 
    'Dang', 'Darchula', 'Dhading', 'Dhankuta', 'Dhanusa', 'Dolakha', 'Dolpa', 
    'Doti', 'Gorkha', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 
    'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu', 
    'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur', 
    'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi East', 
    'Nawalparasi West', 'Nuwakot', 'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 
    'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum East', 
    'Rukum West', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi', 
    'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 
    'Syangja', 'Tanahun', 'Taplejung', 'Terhathum', 'Udayapur'
  ];

  const benefits = [
    { 
      icon: Clock, 
      title: "24/7 Access", 
      desc: "Round-the-clock healthcare support",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      icon: Shield, 
      title: "Secure Platform", 
      desc: "End-to-end encrypted consultations",
      gradient: "from-blue-500 to-indigo-500"
    },
    { 
      icon: Award, 
      title: "Verified Doctors", 
      desc: "NMC licensed medical professionals",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const containerClass = `fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
    isVisible && !isClosing
      ? 'bg-black/60 backdrop-blur-sm' 
      : 'bg-black/0 backdrop-blur-none'
  }`;

  const modalClass = `relative w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 transform ${
    isVisible && !isClosing
      ? 'scale-100 opacity-100 translate-y-0' 
      : 'scale-95 opacity-0 translate-y-8'
  }`;

  const maxHeight = isSignUp && userType === 'doctor' ? 'max-h-[95vh]' : 'max-h-[90vh]';

  return (
    <div className={containerClass} onClick={handleBackdropClick}>
      <div className={`${modalClass} ${maxHeight} overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button - Fixed position */}
        <button
          onClick={handleClose}
          className="fixed top-6 right-6 z-30 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="flex min-h-[600px]">
          
          {/* Left Side - Enhanced Branding */}
          <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 p-12 flex-col justify-between text-white relative overflow-hidden">
            
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/30 to-blue-500/20"></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40"></div>
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`
              }}></div>
            </div>

            <div className="relative z-20">
              {/* Premium Logo */}
              <div className="flex items-center space-x-4 mb-12">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <span className="text-white font-black text-2xl">H</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black">HealthCare<span className="text-emerald-200">Nepal</span></div>
                  <div className="text-emerald-200 text-sm font-medium">Nepal's Premier Virtual Care Platform</div>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                    {isSignUp 
                      ? (userType === 'doctor' 
                          ? 'Join Our Network of Expert Doctors' 
                          : 'Your Health Journey Starts Here')
                      : 'Welcome Back to Better Healthcare'
                    }
                  </h2>
                  <p className="text-emerald-100 text-xl leading-relaxed font-light">
                    {isSignUp 
                      ? 'Experience Nepal\'s most trusted telemedicine platform with AI-powered insights and 24/7 expert care.'
                      : 'Continue your journey toward accessible, quality healthcare across Nepal.'
                    }
                  </p>
                </div>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-default">
                    <div className="flex items-center space-x-3 mb-2">
                      <Users className="w-6 h-6 text-emerald-200" />
                      <div className="text-3xl font-black">500+</div>
                    </div>
                    <div className="text-emerald-200 font-medium">Licensed Doctors</div>
                    <div className="text-emerald-300 text-sm mt-1">All Specializations</div>
                  </div>
                  <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-default">
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle className="w-6 h-6 text-blue-200" />
                      <div className="text-3xl font-black">50M+</div>
                    </div>
                    <div className="text-blue-200 font-medium">Consultations</div>
                    <div className="text-blue-300 text-sm mt-1">Successful Treatments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Benefits - Positioned lower for professional look */}
            <div className="relative z-20 space-y-4 mt-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 group cursor-default">
                    <div className={`w-12 h-12 bg-gradient-to-r ${benefit.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg group-hover:text-emerald-200 transition-colors duration-300">{benefit.title}</div>
                      <div className="text-emerald-200 group-hover:text-white transition-colors duration-300">{benefit.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Enhanced Form */}
          <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">HealthCare<span className="text-emerald-600">Nepal</span></div>
                <div className="text-gray-600 text-sm">Virtual Care Platform</div>
              </div>
            </div>

            {/* Enhanced Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600 text-xl font-light">
                {isSignUp 
                  ? 'Join thousands of users accessing quality healthcare' 
                  : 'Sign in to continue your healthcare journey'
                }
              </p>
            </div>

            {/* User Type Selection for Sign Up */}
            {isSignUp && (
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-800 mb-4 text-center">Choose Your Account Type</label>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setUserType('patient')}
                    className={`relative p-6 rounded-3xl border-3 transition-all duration-300 transform hover:scale-105 cursor-pointer group overflow-hidden ${
                      userType === 'patient' 
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-xl' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:shadow-lg'
                    }`}
                  >
                    <div className="relative z-10">
                      <Heart className={`w-8 h-8 mx-auto mb-3 transition-all duration-300 ${userType === 'patient' ? 'text-emerald-600 scale-110' : 'text-gray-500 group-hover:text-gray-700'}`} />
                      <div className="font-bold text-lg mb-1">Patient</div>
                      <div className="text-sm opacity-80">Seeking quality healthcare</div>
                    </div>
                    {userType === 'patient' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-3xl"></div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('doctor')}
                    className={`relative p-6 rounded-3xl border-3 transition-all duration-300 transform hover:scale-105 cursor-pointer group overflow-hidden ${
                      userType === 'doctor' 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-xl' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:shadow-lg'
                    }`}
                  >
                    <div className="relative z-10">
                      <Stethoscope className={`w-8 h-8 mx-auto mb-3 transition-all duration-300 ${userType === 'doctor' ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-gray-700'}`} />
                      <div className="font-bold text-lg mb-1">Doctor</div>
                      <div className="text-sm opacity-80">Healthcare provider</div>
                    </div>
                    {userType === 'doctor' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl"></div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Premium Google Sign In */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-4 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer"
            >
              {/* Premium Google Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" className="flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold">{isSignUp ? 'Sign up' : 'Continue'} with Google</span>
              {isLoading && <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>}
            </button>

            {/* Enhanced Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t-2 border-gray-200"></div>
              <div className="px-6 text-sm text-gray-500 font-bold uppercase tracking-wider">or continue with email</div>
              <div className="flex-1 border-t-2 border-gray-200"></div>
            </div>

            {/* Enhanced Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Sign Up Fields */}
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                          errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-sm mt-2 font-medium">{errors.fullName}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                            errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                          }`}
                          placeholder="+977 98XXXXXXXX"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-2 font-medium">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer ${
                            errors.location ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                          }`}
                        >
                          <option value="">Select Your District</option>
                          {nepaliDistricts.map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>
                      {errors.location && <p className="text-red-500 text-sm mt-2 font-medium">{errors.location}</p>}
                    </div>
                  </div>

                  {/* Doctor-specific fields */}
                  {userType === 'doctor' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Medical Specialization *</label>
                        <div className="relative">
                          <Brain className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                          <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer ${
                              errors.specialization ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                            }`}
                          >
                            <option value="">Select Your Specialization</option>
                            {specializations.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        </div>
                        {errors.specialization && <p className="text-red-500 text-sm mt-2 font-medium">{errors.specialization}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">NMC License Number *</label>
                        <div className="relative">
                          <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                          <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                              errors.licenseNumber ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                            }`}
                            placeholder="Enter your NMC License Number"
                          />
                        </div>
                        {errors.licenseNumber && <p className="text-red-500 text-sm mt-2 font-medium">{errors.licenseNumber}</p>}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-16 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password}</p>}
              </div>

              {/* Confirm Password for Sign Up */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-16 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                        errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 font-medium">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Terms and Conditions for Sign Up */}
              {isSignUp && (
                <div className="flex items-start space-x-3 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm text-gray-700 font-medium cursor-pointer">
                      I agree to the{' '}
                      <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.terms && <p className="text-red-500 text-sm mt-1 font-medium">{errors.terms}</p>}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 cursor-pointer ${
                  isSignUp && userType === 'doctor'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                }`}
              >
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                {isLoading && (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>

              {/* Switch between Sign In and Sign Up */}
              <div className="text-center pt-6">
                <p className="text-gray-600 font-medium">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrors({});
                      setFormData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        fullName: '',
                        phone: '',
                        location: '',
                        specialization: '',
                        licenseNumber: ''
                      });
                      setTermsAccepted(false);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-colors duration-300 cursor-pointer"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper to show the component
export default function App() {
  const [showAuth, setShowAuth] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {!showAuth && (
        <button
          onClick={() => setShowAuth(true)}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          Open Auth Modal
        </button>
      )}
      
      {showAuth && (
        <AuthPage onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}
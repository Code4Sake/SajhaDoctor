import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Heart,
  Clock,
  Shield,
  Award,
  Users,
  CheckCircle,
  Calendar,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router';
import { authAPI, handleApiError, utils } from '../../utils/api';

const PatientRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: {
      province: '',
      district: '',
      municipality: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: '',
      email: ''
    }
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects for address and emergencyContact
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase, uppercase, and number';
    }
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^(\+977)?[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please provide a valid Nepali phone number';
    }
    
    if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Format phone number
      const formattedData = {
        ...formData,
        phoneNumber: utils.formatNepalPhoneNumber(formData.phoneNumber)
      };

      const result = await authAPI.registerPatient(formattedData);

      if (result.success) {
        setRegistrationSuccess(true);
        console.log('Registration successful:', result.data);
      } else {
        handleApiError(result.error, setErrors);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Redirect to Google OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  const nepaliProvinces = [
    'Province 1', 'Madhesh Province', 'Bagmati Province',
    'Gandaki Province', 'Lumbini Province', 'Karnali Province',
    'Sudurpashchim Province'
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

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
          <p className="text-gray-600 mb-6">
            Please check your email to verify your account before signing in.
          </p>
          <Link
            to="/home/Login"
            className="w-full py-3 px-6 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors inline-block"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/30 to-blue-500/20"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40"></div>
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

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                  Your Health Journey Starts Here
                </h2>
                <p className="text-emerald-100 text-xl leading-relaxed font-light">
                  Join thousands of patients accessing quality healthcare across Nepal through our trusted platform.
                </p>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-6 h-6 text-emerald-200" />
                    <div className="text-3xl font-black">500+</div>
                  </div>
                  <div className="text-emerald-200 font-medium">Licensed Doctors</div>
                </div>
                <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-blue-200" />
                    <div className="text-3xl font-black">50M+</div>
                  </div>
                  <div className="text-blue-200 font-medium">Consultations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="relative z-20 space-y-4">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-center space-x-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{benefit.title}</div>
                    <div className="text-emerald-200">{benefit.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-start max-h-screen overflow-y-auto pt-16 lg:pt-20">
          
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

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Heart className="w-10 h-10 text-emerald-600" />
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900">Patient Registration</h1>
            </div>
            <p className="text-gray-600 text-xl font-light">
              Create your patient account to access quality healthcare
            </p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 font-medium">{errors.general}</p>
            </div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-4 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-300 mb-6 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign up with Google</span>
            {isLoading && <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>}
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <div className="px-6 text-sm text-gray-500 font-bold uppercase tracking-wider">or continue with email</div>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">First Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.firstName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-sm mt-2 font-medium">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Last Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                      errors.lastName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-sm mt-2 font-medium">{errors.lastName}</p>}
              </div>
            </div>

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

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                    errors.phoneNumber ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                  }`}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-2 font-medium">{errors.phoneNumber}</p>}
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Gender</label>
                <div className="relative">
                  <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Address Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Province</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <select
                      name="address.province"
                      value={formData.address.province}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                    >
                      <option value="">Select Province</option>
                      {nepaliProvinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">District</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <select
                      name="address.district"
                      value={formData.address.district}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                    >
                      <option value="">Select District</option>
                      {nepaliDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Municipality/VDC</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    name="address.municipality"
                    value={formData.address.municipality}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                    placeholder="Enter municipality or VDC"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Emergency Contact</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Contact Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                      placeholder="Emergency contact name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Relationship</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <select
                      name="emergencyContact.relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                    >
                      <option value="">Select Relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Emergency Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="tel"
                      name="emergencyContact.phoneNumber"
                      value={formData.emergencyContact.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Emergency Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="email"
                      name="emergencyContact.email"
                      value={formData.emergencyContact.email}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-emerald-500 hover:border-gray-300"
                      placeholder="emergency@email.com"
                    />
                  </div>
                </div>
              </div>
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
                  placeholder="Enter your password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              <span>Create Patient Account</span>
              {isLoading && (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>

            {/* Navigation */}
            <div className="text-center pt-6 space-y-2">
              <p className="text-gray-600 font-medium">
                Are you a healthcare provider?{' '}
                <Link
                  to="/home/DoctorRegister"
                  className="text-emerald-600 underline hover:text-emerald-700 hover:no-underline"
                >
                  Register as Doctor
                </Link>
              </p>
              <p className="text-gray-600 font-medium">
                Already have an account?{' '}
                <Link
                  to="/home/Login"
                  className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-colors duration-300"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
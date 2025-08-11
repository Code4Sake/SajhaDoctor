import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Stethoscope,
  Brain,
  CheckCircle,
  Clock,
  Shield,
  Award,
  Users,
  Calendar,
  Building
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    // User fields
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: '',
    address: {
      province: '',
      district: '',
      municipality: ''
    },
    
    // Doctor specific fields
    licenseNumber: '',
    nmc_registration: '',
    primarySpecialization: '',
    totalExperience: '',
    bio: '',
    languagesSpoken: ['English', 'Nepali'],
    consultationFee: {
      video: 500,
      audio: 300,
      chat: 200,
      inPerson: 800
    },
    availability: {
      monday: { available: false, slots: [] },
      tuesday: { available: false, slots: [] },
      wednesday: { available: false, slots: [] },
      thursday: { available: false, slots: [] },
      friday: { available: false, slots: [] },
      saturday: { available: false, slots: [] },
      sunday: { available: false, slots: [] }
    },
    currentWorkplace: [{
      hospitalName: '',
      position: '',
      isCurrentlyWorking: true
    }]
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: { ...prev.address, [child]: value }
        }));
      } else if (parent === 'consultationFee') {
        setFormData(prev => ({
          ...prev,
          consultationFee: { ...prev.consultationFee, [child]: parseInt(value) || 0 }
        }));
      } else if (parent === 'currentWorkplace') {
        setFormData(prev => ({
          ...prev,
          currentWorkplace: [{ ...prev.currentWorkplace[0], [child]: value }]
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear specific error when user starts typing
    if (errors[name] || errors[name.split('.')[0]]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      delete newErrors[name.split('.')[0]];
      setErrors(newErrors);
    }
  };

  const handleLanguageChange = (language, checked) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: checked 
        ? [...prev.languagesSpoken, language]
        : prev.languagesSpoken.filter(lang => lang !== language)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^(\+977)?[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Nepali phone number';
    }
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!formData.nmc_registration) newErrors.nmc_registration = 'NMC registration number is required';
    if (!formData.primarySpecialization) newErrors.primarySpecialization = 'Primary specialization is required';
    if (!formData.totalExperience) newErrors.totalExperience = 'Total experience is required';
    if (!formData.address.province) newErrors['address.province'] = 'Province is required';
    if (!formData.address.district) newErrors['address.district'] = 'District is required';
    if (!formData.currentWorkplace[0].hospitalName) newErrors['currentWorkplace.hospitalName'] = 'Current workplace is required';
    
    if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const apiData = {
        // User fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: formData.gender || 'not-specified',
        address: formData.address,
        
        // Doctor specific fields
        licenseNumber: formData.licenseNumber,
        nmc_registration: formData.nmc_registration,
        primarySpecialization: formData.primarySpecialization,
        totalExperience: parseInt(formData.totalExperience),
        bio: formData.bio,
        languagesSpoken: formData.languagesSpoken,
        consultationFee: formData.consultationFee,
        availability: formData.availability,
        currentWorkplace: formData.currentWorkplace.filter(w => w.hospitalName)
      };

      console.log('Submitting doctor registration:', apiData);

      // Make API call
      const response = await fetch('/api/auth/signup/doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - redirect to login or dashboard
        console.log('Registration successful:', result);
        alert('Registration successful! Please check your email for verification.');
        navigate('/home/Login');
      } else {
        // Handle API errors
        console.error('Registration failed:', result);
        
        if (result.errors && Array.isArray(result.errors)) {
          const formErrors = {};
          result.errors.forEach(error => {
            const errorMsg = error.toLowerCase();
            if (errorMsg.includes('email')) formErrors.email = error;
            else if (errorMsg.includes('phone')) formErrors.phoneNumber = error;
            else if (errorMsg.includes('license')) formErrors.licenseNumber = error;
            else if (errorMsg.includes('nmc')) formErrors.nmc_registration = error;
            else formErrors.general = error;
          });
          setErrors(formErrors);
        } else {
          setErrors({ general: result.message || 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const specializations = [
    'General Medicine', 'Internal Medicine', 'Family Medicine', 'Cardiology', 'Dermatology', 
    'Pediatrics', 'Orthopedics', 'Gynecology', 'Psychiatry', 'Neurology', 
    'Dentistry', 'ENT', 'Ophthalmology', 'Radiology', 'Anesthesiology',
    'Emergency Medicine', 'Gastroenterology', 'Nephrology', 'Pulmonology', 'Endocrinology',
    'Rheumatology', 'Urology', 'Oncology', 'Pathology', 'Surgery'
  ];

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

  const availableLanguages = ['Nepali', 'English', 'Hindi', 'Maithili', 'Bhojpuri', 'Newari', 'Urdu'];

  const benefits = [
    { 
      icon: Clock, 
      title: "Flexible Hours", 
      desc: "Practice on your own schedule",
      gradient: "from-blue-500 to-indigo-500"
    },
    { 
      icon: Shield, 
      title: "Secure Platform", 
      desc: "HIPAA compliant consultations",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      icon: Award, 
      title: "Verified Network", 
      desc: "Join Nepal's trusted doctors",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/30 to-purple-500/20"></div>
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
                  Join Our Network of Expert Doctors
                </h2>
                <p className="text-emerald-100 text-xl leading-relaxed font-light">
                  Expand your practice and reach patients across Nepal through our trusted telemedicine platform.
                </p>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-6 h-6 text-emerald-200" />
                    <div className="text-3xl font-black">500+</div>
                  </div>
                  <div className="text-emerald-200 font-medium">Active Doctors</div>
                </div>
                <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-200" />
                    <div className="text-3xl font-black">50M+</div>
                  </div>
                  <div className="text-green-200 font-medium">Patient Reach</div>
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
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
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
              <Stethoscope className="w-10 h-10 text-emerald-600" />
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900">Doctor Registration</h1>
            </div>
            <p className="text-gray-600 text-xl font-light">
              Join our network of healthcare professionals
            </p>
          </div>

          {/* General Error Display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Information Section */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
              
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                        errors.firstName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                        errors.lastName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-sm mt-2 font-medium">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                        errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
                </div>

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
                        errors.phoneNumber ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-2 font-medium">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-3">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300 cursor-pointer"
                >
                  <option value="">Select Gender (Optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Address Information</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Province *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <select
                      name="address.province"
                      value={formData.address.province}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer ${
                        errors['address.province'] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Select Province</option>
                      {nepaliProvinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                  {errors['address.province'] && <p className="text-red-500 text-sm mt-2 font-medium">{errors['address.province']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">District *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <select
                      name="address.district"
                      value={formData.address.district}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer ${
                        errors['address.district'] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Select District</option>
                      {nepaliDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  {errors['address.district'] && <p className="text-red-500 text-sm mt-2 font-medium">{errors['address.district']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Municipality</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      name="address.municipality"
                      value={formData.address.municipality}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300"
                      placeholder="Enter municipality"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Professional Information</h3>
              
              {/* License and NMC */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Medical License Number *</label>
                  <div className="relative">
                    <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                        errors.licenseNumber ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                      placeholder="Enter your medical license number"
                    />
                  </div>
                  {errors.licenseNumber && <p className="text-red-500 text-sm mt-2 font-medium">{errors.licenseNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">NMC Registration Number *</label>
                  <div className="relative">
                    <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      name="nmc_registration"
                      value={formData.nmc_registration}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                        errors.nmc_registration ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                      placeholder="Enter your NMC registration number"
                    />
                  </div>
                  {errors.nmc_registration && <p className="text-red-500 text-sm mt-2 font-medium">{errors.nmc_registration}</p>}
                </div>
              </div>

              {/* Specialization and Experience */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Primary Specialization *</label>
                  <div className="relative">
                    <Brain className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <select
                      name="primarySpecialization"
                      value={formData.primarySpecialization}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 appearance-none bg-gray-50 focus:bg-white hover:bg-white cursor-pointer ${
                        errors.primarySpecialization ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Select Your Specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  {errors.primarySpecialization && <p className="text-red-500 text-sm mt-2 font-medium">{errors.primarySpecialization}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Total Experience (Years) *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="number"
                      name="totalExperience"
                      value={formData.totalExperience}
                      onChange={handleInputChange}
                      min="0"
                      max="60"
                      className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                        errors.totalExperience ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  {errors.totalExperience && <p className="text-red-500 text-sm mt-2 font-medium">{errors.totalExperience}</p>}
                </div>
              </div>

              {/* Current Workplace */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-3">Current Workplace *</label>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      name="currentWorkplace.hospitalName"
                      value={formData.currentWorkplace[0].hospitalName}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white ${
                        errors['currentWorkplace.hospitalName'] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                      }`}
                      placeholder="Hospital/Clinic Name"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      name="currentWorkplace.position"
                      value={formData.currentWorkplace[0].position}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-5 border-2 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300"
                      placeholder="Your Position (Optional)"
                    />
                  </div>
                </div>
                {errors['currentWorkplace.hospitalName'] && <p className="text-red-500 text-sm mt-2 font-medium">{errors['currentWorkplace.hospitalName']}</p>}
              </div>

              {/* Languages Spoken */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-3">Languages Spoken</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableLanguages.map(language => (
                    <label key={language} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.languagesSpoken.includes(language)}
                        onChange={(e) => handleLanguageChange(language, e.target.checked)}
                        className="h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Consultation Fees Section */}
            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Consultation Fees (NPR)</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Video Call</label>
                  <input
                    type="number"
                    name="consultationFee.video"
                    value={formData.consultationFee.video}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Audio Call</label>
                  <input
                    type="number"
                    name="consultationFee.audio"
                    value={formData.consultationFee.audio}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Chat</label>
                  <input
                    type="number"
                    name="consultationFee.chat"
                    value={formData.consultationFee.chat}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">In-Person</label>
                  <input
                    type="number"
                    name="consultationFee.inPerson"
                    value={formData.consultationFee.inPerson}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300"
                    placeholder="800"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Professional Bio</h3>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                maxLength="1000"
                className="w-full px-4 py-4 border-2 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-0 bg-gray-50 focus:bg-white hover:bg-white border-gray-200 focus:border-blue-500 hover:border-gray-300 resize-none"
                placeholder="Tell patients about yourself, your experience, and areas of expertise... (Optional, max 1000 characters)"
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {formData.bio.length}/1000 characters
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Security</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
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
                        errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                        errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="terms" className="text-sm text-gray-700 font-medium cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                    Medical Professional Terms
                  </a>,{' '}
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
              <span>{isLoading ? 'Creating Account...' : 'Create Doctor Account'}</span>
              {isLoading && (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>

            {/* Navigation */}
            <div className="text-center pt-6 space-y-2">
              <p className="text-gray-600 font-medium">
                Looking for patient care?{' '}
                <Link 
                    to="/home/PatientRegister" 
                    className="text-emerald-600 underline hover:text-emerald-700 hover:no-underline"
                >   
                  Register as Patient
                </Link>
                <br />

                Already have an account?{' '}
                <Link 
                    to="/home/Login" 
                    className="text-emerald-600 underline hover:text-emerald-700 hover:no-underline"
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

export default DoctorRegister;
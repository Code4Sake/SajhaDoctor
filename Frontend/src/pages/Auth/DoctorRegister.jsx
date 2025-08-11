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
  Users
} from 'lucide-react';
import { Link } from 'react-router';
const DoctorRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.specialization) newErrors.specialization = 'Medical specialization is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'NMC License number is required';
    if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Doctor registration:', formData);
      // Handle successful signup here
    }, 2000);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    console.log('Google doctor registration initiated');
    setTimeout(() => {
      setIsLoading(false);
      // Handle Google signup here
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

         
          

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <div className="px-6 text-sm text-gray-500 font-bold uppercase tracking-wider">or continue with email</div>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            
            {/* Full Name */}
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

            {/* Phone and Location */}
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
                      errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                      errors.location ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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

            {/* Medical Specialization and License */}
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
                      errors.specialization ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                      errors.licenseNumber ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your NMC License Number"
                  />
                </div>
                {errors.licenseNumber && <p className="text-red-500 text-sm mt-2 font-medium">{errors.licenseNumber}</p>}
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
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your password (min 8 characters)"
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
            <Link to="/home/DoctorDashboard">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
              <span>Create Doctor Account</span>
              {isLoading && (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
            </Link>

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
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  Star,
  CheckCircle,
  Heart,
  Clock,
  Award,
  Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, utils, handleApiError } from '../../utils/api';

const SignIn = ({ onLogin, onNavigate }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({}); // Clear any previous errors
    
    try {
      console.log('Attempting login with:', { email: formData.email, password: '[HIDDEN]' });
      
      const result = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        console.log('Login successful:', result.data);
        
        // Extract user data from response
        const { user, token } = result.data.data || result.data;
        
        // Store user data in localStorage (optional, for persistence)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        // Determine user type and redirect accordingly
        const userType = user?.userType || user?.role;
        
        // Call onLogin callback if provided (for parent component)
        if (onLogin) {
          onLogin(userType, user);
        }

        // Navigate based on user type
        if (userType === 'doctor') {
          navigate('/home/DoctorDashboard');
        } else if (userType === 'patient') {
          navigate('/home/PatientDashboard');
        } else {
          // Fallback - could be admin or unknown role
          navigate('/home/Dashboard');
        }

        // Show success message (optional)
        // You could use a toast notification here instead of alert
        console.log(`Welcome back, ${user?.firstName || 'User'}!`);
        
      } else {
        // Handle API errors
        console.error('Login failed:', result.error);
        handleApiError(result.error, setErrors);
      }
    } catch (error) {
      console.error('Network error during login:', error);
      setErrors({ 
        general: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    
    // Redirect to your backend Google OAuth endpoint
    // Your backend should handle the OAuth flow and redirect back to your frontend
    const googleAuthURL = '/api/auth/google';
    window.location.href = googleAuthURL;
    
    // Note: The loading state will be reset when the page redirects
    // You might want to show a loading overlay instead
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="flex min-h-screen">
        
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
                <div className="text-2xl font-black">Sajha<span className="text-emerald-200">Doctor</span></div>
                <div className="text-emerald-200 text-sm font-medium">Virtual Care Platform</div>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                  Welcome Back to Better Healthcare
                </h2>
                <p className="text-emerald-100 text-xl leading-relaxed font-light">
                  Continue your journey toward accessible, quality healthcare across Nepal.
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

          {/* Enhanced Benefits */}
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
              Welcome Back
            </h1>
            <p className="text-gray-600 text-xl font-light">
              Sign in to continue your healthcare journey
            </p>
          </div>

          {/* General Error Display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
              {errors.general}
            </div>
          )}

         

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm underline transition-colors duration-300">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button - REMOVED the Link wrapper that was overriding the form submission */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              {isLoading && (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>

            {/* Switch to Sign Up */}
            <div className="text-center pt-6">
              <p className="text-gray-600 font-medium">
                Don't have an account?{' '}
                <Link to="/home/Register" className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-colors duration-300">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SignIn;
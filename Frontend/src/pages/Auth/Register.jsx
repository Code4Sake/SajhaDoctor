import React from 'react';
import { 
  Heart,
  Stethoscope,
  Users,
  CheckCircle,
  Clock,
  Shield,
  Award,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router';

const UserTypeSelectionPage = () => {
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
    <div className="min-h-screen bg-gray-50">
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
                <div className="text-2xl font-black">HealthCare<span className="text-emerald-200">Nepal</span></div>
                <div className="text-emerald-200 text-sm font-medium">Nepal's Premier Virtual Care Platform</div>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                  Transform Healthcare in Nepal
                </h2>
                <p className="text-emerald-100 text-xl leading-relaxed font-light">
                  Join Nepal's most trusted telemedicine platform connecting patients with expert doctors through cutting-edge technology.
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

        {/* Right Side - User Type Selection */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center items-center p-8 lg:p-16">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">HealthCare<span className="text-emerald-600">Nepal</span></div>
              <div className="text-gray-600 text-sm">Virtual Care Platform</div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-16 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Join Our Platform
            </h1>
            <p className="text-gray-600 text-xl font-light leading-relaxed">
              Choose your account type to get started with Nepal's premier healthcare platform
            </p>
          </div>

         {/* User Type Selection Cards */}
<div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl">
  
  {/* Patient Card */}
  <Link to="/home/PatientRegister" className="group block">
    <div className="relative bg-white rounded-3xl p-10 text-center transition-all duration-500 transform group-hover:-translate-y-4 cursor-pointer overflow-hidden border border-gray-100 hover:border-emerald-200">
      
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-teal-50/0 to-emerald-100/0 group-hover:from-emerald-50/80 group-hover:via-teal-50/60 group-hover:to-emerald-100/40 transition-all duration-500 rounded-3xl"></div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-teal-200/40 to-emerald-200/40 rounded-full blur-xl"></div>
      </div>
      
      {/* Premium Shadow */}
      <div className="absolute inset-0 rounded-3xl shadow-lg group-hover:shadow-[0_25px_50px_rgba(16,185,129,0.15)] transition-all duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Icon */}
        <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-2xl">
          <Heart className="w-14 h-14 text-white group-hover:scale-110 transition-all duration-300" />
        </div>
        
        {/* Title */}
        <h3 className="text-4xl font-black text-gray-900 mb-6 group-hover:text-emerald-700 transition-all duration-300">
          I'm a Patient
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-xl mb-10 leading-relaxed group-hover:text-gray-700 transition-all duration-300 font-medium">
          Access world-class healthcare from verified doctors across Nepal
        </p>
        
        {/* Premium Features */}
        <div className="space-y-5 mb-10">
          <div className="flex items-center justify-center space-x-4 text-gray-600 group-hover:text-emerald-600 transition-all duration-300">
            <div className="w-8 h-8 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-semibold text-lg">24/7 Instant Consultations</span>
          </div>
          <div className="flex items-center justify-center space-x-4 text-gray-600 group-hover:text-emerald-600 transition-all duration-300">
            <div className="w-8 h-8 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-semibold text-lg">Digital Prescription System</span>
          </div>
          <div className="flex items-center justify-center space-x-4 text-gray-600 group-hover:text-emerald-600 transition-all duration-300">
            <div className="w-8 h-8 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-semibold text-lg">Complete Health Records</span>
          </div>
        </div>
        
        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-700 group-hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-3 group-hover:scale-105 shadow-lg group-hover:shadow-xl">
          <span>Register as Patient</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </Link>

  {/* Doctor Card */}
  <Link to="/home/DoctorRegister" className="group block">
    <div className="relative bg-white rounded-3xl p-10 text-center transition-all duration-500 transform group-hover:-translate-y-4 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200">
      
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-blue-100/0 group-hover:from-blue-50/80 group-hover:via-indigo-50/60 group-hover:to-blue-100/40 transition-all duration-500 rounded-3xl"></div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-indigo-200/40 to-blue-200/40 rounded-full blur-xl"></div>
      </div>
      
      {/* Premium Shadow */}
      <div className="absolute inset-0 rounded-3xl shadow-lg group-hover:shadow-[0_25px_50px_rgba(59,130,246,0.15)] transition-all duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Icon */}
        <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-2xl">
          <Stethoscope className="w-14 h-14 text-white group-hover:scale-110 transition-all duration-300" />
        </div>
        
        {/* Title */}
        <h3 className="text-4xl font-black text-gray-900 mb-6 group-hover:text-blue-700 transition-all duration-300">
          I'm a Doctor
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-xl mb-10 leading-relaxed group-hover:text-gray-700 transition-all duration-300 font-medium">
          Join Nepal's premier platform and expand your medical practice
        </p>
        
        {/* Premium Features */}
        <div className="space-y-5 mb-10">
          <div className="flex items-center justify-center space-x-4 text-gray-600 group-hover:text-blue-600 transition-all duration-300">
            <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-lg">Flexible Practice Hours</span>
          </div>
          <div className="flex items-center justify-center space-x-4 text-gray-600 group-hover:text-blue-600 transition-all duration-300">
            <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-lg">Advanced Patient Tools</span>
          </div>
          <div className="flex items-center justify-center space-x-4 text-gray-600 group-hover:text-blue-600 transition-all duration-300">
            <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-lg">Revenue Management</span>
          </div>
        </div>
        
        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-3 group-hover:scale-105 shadow-lg group-hover:shadow-xl">
          <span>Register as Doctor</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </Link>
</div>

          {/* Bottom Link */}
          <div className="text-center mt-16">
            <p className="text-gray-600 font-medium text-lg">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-colors duration-300 cursor-pointer"
              >
                Sign In Here
            </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;
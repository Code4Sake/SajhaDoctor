import React from 'react';
import { Heart, Phone, Clock, MapPin, Star, ArrowRight, Shield, Users, Stethoscope, Calendar, MessageCircle, User, Video, Activity, Zap, Award, Globe, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
const Home = ({ onNavigate, isAuthenticated }) => {
  return (
    <div className="pb-20 lg:pb-8">
      {/* Hero Section - Professional & Refined */}
      <section className="relative bg-gradient-to-br from-slate-200 via-slate-100 to-emerald-100 overflow-hidden min-h-screen">
        {/* Sophisticated Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-100/20 to-transparent rounded-full"></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative container mx-auto px-4 lg:px-6">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:min-h-screen">
            <div className="py-5 lg:py-10 text-center lg:text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 backdrop-blur-sm border border-emerald-200 mb-8">
                <Sparkles className="w-4 h-4 text-emerald-600 mr-2" />
                <span className="text-sm font-semibold text-emerald-800">Nepal's Premier Healthcare Platform</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 mb-8 lg:mb-10 leading-tight">
                Doctor जहाँ पनि,
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  जहिले पनि
                </span>
              </h1>
              
              <p className="text-black text-xl lg:text-2xl leading-relaxed mb-10 lg:mb-12 lg:max-w-2xl font-light">
 Experience the future of healthcare with AI-powered consultations, expert medical care, and instant access to qualified doctors across Nepal.
</p>

              {/* Premium Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-12 lg:mb-14">
                <div className="flex items-center space-x-3 text-slate-700 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200 shadow-lg">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">NMC Verified</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 shadow-lg">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">500+ Doctors</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-200 shadow-lg">
                  <Globe className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">All 77 Districts</span>
                </div>
              </div>

              {/* Professional Registration Options */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start mb-12">
                <Link to="/home/PatientRegister">
                <button
                  className="group flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-5 lg:py-6 px-10 lg:px-14 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 flex items-center justify-center space-x-3 cursor-pointer text-lg backdrop-blur-sm"
                >
                  <User className="w-6 h-6" />
                  <span>Register as Patient</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                </Link>
                <Link to="/home/DoctorRegister">
                <button
                  onClick={() => onNavigate('register')}
                  className="group flex-1 bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-200 hover:border-emerald-300 font-bold py-5 lg:py-6 px-10 lg:px-14 rounded-2xl backdrop-blur-md hover:backdrop-blur-lg transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 flex items-center justify-center space-x-3 cursor-pointer text-lg shadow-xl"
                >
                  <Stethoscope className="w-6 h-6" />
                  <span>Join as Doctor</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                </Link>
              </div>

              {/* Premium Stats */}
              <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
                <div className="group">
                  <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-sm text-slate-600 font-medium">Doctors Online</div>
                </div>
                <div className="group">
                  <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">&lt;2</div>
                  <div className="text-sm text-slate-600 font-medium">Min Wait Time</div>
                </div>
                <div className="group">
                  <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                  <div className="text-sm text-slate-600 font-medium">Uptime</div>
                </div>
              </div>
            </div>

            {/* Professional Hero Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-all duration-700 border border-slate-200">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Stethoscope className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded-full w-32 mb-2"></div>
                        <div className="h-3 bg-slate-100 rounded-full w-24"></div>
                      </div>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-slate-100 rounded-full"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-4/5"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-3/5"></div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="flex-1 h-12 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl border border-slate-100"></div>
                      <div className="w-24 h-12 bg-slate-100 rounded-xl border border-slate-200"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements with glow */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-100 border border-emerald-200 mb-8">
              <Activity className="w-5 h-5 text-emerald-600 mr-3" />
              <span className="text-sm font-bold text-emerald-800 tracking-wide uppercase">Our Services</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
              Comprehensive Healthcare
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                At Your Fingertips
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
              Access quality healthcare services from the comfort of your home with our advanced telemedicine platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <button
              onClick={() => onNavigate('general-care')}
              className="group bg-white p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 text-left border border-slate-200 hover:border-emerald-200 hover:-translate-y-4 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-emerald-100 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Stethoscope className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600" />
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-3">General Care</h3>
                <p className="text-slate-600 leading-relaxed">Expert medical consultations for common health concerns</p>
                <ChevronRight className="w-5 h-5 text-emerald-600 mt-4 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('emergency')}
              className="group bg-white p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 text-left border border-slate-200 hover:border-red-200 hover:-translate-y-4 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-red-100 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Phone className="w-8 h-8 lg:w-10 lg:h-10 text-red-600" />
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-3">Emergency</h3>
                <p className="text-slate-600 leading-relaxed">24/7 urgent medical care when you need it most</p>
                <ChevronRight className="w-5 h-5 text-red-600 mt-4 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('mental-health')}
              className="group bg-white p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 text-left border border-slate-200 hover:border-blue-200 hover:-translate-y-4 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-blue-100 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-3">Mental Health</h3>
                <p className="text-slate-600 leading-relaxed">Professional therapy and counseling services</p>
                <ChevronRight className="w-5 h-5 text-blue-600 mt-4 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('specialists')}
              className="group bg-white p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 text-left border border-slate-200 hover:border-purple-200 hover:-translate-y-4 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-purple-100 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Users className="w-8 h-8 lg:w-10 lg:h-10 text-purple-600" />
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-3">Specialists</h3>
                <p className="text-slate-600 leading-relaxed">Expert opinions from specialized medical professionals</p>
                <ChevronRight className="w-5 h-5 text-purple-600 mt-4 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>
          </div>

          {/* Premium feature highlights */}
          <div className="mt-20 lg:mt-24 grid lg:grid-cols-3 gap-12">
            <div className="text-center lg:text-left group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Instant Access</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Connect with doctors within 2 minutes, 24/7 availability across all specialties</p>
            </div>
            
            <div className="text-center lg:text-left group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Secure & Private</h3>
              <p className="text-slate-600 text-lg leading-relaxed">End-to-end encrypted consultations with HIPAA-compliant data protection</p>
            </div>
            
            <div className="text-center lg:text-left group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Quality Assured</h3>
              <p className="text-slate-600 text-lg leading-relaxed">All doctors are verified by Nepal Medical Council with proven expertise</p>
            </div>
          </div>
        </div>  
      </section>

      {/* Professional How It Works Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Activity className="w-5 h-5 text-emerald-400 mr-3" />
              <span className="text-sm font-bold text-emerald-100 tracking-wide uppercase">How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
              Simple Steps to
              <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Better Health
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white font-black text-3xl">1</span>
                </div>
                <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-black text-white mb-6">Choose Your Doctor</h3>
              <p className="text-slate-300 text-lg leading-relaxed">Browse through our network of qualified doctors and select the one that best fits your needs</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white font-black text-3xl">2</span>
                </div>
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-black text-white mb-6">Book Appointment</h3>
              <p className="text-slate-300 text-lg leading-relaxed">Schedule your consultation at your convenience with flexible timing options</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white font-black text-3xl">3</span>
                </div>
                <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-black text-white mb-6">Get Treatment</h3>
              <p className="text-slate-300 text-lg leading-relaxed">Receive professional medical care through video calls, prescriptions, and follow-ups</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Auth CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

          <div className="relative container mx-auto px-4 lg:px-6">
            <div className="text-center text-white max-w-5xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-10">
                <Sparkles className="w-5 h-5 mr-3" />
                <span className="text-sm font-bold tracking-wide uppercase">Join Our Healthcare Revolution</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-xl lg:text-2xl text-emerald-100 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
                Join <span className="font-bold text-white">50,000+</span> patients already experiencing better healthcare with our premium platform
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto mb-16">
                <button
                  onClick={() => onNavigate('register')}
                  className="group flex-1 bg-white hover:bg-gray-50 text-emerald-600 font-bold py-6 lg:py-7 px-12 lg:px-16 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-white/25 flex items-center justify-center space-x-3 cursor-pointer text-lg"
                >
                  <User className="w-6 h-6" />
                  <span>Register as Patient</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <button
                  onClick={() => onNavigate('register')}
                  className="group flex-1 border-2 border-white/30 hover:border-white text-white hover:bg-white/10 font-bold py-6 lg:py-7 px-12 lg:px-16 rounded-2xl transition-all duration-500 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center space-x-3 cursor-pointer text-lg"
                >
                  <Stethoscope className="w-6 h-6" />
                  <span>Join as Doctor</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-8 text-center max-w-2xl mx-auto">
                <div className="group cursor-pointer">
                  <div className="text-4xl lg:text-5xl font-black mb-3 group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-emerald-200 font-medium">Licensed Doctors</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl lg:text-5xl font-black mb-3 group-hover:scale-110 transition-transform duration-300">50K+</div>
                  <div className="text-emerald-200 font-medium">Happy Patients</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl lg:text-5xl font-black mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-emerald-200 font-medium">Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
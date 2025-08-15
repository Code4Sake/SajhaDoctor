import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Play, Shield, Award, Users, CheckCircle, Star, Activity, Heart, Clock, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { Stethoscope, UserCheck } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [counters, setCounters] = useState({ doctors: 0, consultations: 0, cities: 0 });
  const [isInView, setIsInView] = useState(false);
  const heroRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (isInView) {
      const animateCounter = (target, key, duration = 2000) => {
        const startTime = Date.now();
        const startValue = 0;

        const updateCounter = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

          setCounters(prev => ({ ...prev, [key]: currentValue }));

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };

        requestAnimationFrame(updateCounter);
      };

      const timer = setTimeout(() => {
        animateCounter(500, 'doctors', 2000);
        animateCounter(50, 'consultations', 2500);
        animateCounter(77, 'cities', 1800);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Load professional medical background image
  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop&crop=center&q=80";
    }
  }, [isInView]);

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const trustIndicators = [
    { icon: Shield, text: "Nepal Medical Council Verified", color: "text-emerald-300" },
    { icon: Award, text: "Licensed Doctors", color: "text-blue-300" },
    { icon: Users, text: "50M+ Consultations", color: "text-purple-300" },
    { icon: CheckCircle, text: "99.9% Uptime", color: "text-teal-300" },
    { icon: MapPin, text: "All 77 Districts", color: "text-orange-300" }
  ];

  const consultationModes = [
    { icon: Activity, text: "HD Video Calls", desc: "Face-to-face consultation", gradient: "from-blue-400 to-indigo-500" },
    { icon: Heart, text: "Audio Calls", desc: "Voice-only consultation", gradient: "from-emerald-400 to-teal-500" },
    { icon: Clock, text: "Chat Support", desc: "Text-based consultation", gradient: "from-purple-400 to-pink-500" }
  ];

  const keyFeatures = [
    { icon: Activity, text: "AI Symptom Checker", desc: "Get instant preliminary diagnosis", gradient: "from-emerald-400 to-teal-400" },
    { icon: Heart, text: "Secure Video Consultations", desc: "Face-to-face with doctors", gradient: "from-blue-400 to-indigo-400" },
    { icon: Clock, text: "e‑Prescription Delivery", desc: "Digital prescriptions", gradient: "from-purple-400 to-pink-400" }
  ];

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>

      {/* Top Header Bar - Clean Layout */}
    <div className="absolute top-6 left-0 right-0 z-50 bg-transparent">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 top-5">
          <div className="flex justify-between items-center">
            
           <div className="flex items-center space-x-3 -ml-16">

                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Sajha<span className="text-teal-400">Doctor</span>
                  </h1>
                  <p className="text-xs text-emerald-300 font-medium">Virtual Care Platform</p>
                </div>
              </div>
           
            {/* Center - Trust Indicators */}
            <div className="hidden lg:flex items-center space-x-8">
              {trustIndicators.map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-300"
                >
                  <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
                  <span className="text-sm font-medium">{indicator.text}</span>
                </div>
              ))}
            </div>
<Link to="/home/login" className="hidden lg:flex items-center space-x-3 text-white hover:text-emerald-300 transition-all duration-300">
<div className="flex items-center ml-4">
  <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 hover:from-emerald-500/40 hover:via-teal-500/40 hover:to-blue-500/40 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white/90 hover:text-white px-6 py-3 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/20 cursor-pointer">
    
    {/* Animated background shimmer */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    
    {/* Glowing border effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
    
    {/* Button content */}
    <div className="relative flex items-center space-x-3 z-10">
      <UserCheck className="w-5 h-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 filter group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
      <span className="text-sm font-bold tracking-wide">Sign In</span>
      
      {/* Animated arrow that appears on hover */}
      <div className="w-0 group-hover:w-5 overflow-hidden transition-all duration-300">
        <ArrowRight className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
      </div>
    </div>
    
    {/* Floating pulse dot */}
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {/* Bottom glow line */}
    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-500"></div>
  </button>
</div>
</Link>
          </div>
        </div>
      </div>

      <section
        ref={heroRef}
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14"
        aria-label="SajhaDoctor - Virtual healthcare services across Nepal"
      >
        {/* Professional Background */}
        <div className="absolute inset-0 z-0">
          {/* Enhanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-15"></div>

          {/* Professional Medical Background Image */}
          <div
            className={`w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: imageLoaded
                ? 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop&crop=center&q=80)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)'
            }}
            role="img"
            aria-label="Professional healthcare provider conducting virtual consultation"
          />

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900 animate-pulse z-5"></div>
          )}

          {/* Enhanced Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-20 z-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 50% 10%, rgba(168, 85, 247, 0.2) 0%, transparent 40%)`
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-15">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Enhanced Floating Info Cards - LEFT SIDE */}
        <div className={`absolute top-1/4 left-4 lg:left-8 xl:left-12 z-40 transition-all duration-1000 transform ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`} style={{ transitionDelay: '1400ms' }}>
          <div className="bg-gradient-to-r hidden md:block from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl p-4 lg:p-6 border border-emerald-300/30 shadow-2xl hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-300 animate-float max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></div>
              <div>
                <span className="text-white font-bold text-lg lg:text-xl block leading-tight">
                  {counters.doctors}+ Doctors Online
                </span>
                <span className="text-emerald-200 text-sm lg:text-base block mt-1">
                  All specializations available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Floating Info Cards - RIGHT SIDE */}
        <div className={`absolute top-1/3 right-4 lg:right-8 xl:right-12 z-40 transition-all duration-1000 transform ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`} style={{ transitionDelay: '1600ms' }}>
          <div className="bg-gradient-to-r hidden md:block from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-2xl p-4 lg:p-6 border border-blue-300/30 shadow-2xl hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-300 animate-float-delayed max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
              <div>
                <span className="text-white font-bold text-lg lg:text-xl block leading-tight">
                  Average 2 min wait
                </span>
                <span className="text-blue-200 text-sm lg:text-base block mt-1">
                  Fast response time
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">

            {/* Main Heading - Enhanced */}
            <div className={`mb-8 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`} style={{ transitionDelay: '400ms' }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                <span className="block">Nepal's Most Trusted</span>
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-blue-300 bg-clip-text text-transparent">
                    Digital Healthcare
                  </span>
                </span>
                <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">Platform</span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-200/90 font-light leading-relaxed max-w-4xl mx-auto mb-6">
                Connect with board-certified doctors instantly. Get expert medical consultations, prescriptions, and health advice from the comfort of your home.
              </p>

              <div className="flex items-center justify-center space-x-3 text-emerald-300 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-base font-semibold">24/7 Availability • Instant Connection • Nepal Medical Council Verified</span>
              </div>
            </div>

            {/* Key Features Pills */}
            <div className={`flex flex-wrap justify-center gap-3 lg:gap-4 mb-10 lg:mb-12 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '700ms' }}>
              {keyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${feature.gradient}`}></div>
                  <feature.icon className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-300" />
                  <div className="text-left">
                    <span className="text-white/90 group-hover:text-white font-semibold text-sm transition-colors duration-300 block">{feature.text}</span>
                    <span className="text-white/60 group-hover:text-white/80 text-xs transition-colors duration-300">{feature.desc}</span>
                  </div>
                </div>
              ))}
            </div>


            {/* CTA Buttons - Enhanced */}
           <div className={`flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-12 lg:mb-16 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`} style={{ transitionDelay: '800ms' }}>


              {/* Primary CTA */}
               <Link to="/home">
              <button
                className="group relative bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white px-8 py-4 lg:px-12 lg:py-5 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/30 w-full sm:w-auto flex items-center justify-center space-x-3 cursor-pointer"
                aria-label="Start consultation with SajhaDoctor"
              >
                <Heart className="w-5 h-5" />
                <span className="block text-lg font-semibold">Get Started Now</span>

                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />

                {/* Floating notification */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  Live
                </div>
              </button>
                   </Link>

              {/* Secondary CTA */}
              <button
                onClick={() => scrollToSection('#how-it-works')}
                className="group flex items-center space-x-3 text-white hover:text-emerald-200 transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer"
                aria-label="Watch SajhaDoctor demo"
              >
                <div className="bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group-hover:scale-110 border border-white/20">
                  <Play className="text-white w-5 h-5" fill="currentColor" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-semibold">Watch Demo</span>
                  <span className="block text-sm text-white/70">See how it works</span>
                </div>
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className={`grid grid-cols-3 gap-6 lg:gap-12 max-w-4xl mx-auto mb-8 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`} style={{ transitionDelay: '1000ms' }}>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                  {counters.doctors}+
                </div>
                <div className="text-sm sm:text-base text-gray-300 font-medium">Licensed Doctors</div>
                <div className="text-xs text-emerald-300 mt-1">Online Now</div>
              </div>

              <div className="text-center border-l border-r border-white/20 group">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                  {counters.cities}
                </div>
                <div className="text-sm sm:text-base text-gray-300 font-medium">Districts Covered</div>
                <div className="text-xs text-blue-300 mt-1">All Nepal</div>
              </div>

              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                  {counters.consultations}M+
                </div>
                <div className="text-sm sm:text-base text-gray-300 font-medium">Consultations</div>
                <div className="text-xs text-purple-300 mt-1">Successful</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '1200ms' }}>
            <div className="flex flex-col items-center space-y-2 cursor-pointer group" onClick={() => scrollToSection('#services')}>
              <div className="w-6 h-10 border-2 border-white/50 group-hover:border-white/80 rounded-full flex justify-center transition-colors duration-300">
                <div className="w-1 h-3 bg-white/60 group-hover:bg-white/90 rounded-full mt-2 animate-bounce transition-colors duration-300"></div>
              </div>
              <span className="text-xs text-white/60 group-hover:text-white/90 font-medium transition-colors duration-300">Explore Services</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
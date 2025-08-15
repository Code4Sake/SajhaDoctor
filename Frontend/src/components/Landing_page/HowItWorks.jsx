import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, UserCheck, Video, FileText, ArrowRight, Clock, Star, Shield, Users } from 'lucide-react';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  // Enhanced intersection observer with better threshold management
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Improved auto-advance with pause functionality
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
  }, []);

  const pauseInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isVisible && !isPaused) {
      startInterval();
    } else {
      pauseInterval();
    }

    return () => pauseInterval();
  }, [isVisible, isPaused, startInterval, pauseInterval]);

  const handleStepHover = (index, isHovering) => {
    setIsHovered(isHovering ? index : null);
    setIsPaused(isHovering);
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const steps = [
    {
      number: "01",
      title: "AI-Powered Symptom Analysis",
      subtitle: "Intelligent Health Assessment",
      description: "Our advanced AI analyzes your symptoms with medical-grade precision, providing instant insights and recommendations in both Nepali and English.",
      icon: Search,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      shadowColor: "shadow-emerald-100/50",
      iconColor: "text-emerald-600",
      details: [
        "ML-powered diagnostic assistance",
        "Multi-language symptom processing",
        "Real-time health risk assessment",
        "Check real-time availability"
      ],
      metrics: { accuracy: "94%", languages: "2+", processing: "<30s" }
    },
    {
      number: "02", 
      title: "Expert Doctor Matching",
      subtitle: "Personalized Healthcare Network",
      description: "Connect with Nepal's finest medical professionals through our intelligent matching system that considers your condition, location, and preferences.",
      icon: UserCheck,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      shadowColor: "shadow-blue-100/50",
      iconColor: "text-blue-600",
      details: [
        "Smart specialty-based matching",
        "Verified credentials & ratings",
        "Same-day availability guarantee",
        "Flexible appointment scheduling"
      ],
      metrics: { doctors: "500+", rating: "4.9★", availability: "24/7" }
    },
    {
      number: "03",
      title: "Seamless Digital Consultation",
      subtitle: "Complete Healthcare Experience",
      description: "Experience high-definition consultations with integrated prescription services and doorstep medicine delivery across Nepal.",
      icon: Video,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      shadowColor: "shadow-green-100/50",
      iconColor: "text-green-600",
      details: [
        "4K video consultation quality",
        "Blockchain-secured prescriptions",
        "Same-day medicine delivery",
        "Automated follow-up scheduling"
      ],
      metrics: { quality: "4K HD", delivery: "2-4hrs", satisfaction: "98%" }
    }
  ];

  const stats = [
    { icon: Clock, value: "< 2 min", label: "Average wait time", color: "text-emerald-600" },
    { icon: Star, value: "98.7%", label: "Patient satisfaction", color: "text-blue-600" },
    { icon: Shield, value: "24/7", label: "Always available", color: "text-green-600" },
    { icon: Users, value: "50K+", label: "Happy patients", color: "text-purple-600" }
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-20 lg:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_70%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Section Header */}
        <div className={`text-center mb-20 lg:mb-28 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}>
          
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200/50 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-700 to-blue-700 bg-clip-text text-transparent">
              How It Works
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Healthcare Made
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Simple & Accessible
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience Nepal's most advanced telemedicine platform with AI-powered diagnostics 
            and expert medical care at your fingertips
          </p>
        </div>

        {/* Enhanced Steps Container */}
        <div className="relative mb-20">
          
          {/* Desktop Progress Line */}
          <div className="hidden lg:block absolute top-40 left-0 right-0 h-0.5 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full transition-all duration-1500 ease-out"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
            {/* Progress indicators */}
            {steps.map((_, index) => (
              <div
                key={index}
                className={`absolute w-4 h-4 rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-500 cursor-pointer ${
                  index <= activeStep 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg' 
                    : 'bg-white border-2 border-gray-300'
                }`}
                style={{ left: `${(index / (steps.length - 1)) * 100}%`, marginLeft: '-8px' }}
                onClick={() => handleStepClick(index)}
              ></div>
            ))}
          </div>

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index <= activeStep;
              const isCurrentStep = index === activeStep;
              const isStepHovered = isHovered === index;
              
              return (
                <div
                  key={index}
                  className={`relative transition-all duration-700 transform cursor-pointer ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150 + 300}ms` }}
                  onMouseEnter={() => handleStepHover(index, true)}
                  onMouseLeave={() => handleStepHover(index, false)}
                  onClick={() => handleStepClick(index)}
                >
                  
                  {/* Enhanced Step Card */}
                  <div className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 transition-all duration-500 border-2 hover:scale-105 ${
                    isCurrentStep 
                      ? `${step.borderColor} ${step.shadowColor} shadow-2xl` 
                      : isActive 
                        ? 'border-gray-200 shadow-xl' 
                        : 'border-gray-100 shadow-lg hover:border-gray-200 hover:shadow-xl'
                  }`}>
                    
                    {/* Floating background gradient */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      {/* Icon Container */}
                      <div className="relative mb-8">
                        <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isCurrentStep 
                            ? `bg-gradient-to-br ${step.bgGradient} shadow-lg` 
                            : isActive 
                              ? 'bg-gray-50 group-hover:bg-gradient-to-br group-hover:' + step.bgGradient.split(' ')[0]
                              : 'bg-gray-50'
                        }`}>
                          <IconComponent className={`w-10 h-10 lg:w-12 lg:h-12 transition-all duration-500 ${
                            isCurrentStep || isStepHovered ? step.iconColor : 'text-gray-400 group-hover:' + step.iconColor.split('-')[1] + '-500'
                          }`} />
                        </div>
                        
                        {/* Enhanced Step Number */}
                        <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                          isCurrentStep 
                            ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg` 
                            : isActive 
                              ? 'bg-gray-600 text-white' 
                              : 'bg-gray-200 text-gray-600 group-hover:bg-gradient-to-r group-hover:' + step.gradient.split(' ')[0] + ' group-hover:text-white'
                        }`}>
                          {step.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-6">
                        <div className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                          isCurrentStep ? step.iconColor : 'text-gray-500'
                        }`}>
                          {step.subtitle}
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-light">
                          {step.description}
                        </p>
                      </div>

                      {/* Enhanced Feature List */}
                      <ul className="space-y-3 mb-8">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center text-sm text-gray-600 font-medium">
                            <div className={`w-2 h-2 rounded-full mr-4 transition-all duration-500 ${
                              isCurrentStep ? step.iconColor.replace('text', 'bg') : 'bg-gray-300 group-hover:' + step.iconColor.replace('text', 'bg')
                            }`}></div>
                            <span className="group-hover:text-gray-700 transition-colors duration-300">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Metrics */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        {Object.entries(step.metrics).map(([key, value], idx) => (
                          <div key={idx} className="text-center">
                            <div className={`text-lg font-bold transition-colors duration-300 ${
                              isCurrentStep ? step.iconColor : 'text-gray-700'
                            }`}>
                              {value}
                            </div>
                            <div className="text-xs text-gray-500 capitalize font-medium">
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isActive ? 'bg-white shadow-lg border border-gray-200' : 'bg-gray-100'
                        }`}>
                          <ArrowRight className={`w-5 h-5 transition-colors duration-500 ${
                            isActive ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Connector */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-6">
                      <div className={`w-1 h-12 rounded-full transition-all duration-500 ${
                        isActive ? 'bg-gradient-to-b from-emerald-500 to-blue-500' : 'bg-gray-200'
                      }`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Stats & CTA Section */}
        <div className={`transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`} style={{ transitionDelay: '900ms' }}>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="group text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-gray-200 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors duration-300">
                      <IconComponent className={`w-6 h-6 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced CTA */}
          <div className="text-center">
            <button className="group relative inline-flex items-center bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden">
              
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <span className="relative z-10">Start Your Consultation</span>
              <ArrowRight className="relative z-10 w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            
            <p className="text-gray-500 mt-4 font-light">
              Join <span className="font-semibold text-gray-700">50,000+</span> satisfied patients. 
              No waiting rooms. No hassle. Just premium healthcare.
            </p>
            
            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Secure Platform
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Licensed Doctors
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
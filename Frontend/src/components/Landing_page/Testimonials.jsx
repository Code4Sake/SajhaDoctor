import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Award, TrendingUp, Shield, Clock, Heart, CheckCircle, Play, Pause } from 'lucide-react';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  // Enhanced intersection observer
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

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Enhanced auto-rotate with smooth transitions
  useEffect(() => {
    if (isAutoPlay && isVisible && !isTransitioning) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, isVisible, isTransitioning]);

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      location: "Kathmandu Medical College",
      occupation: "Senior Cardiologist",
      rating: 5,
      text: "SajhaDoctor has revolutionized how I connect with patients across Nepal. The platform's AI-powered diagnostics complement my clinical expertise perfectly. The seamless integration with my practice has improved patient outcomes significantly. This is the future of healthcare in Nepal.",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
      condition: "Cardiac Specialist",
      date: "Active since 2023",
      experience: "15+ years",
      patients: "2,500+",
      specialty: "Interventional Cardiology",
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: "Rajesh Thapa",
      location: "Pokhara Valley, Nepal", 
      occupation: "Tech Entrepreneur",
      rating: 5,
      text: "Living in a remote area, accessing specialized healthcare was nearly impossible. SajhaDoctor connected me with top cardiologists in Kathmandu for my heart condition. The HD video consultations, real-time health monitoring, and instant prescription delivery have been life-saving. Truly world-class service.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
      condition: "Cardiac Monitoring",
      date: "2 months ago",
      experience: "Long-term patient",
      patients: null,
      specialty: "Remote Healthcare",
      verified: true,
      featured: false
    },
    {
      id: 3,
      name: "Dr. Sunita Rai",
      location: "Tribhuvan University Hospital",
      occupation: "Pediatric Emergency Specialist",
      rating: 5,
      text: "The 24/7 emergency consultation feature has been invaluable for critical pediatric cases. Parents from rural areas can now access immediate expert advice during medical emergencies. The platform's diagnostic tools and secure communication channels ensure quality care delivery regardless of location.",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=120&fit=crop&crop=face",
      condition: "Pediatric Emergency",
      date: "Active since 2022",
      experience: "12+ years",
      patients: "5,000+",
      specialty: "Emergency Pediatrics",
      verified: true,
      featured: true
    },
    {
      id: 4,
      name: "Amit Poudel",
      location: "Lalitpur Innovation Hub",
      occupation: "Mental Health Advocate", 
      rating: 5,
      text: "The stigma around mental health in Nepal made it difficult to seek help. SajhaDoctor's private, secure platform connected me with excellent psychiatrists. The anonymous consultation option and comprehensive mental health resources have been transformative for my recovery journey.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
      condition: "Mental Health Support",
      date: "6 months ago",
      experience: "Recovery journey",
      patients: null,
      specialty: "Mental Wellness",
      verified: true,
      featured: false
    },
    {
      id: 5,
      name: "Dr. Maya Gurung",
      location: "Nepal Mental Health Institute",
      occupation: "Clinical Psychologist",
      rating: 5,
      text: "The platform's comprehensive mental health toolkit and secure communication channels have enhanced my practice tremendously. I can now provide therapy sessions to patients across Nepal, breaking geographical barriers. The built-in assessment tools and progress tracking features are exceptional.",
      avatar: "https://images.unsplash.com/photo-1594824475968-d94c5269b8c6?w=120&h=120&fit=crop&crop=face",
      condition: "Psychology Practice",
      date: "Active since 2023",
      experience: "10+ years",
      patients: "1,200+",
      specialty: "Clinical Psychology",
      verified: true,
      featured: true
    }
  ], []);

  const trustIndicators = useMemo(() => [
    {
      icon: Award,
      title: "50M+",
      subtitle: "Consultations Delivered",
      description: "Trusted healthcare platform",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      icon: TrendingUp,
      title: "98.7%",
      subtitle: "Patient Satisfaction",
      description: "Exceptional care quality",
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      icon: Shield,
      title: "24/7",
      subtitle: "Secure Platform",
      description: "HIPAA compliant system",
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-50 to-purple-50"
    }
  ], []);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  }, [testimonials.length, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsAutoPlay(false);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  }, [testimonials.length, isTransitioning]);

  const handleDotClick = useCallback((index) => {
    if (isTransitioning || index === currentTestimonial) return;
    setIsTransitioning(true);
    setIsAutoPlay(false);
    setTimeout(() => {
      setCurrentTestimonial(index);
      setIsTransitioning(false);
    }, 300);
  }, [currentTestimonial, isTransitioning]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay(prev => !prev);
  }, []);

  const currentData = testimonials[currentTestimonial];

  return (
    <section 
      id="testimonials" 
      ref={sectionRef} 
      className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden"
      aria-label="Patient testimonials and reviews"
    >
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full blur-3xl opacity-20" />
      
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Premium Section Header */}
        <div className={`text-center mb-20 lg:mb-28 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold mb-6 shadow-sm border border-blue-200">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Patient Success Stories
            <Heart className="w-4 h-4 ml-2 text-red-500" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Transforming Lives
            <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              Across Nepal
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Real stories from patients and healthcare professionals who trust our platform
          </p>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`} style={{ transitionDelay: '200ms' }}>
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon;
            return (
              <div 
                key={index} 
                className={`group relative text-center p-8 rounded-3xl bg-gradient-to-br ${indicator.bgColor} border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${indicator.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                  
                  <div className={`text-3xl lg:text-4xl font-black text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {indicator.title}
                  </div>
                  
                  <div className="text-sm lg:text-base font-semibold text-gray-700 mb-2">
                    {indicator.subtitle}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {indicator.description}
                  </div>

                  {/* Floating elements */}
                  {hoveredCard === index && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
                      <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Testimonial Carousel */}
        <div className={`relative max-w-6xl mx-auto transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`} style={{ transitionDelay: '400ms' }}>
          
          {/* Main Testimonial Card */}
          <div className={`relative bg-white/90 backdrop-blur-sm rounded-4xl p-8 lg:p-12 shadow-2xl border border-gray-100 overflow-hidden transition-all duration-700 ${
            isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
          }`}>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-teal-50/30" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full blur-3xl" />
            
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote className="w-20 h-20 lg:w-24 lg:h-24 text-blue-600" />
            </div>

            {/* Enhanced Header */}
            <div className="relative z-10 mb-8">
              <div className="flex items-center justify-between mb-6">
                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(currentData.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-bold text-gray-700 bg-yellow-100 px-3 py-1 rounded-full">
                    {currentData.rating}.0
                  </span>
                </div>

                {/* Auto-play Control */}
                <button
                  onClick={toggleAutoPlay}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
                  aria-label={isAutoPlay ? 'Pause auto-play' : 'Resume auto-play'}
                >
                  {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isAutoPlay ? 'Pause' : 'Play'}</span>
                </button>
              </div>

              {/* Featured Badge */}
              {currentData.featured && (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold mb-6">
                  <Award className="w-4 h-4 mr-2" />
                  Featured Story
                </div>
              )}
            </div>

            {/* Enhanced Testimonial Text */}
            <blockquote className="relative z-10 text-xl lg:text-2xl text-gray-800 mb-10 leading-relaxed font-medium">
              <span className="text-4xl text-blue-600 font-bold mr-2">"</span>
              {currentData.text}
              <span className="text-4xl text-blue-600 font-bold ml-1">"</span>
            </blockquote>

            {/* Enhanced Patient/Doctor Info */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              {/* Profile Section */}
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={currentData.avatar}
                    alt={currentData.name}
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover shadow-xl border-4 border-white"
                  />
                  {currentData.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="ml-6">
                  <div className="font-black text-gray-900 text-xl lg:text-2xl mb-1">
                    {currentData.name}
                  </div>
                  <div className="text-gray-700 text-base lg:text-lg font-semibold mb-1">
                    {currentData.occupation}
                  </div>
                  <div className="text-gray-600 text-sm lg:text-base mb-2">
                    {currentData.location}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    {currentData.experience && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {currentData.experience}
                      </span>
                    )}
                    {currentData.patients && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {currentData.patients} patients
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Treatment/Specialty Info */}
              <div className="lg:text-right">
                <div className="inline-flex items-center bg-gradient-to-r from-teal-50 to-blue-50 text-teal-800 px-4 py-2 rounded-full text-sm font-semibold mb-3 border border-teal-200">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-2" />
                  {currentData.condition}
                </div>
                <div className="text-gray-600 text-sm lg:text-base mb-1">
                  {currentData.specialty}
                </div>
                <div className="text-gray-500 text-sm flex items-center justify-end lg:justify-end">
                  <Clock className="w-4 h-4 mr-1" />
                  {currentData.date}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <button
            onClick={handlePrev}
            disabled={isTransitioning}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 lg:-translate-x-8 bg-white/90 backdrop-blur-sm rounded-full p-4 lg:p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 lg:translate-x-8 bg-white/90 backdrop-blur-sm rounded-full p-4 lg:p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </button>
        </div>

        {/* Enhanced Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className={`transition-all duration-500 rounded-full border-2 ${
                index === currentTestimonial 
                  ? 'w-12 h-4 bg-gradient-to-r from-blue-500 to-teal-500 border-blue-300' 
                  : 'w-4 h-4 bg-gray-200 border-gray-300 hover:bg-gray-300 hover:border-gray-400'
              } disabled:opacity-50`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Premium Bottom CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`} style={{ transitionDelay: '600ms' }}>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 lg:p-12 shadow-2xl border border-gray-100 inline-block max-w-2xl mx-auto overflow-hidden">
            
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-teal-50/50" />
            
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">
                Ready to Join Our Success Stories?
              </h3>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                Experience world-class healthcare that thousands of patients and doctors trust across Nepal
              </p>
              
              <div className="space-y-4">
                <button className="group inline-flex items-center bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 hover:from-emerald-700 hover:via-blue-700 hover:to-violet-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50">
                  <span className="relative">
                    Start Your Consultation Now
                    <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                  <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    No waiting lists
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Instant appointments
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Premium care guaranteed
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Join over 50,000+ satisfied patients • HIPAA compliant • ISO 27001 certified • 24/7 support available
          </p>
        </div>
      </div>

      <style jsx>{`
        .rounded-4xl {
          border-radius: 2rem;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
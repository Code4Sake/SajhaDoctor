import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Brain, MapPin, Clock, Shield, Smartphone, ArrowRight, CheckCircle, Star, Lock } from 'lucide-react';

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  const features = [
    {
      icon: MessageCircle,
      title: "Fast Online Consultations",
      description: "Connect with Nepal Medical Council verified doctors within minutes through secure video calls or chat. Available 24/7 for non-emergency consultations with instant booking.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      hoverBg: "group-hover:bg-emerald-100",
      delay: "100ms",
      badge: "Most Popular"
    },
    {
      icon: Brain,
      title: "AI Symptom Checker",
      description: "Get preliminary insights about your symptoms using our advanced AI-powered diagnostic tool. Receive personalized health recommendations before consulting a doctor.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBg: "group-hover:bg-blue-100",
      delay: "300ms",
      badge: "AI Powered"
    },
    {
      icon: MapPin,
      title: "Nationwide Doctor Network",
      description: "Access qualified healthcare providers across all 77 districts of Nepal. Filter by specialty, language (Nepali, English, Hindi), experience, and patient ratings.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      hoverBg: "group-hover:bg-purple-100",
      delay: "500ms",
      badge: "All Nepal"
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock access to healthcare professionals",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Lock,
      title: "Data Privacy Protected",
      description: "Your medical data is encrypted and secure",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Seamless experience across all devices",
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50"
    }
  ];

  const stats = [
    { number: "500+", label: "NMC Licensed Doctors", icon: CheckCircle },
    { number: "50M+", label: "Consultations", icon: Star },
    { number: "99.9%", label: "Uptime", icon: Shield }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className={`text-center mb-16 lg:mb-20 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 text-sm font-semibold mb-6 border border-emerald-200/50">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
            Our Premium Services
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Healthcare Made
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mt-2">
              Simple & Accessible
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the future of healthcare with our comprehensive telemedicine platform designed specifically for Nepal's diverse healthcare needs.
          </p>
        </div>

        {/* Stats Bar */}
        <div className={`grid grid-cols-3 gap-6 lg:gap-12 mb-16 lg:mb-20 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`} style={{ transitionDelay: '200ms' }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full p-3">
                      <IconComponent className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-16 lg:mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: feature.delay }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {feature.badge}
                  </span>
                </div>

                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Icon Container */}
                <div className={`${feature.bgColor} ${feature.hoverBg} rounded-2xl p-4 w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 relative z-10`}>
                  <IconComponent className={`${feature.iconColor} w-8 h-8 lg:w-10 lg:h-10 group-hover:scale-110 transition-transform duration-300`} />
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 relative z-10">
                  {feature.description}
                </p>

                {/* Enhanced CTA Link */}
                <button className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent hover:underline group-hover:translate-x-2 transition-all duration-300 cursor-pointer relative z-10`}>
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Additional Features Bar */}
        <div className={`bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 transition-all duration-700 transform relative overflow-hidden ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`} style={{ transitionDelay: '700ms' }}>
          {/* Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-transparent to-blue-50/50"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-8 lg:mb-12">
              Why Choose Our Platform?
            </h3>
            <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
              {additionalFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center group cursor-default">
                    <div className="flex-shrink-0 mb-4">
                      <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                        <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">{feature.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

       
      </div>

      {/* Floating Elements */}
      <div className="hidden lg:block absolute top-1/4 left-8 animate-float">
        <div className="w-4 h-4 bg-emerald-400 rounded-full opacity-60"></div>
      </div>
      <div className="hidden lg:block absolute top-1/3 right-12 animate-float-delayed">
        <div className="w-6 h-6 bg-blue-400 rounded-full opacity-40"></div>
      </div>
      <div className="hidden lg:block absolute bottom-1/4 left-16 animate-pulse">
        <div className="w-3 h-3 bg-purple-400 rounded-full opacity-50"></div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
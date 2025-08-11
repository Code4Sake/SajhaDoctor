import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Clock,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Globe,
  Users,
  Stethoscope,
  Calendar
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubscription = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate subscription process
    setSubscriptionStatus('loading');
    setTimeout(() => {
      setSubscriptionStatus('success');
      setEmail('');
      setTimeout(() => setSubscriptionStatus(''), 3000);
    }, 1500);
  };

  const companyLinks = [
    { name: 'About Us', href: '#about', description: 'Our story and mission' },
    { name: 'Leadership Team', href: '#team', description: 'Meet our experts' },
    { name: 'Careers', href: '#careers', description: 'Join our team', badge: '12 open' },
    { name: 'Press & Media', href: '#press', description: 'Latest news' },
    { name: 'Investor Relations', href: '#investors', description: 'Financial information' },
    { name: 'Quality Assurance', href: '#quality', description: 'Our standards' }
  ];

  const serviceLinks = [
    { name: 'General Consultation', href: '#general', icon: Stethoscope },
    { name: 'Mental Health', href: '#mental-health', icon: Heart },
    { name: 'Specialist Care', href: '#specialists', icon: Users },
    { name: 'Emergency Consultation', href: '#emergency', icon: AlertTriangle, urgent: true },
    { name: 'Prescription Delivery', href: '#pharmacy', icon: Calendar },
    { name: 'Health Records', href: '#records', icon: Shield }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy', updated: true },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Medical Disclaimer', href: '#disclaimer' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'HIPAA Compliance', href: '#hipaa', certified: true },
    { name: 'Data Security', href: '#security', certified: true }
  ];

  const helpLinks = [
    { name: 'Help Center', href: '#help', description: '24/7 support available' },
    { name: 'Contact Support', href: '#support', description: 'Get assistance' },
    { name: 'Technical Issues', href: '#tech-support', description: 'Troubleshooting' },
    { name: 'Billing Questions', href: '#billing', description: 'Payment help' },
    { name: 'Insurance Claims', href: '#insurance', description: 'Claims support' },
    { name: 'Doctor Portal', href: '#doctor-portal', description: 'Healthcare providers', external: true }
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      href: 'https://facebook.com/healthcarenepal', 
      color: 'hover:text-blue-600',
      followers: '25.4K'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: 'https://twitter.com/healthcarenepal', 
      color: 'hover:text-blue-400',
      followers: '18.2K'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: 'https://instagram.com/healthcarenepal', 
      color: 'hover:text-pink-600',
      followers: '32.1K'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://linkedin.com/company/healthcarenepal', 
      color: 'hover:text-blue-700',
      followers: '12.8K'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      href: 'https://youtube.com/healthcarenepal', 
      color: 'hover:text-red-600',
      followers: '45.6K'
    }
  ];

  const certifications = [
    { 
      icon: Shield, 
      text: 'HIPAA Compliant', 
      description: 'Healthcare data protection',
      verified: true 
    },
    { 
      icon: Award, 
      text: 'ISO 27001 Certified', 
      description: 'Information security management',
      verified: true 
    },
    { 
      icon: Clock, 
      text: 'SOC 2 Type II', 
      description: 'Operational security controls',
      verified: true 
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Happy Patients' },
    { number: '1,200+', label: 'Healthcare Providers' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-blue-600 py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-teal-100 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0 lg:max-w-xl">
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Stay Updated with Health Tips
              </h3>
              <p className="text-teal-100 text-lg lg:text-xl leading-relaxed">
                Get expert health advice, wellness tips, and platform updates delivered to your inbox. 
                Join our community of health-conscious individuals.
              </p>
            </div>
            
            <div className="lg:ml-8 lg:flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <form onSubmit={handleSubscription} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      required
                      disabled={subscriptionStatus === 'loading'}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={subscriptionStatus === 'loading'}
                    >
                      {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                  {subscriptionStatus === 'success' && (
                    <div className="mt-4 text-center lg:text-left">
                      <p className="text-white font-medium flex items-center justify-center lg:justify-start">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Successfully subscribed!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-16">
            
            {/* Company Info - Spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">
                    HealthCare<span className="text-teal-400">Nepal</span>
                  </h3>
                  <p className="text-gray-400 font-medium">Virtual Care Platform</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8 text-lg max-w-sm">
                Revolutionizing healthcare accessibility across Nepal through innovative telemedicine solutions. 
                Quality care, anytime, anywhere.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                    <Phone className="w-5 h-5 text-teal-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">+977-1-4444-5555</span>
                    <p className="text-sm text-gray-500">24/7 Emergency Hotline</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                    <Mail className="w-5 h-5 text-teal-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">support@healthcarenepal.com</span>
                    <p className="text-sm text-gray-500">General inquiries</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                    <MapPin className="w-5 h-5 text-teal-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      Kathmandu Medical Plaza<br />
                      Bagmati Province, Nepal
                    </span>
                    <p className="text-sm text-gray-500">Headquarters</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <div key={social.name} className="relative group">
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setHoveredSocial(social.name)}
                        onMouseLeave={() => setHoveredSocial(null)}
                        className={`w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 ${social.color} hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </a>
                      
                      {hoveredSocial === social.name && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
                          <div className="text-center">
                            <div className="font-semibold">{social.name}</div>
                            <div className="text-gray-400 text-xs">{social.followers} followers</div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-8 flex items-center">
                <div className="w-1 h-6 bg-teal-500 rounded-full mr-3"></div>
                Company
              </h4>
              <ul className="space-y-4">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="group flex items-start space-x-2 text-gray-400 hover:text-teal-400 transition-all duration-300 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 mt-0.5 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{link.name}</span>
                          {link.badge && (
                            <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-8 flex items-center">
                <div className="w-1 h-6 bg-teal-500 rounded-full mr-3"></div>
                Services
              </h4>
              <ul className="space-y-4">
                {serviceLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.name}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className={`group flex items-center space-x-3 text-gray-400 hover:text-teal-400 transition-all duration-300 cursor-pointer ${link.urgent ? 'hover:text-red-400' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${link.urgent ? 'bg-red-900/30 group-hover:bg-red-600' : 'bg-gray-800 group-hover:bg-teal-600'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        {link.urgent && (
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-8 flex items-center">
                <div className="w-1 h-6 bg-teal-500 rounded-full mr-3"></div>
                Legal & Privacy
              </h4>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="group flex items-center justify-between w-full text-gray-400 hover:text-teal-400 transition-all duration-300 cursor-pointer"
                    >
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        {link.updated && (
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        )}
                        {link.certified && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help & Contact Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-8 flex items-center">
                <div className="w-1 h-6 bg-teal-500 rounded-full mr-3"></div>
                Support
              </h4>
              <ul className="space-y-4">
                {helpLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="group flex items-start space-x-2 text-gray-400 hover:text-teal-400 transition-all duration-300 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 mt-0.5 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{link.name}</span>
                          {link.external && (
                            <ExternalLink className="w-3 h-3" />
                          )}
                        </div>
                        {link.description && (
                          <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Certifications & Emergency Notice */}
          <div className="border-t border-gray-800 mt-16 pt-12">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
              
              {/* Certifications */}
              <div className="flex flex-wrap items-center gap-8">
                {certifications.map((cert, index) => {
                  const IconComponent = cert.icon;
                  return (
                    <div key={index} className="group cursor-pointer">
                      <div className="flex items-center space-x-3 p-4 rounded-2xl border border-gray-800 hover:border-teal-600 transition-all duration-300 hover:bg-gray-800/50">
                        <div className="w-10 h-10 bg-teal-600/20 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                          <IconComponent className="w-5 h-5 text-teal-400 group-hover:text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-300 group-hover:text-white">
                              {cert.text}
                            </span>
                            {cert.verified && (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{cert.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Emergency Notice */}
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-2xl px-6 py-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div>
                    <p className="text-red-300 font-bold text-sm">
                      Medical Emergency?
                    </p>
                    <p className="text-red-200 text-xs">
                      Call 102 or visit nearest hospital immediately
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-gray-950/80 backdrop-blur-sm border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400">
              <p className="font-medium">© 2025 HealthCareNepal. All rights reserved.</p>
              <p className="text-xs mt-1">Registered Healthcare Technology Provider • License #HTN-2025-001</p>
            </div>

            {/* Additional Legal Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {['Accessibility', 'Site Map', 'Medical Licensing'].map((link) => (
                <button 
                  key={link}
                  className="text-gray-400 hover:text-teal-400 transition-colors font-medium cursor-pointer hover:underline"
                >
                  {link}
                </button>
              ))}
            </div>

            {/* Language & Region Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <select className="bg-gray-800 text-gray-300 rounded-xl px-4 py-2 border border-gray-700 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer">
                  <option value="en-NP">🇳🇵 English (Nepal)</option>
                  <option value="ne-NP">🇳🇵 नेपाली (नेपाल)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </footer>
  );
};

export default Footer;
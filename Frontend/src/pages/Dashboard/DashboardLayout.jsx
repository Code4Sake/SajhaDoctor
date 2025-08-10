import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';

const DashboardLayout = ({ 
  children, 
  activeTab, 
  onTabChange,
  headerProps = {},
  sidebarProps = {},
  mobileNavProps = {},
  showMobileNav = true 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle tab change with loading state
  const handleTabChange = (tabKey) => {
    if (tabKey === activeTab) return;
    
    setIsLoading(true);
    setTimeout(() => {
      onTabChange(tabKey);
      setIsLoading(false);
      setSidebarOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Global Styles */}
      <style jsx global>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .sidebar-animate { animation: slideInLeft 0.3s ease-out forwards; }
        .mobile-nav-safe { padding-bottom: 5rem; }
      `}</style>

      {/* Header */}
      <Header 
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        {...headerProps}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            {...sidebarProps}
          />

          {/* Main Content */}
          <div className={`flex-1 space-y-8 ${isMobile ? 'mobile-nav-safe' : ''}`}>
            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-center mt-4 font-semibold text-gray-700">Loading...</p>
                </div>
              </div>
            )}

            {/* Content passed as children */}
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && showMobileNav && (
        <MobileNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          {...mobileNavProps}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
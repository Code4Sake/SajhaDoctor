import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorsList from './pages/Doctor/DoctorsList';
import Footer from './components/Landing_page/Footer';
import FloatingAIChatbot from './components/FloatingAIChatbot.jsx';
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('patient');

  // Navigation function with authentication check
  const navigateTo = (page) => {
    const protectedPages = ['doctors', 'appointments', 'chat', 'profile', 'emergency'];
    
    if (protectedPages.includes(page) && !isAuthenticated) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  // Authentication functions
  const handleLogin = (type = 'patient') => {
    setIsAuthenticated(true);
    setUserType(type);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType('patient');
    setCurrentPage('home');
  };

  // Render current page
  const renderPage = () => {
    switch(currentPage) {
      case 'login': 
        return <Login onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'register': 
        return <Register onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'doctors': 
        return <DoctorsList onNavigate={navigateTo} />;
      case 'appointments': 
        return <AppointmentsList onNavigate={navigateTo} />;
      case 'chat': 
        return <ChatRoom onNavigate={navigateTo} />;
      case 'profile': 
        return <PatientProfile onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'emergency': 
        return <EmergencyConsultation onNavigate={navigateTo} />;
      default: 
        return <Home onNavigate={navigateTo} isAuthenticated={isAuthenticated} />;
    }
  };

  return (
    <AuthProvider value={{ isAuthenticated, userType, handleLogin, handleLogout }}>
      <div className="min-h-screen bg-gray-50">
        <Layout 
          currentPage={currentPage}
          isAuthenticated={isAuthenticated}
          userType={userType}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        >
          <main className="transition-all duration-300">
            {renderPage()}
          </main>
        </Layout>
        <Footer />
        <FloatingAIChatbot />  {/* ADD THIS LINE */}
      </div>
    </AuthProvider>
  );
};

export default App;
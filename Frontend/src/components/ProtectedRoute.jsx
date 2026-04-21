import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../pages/Auth/AuthContext';
import { motion } from 'framer-motion';

/**
 * ProtectedRoute — Guards dashboard routes
 * - If not authenticated → redirect to login
 * - If authenticated but wrong role → redirect to correct dashboard
 * - Shows loading spinner while auth state is resolving
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, userType, loading } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--s50)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: 'var(--blue-600)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-semibold" style={{ color: 'var(--s400)' }}>Loading...</p>
      </div>
    );
  }

  // Not authenticated → go to login (save attempted URL for redirect-back)
  if (!user) {
    return <Navigate to="/home/Login" state={{ from: location.pathname }} replace />;
  }

  // Role mismatch — doctor trying to access patient dashboard or vice versa
  if (requiredRole && userType !== requiredRole) {
    const correctPath = userType === 'doctor' ? '/doctor' : '/dashboard';
    return <Navigate to={correctPath} replace />;
  }

  return children;
}

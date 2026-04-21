import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
          style={{ background: 'var(--s50)', fontFamily: "'Inter', system-ui, sans-serif" }}>

          <motion.div className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-8"
            style={{ background: '#FEF2F2', border: '1px solid #FEE2E2' }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
            <AlertOctagon size={36} style={{ color: '#EF4444' }} strokeWidth={1.5} />
          </motion.div>

          <motion.div className="text-center max-w-md"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h1 className="text-[1.75rem] font-extrabold mb-3"
              style={{ color: '#0F172A', letterSpacing: '-0.04em' }}>
              Something went wrong
            </h1>
            <p className="text-[0.95rem] mb-8 leading-relaxed" style={{ color: '#64748B' }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-left mb-8 p-4 rounded-xl text-[0.8rem] font-mono overflow-auto max-h-40"
                style={{ background: '#1E293B', color: '#F87171' }}>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <motion.button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[0.9rem] font-bold text-white"
                style={{ background: '#2563EB', boxShadow: '0 4px 16px -4px rgba(37,99,235,0.3)' }}
                whileHover={{ scale: 1.04, boxShadow: '0 12px 32px -8px rgba(37,99,235,0.4)' }}
                whileTap={{ scale: 0.97 }}>
                <RefreshCw size={18} /> Refresh Page
              </motion.button>
              <motion.button
                onClick={() => { window.location.href = '/'; }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[0.9rem] font-bold"
                style={{ background: 'white', color: '#334155', border: '2px solid #E2E8F0' }}
                whileHover={{ scale: 1.04, borderColor: '#2563EB', color: '#2563EB' }}
                whileTap={{ scale: 0.97 }}>
                <Home size={18} /> Go Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: 'var(--s50)' }}>

      {/* Subtle radial bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.03), transparent 65%)' }} />

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <Link to="/" className="flex items-center gap-3">
          <motion.div className="w-11 h-11 rounded-[13px] flex items-center justify-center"
            style={{ background: 'var(--blue-600)' }}
            whileHover={{ scale: 1.1, rotate: -5 }}>
            <span className="text-white font-black text-xl">S</span>
          </motion.div>
          <span className="text-[1.4rem] font-extrabold tracking-[-0.03em]" style={{ color: 'var(--navy-800)' }}>
            Sajha<span style={{ color: 'var(--blue-600)' }}>Doctor</span>
          </span>
        </Link>
      </motion.div>

      {/* 404 Content */}
      <motion.div className="text-center max-w-lg relative z-10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

        <motion.div className="w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-8"
          style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)' }}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}>
          <AlertTriangle size={36} style={{ color: 'var(--blue-600)' }} strokeWidth={1.5} />
        </motion.div>

        <motion.p className="text-[5rem] font-extrabold leading-none mb-2"
          style={{ color: 'var(--blue-600)', letterSpacing: '-0.06em' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
          404
        </motion.p>

        <h1 className="text-[1.75rem] font-extrabold mb-3"
          style={{ color: 'var(--navy-800)', letterSpacing: '-0.04em' }}>
          Page Not Found
        </h1>

        <p className="text-[1rem] mb-10 leading-relaxed" style={{ color: 'var(--s500)' }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <motion.button className="btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Home size={18} /> Go Home
            </motion.button>
          </Link>
          <motion.button className="btn-secondary" onClick={() => window.history.back()}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <ArrowLeft size={18} /> Go Back
          </motion.button>
        </div>
      </motion.div>

      {/* Security footer */}
      <motion.div className="mt-16 flex items-center gap-2 text-[0.8rem]"
        style={{ color: 'var(--s400)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Search size={14} />
        <span>If you believe this is an error, contact support</span>
      </motion.div>
    </div>
  );
}

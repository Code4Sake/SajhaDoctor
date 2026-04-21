import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Stethoscope, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const cards = [
  {
    to: '/home/PatientRegister',
    icon: Heart,
    title: "I'm a Patient",
    desc: 'Access quality healthcare from verified doctors across Nepal.',
    features: ['24/7 Instant Consultations', 'Digital Prescriptions', 'Complete Health Records'],
  },
  {
    to: '/home/DoctorRegister',
    icon: Stethoscope,
    title: "I'm a Doctor",
    desc: "Expand your practice and reach patients across all 77 districts.",
    features: ['Flexible Practice Hours', 'Patient Management Tools', 'Revenue Dashboard'],
  },
];

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: 'var(--s50)' }}>
      <div className="w-full max-w-3xl mb-8">
        <Link to="/" className="flex items-center gap-2 text-[0.85rem] font-bold transition-all hover:text-blue-600 hover:gap-3" style={{ color: 'var(--s400)' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <Link to="/" className="flex items-center gap-3 mb-10">
        <motion.div className="w-11 h-11 rounded-[13px] flex items-center justify-center"
          style={{ background: 'var(--blue-600)' }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
          <span className="text-white font-black text-xl">S</span>
        </motion.div>
        <span className="text-[1.4rem] font-extrabold tracking-[-0.03em]" style={{ color: 'var(--navy-800)' }}>
          Sajha<span style={{ color: 'var(--blue-600)' }}>Doctor</span>
        </span>
      </Link>

      <div className="text-center mb-12 max-w-lg">
        <motion.h1 className="text-[2.25rem] font-extrabold mb-3"
          style={{ color: 'var(--navy-800)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          Join Our Platform
        </motion.h1>
        <motion.p className="text-[1.05rem]" style={{ color: 'var(--s500)' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          Choose your account type to get started
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link key={i} to={c.to}>
              <motion.div
                className="relative bg-white rounded-[24px] p-8 text-center cursor-pointer overflow-hidden group"
                style={{ border: '2px solid var(--s200)' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -10, borderColor: 'var(--blue-200)', boxShadow: '0 28px 64px -16px rgba(37,99,235,0.12)' }}>
                <motion.div className="w-20 h-20 mx-auto mb-6 rounded-[20px] flex items-center justify-center"
                  style={{ background: 'var(--blue-50)' }}
                  whileHover={{ scale: 1.12, rotate: -6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                  <Icon size={36} style={{ color: 'var(--blue-600)' }} strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-[1.5rem] font-extrabold mb-2" style={{ color: 'var(--navy-800)', letterSpacing: '-0.03em' }}>{c.title}</h3>
                <p className="text-[0.9rem] mb-6 leading-relaxed" style={{ color: 'var(--s500)' }}>{c.desc}</p>
                <div className="space-y-2.5 mb-7">
                  {c.features.map(f => (
                    <div key={f} className="flex items-center justify-center gap-2 text-[0.85rem] font-medium" style={{ color: 'var(--s600)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--blue-600)' }} />{f}
                    </div>
                  ))}
                </div>
                <motion.div className="btn-primary w-full justify-center"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Register <ArrowRight size={18} />
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <motion.p className="text-center mt-10 text-[0.9rem]" style={{ color: 'var(--s500)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        Already have an account?{' '}
        <Link to="/home/Login" className="font-bold transition-colors hover:text-blue-800" style={{ color: 'var(--blue-600)' }}>Sign In</Link>
      </motion.p>
    </div>
  );
}
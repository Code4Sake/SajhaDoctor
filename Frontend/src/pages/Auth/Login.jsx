import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

const Input = ({ icon: Icon, error, label, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label className="block text-[0.8rem] font-bold mb-2" style={{ color: 'var(--s700)' }}>{label}</label>}
      <motion.div className="relative" animate={{ scale: focused ? 1.01 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors duration-300"
          style={{ color: focused ? 'var(--blue-600)' : error ? '#EF4444' : 'var(--s400)' }} />
        <input {...props}
          className="w-full pl-12 pr-4 py-4 rounded-[14px] text-[0.95rem] font-medium outline-none transition-all duration-300"
          style={{ background: focused ? 'white' : 'var(--s50)', border: `2px solid ${error ? '#FCA5A5' : focused ? 'var(--blue-500)' : 'var(--s200)'}`, color: 'var(--navy-800)',
            boxShadow: focused ? '0 0 0 4px rgba(37,99,235,0.06), 0 4px 12px rgba(37,99,235,0.04)' : 'none' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      </motion.div>
      <AnimatePresence>
        {error && <motion.p className="text-[0.75rem] font-medium mt-1.5" style={{ color: '#EF4444' }}
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.p>}
      </AnimatePresence>
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); if (errors[name] || errors.general) setErrors(p => ({ ...p, [name]: '', general: '' })); };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Invalid email';
    if (!form.password) err.password = 'Password is required';
    setErrors(err); return !Object.keys(err).length;
  };

  const { login: firebaseLogin, profile } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from;

  const submit = async (e) => {
    e.preventDefault(); if (!validate()) return;
    setLoading(true); setErrors({});
    try {
      const result = await firebaseLogin(form.email, form.password);
      if (result.success) {
        // If we have a saved redirect path (from ProtectedRoute), go there
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else {
          // Otherwise determine dashboard from user type
          const { doc: firestoreDoc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../../firebase');
          const snap = await getDoc(firestoreDoc(db, 'users', result.user.uid));
          const type = snap.exists() ? snap.data().userType : 'patient';
          navigate(type === 'doctor' ? '/doctor' : '/dashboard', { replace: true });
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) { setErrors({ general: 'Network error. Please try again.' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden" style={{ background: 'var(--s50)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.04), transparent 70%)' }} />

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/" className="flex items-center gap-3">
          <motion.div className="w-11 h-11 rounded-[13px] flex items-center justify-center"
            style={{ background: 'var(--blue-600)' }}
            whileHover={{ scale: 1.1, rotate: -5 }}><span className="text-white font-black text-xl">S</span></motion.div>
          <span className="text-[1.4rem] font-extrabold tracking-[-0.03em]" style={{ color: 'var(--navy-800)' }}>
            Sajha<span style={{ color: 'var(--blue-600)' }}>Doctor</span>
          </span>
        </Link>
      </motion.div>

      <motion.div className="w-full max-w-[440px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-[24px] p-8 md:p-10" style={{ background: 'white', boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 12px 40px -8px rgba(15,23,42,0.06)', border: '1px solid var(--s100)' }}>

          <div className="text-center mb-7">
            <h1 className="text-[1.75rem] font-extrabold mb-1.5" style={{ color: 'var(--navy-800)', letterSpacing: '-0.04em' }}>Welcome Back</h1>
            <p className="text-[0.9rem]" style={{ color: 'var(--s500)' }}>Sign in to your SajhaDoctor account</p>
          </div>

          <AnimatePresence>
            {errors.general && (
              <motion.div className="mb-5 p-4 rounded-[14px] text-[0.85rem] font-medium"
                style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626' }}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors.general}</motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={submit} className="space-y-4">
            <Input icon={Mail} type="email" name="email" value={form.email} onChange={set} placeholder="Email address" label="Email" error={errors.email} autoComplete="email" />
            <div className="relative">
              <Input icon={Lock} type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={set} placeholder="Password" label="Password" error={errors.password} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-[38px] p-1 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--s400)' }}>
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right"><a href="#" className="text-[0.85rem] font-bold hover:text-blue-800 transition-colors" style={{ color: 'var(--blue-600)' }}>Forgot password?</a></div>

            <motion.button type="submit" disabled={loading} className="btn-primary w-full"
              style={{ padding: '16px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1, marginTop: '4px' }}
              whileHover={{ scale: 1.02, boxShadow: '0 12px 32px -8px rgba(37,99,235,0.35)' }}
              whileTap={{ scale: 0.97 }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <>Sign In <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-[0.9rem]" style={{ color: 'var(--s500)' }}>
            Don't have an account?{' '}
            <Link to="/home/PatientRegister" className="font-bold transition-colors hover:text-blue-800" style={{ color: 'var(--blue-600)' }}>Sign Up</Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-[0.8rem]" style={{ color: 'var(--s400)' }}>
            <Shield size={14} /><span>256-bit SSL · HIPAA aligned</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
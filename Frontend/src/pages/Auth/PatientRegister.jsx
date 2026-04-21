import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Heart, Clock, Shield,
  CheckCircle, Calendar, UserCheck, ArrowRight, ArrowLeft, ChevronDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from './AuthContext';

// Inline phone formatter (previously from api.js)
const utils = {
  formatNepalPhoneNumber: (phone) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('977')) return '+' + digits;
    if (digits.startsWith('0')) return '+977' + digits.slice(1);
    return '+977' + digits;
  },
};

/* ═══ Animated Input ═══ */
const Input = ({ icon: Icon, error, label, required, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      {label && <label className="block text-[0.78rem] font-bold mb-1.5" style={{ color: 'var(--s700)' }}>{label}{required && ' *'}</label>}
      <motion.div className="relative" animate={{ scale: focused ? 1.008 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] transition-colors duration-300"
          style={{ color: focused ? 'var(--blue-600)' : error ? '#EF4444' : 'var(--s400)' }} />
        <input {...props}
          className="w-full pl-10 pr-4 py-3.5 rounded-[12px] text-[0.9rem] font-medium outline-none transition-all duration-300"
          style={{ background: focused ? 'white' : 'var(--s50)', border: `2px solid ${error ? '#FCA5A5' : focused ? 'var(--blue-500)' : 'var(--s200)'}`,
            color: 'var(--navy-800)', boxShadow: focused ? '0 0 0 4px rgba(37,99,235,0.06)' : 'none' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      </motion.div>
      <AnimatePresence>
        {error && <motion.p className="text-[0.72rem] font-medium mt-1" style={{ color: '#EF4444' }}
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.p>}
      </AnimatePresence>
    </motion.div>
  );
};

const Select = ({ icon: Icon, label, children, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label className="block text-[0.78rem] font-bold mb-1.5" style={{ color: 'var(--s700)' }}>{label}</label>}
      <motion.div className="relative" animate={{ scale: focused ? 1.008 : 1 }}>
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px]" style={{ color: focused ? 'var(--blue-600)' : 'var(--s400)' }} />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--s400)' }} />
        <select {...props}
          className="w-full pl-10 pr-9 py-3.5 rounded-[12px] text-[0.9rem] font-medium outline-none appearance-none cursor-pointer transition-all duration-300"
          style={{ background: focused ? 'white' : 'var(--s50)', border: `2px solid ${focused ? 'var(--blue-500)' : 'var(--s200)'}`, color: 'var(--navy-800)' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>{children}</select>
      </motion.div>
    </div>
  );
};

/* ═══ Steps ═══ */
const Steps = ({ current }) => (
  <div className="flex items-center gap-2 mb-6">
    {['Personal Info', 'Address & Emergency', 'Security'].map((s, i) => (
      <React.Fragment key={s}>
        <motion.div className="flex items-center gap-1.5"
          animate={{ scale: i === current ? 1.05 : 1 }}>
          <motion.div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.7rem] font-bold"
            animate={{ background: i <= current ? 'var(--blue-600)' : 'var(--s100)', color: i <= current ? 'white' : 'var(--s400)' }}>
            {i < current ? '✓' : i + 1}
          </motion.div>
          <span className="text-[0.7rem] font-bold hidden sm:inline" style={{ color: i <= current ? 'var(--navy-800)' : 'var(--s400)' }}>{s}</span>
        </motion.div>
        {i < 2 && <motion.div className="flex-1 h-[2px] rounded-full" animate={{ background: i < current ? 'var(--blue-600)' : 'var(--s200)' }} />}
      </React.Fragment>
    ))}
  </div>
);

const slideVariants = {
  enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
};

const PatientRegister = () => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', dateOfBirth: '', gender: '',
    address: { province: '', district: '', municipality: '' },
    emergencyContact: { name: '', relationship: '', phoneNumber: '', email: '' }
  });
  const [errors, setErrors] = useState({});

  const set = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) { const [p, c] = name.split('.'); setForm(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } })); }
    else setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const err = {};
    if (step === 0) {
      if (!form.firstName) err.firstName = 'Required'; if (!form.lastName) err.lastName = 'Required';
      if (!form.email) err.email = 'Required'; else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Invalid';
      if (!form.phoneNumber) err.phoneNumber = 'Required';
    }
    if (step === 2) {
      if (!form.password) err.password = 'Required'; else if (form.password.length < 6) err.password = 'Min 6 chars';
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) err.password = 'Need upper, lower & number';
      if (form.password !== form.confirmPassword) err.confirmPassword = "Don't match";
      if (!termsOk) err.terms = 'Required';
    }
    setErrors(err); return !Object.keys(err).length;
  };

  const next = () => { if (validate()) { setDir(1); setStep(s => Math.min(s + 1, 2)); } };
  const prev = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)); };

  const navigate = useNavigate();
  const { registerPatient: firebaseRegister } = useAuth();

  const removeUndefined = (obj) => { const r = {}; for (const [k, v] of Object.entries(obj)) { if (v !== undefined && v !== null && v !== '') { if (typeof v === 'object' && !Array.isArray(v)) { const c = removeUndefined(v); if (Object.keys(c).length) r[k] = c; } else r[k] = v; } } return r; };

  const submit = async (e) => {
    e.preventDefault(); if (!validate()) return;
    setLoading(true); setErrors({});
    try {
      const data = removeUndefined({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim().toLowerCase(), password: form.password,
        phoneNumber: utils.formatNepalPhoneNumber(form.phoneNumber), dateOfBirth: form.dateOfBirth || undefined, gender: form.gender || undefined,
        address: { province: form.address.province, district: form.address.district, municipality: form.address.municipality },
        emergencyContact: { name: form.emergencyContact.name, relationship: form.emergencyContact.relationship,
          phoneNumber: form.emergencyContact.phoneNumber ? utils.formatNepalPhoneNumber(form.emergencyContact.phoneNumber) : undefined, email: form.emergencyContact.email }
      });
      const result = await firebaseRegister(data);
      if (result.success) setSuccess(true);
      else setErrors({ general: result.error });
    } catch (error) { setErrors({ general: 'Network error. Please try again.' }); }
    finally { setLoading(false); }
  };

  const provinces = ['Province 1','Madhesh Province','Bagmati Province','Gandaki Province','Lumbini Province','Karnali Province','Sudurpashchim Province'];
  const districts = ['Achham','Arghakhanchi','Baglung','Baitadi','Bajhang','Bajura','Banke','Bara','Bardiya','Bhaktapur','Bhojpur','Chitwan','Dadeldhura','Dailekh','Dang','Darchula','Dhading','Dhankuta','Dhanusa','Dolakha','Dolpa','Doti','Gorkha','Gulmi','Humla','Ilam','Jajarkot','Jhapa','Jumla','Kailali','Kalikot','Kanchanpur','Kapilvastu','Kaski','Kathmandu','Kavrepalanchok','Khotang','Lalitpur','Lamjung','Mahottari','Makwanpur','Manang','Morang','Mugu','Mustang','Myagdi','Nawalparasi East','Nawalparasi West','Nuwakot','Okhaldhunga','Palpa','Panchthar','Parbat','Parsa','Pyuthan','Ramechhap','Rasuwa','Rautahat','Rolpa','Rukum East','Rukum West','Rupandehi','Salyan','Sankhuwasabha','Saptari','Sarlahi','Sindhuli','Sindhupalchok','Siraha','Solukhumbu','Sunsari','Surkhet','Syangja','Tanahun','Taplejung','Terhathum','Udayapur'];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--s50)' }}>
        <motion.div className="max-w-md w-full rounded-[24px] p-10 text-center"
          style={{ background: 'white', boxShadow: '0 24px 64px -16px rgba(15,23,42,0.1)', border: '1px solid var(--s100)' }}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--blue-50)' }}
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }}>
            <CheckCircle size={28} style={{ color: 'var(--blue-600)' }} />
          </motion.div>
          <h2 className="text-[1.5rem] font-extrabold mb-3" style={{ color: 'var(--navy-800)' }}>Registration Successful!</h2>
          <p className="text-[0.9rem] mb-6" style={{ color: 'var(--s500)' }}>Check your email to verify your account.</p>
          <Link to="/home/Login"><motion.button className="btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Go to Sign In <ArrowRight size={18} /></motion.button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 relative overflow-hidden" style={{ background: 'var(--s50)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.04), transparent 70%)' }} />

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/" className="flex items-center gap-3">
          <motion.div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'var(--blue-600)' }}
            whileHover={{ scale: 1.1, rotate: -5 }}><span className="text-white font-black text-lg">S</span></motion.div>
          <span className="text-[1.25rem] font-extrabold tracking-[-0.03em]" style={{ color: 'var(--navy-800)' }}>
            Sajha<span style={{ color: 'var(--blue-600)' }}>Doctor</span></span>
        </Link>
      </motion.div>

      <motion.div className="w-full max-w-[540px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-[24px] p-7 md:p-9" style={{ background: 'white', boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 12px 40px -8px rgba(15,23,42,0.06)', border: '1px solid var(--s100)' }}>

          <div className="flex items-center gap-2.5 mb-1">
            <Heart size={20} style={{ color: 'var(--blue-600)' }} />
            <h1 className="text-[1.4rem] font-extrabold" style={{ color: 'var(--navy-800)', letterSpacing: '-0.03em' }}>Patient Registration</h1>
          </div>
          <p className="text-[0.85rem] mb-5" style={{ color: 'var(--s500)' }}>Create your account in 3 easy steps</p>

          <AnimatePresence>
            {errors.general && (
              <motion.div className="mb-4 p-3 rounded-[12px] text-[0.82rem] font-medium"
                style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{errors.general}</motion.div>
            )}
          </AnimatePresence>

          <Steps current={step} />

          <form onSubmit={submit}>
            <AnimatePresence mode="wait" custom={dir}>
              {step === 0 && (
                <motion.div key="s0" className="space-y-3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}>
                  <div className="grid grid-cols-2 gap-3">
                    <Input icon={User} name="firstName" value={form.firstName} onChange={set} placeholder="First name" label="First Name" required error={errors.firstName} />
                    <Input icon={User} name="lastName" value={form.lastName} onChange={set} placeholder="Last name" label="Last Name" required error={errors.lastName} />
                  </div>
                  <Input icon={Mail} type="email" name="email" value={form.email} onChange={set} placeholder="Email" label="Email" required error={errors.email} />
                  <Input icon={Phone} type="tel" name="phoneNumber" value={form.phoneNumber} onChange={set} placeholder="+977 98XXXXXXXX" label="Phone" required error={errors.phoneNumber} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input icon={Calendar} type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={set} label="Date of Birth" />
                    <Select icon={UserCheck} name="gender" value={form.gender} onChange={set} label="Gender">
                      <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                    </Select>
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s1" className="space-y-3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <p className="text-[0.8rem] font-bold" style={{ color: 'var(--navy-800)' }}>Address</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Select icon={MapPin} name="address.province" value={form.address.province} onChange={set} label="Province">
                      <option value="">Select</option>{provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                    <Select icon={MapPin} name="address.district" value={form.address.district} onChange={set} label="District">
                      <option value="">Select</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </Select>
                  </div>
                  <Input icon={MapPin} name="address.municipality" value={form.address.municipality} onChange={set} placeholder="Municipality / VDC" label="Municipality" />
                  <p className="text-[0.8rem] font-bold pt-1" style={{ color: 'var(--navy-800)' }}>Emergency Contact</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input icon={User} name="emergencyContact.name" value={form.emergencyContact.name} onChange={set} placeholder="Name" label="Contact Name" />
                    <Select icon={User} name="emergencyContact.relationship" value={form.emergencyContact.relationship} onChange={set} label="Relationship">
                      <option value="">Select</option>{['Spouse','Parent','Child','Sibling','Friend','Other'].map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input icon={Phone} name="emergencyContact.phoneNumber" value={form.emergencyContact.phoneNumber} onChange={set} placeholder="Phone" label="Phone" />
                    <Input icon={Mail} name="emergencyContact.email" value={form.emergencyContact.email} onChange={set} placeholder="Email" label="Email" />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" className="space-y-3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <div className="relative">
                    <Input icon={Lock} type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={set} placeholder="Min 6 chars, upper+lower+number" label="Password" required error={errors.password} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-9 p-1 rounded-lg hover:bg-gray-100" style={{ color: 'var(--s400)' }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <div className="relative">
                    <Input icon={Lock} type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={set} placeholder="Re-enter" label="Confirm Password" required error={errors.confirmPassword} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-9 p-1 rounded-lg hover:bg-gray-100" style={{ color: 'var(--s400)' }}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <motion.label className="flex items-start gap-3 p-3.5 rounded-[12px] cursor-pointer transition-all hover:border-blue-200"
                    style={{ background: 'var(--s50)', border: `2px solid ${errors.terms ? '#FCA5A5' : 'var(--s200)'}` }}>
                    <input type="checkbox" checked={termsOk} onChange={e => setTermsOk(e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-blue-600" />
                    <span className="text-[0.8rem]" style={{ color: 'var(--s600)' }}>
                      I agree to the <a href="#" className="font-bold" style={{ color: 'var(--blue-600)' }}>Terms</a> and <a href="#" className="font-bold" style={{ color: 'var(--blue-600)' }}>Privacy Policy</a>
                    </span>
                  </motion.label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-6 gap-3">
              {step > 0 ? (
                <motion.button type="button" onClick={prev} className="btn-secondary" style={{ padding: '11px 22px', fontSize: '0.88rem' }}
                  whileHover={{ scale: 1.03, x: -3 }} whileTap={{ scale: 0.97 }}><ArrowLeft size={16} /> Back</motion.button>
              ) : <div />}
              {step < 2 ? (
                <motion.button type="button" onClick={next} className="btn-primary" style={{ padding: '11px 26px', fontSize: '0.88rem' }}
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 24px -6px rgba(37,99,235,0.3)' }} whileTap={{ scale: 0.97 }}>Next <ArrowRight size={16} /></motion.button>
              ) : (
                <motion.button type="submit" disabled={loading} className="btn-primary" style={{ padding: '11px 26px', fontSize: '0.88rem', opacity: loading ? 0.7 : 1 }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
                </motion.button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center mt-5 space-y-1.5">
          <p className="text-[0.85rem]" style={{ color: 'var(--s500)' }}>Are you a doctor? <Link to="/home/DoctorRegister" className="font-bold hover:text-blue-800 transition-colors" style={{ color: 'var(--blue-600)' }}>Register here</Link></p>
          <p className="text-[0.85rem]" style={{ color: 'var(--s500)' }}>Already have an account? <Link to="/home/Login" className="font-bold hover:text-blue-800 transition-colors" style={{ color: 'var(--blue-600)' }}>Sign In</Link></p>
          <div className="flex items-center justify-center gap-2 text-[0.75rem] pt-1" style={{ color: 'var(--s400)' }}><Shield size={13} /><span>256-bit SSL · HIPAA aligned</span></div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientRegister;
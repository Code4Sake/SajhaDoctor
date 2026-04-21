import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useAuth } from '../Auth/AuthContext';
import { getDoctorDashboard, toggleDoctorOnline } from '../../utils/firestoreAPI';
import {
  Calendar, Users, DollarSign, Star, Power, Clock, ArrowRight, Video,
  Phone, Stethoscope, TrendingUp, Activity, CheckCircle, ChevronRight
} from 'lucide-react';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

function AnimatedCount({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = parseInt(value) || 0;
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
}

export default function DoctorHome() {
  const { user, profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(profile?.isOnline || false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getDoctorDashboard(user.uid).then(res => {
        if (res.success) {
          setData(res.data);
          setIsOnline(res.data.doctor?.isOnline || false);
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleToggle = async () => {
    setToggling(true);
    const res = await toggleDoctorOnline(user.uid);
    if (res.success) setIsOnline(res.data.isOnline);
    setToggling(false);
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();
  const firstName = profile?.firstName || 'Doctor';
  const stats = data?.stats || {};
  const appointments = data?.appointments || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: 'var(--blue-600)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 max-w-6xl mx-auto">

      {/* ═══ GREETING + ONLINE TOGGLE ═══ */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--navy-800)', letterSpacing: '-0.03em' }}>
            {greeting}, <span style={{ color: 'var(--blue-600)' }}>Dr. {firstName}</span>
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--s400)', fontWeight: 500 }}>
            {isOnline ? 'You are accepting consultations' : 'You are currently offline'}
          </p>
        </div>
        <motion.button
          onClick={handleToggle}
          disabled={toggling}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold transition-all self-start"
          style={{
            background: isOnline ? 'var(--green-bg)' : 'var(--s100)',
            color: isOnline ? 'var(--green)' : 'var(--s500)',
            border: `2px solid ${isOnline ? 'var(--green)' : 'var(--s200)'}`,
          }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          <Power size={18} />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
          <div className="w-10 h-5 rounded-full relative transition-colors"
            style={{ background: isOnline ? 'var(--green)' : 'var(--s300)' }}>
            <motion.div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
              animate={{ left: isOnline ? '22px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          </div>
        </motion.button>
      </motion.div>

      {/* ═══ STAT CARDS ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "Today's Appointments", value: stats.todayAppointments || 0, icon: Calendar, gradient: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' },
          { label: 'Total Patients',       value: stats.totalPatients || 0,      icon: Users,    gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)' },
          { label: 'Total Earnings',       value: `Rs.${stats.totalEarnings || 0}`, icon: DollarSign, gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', isString: true },
          { label: 'Rating',              value: stats.averageRating || 0,       icon: Star,     gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
        ].map(s => (
          <motion.div key={s.label} variants={fadeUp}
            className="relative overflow-hidden rounded-2xl p-4 lg:p-5 cursor-default group"
            style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
            whileHover={{ y: -4, boxShadow: '0 20px 48px -12px rgba(15,23,42,0.1)' }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: s.gradient }} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center" style={{ background: s.gradient }}>
                <s.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold" style={{ color: 'var(--navy-800)', letterSpacing: '-0.03em' }}>
                  {s.isString ? s.value : <AnimatedCount value={s.value} />}
                </p>
                <p className="text-xs font-semibold" style={{ color: 'var(--s400)' }}>{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-extrabold tracking-tight mb-4" style={{ color: 'var(--navy-800)' }}>Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Calendar,  label: 'Appointments', to: '/doctor/appointments', color: 'var(--blue-600)', bg: 'var(--blue-50)' },
            { icon: Users,     label: 'Patients',     to: '/doctor/patients',     color: '#22C55E', bg: '#DCFCE7' },
            { icon: TrendingUp,label: 'Analytics',     to: '/doctor/analytics',    color: '#8B5CF6', bg: '#F5F3FF' },
            { icon: Stethoscope, label: 'Prescriptions', to: '/doctor/prescriptions', color: '#F59E0B', bg: '#FFF7ED' },
          ].map(a => (
            <Link key={a.label} to={a.to}>
              <motion.div className="rounded-2xl p-4 group cursor-pointer"
                style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px -12px rgba(15,23,42,0.1)' }} whileTap={{ scale: 0.97 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: a.bg }}>
                  <a.icon size={18} style={{ color: a.color }} />
                </div>
                <p className="font-bold text-sm" style={{ color: 'var(--navy-800)' }}>{a.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ═══ UPCOMING APPOINTMENTS ═══ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--navy-800)' }}>Upcoming Appointments</h3>
          <Link to="/doctor/appointments" className="text-sm font-bold flex items-center gap-1" style={{ color: 'var(--blue-600)' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {appointments.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
            <Calendar size={36} style={{ color: 'var(--s300)' }} className="mx-auto mb-3" />
            <p className="font-bold" style={{ color: 'var(--s500)' }}>No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 4).map((apt, i) => (
              <motion.div key={apt.id || i}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
                whileHover={{ y: -2, boxShadow: '0 8px 24px -8px rgba(15,23,42,0.06)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
                  {apt.type === 'video' ? <Video size={18} className="text-white" /> : <Stethoscope size={18} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: 'var(--navy-800)' }}>{apt.patientName || 'Patient'}</p>
                  <p className="text-xs" style={{ color: 'var(--s400)' }}>{apt.date} · {apt.time} · {apt.reason || 'Consultation'}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    background: apt.status === 'confirmed' ? 'var(--green-bg)' : '#FFF7ED',
                    color: apt.status === 'confirmed' ? 'var(--green)' : '#F59E0B',
                  }}>
                  {apt.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

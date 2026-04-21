import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useAuth } from '../Auth/AuthContext';
import { getPatientDashboard } from '../../utils/firestoreAPI';
import {
  Calendar, Search, FileText, Heart, Video, Phone,
  MessageCircle, Clock, TrendingUp, Activity, ArrowRight,
  CheckCircle, Star, Stethoscope, Zap, ChevronRight
} from 'lucide-react';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

function AnimatedCount({ value, suffix = '' }) {
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
  return <>{count}{suffix}</>;
}

export default function PatientHome() {
  const { user, profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getPatientDashboard(user.uid).then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
      });
    }
  }, [user]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const firstName = profile?.firstName || user?.displayName?.split(' ')[0] || 'there';

  const quickActions = [
    { icon: Search,    label: 'Find a Doctor',      desc: 'Browse specialists',      to: '/dashboard/find-doctors', color: '--blue-600',  bg: '--blue-50' },
    { icon: Calendar,  label: 'Book Appointment',    desc: 'Schedule a visit',         to: '/dashboard/find-doctors', color: '--green',     bg: '--green-bg' },
    { icon: FileText,  label: 'Prescriptions',       desc: 'View your medicines',      to: '/dashboard/prescriptions', color: '#8B5CF6',   bg: '#F5F3FF' },
    { icon: Heart,     label: 'Health Records',      desc: 'Medical history',          to: '/dashboard/health',       color: '#EC4899',    bg: '#FDF2F8' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: 'var(--blue-600)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const stats = data?.stats || {};
  const upcomingAppointments = data?.upcomingAppointments || [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 max-w-6xl mx-auto">

      {/* ═══ GREETING ═══ */}
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--navy-800)', letterSpacing: '-0.03em' }}>
          {greeting}, <span style={{ color: 'var(--blue-600)' }}>{firstName}</span>
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--s400)', fontWeight: 500 }}>
          Here's what's happening with your health today.
        </p>
      </motion.div>

      {/* ═══ STAT CARDS ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: 'Total Visits', value: stats.totalConsultations || 0, icon: Activity,   gradient: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' },
          { label: 'Upcoming',     value: stats.upcomingCount || 0,      icon: Calendar,   gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)' },
          { label: 'Health Score',  value: profile?.healthScore || '—',   icon: TrendingUp, gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
          { label: 'Active Rx',    value: 0,                             icon: FileText,   gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="relative overflow-hidden rounded-2xl p-4 lg:p-5 cursor-default group"
            style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
            whileHover={{ y: -4, boxShadow: '0 20px 48px -12px rgba(15,23,42,0.1)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: s.gradient }} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center"
                style={{ background: s.gradient }}>
                <s.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold" style={{ color: 'var(--navy-800)', letterSpacing: '-0.03em' }}>
                  {typeof s.value === 'number' ? <AnimatedCount value={s.value} /> : s.value}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {quickActions.map((a, i) => (
            <Link key={a.label} to={a.to}>
              <motion.div
                className="relative overflow-hidden rounded-2xl p-4 lg:p-5 cursor-pointer group"
                style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
                whileHover={{ y: -6, boxShadow: '0 24px 56px -16px rgba(15,23,42,0.12)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `${a.color.startsWith('#') ? a.color : `var(${a.color})`}` }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: a.bg.startsWith('#') ? a.bg : `var(${a.bg})` }}>
                  <a.icon size={20} style={{ color: a.color.startsWith('#') ? a.color : `var(${a.color})` }} />
                </div>
                <p className="font-bold text-sm" style={{ color: 'var(--navy-800)' }}>{a.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--s400)' }}>{a.desc}</p>
                <ChevronRight size={16} className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: 'var(--s300)' }} />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ═══ UPCOMING APPOINTMENTS ═══ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--navy-800)' }}>Upcoming Appointments</h3>
          <Link to="/dashboard/appointments" className="text-sm font-bold flex items-center gap-1 transition-colors"
            style={{ color: 'var(--blue-600)' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {upcomingAppointments.length === 0 ? (
          <div className="rounded-2xl p-8 lg:p-12 text-center" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--blue-50)' }}>
              <Calendar size={28} style={{ color: 'var(--blue-400)' }} />
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--navy-800)' }}>No upcoming appointments</p>
            <p className="text-sm mt-1 mb-6" style={{ color: 'var(--s400)' }}>Find a doctor and schedule your first visit</p>
            <Link to="/dashboard/find-doctors">
              <motion.button className="btn-primary btn-sm" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Find a Doctor <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.slice(0, 3).map((apt, i) => (
              <motion.div
                key={apt.id || i}
                className="flex items-center gap-4 rounded-2xl p-4 group cursor-default"
                style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
                whileHover={{ y: -2, boxShadow: '0 12px 32px -8px rgba(15,23,42,0.08)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
                  {apt.type === 'video' ? <Video size={20} className="text-white" /> :
                   apt.type === 'audio' ? <Phone size={20} className="text-white" /> :
                   <Stethoscope size={20} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: 'var(--navy-800)' }}>
                    Dr. {apt.doctorName || 'Doctor'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--s400)' }}>
                    {apt.specialization || 'General'} · {apt.date} · {apt.time}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
                  style={{
                    background: apt.status === 'confirmed' ? 'var(--green-bg)' : 'var(--blue-50)',
                    color: apt.status === 'confirmed' ? 'var(--green)' : 'var(--blue-600)',
                  }}>
                  {apt.status || 'Pending'}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ═══ RECENT ACTIVITY ═══ */}
      {data?.recentActivities?.length > 0 && (
        <motion.div variants={fadeUp}>
          <h3 className="text-lg font-extrabold tracking-tight mb-4" style={{ color: 'var(--navy-800)' }}>Recent Activity</h3>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
            {data.recentActivities.map((act, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--s50)]"
                style={{ borderBottom: i < data.recentActivities.length - 1 ? '1px solid var(--s100)' : 'none' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--blue-50)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--blue-600)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--navy-800)' }}>{act.title}</p>
                  <p className="text-xs" style={{ color: 'var(--s400)' }}>{act.subtitle}</p>
                </div>
                <span className="text-xs font-medium shrink-0" style={{ color: 'var(--s400)' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

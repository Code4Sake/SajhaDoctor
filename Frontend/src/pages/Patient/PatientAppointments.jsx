import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { getAppointments, updateAppointmentStatus } from '../../utils/firestoreAPI';
import {
  Calendar, Clock, Video, Phone, MessageCircle, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Stethoscope, Filter
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function PatientAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    if (user?.uid) {
      getAppointments(user.uid, 'patient').then(res => {
        if (res.success) setAppointments(res.data);
        setLoading(false);
      });
    }
  }, [user]);

  const filtered = appointments.filter(apt => {
    if (tab === 'upcoming') return apt.status === 'pending' || apt.status === 'confirmed';
    if (tab === 'past') return apt.status === 'completed';
    if (tab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const tabs = [
    { key: 'upcoming',  label: 'Upcoming',  count: appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length },
    { key: 'past',      label: 'Past',       count: appointments.filter(a => a.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled',  count: appointments.filter(a => a.status === 'cancelled').length },
  ];

  const getTypeIcon = (type) => {
    if (type === 'video') return <Video size={16} />;
    if (type === 'audio') return <Phone size={16} />;
    if (type === 'chat') return <MessageCircle size={16} />;
    return <Stethoscope size={16} />;
  };

  const statusStyles = {
    pending:   { bg: '#FFF7ED', color: '#F59E0B', label: 'Pending' },
    confirmed: { bg: 'var(--green-bg)', color: 'var(--green)', label: 'Confirmed' },
    completed: { bg: 'var(--blue-50)', color: 'var(--blue-600)', label: 'Completed' },
    cancelled: { bg: '#FEF2F2', color: '#EF4444', label: 'Cancelled' },
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    const res = await updateAppointmentStatus(id, 'cancelled', 'Cancelled by patient');
    if (res.success) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    }
  };

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
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="max-w-4xl mx-auto space-y-6">

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-2 p-1 rounded-2xl" style={{ background: 'var(--s100)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative"
            style={{
              background: tab === t.key ? 'var(--white)' : 'transparent',
              color: tab === t.key ? 'var(--navy-800)' : 'var(--s400)',
              boxShadow: tab === t.key ? '0 2px 8px -2px rgba(15,23,42,0.08)' : 'none',
            }}
          >
            {t.label}
            {t.count > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: tab === t.key ? 'var(--blue-50)' : 'var(--s200)', color: tab === t.key ? 'var(--blue-600)' : 'var(--s500)' }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* List */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
              <Calendar size={40} style={{ color: 'var(--s300)' }} className="mx-auto mb-3" />
              <p className="font-bold" style={{ color: 'var(--s500)' }}>No {tab} appointments</p>
            </div>
          ) : (
            filtered.map((apt, i) => {
              const st = statusStyles[apt.status] || statusStyles.pending;
              return (
                <motion.div
                  key={apt.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl p-4 lg:p-5 group"
                  style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
                      <span className="text-white">{getTypeIcon(apt.type || apt.consultationType)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold" style={{ color: 'var(--navy-800)' }}>
                            Dr. {apt.doctorName || 'Doctor'}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--s400)' }}>
                            {apt.specialization || 'General Consultation'}
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                          style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs font-medium" style={{ color: 'var(--s400)' }}>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {apt.date || 'TBD'}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {apt.time || 'TBD'}</span>
                      </div>
                      {apt.reason && (
                        <p className="text-xs mt-2 line-clamp-1" style={{ color: 'var(--s400)' }}>
                          Reason: {apt.reason}
                        </p>
                      )}
                      {tab === 'upcoming' && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleCancel(apt.id)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{ color: '#EF4444', background: '#FEF2F2' }}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

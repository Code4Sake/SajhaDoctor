import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { getAppointments } from '../../utils/firestoreAPI';
import { FileText, Pill, Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      // Prescriptions come from completed appointments for now
      getAppointments(user.uid, 'patient').then(res => {
        if (res.success) {
          const completed = res.data.filter(a => a.status === 'completed' && a.prescription);
          setPrescriptions(completed);
        }
        setLoading(false);
      });
    }
  }, [user]);

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

      {prescriptions.length === 0 ? (
        <motion.div variants={fadeUp}
          className="rounded-2xl p-12 text-center" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#F5F3FF' }}>
            <FileText size={28} style={{ color: '#8B5CF6' }} />
          </div>
          <p className="font-extrabold text-lg" style={{ color: 'var(--navy-800)' }}>No prescriptions yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--s400)' }}>
            Prescriptions from your completed consultations will appear here.
          </p>
        </motion.div>
      ) : (
        prescriptions.map((rx, i) => (
          <motion.div key={rx.id || i} variants={fadeUp}
            className="rounded-2xl p-5 group" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
            whileHover={{ y: -2, boxShadow: '0 12px 32px -8px rgba(15,23,42,0.08)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: '#F5F3FF' }}>
                  <Pill size={18} style={{ color: '#8B5CF6' }} />
                </div>
                <div>
                  <p className="font-bold" style={{ color: 'var(--navy-800)' }}>Dr. {rx.doctorName}</p>
                  <p className="text-xs" style={{ color: 'var(--s400)' }}>{rx.specialization} · {rx.date}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>Active</span>
            </div>
            {rx.prescription && (
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--s50)' }}>
                {(Array.isArray(rx.prescription) ? rx.prescription : [rx.prescription]).map((med, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} style={{ color: 'var(--green)' }} />
                    <span className="font-semibold" style={{ color: 'var(--navy-800)' }}>{typeof med === 'string' ? med : med.name}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
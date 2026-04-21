import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { getAppointments } from '../../utils/firestoreAPI';
import { Users, Search, Calendar, Clock, User, ChevronRight } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function DoctorPatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      getAppointments(user.uid, 'doctor').then(res => {
        if (res.success) {
          // Deduplicate patients from appointments
          const map = new Map();
          res.data.forEach(apt => {
            if (apt.patientId && !map.has(apt.patientId)) {
              map.set(apt.patientId, {
                id: apt.patientId,
                name: apt.patientName || 'Patient',
                lastVisit: apt.date || 'Unknown',
                totalVisits: 0,
                appointments: [],
              });
            }
            if (apt.patientId && map.has(apt.patientId)) {
              const p = map.get(apt.patientId);
              p.totalVisits++;
              p.appointments.push(apt);
            }
          });
          setPatients(Array.from(map.values()));
        }
        setLoading(false);
      });
    }
  }, [user]);

  const filtered = patients.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: 'var(--blue-600)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  // Patient detail view
  if (selectedPatient) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => setSelectedPatient(null)}
          className="text-sm font-bold flex items-center gap-1" style={{ color: 'var(--s400)' }}>
          ← Back to patients
        </button>
        <div className="rounded-2xl p-5" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
              {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-extrabold text-xl" style={{ color: 'var(--navy-800)' }}>{selectedPatient.name}</p>
              <p className="text-sm" style={{ color: 'var(--s400)' }}>{selectedPatient.totalVisits} visit{selectedPatient.totalVisits !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--s500)' }}>Visit History</h3>
          <div className="space-y-2">
            {selectedPatient.appointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--s50)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--blue-50)' }}>
                  <Calendar size={14} style={{ color: 'var(--blue-600)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--navy-800)' }}>{apt.reason || 'Consultation'}</p>
                  <p className="text-xs" style={{ color: 'var(--s400)' }}>{apt.date} · {apt.time}</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    background: apt.status === 'completed' ? 'var(--green-bg)' : 'var(--blue-50)',
                    color: apt.status === 'completed' ? 'var(--green)' : 'var(--blue-600)',
                  }}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      className="max-w-4xl mx-auto space-y-6">

      {/* Search */}
      <motion.div variants={fadeUp} className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--s300)' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patients..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium"
          style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)', background: 'var(--white)' }} />
      </motion.div>

      <motion.p variants={fadeUp} className="text-sm font-semibold" style={{ color: 'var(--s400)' }}>
        {filtered.length} patient{filtered.length !== 1 ? 's' : ''}
      </motion.p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <Users size={40} style={{ color: 'var(--s300)' }} className="mx-auto mb-3" />
          <p className="font-bold" style={{ color: 'var(--s500)' }}>No patients yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--s400)' }}>Patients from your appointments will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <motion.div key={p.id || i} variants={fadeUp}
              onClick={() => setSelectedPatient(p)}
              className="flex items-center gap-4 rounded-2xl p-4 cursor-pointer group"
              style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px -8px rgba(15,23,42,0.06)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
                {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: 'var(--navy-800)' }}>{p.name}</p>
                <p className="text-xs" style={{ color: 'var(--s400)' }}>{p.totalVisits} visit{p.totalVisits !== 1 ? 's' : ''} · Last: {p.lastVisit}</p>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--s300)' }} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

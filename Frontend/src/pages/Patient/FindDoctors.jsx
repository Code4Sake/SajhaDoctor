import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { getDoctorsList, bookAppointment } from '../../utils/firestoreAPI';
import {
  Search, Star, MapPin, Clock, Video, Phone, MessageCircle,
  Filter, X, ChevronDown, CheckCircle, Calendar, ArrowLeft, Stethoscope
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function FindDoctors() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingStep, setBookingStep] = useState(0); // 0=browsing, 1=date, 2=confirm
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingType, setBookingType] = useState('video');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDoctorsList().then(res => {
      if (res.success) setDoctors(res.data);
      setLoading(false);
    });
  }, []);

  const specialties = ['all', ...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const filtered = doctors.filter(d => {
    const matchSearch = !search ||
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialty === 'all' || d.specialization?.toLowerCase() === specialty.toLowerCase();
    return matchSearch && matchSpec;
  });

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  const today = new Date().toISOString().split('T')[0];

  const handleBook = async () => {
    if (!user || !bookingDoctor || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    const data = {
      doctorId: bookingDoctor.id,
      doctorName: `${bookingDoctor.firstName} ${bookingDoctor.lastName}`,
      specialization: bookingDoctor.specialization || 'General',
      patientId: user.uid,
      patientName: user.displayName || 'Patient',
      date: selectedDate,
      time: selectedTime,
      type: bookingType,
      consultationType: bookingType,
      reason: bookingReason,
    };
    const res = await bookAppointment(data);
    setSubmitting(false);
    if (res.success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingDoctor(null);
        setBookingStep(0);
        setBookingSuccess(false);
        setSelectedDate('');
        setSelectedTime('');
        setBookingReason('');
      }, 2500);
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

  // ═══ BOOKING FLOW ═══
  if (bookingDoctor) {
    if (bookingSuccess) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center py-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--green-bg)' }}>
            <CheckCircle size={36} style={{ color: 'var(--green)' }} />
          </motion.div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy-800)' }}>Appointment Booked!</h2>
          <p style={{ color: 'var(--s400)' }}>Your appointment with Dr. {bookingDoctor.firstName} has been scheduled.</p>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => { setBookingDoctor(null); setBookingStep(0); }}
          className="flex items-center gap-2 text-sm font-bold transition-colors"
          style={{ color: 'var(--s400)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--blue-600)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--s400)'}>
          <ArrowLeft size={16} /> Back to doctors
        </button>

        {/* Doctor header */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
              {bookingDoctor.firstName?.[0]}{bookingDoctor.lastName?.[0]}
            </div>
            <div>
              <p className="font-extrabold text-lg" style={{ color: 'var(--navy-800)' }}>
                Dr. {bookingDoctor.firstName} {bookingDoctor.lastName}
              </p>
              <p className="text-sm" style={{ color: 'var(--s400)' }}>{bookingDoctor.specialization}</p>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>Select Date</h3>
          <input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm font-medium"
            style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }} />
        </div>

        {/* Time */}
        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
            <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>Select Time</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map(t => (
                <button key={t} onClick={() => setSelectedTime(t)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: selectedTime === t ? 'var(--blue-600)' : 'var(--s50)',
                    color: selectedTime === t ? 'white' : 'var(--s600)',
                    border: selectedTime === t ? 'none' : '1px solid var(--s200)',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Type + Reason */}
        {selectedTime && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
            <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>Consultation Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'video', icon: Video, label: 'Video' },
                { val: 'audio', icon: Phone, label: 'Audio' },
                { val: 'chat',  icon: MessageCircle, label: 'Chat' },
              ].map(t => (
                <button key={t.val} onClick={() => setBookingType(t.val)}
                  className="flex flex-col items-center gap-2 py-4 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: bookingType === t.val ? 'var(--blue-50)' : 'var(--s50)',
                    color: bookingType === t.val ? 'var(--blue-600)' : 'var(--s500)',
                    border: `2px solid ${bookingType === t.val ? 'var(--blue-600)' : 'var(--s200)'}`,
                  }}>
                  <t.icon size={20} />
                  {t.label}
                </button>
              ))}
            </div>
            <textarea value={bookingReason} onChange={e => setBookingReason(e.target.value)}
              placeholder="Reason for visit (optional)..." rows={3}
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
              style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }} />
          </motion.div>
        )}

        {/* Confirm */}
        {selectedTime && (
          <motion.button
            onClick={handleBook}
            disabled={submitting}
            className="btn-primary w-full"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Booking...' : `Book for ${selectedDate} at ${selectedTime}`}
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ═══ DOCTORS LIST ═══
  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      className="max-w-6xl mx-auto space-y-6">

      {/* Search + Filter */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--s300)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium"
            style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)', background: 'var(--white)' }} />
        </div>
        <select value={specialty} onChange={e => setSpecialty(e.target.value)}
          className="px-4 py-3 rounded-xl border text-sm font-bold"
          style={{ borderColor: 'var(--s200)', color: 'var(--s600)', background: 'var(--white)', minWidth: '160px' }}>
          {specialties.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Specialties' : s}</option>
          ))}
        </select>
      </motion.div>

      <motion.p variants={fadeUp} className="text-sm font-semibold" style={{ color: 'var(--s400)' }}>
        {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
      </motion.p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <Stethoscope size={40} style={{ color: 'var(--s300)' }} className="mx-auto mb-3" />
          <p className="font-bold" style={{ color: 'var(--s500)' }}>No doctors found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--s400)' }}>Try different search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id || i}
              variants={fadeUp}
              className="rounded-2xl overflow-hidden group cursor-default"
              style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}
              whileHover={{ y: -6, boxShadow: '0 24px 56px -16px rgba(15,23,42,0.12)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="h-[3px] w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, var(--blue-600), var(--blue-400))' }} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
                    {doc.firstName?.[0]}{doc.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate" style={{ color: 'var(--navy-800)' }}>
                      Dr. {doc.firstName} {doc.lastName}
                    </p>
                    <p className="text-xs font-medium" style={{ color: 'var(--blue-600)' }}>{doc.specialization || 'General'}</p>
                  </div>
                  {doc.isOnline && (
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'var(--green)', boxShadow: '0 0 0 3px var(--green-bg)' }} />
                  )}
                </div>

                <div className="space-y-2 mb-4 text-xs font-medium" style={{ color: 'var(--s400)' }}>
                  {doc.currentHospital && (
                    <div className="flex items-center gap-2"><MapPin size={12} /> {doc.currentHospital}</div>
                  )}
                  <div className="flex items-center gap-2"><Clock size={12} /> {doc.yearsExperience || 0} yrs experience</div>
                  {doc.consultationFee && (
                    <div className="flex items-center gap-2">Rs. {doc.consultationFee} per consultation</div>
                  )}
                </div>

                {doc.languages?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doc.languages.slice(0, 3).map((l, j) => (
                      <span key={j} className="text-[0.65rem] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>
                        {l.value || l}
                      </span>
                    ))}
                  </div>
                )}

                <motion.button
                  onClick={() => setBookingDoctor(doc)}
                  className="btn-primary w-full btn-sm"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  Book Appointment
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
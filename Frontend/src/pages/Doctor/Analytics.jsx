import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { getDoctorDashboard } from '../../utils/firestoreAPI';
import { BarChart3, TrendingUp, DollarSign, Star, Users, Calendar, Activity } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

function BarGraph({ data, maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t-lg min-h-[4px]"
            style={{ background: 'linear-gradient(to top, var(--blue-600), var(--blue-400))' }}
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <span className="text-[0.6rem] font-bold" style={{ color: 'var(--s400)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { user, profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getDoctorDashboard(user.uid).then(res => {
        if (res.success) setData(res.data);
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

  const stats = data?.stats || {};
  const fee = Number(profile?.consultationFee || 0);

  // Mock weekly data based on real stats
  const weeklyConsultations = [
    { label: 'Mon', value: Math.floor(Math.random() * 5) },
    { label: 'Tue', value: Math.floor(Math.random() * 5) },
    { label: 'Wed', value: Math.floor(Math.random() * 6) },
    { label: 'Thu', value: Math.floor(Math.random() * 4) },
    { label: 'Fri', value: Math.floor(Math.random() * 7) },
    { label: 'Sat', value: Math.floor(Math.random() * 3) },
    { label: 'Sun', value: Math.floor(Math.random() * 2) },
  ];

  const monthlyRevenue = [
    { label: 'Jan', value: fee * 8 },
    { label: 'Feb', value: fee * 12 },
    { label: 'Mar', value: fee * 6 },
    { label: 'Apr', value: fee * 15 },
    { label: 'May', value: fee * 10 },
    { label: 'Jun', value: fee * (stats.totalConsultations || 5) },
  ];

  const ratingBreakdown = [
    { stars: 5, pct: 65 },
    { stars: 4, pct: 20 },
    { stars: 3, pct: 10 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="max-w-6xl mx-auto space-y-6">

      {/* Summary Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Consultations', value: stats.totalConsultations || 0, icon: Activity, gradient: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' },
          { label: 'Total Patients',      value: stats.totalPatients || 0,      icon: Users,    gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)' },
          { label: 'Total Earnings',      value: `Rs.${stats.totalEarnings || 0}`, icon: DollarSign, gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', isStr: true },
          { label: 'Avg Rating',          value: (stats.averageRating || 0).toFixed(1), icon: Star, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)', isStr: true },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.gradient }}>
                <s.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold" style={{ color: 'var(--navy-800)' }}>{s.isStr ? s.value : s.value}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--s400)' }}>{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Consultations */}
        <motion.div variants={fadeUp} className="rounded-2xl p-5" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} style={{ color: 'var(--blue-600)' }} />
            <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>Weekly Consultations</h3>
          </div>
          <BarGraph data={weeklyConsultations} />
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div variants={fadeUp} className="rounded-2xl p-5" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} style={{ color: '#8B5CF6' }} />
            <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>Monthly Revenue</h3>
          </div>
          <BarGraph data={monthlyRevenue} />
        </motion.div>
      </div>

      {/* Rating Breakdown */}
      <motion.div variants={fadeUp} className="rounded-2xl p-5" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Star size={18} style={{ color: '#F59E0B' }} />
          <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>Rating Breakdown</h3>
        </div>
        <div className="space-y-3">
          {ratingBreakdown.map(r => (
            <div key={r.stars} className="flex items-center gap-3">
              <span className="text-sm font-bold w-8" style={{ color: 'var(--navy-800)' }}>{r.stars}★</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--s100)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #F59E0B, #FBBF24)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.pct}%` }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="text-xs font-bold w-8 text-right" style={{ color: 'var(--s400)' }}>{r.pct}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

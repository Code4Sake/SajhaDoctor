import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Pill } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function DoctorPrescriptions() {
  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="max-w-4xl mx-auto space-y-6">

      <motion.div variants={fadeUp}
        className="rounded-2xl p-12 text-center" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#F5F3FF' }}>
          <Pill size={28} style={{ color: '#8B5CF6' }} />
        </div>
        <p className="font-extrabold text-lg" style={{ color: 'var(--navy-800)' }}>Prescriptions</p>
        <p className="text-sm mt-1 max-w-md mx-auto" style={{ color: 'var(--s400)' }}>
          Digital prescriptions will be available here once you complete consultations. 
          You'll be able to create and manage prescriptions for your patients.
        </p>
      </motion.div>
    </motion.div>
  );
}

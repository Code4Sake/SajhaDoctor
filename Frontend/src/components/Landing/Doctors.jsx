import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import TextReveal from '../ui/TextReveal';
import { useLanguage } from '../../i18n/LanguageContext';

const doctors = [
  { name: 'Dr. Anisha Sharma', specialty: 'Cardiologist', nepali: 'हृदय रोग विशेषज्ञ', location: 'Kathmandu', exp: '12 yrs', rating: 4.9, reviews: 234, fee: 'NPR 500', status: 'Online', img: '/doctor-1.png' },
  { name: 'Dr. Rajesh Adhikari', specialty: 'General Physician', nepali: 'सामान्य चिकित्सक', location: 'Pokhara', exp: '8 yrs', rating: 4.8, reviews: 189, fee: 'NPR 400', status: 'Online', img: '/doctor-2.png' },
  { name: 'Dr. Sunil Karki', specialty: 'Dermatologist', nepali: 'छाला रोग विशेषज्ञ', location: 'Lalitpur', exp: '6 yrs', rating: 4.7, reviews: 156, fee: 'NPR 450', status: 'In 10 min', img: '/doctor-3.png' },
];

function DoctorCard({ doc, index }) {
  const { t } = useLanguage();
  return (
    <motion.div className="doc-card group cursor-pointer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>

      <div className="relative overflow-hidden" style={{ background: 'var(--s100)' }}>
        <img src={doc.img} alt={doc.name}
          className="w-full h-64 object-cover object-top transition-transform duration-700 group-hover:scale-110" />
        {/* Status */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
          <span className="w-[7px] h-[7px] rounded-full"
            style={{ background: doc.status === 'Online' ? 'var(--green)' : 'var(--blue-400)', animation: doc.status === 'Online' ? 'pulse-dot 2s infinite' : 'none' }} />
          <span className="text-[0.72rem] font-bold" style={{ color: 'var(--s700)' }}>{doc.status}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="p-5">
        <h4 className="text-[1.05rem] font-extrabold mb-0.5" style={{ color: 'var(--navy-800)', letterSpacing: '-0.01em' }}>{doc.name}</h4>
        <p className="text-[0.85rem] font-bold mb-0.5" style={{ color: 'var(--blue-600)' }}>{doc.specialty}</p>
        <p className="text-[0.72rem] font-medium mb-3.5" style={{ color: 'var(--s400)' }}>{doc.nepali} • {doc.exp}</p>

        <div className="flex items-center gap-3 mb-4 text-[0.8rem]" style={{ color: 'var(--s500)' }}>
          <span className="flex items-center gap-1">
            <Star size={14} fill="#FBBF24" stroke="#FBBF24" />
            <span className="font-extrabold" style={{ color: 'var(--s700)' }}>{doc.rating}</span>
            <span className="text-[0.7rem]">({doc.reviews})</span>
          </span>
          <span className="w-px h-3.5" style={{ background: 'var(--s200)' }} />
          <span className="flex items-center gap-1"><MapPin size={13} /> {doc.location}</span>
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--s100)' }}>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--s400)' }}>{t('doctors.fee')}</p>
            <p className="text-[1.15rem] font-extrabold" style={{ color: 'var(--navy-800)' }}>{doc.fee}</p>
          </div>
          <motion.button className="btn-primary btn-sm"
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            {t('doctors.bookNow')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Doctors() {
  const { t } = useLanguage();
  return (
    <section id="doctors" className="sec" style={{ background: 'var(--white)' }}>
      <div className="ctr">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <TextReveal>
              <span className="inline-block text-[0.7rem] font-extrabold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full"
                style={{ color: 'var(--blue-600)', background: 'var(--blue-50)' }}>{t('doctors.badge')}</span>
            </TextReveal>
            <TextReveal delay={0.05}><h2>{t('doctors.title')}</h2></TextReveal>
            <TextReveal delay={0.1}><p className="mt-3 text-[1rem]" style={{ color: 'var(--s500)' }}>{t('doctors.subtitle')}</p></TextReveal>
          </div>
          <TextReveal delay={0.12}>
            <Link to="/dashboard/find-doctors">
              <motion.button className="btn-secondary btn-sm"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                {t('doctors.viewAll')} <ArrowRight size={16} />
              </motion.button>
            </Link>
          </TextReveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, i) => <DoctorCard key={doc.name} doc={doc} index={i} />)}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Star } from 'lucide-react';
import TextReveal from '../ui/TextReveal';
import { useLanguage } from '../../i18n/LanguageContext';

const reviews = [
  { quote: 'My child had a high fever at midnight. SajhaDoctor connected me with a pediatrician in 3 minutes. Lifesaving!', name: 'Sunita Thapa', role: 'Mother, Pokhara', img: '/doctor-1.png' },
  { quote: 'As a doctor in rural Jumla, this platform lets me reach patients who would otherwise travel 8 hours.', name: 'Dr. Ramesh Khatri', role: 'Physician, Jumla', img: '/doctor-2.png' },
  { quote: 'The AI Symptom Checker helped me understand my condition before the consultation. Very empowering.', name: 'Anish Gurung', role: 'Engineer, KTM', img: '/doctor-3.png' },
  { quote: 'Finally a telehealth platform that works in Nepali and supports Khalti. No more traveling!', name: 'Priya Maharjan', role: 'Student, Lalitpur', img: '/doctor-1.png' },
  { quote: 'Video consultation from my farm in Chitwan. Prescription sent digitally — no paper, no hassle.', name: 'Bikram Chaudhary', role: 'Farmer, Chitwan', img: '/doctor-2.png' },
  { quote: 'Professional, secure, affordable. This is what healthcare in Nepal should look like!', name: 'Deepa Rai', role: 'Teacher, Dharan', img: '/doctor-3.png' },
];

const Card = ({ r }) => (
  <div className="rev-card group">
    <div className="flex gap-[2px] mb-3.5">
      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FBBF24" stroke="#FBBF24" />)}
    </div>
    <p className="text-[0.9rem] leading-[1.7] mb-5" style={{ color: 'var(--s600)' }}>"{r.quote}"</p>
    <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--s100)' }}>
      <img src={r.img} alt={r.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:ring-blue-100" />
      <div>
        <p className="text-[0.85rem] font-extrabold" style={{ color: 'var(--navy-800)' }}>{r.name}</p>
        <p className="text-[0.7rem] font-medium" style={{ color: 'var(--s400)' }}>{r.role}</p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  const { t } = useLanguage();
  const row1 = [...reviews.slice(0, 3), ...reviews.slice(0, 3)];
  const row2 = [...reviews.slice(3), ...reviews.slice(3)];

  return (
    <section id="reviews" className="sec overflow-hidden" style={{ background: 'var(--s50)' }}>
      <div className="ctr mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <TextReveal>
            <span className="inline-block text-[0.7rem] font-extrabold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full"
              style={{ color: 'var(--blue-600)', background: 'var(--blue-50)' }}>{t('testimonials.badge')}</span>
          </TextReveal>
          <TextReveal delay={0.05}><h2>{t('testimonials.title')}</h2></TextReveal>
        </div>
      </div>

      <div className="mb-5 overflow-hidden">
        <div className="marq marq-l">{row1.map((r, i) => <Card key={`a${i}`} r={r} />)}</div>
      </div>
      <div className="overflow-hidden">
        <div className="marq marq-r">{row2.map((r, i) => <Card key={`b${i}`} r={r} />)}</div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { Heart, Droplets, AlertTriangle, Pill, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function HealthRecords() {
  const { profile, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const med = profile?.medicalHistory || {};

  const [bloodType, setBloodType] = useState(med.bloodType || '');
  const [allergies, setAllergies] = useState(med.allergies || []);
  const [conditions, setConditions] = useState(med.chronicConditions || []);
  const [medications, setMedications] = useState(med.currentMedications || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMed, setNewMed] = useState('');

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfile({
      medicalHistory: { bloodType, allergies, chronicConditions: conditions, currentMedications: medications }
    });
    setSaving(false);
    setEditing(false);
  };

  const addItem = (list, setList, newVal, setNew) => {
    if (newVal.trim()) { setList([...list, newVal.trim()]); setNew(''); }
  };
  const removeItem = (list, setList, idx) => setList(list.filter((_, i) => i !== idx));

  const sections = [
    { title: 'Blood Type', icon: Droplets, iconColor: '#EF4444', iconBg: '#FEF2F2',
      content: (
        editing ? (
          <select value={bloodType} onChange={e => setBloodType(e.target.value)}
            className="px-4 py-2.5 rounded-xl border text-sm font-bold" style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }}>
            <option value="">Select</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        ) : (
          <span className="text-2xl font-extrabold" style={{ color: 'var(--navy-800)' }}>{bloodType || '—'}</span>
        )
      )
    },
    { title: 'Allergies', icon: AlertTriangle, iconColor: '#F59E0B', iconBg: '#FFF7ED',
      items: allergies, setItems: setAllergies, newVal: newAllergy, setNew: setNewAllergy, placeholder: 'Add allergy' },
    { title: 'Chronic Conditions', icon: Heart, iconColor: '#EC4899', iconBg: '#FDF2F8',
      items: conditions, setItems: setConditions, newVal: newCondition, setNew: setNewCondition, placeholder: 'Add condition' },
    { title: 'Current Medications', icon: Pill, iconColor: '#8B5CF6', iconBg: '#F5F3FF',
      items: medications, setItems: setMedications, newVal: newMed, setNew: setNewMed, placeholder: 'Add medication' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="max-w-3xl mx-auto space-y-6">

      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--navy-800)' }}>Health Records</h2>
          <p className="text-sm" style={{ color: 'var(--s400)' }}>Manage your medical information</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <motion.button onClick={handleSave} disabled={saving} className="btn-primary btn-sm"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </motion.button>
            <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'var(--s100)', color: 'var(--s500)' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <motion.button onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Edit3 size={14} /> Edit
          </motion.button>
        )}
      </motion.div>

      {sections.map((sec, i) => (
        <motion.div key={sec.title} variants={fadeUp}
          className="rounded-2xl p-5" style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: sec.iconBg }}>
              <sec.icon size={18} style={{ color: sec.iconColor }} />
            </div>
            <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>{sec.title}</h3>
          </div>

          {sec.content ? (
            <div>{sec.content}</div>
          ) : (
            <>
              {sec.items.length === 0 && !editing && (
                <p className="text-sm" style={{ color: 'var(--s400)' }}>None recorded</p>
              )}
              <div className="flex flex-wrap gap-2">
                {sec.items.map((item, j) => (
                  <span key={j} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: sec.iconBg, color: sec.iconColor }}>
                    {item}
                    {editing && (
                      <button onClick={() => removeItem(sec.items, sec.setItems, j)}>
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2 mt-3">
                  <input value={sec.newVal} onChange={e => sec.setNew(e.target.value)}
                    placeholder={sec.placeholder}
                    onKeyDown={e => e.key === 'Enter' && addItem(sec.items, sec.setItems, sec.newVal, sec.setNew)}
                    className="flex-1 px-3 py-2 rounded-xl border text-sm"
                    style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }} />
                  <button onClick={() => addItem(sec.items, sec.setItems, sec.newVal, sec.setNew)}
                    className="px-3 py-2 rounded-xl" style={{ background: sec.iconBg, color: sec.iconColor }}>
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

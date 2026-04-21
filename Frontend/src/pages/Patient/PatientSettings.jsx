import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { User, Lock, Bell, Save, Eye, EyeOff, Check } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function PatientSettings() {
  const { user, profile, updateUserProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phoneNumber || profile.phone || '');
      setDob(profile.dateOfBirth || '');
      setGender(profile.gender || '');
    }
  }, [profile]);

  const handleProfileSave = async () => {
    setSaving(true);
    await updateUserProfile({ firstName, lastName, phoneNumber: phone, dateOfBirth: dob, gender });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    if (newPw.length < 6) { setPwError('Password must be at least 6 characters'); return; }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPw);
      setPwSuccess(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.code === 'auth/wrong-password' ? 'Current password is incorrect' : err.message);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile',  icon: User },
    { key: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="max-w-3xl mx-auto space-y-6">

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-2">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t.key ? 'var(--blue-50)' : 'transparent',
              color: tab === t.key ? 'var(--blue-600)' : 'var(--s400)',
            }}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </motion.div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <motion.div variants={fadeUp} className="rounded-2xl p-5 lg:p-6 space-y-5"
          style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold"
              style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
              {(firstName[0] || '') + (lastName[0] || '')}
            </div>
            <div>
              <p className="font-extrabold text-lg" style={{ color: 'var(--navy-800)' }}>{firstName} {lastName}</p>
              <p className="text-sm" style={{ color: 'var(--s400)' }}>{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'First Name', value: firstName, set: setFirstName, type: 'text' },
              { label: 'Last Name', value: lastName, set: setLastName, type: 'text' },
              { label: 'Phone', value: phone, set: setPhone, type: 'tel' },
              { label: 'Date of Birth', value: dob, set: setDob, type: 'date' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--s500)' }}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium"
                  style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--s500)' }}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium"
                style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--s500)' }}>Email</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium"
                style={{ borderColor: 'var(--s200)', color: 'var(--s400)', background: 'var(--s50)' }} />
            </div>
          </div>

          <motion.button onClick={handleProfileSave} disabled={saving}
            className="btn-primary btn-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
          </motion.button>
        </motion.div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <motion.div variants={fadeUp} className="rounded-2xl p-5 lg:p-6 space-y-5"
          style={{ background: 'var(--white)', border: '1px solid var(--s100)' }}>
          <h3 className="font-extrabold" style={{ color: 'var(--navy-800)' }}>Change Password</h3>

          {pwSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm font-bold"
              style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
              <Check size={16} /> Password updated successfully!
            </div>
          )}
          {pwError && (
            <div className="p-3 rounded-xl text-sm font-bold" style={{ background: '#FEF2F2', color: '#EF4444' }}>
              {pwError}
            </div>
          )}

          <div className="space-y-3 max-w-md">
            <div className="relative">
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--s500)' }}>Current Password</label>
              <input type={showPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border text-sm"
                style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }} />
              <button onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-8" style={{ color: 'var(--s400)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--s500)' }}>New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--s500)' }}>Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: 'var(--s200)', color: 'var(--navy-800)' }} />
            </div>
            <motion.button onClick={handlePasswordChange}
              className="btn-primary btn-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Update Password
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

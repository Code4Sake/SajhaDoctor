// src/utils/firestoreAPI.js — Firestore data layer replacing Express/MongoDB API
import { 
  doc, getDoc, setDoc, updateDoc, collection, 
  query, where, getDocs, addDoc, orderBy, limit,
  serverTimestamp, deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// ═══════════════════════════════════════════════════════
// USER PROFILES
// ═══════════════════════════════════════════════════════

/** Get any user's profile by UID */
export const getUserProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return { success: true, data: snap.data() };
    return { success: false, error: 'Profile not found' };
  } catch (err) {
    console.error('getUserProfile error:', err);
    return { success: false, error: err.message };
  }
};

/** Update user profile fields (merge) */
export const updateUserProfile = async (uid, updates) => {
  try {
    await setDoc(doc(db, 'users', uid), { ...updates, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('updateUserProfile error:', err);
    return { success: false, error: err.message };
  }
};

// ═══════════════════════════════════════════════════════
// DOCTORS
// ═══════════════════════════════════════════════════════

/** Get all verified doctors (for patient's FindDoctors page) */
export const getDoctorsList = async (filters = {}) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('userType', '==', 'doctor')
    );
    const snap = await getDocs(q);
    let doctors = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Client-side filtering (Firestore compound queries are limited)
    if (filters.specialization) {
      doctors = doctors.filter(d => 
        d.specialization?.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      doctors = doctors.filter(d =>
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(s) ||
        d.specialization?.toLowerCase().includes(s) ||
        d.currentHospital?.toLowerCase().includes(s)
      );
    }
    if (filters.minRating) {
      doctors = doctors.filter(d => (d.rating || 0) >= filters.minRating);
    }
    if (filters.maxFee) {
      doctors = doctors.filter(d => Number(d.consultationFee || 0) <= Number(filters.maxFee));
    }
    if (filters.isOnline) {
      doctors = doctors.filter(d => d.isOnline === true);
    }

    return { success: true, data: doctors };
  } catch (err) {
    console.error('getDoctorsList error:', err);
    return { success: false, error: err.message };
  }
};

/** Get a single doctor's public profile */
export const getDoctorProfile = async (doctorUid) => {
  try {
    const snap = await getDoc(doc(db, 'users', doctorUid));
    if (snap.exists() && snap.data().userType === 'doctor') {
      return { success: true, data: { id: snap.id, ...snap.data() } };
    }
    return { success: false, error: 'Doctor not found' };
  } catch (err) {
    console.error('getDoctorProfile error:', err);
    return { success: false, error: err.message };
  }
};

/** Toggle doctor's online status */
export const toggleDoctorOnline = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return { success: false, error: 'Doctor not found' };
    const current = snap.data().isOnline || false;
    await updateDoc(doc(db, 'users', uid), { isOnline: !current, updatedAt: serverTimestamp() });
    return { success: true, data: { isOnline: !current } };
  } catch (err) {
    console.error('toggleDoctorOnline error:', err);
    return { success: false, error: err.message };
  }
};

// ═══════════════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════════════

/** Book an appointment */
export const bookAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, data: { id: docRef.id } };
  } catch (err) {
    console.error('bookAppointment error:', err);
    return { success: false, error: err.message };
  }
};

/** Get appointments for a user (patient or doctor) */
export const getAppointments = async (uid, role = 'patient') => {
  const field = role === 'doctor' ? 'doctorId' : 'patientId';
  try {
    const q = query(
      collection(db, 'appointments'),
      where(field, '==', uid)
    );
    const snap = await getDocs(q);
    const appointments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort client-side to avoid needing composite Firestore index
    appointments.sort((a, b) => {
      const da = a.createdAt?.toDate?.() || new Date(0);
      const db2 = b.createdAt?.toDate?.() || new Date(0);
      return db2 - da;
    });
    return { success: true, data: appointments };
  } catch (err) {
    console.error('getAppointments error:', err);
    return { success: false, error: err.message, data: [] };
  }
};

/** Update appointment status */
export const updateAppointmentStatus = async (appointmentId, status, reason = '') => {
  try {
    const updates = { status, updatedAt: serverTimestamp() };
    if (reason) updates.cancelReason = reason;
    await updateDoc(doc(db, 'appointments', appointmentId), updates);
    return { success: true };
  } catch (err) {
    console.error('updateAppointmentStatus error:', err);
    return { success: false, error: err.message };
  }
};

// ═══════════════════════════════════════════════════════
// PATIENT DASHBOARD DATA
// ═══════════════════════════════════════════════════════

/** Get patient dashboard data (profile + appointments + stats) */
export const getPatientDashboard = async (uid) => {
  try {
    // Fetch profile and appointments in parallel
    const [profileResult, appointmentsResult] = await Promise.all([
      getUserProfile(uid),
      getAppointments(uid, 'patient'),
    ]);

    const profile = profileResult.success ? profileResult.data : {};
    const appointments = appointmentsResult.success ? appointmentsResult.data : [];

    // Compute stats from real data
    const now = new Date();
    const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
    const completed = appointments.filter(a => a.status === 'completed');

    return {
      success: true,
      data: {
        patient: profile,
        upcomingAppointments: upcoming,
        stats: {
          totalConsultations: completed.length,
          upcomingCount: upcoming.length,
          totalAppointments: appointments.length,
        },
        quickStats: [
          { label: 'Total Visits', value: completed.length.toString(), change: '' },
          { label: 'Upcoming', value: upcoming.length.toString(), change: '' },
          { label: 'Health Score', value: profile.healthScore?.toString() || '—', change: '' },
          { label: 'Active Rx', value: '0', change: '' },
        ],
        recentActivities: completed.slice(0, 5).map(a => ({
          title: `Consultation with Dr. ${a.doctorName || 'Doctor'}`,
          subtitle: a.specialization || 'General',
          time: a.date || 'Recent',
          type: 'consultation',
          icon: 'Video',
        })),
      }
    };
  } catch (err) {
    console.error('getPatientDashboard error:', err);
    return { success: false, error: err.message };
  }
};

// ═══════════════════════════════════════════════════════
// DOCTOR DASHBOARD DATA
// ═══════════════════════════════════════════════════════

/** Get doctor dashboard data (profile + appointments + stats) */
export const getDoctorDashboard = async (uid) => {
  try {
    const [profileResult, appointmentsResult] = await Promise.all([
      getUserProfile(uid),
      getAppointments(uid, 'doctor'),
    ]);

    const profile = profileResult.success ? profileResult.data : {};
    const appointments = appointmentsResult.success ? appointmentsResult.data : [];

    const completed = appointments.filter(a => a.status === 'completed');
    const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
    const today = appointments.filter(a => {
      if (!a.date) return false;
      const appointmentDate = new Date(a.date);
      const now = new Date();
      return appointmentDate.toDateString() === now.toDateString();
    });

    return {
      success: true,
      data: {
        doctor: profile,
        appointments: upcoming,
        stats: {
          todayAppointments: today.length,
          totalConsultations: profile.totalConsultations || completed.length,
          totalEarnings: profile.totalEarnings || (completed.length * Number(profile.consultationFee || 0)),
          averageRating: profile.rating || 0,
          totalPatients: profile.totalPatients || 0,
        },
      },
    };
  } catch (err) {
    console.error('getDoctorDashboard error:', err);
    return { success: false, error: err.message };
  }
};

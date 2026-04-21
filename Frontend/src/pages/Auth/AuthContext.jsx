import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // Firebase Auth user
  const [profile, setProfile] = useState(null);     // Firestore profile data
  const [userType, setUserType] = useState(null);   // 'patient' | 'doctor'
  const [loading, setLoading] = useState(true);     // Initial auth check
  const [actionLoading, setActionLoading] = useState(false); // For login/register buttons

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setProfile(data);
            setUserType(data.userType || 'patient');
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
        setUserType(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Register a patient
  const registerPatient = async (formData) => {
    setActionLoading(true);
    try {
      // 1. Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Update display name
      await updateProfile(cred.user, { 
        displayName: `${formData.firstName} ${formData.lastName}` 
      });

      // 3. Save full profile to Firestore
      const profileData = {
        uid: cred.user.uid,
        userType: 'patient',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || '',
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || '',
        address: formData.address || {},
        emergencyContact: formData.emergencyContact || {},
        // Medical defaults (can be filled later in Settings)
        medicalHistory: {
          bloodType: '',
          allergies: [],
          chronicConditions: [],
          currentMedications: [],
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), profileData);
      setProfile(profileData);
      setUserType('patient');

      return { success: true, user: cred.user };
    } catch (error) {
      console.error('Patient registration error:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    } finally {
      setActionLoading(false);
    }
  };

  // Register a doctor
  const registerDoctor = async (formData) => {
    setActionLoading(true);
    try {
      // 1. Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Update display name
      await updateProfile(cred.user, { 
        displayName: `Dr. ${formData.firstName} ${formData.lastName}` 
      });

      // 3. Save full profile to Firestore
      const profileData = {
        uid: cred.user.uid,
        userType: 'doctor',
        verified: false, // Admin must verify before doctor can practice
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || '',
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || '',
        // Professional info
        nmcLicense: formData.nmcLicense || '',
        specialization: formData.specialization || '',
        subSpecialization: formData.subSpecialization || '',
        qualification: formData.qualification || '',
        medicalSchool: formData.medicalSchool || '',
        yearsExperience: formData.yearsExperience || '',
        currentHospital: formData.currentHospital || '',
        // Practice info
        consultationFee: formData.consultationFee || '',
        consultTypes: formData.consultTypes || [],
        languages: formData.languages || [],
        bio: formData.bio || '',
        // Stats (will grow over time)
        rating: 0,
        totalPatients: 0,
        totalConsultations: 0,
        isOnline: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), profileData);
      setProfile(profileData);
      setUserType('doctor');

      return { success: true, user: cred.user };
    } catch (error) {
      console.error('Doctor registration error:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    } finally {
      setActionLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setActionLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Profile will be loaded by onAuthStateChanged listener
      return { success: true, user: cred.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    } finally {
      setActionLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      // State will be cleared by onAuthStateChanged listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update profile in Firestore
  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const updatedData = { ...updates, updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
      setProfile(prev => ({ ...prev, ...updates }));
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    profile,
    userType,
    isAuthenticated,
    loading,
    actionLoading,
    login,
    logout,
    registerPatient,
    registerDoctor,
    updateUserProfile,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Convert Firebase error codes to user-friendly messages
function getFirebaseErrorMessage(error) {
  const code = error.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}
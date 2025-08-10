// routes/auth.js
import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

// Import controllers and middleware
import * as authController from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import {
  validatePatientSignup,
  validateDoctorSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword
} from '../middlewares/validation.js';

const router = express.Router();


// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    status: 'error',
    message: 'Too many password reset attempts, please try again later.'
  }
});

// ============================================
// REGISTRATION ROUTES
// ============================================

// @route   POST /api/auth/signup/patient
// @desc    Register a new patient
// @access  Public
console.log(authController.signupPatient);

router.post('/signup/patient', authLimiter, validatePatientSignup, authController.signupPatient);

// @route   POST /api/auth/signup/doctor
// @desc    Register a new doctor
// @access  Public
router.post('/signup/doctor', authLimiter, validateDoctorSignup, authController.signupDoctor);

// @route   POST /api/auth/login
// @desc    Login user (patient or doctor)
// @access  Public
router.post('/login', authLimiter, validateLogin, authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', authController.logout);

// ============================================
// EMAIL VERIFICATION ROUTES
// ============================================

// @route   GET /api/auth/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:token', authController.verifyEmail);

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post('/resend-verification', passwordResetLimiter, authController.resendVerificationEmail);

// ============================================
// PASSWORD RESET ROUTES
// ============================================

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, authController.forgotPassword);

// @route   PATCH /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.patch('/reset-password/:token', authLimiter, validateResetPassword, authController.resetPassword);

// ============================================
// PROTECTED ROUTES (require authentication)
// ============================================

// @route   GET /api/auth/me
// @desc    Get current user profile with role-specific data
// @access  Private
router.get('/me', protect, authController.getMe);

// @route   PATCH /api/auth/update-password
// @desc    Update password for logged in user
// @access  Private
router.patch('/update-password', protect, validateUpdatePassword, authController.updatePassword);

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure',
    session: false
  }),
  authController.googleSuccess
);

// @route   GET /api/auth/google/failure
// @desc    Google OAuth failure
// @access  Public
router.get('/google/failure', authController.googleFailure);

// ============================================
// DEBUG ROUTES (Remove in production)
// ============================================

// @route   GET /api/auth/debug-users
// @desc    Debug endpoint to check database contents
// @access  Public (remove in production)
router.get('/debug-users', async (req, res) => {
  try {
    const { default: mongoose } = await import('mongoose');
    const { default: User } = await import('../models/User.js');
    const { default: Patient } = await import('../models/Patient.js');
    const { default: Doctor } = await import('../models/Doctor.js');

    // Get database info
    const dbName = mongoose.connection.db.databaseName;

    // Count documents in each collection
    const userCount = await User.countDocuments();
    const patientCount = await Patient.countDocuments();
    const doctorCount = await Doctor.countDocuments();

    // Get sample data (limit to 5 for safety)
    const users = await User.find({}).limit(5).select('-password');
    const patients = await Patient.find({}).limit(5).populate('userId', 'firstName lastName email');
    const doctors = await Doctor.find({}).limit(5).populate('userId', 'firstName lastName email');

    // Get collections list
    const collections = await mongoose.connection.db.listCollections().toArray();

    res.json({
      status: 'success',
      database: dbName,

      counts: {
        users: userCount,
        patients: patientCount,
        doctors: doctorCount
      },

      collections: collections.map(c => ({
        name: c.name,
        type: c.type
      })),

      sampleData: {
        users: users,
        patients: patients,
        doctors: doctors
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ============================================
// HEALTH CHECK ROUTE
// ============================================

// @route   GET /api/auth/health
// @desc    Health check for auth service
// @access  Public
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Auth service is running',
    timestamp: new Date().toISOString(),
    supportedRoutes: {
      registration: [
        'POST /api/auth/signup/patient',
        'POST /api/auth/signup/doctor'
      ],
      authentication: [
        'POST /api/auth/login',
        'POST /api/auth/logout'
      ],
      verification: [
        'GET /api/auth/verify-email/:token',
        'POST /api/auth/resend-verification'
      ],
      passwordReset: [
        'POST /api/auth/forgot-password',
        'PATCH /api/auth/reset-password/:token'
      ],
      profile: [
        'GET /api/auth/me',
        'PATCH /api/auth/update-password'
      ]
    }
  });
});

export default router;

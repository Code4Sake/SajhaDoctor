// middleware/validation.js
import { body, validationResult } from 'express-validator';

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// Common validation rules
const commonUserValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name should only contain letters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name should only contain letters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const { default: User } = await import('../models/User.js');
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }),

  body('phoneNumber')
    .matches(/^(\+977)?[0-9]{10}$/)
    .withMessage('Please provide a valid Nepali phone number')
    .custom(async (phoneNumber) => {
      const { default: User } = await import('../models/User.js');
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        throw new Error('Phone number already exists');
      }
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

// Validation rules for patient signup
const validatePatientSignup = [
  ...commonUserValidation,

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please provide a valid blood group'),

  
  body('address.province')
    .optional()
    .isIn([
      'Province 1', 'Madhesh Province', 'Bagmati Province',
      'Gandaki Province', 'Lumbini Province', 'Karnali Province',
      'Sudurpashchim Province'
    ])
    .withMessage('Please select a valid province'),

  handleValidationErrors
];

// Validation rules for doctor signup
const validateDoctorSignup = [
  ...commonUserValidation,

  body('licenseNumber')
    .notEmpty()
    .withMessage('Medical license number is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('License number must be between 5 and 50 characters')
    .custom(async (licenseNumber) => {
      const { default: Doctor } = await import('../models/Doctor.js');
      const existingDoctor = await Doctor.findOne({ licenseNumber });
      if (existingDoctor) {
        throw new Error('License number already exists');
      }
    }),

  body('nmc_registration')
    .notEmpty()
    .withMessage('Nepal Medical Council registration number is required')
    .custom(async (nmc_registration) => {
      const { default: Doctor } = await import('../models/Doctor.js');
      const existingDoctor = await Doctor.findOne({ nmc_registration });
      if (existingDoctor) {
        throw new Error('NMC registration number already exists');
      }
    }),

  body('primarySpecialization')
    .notEmpty()
    .withMessage('Primary specialization is required')
    .isIn([
      'General Medicine', 'Cardiology', 'Dermatology', 'Endocrinology',
      'Gastroenterology', 'Neurology', 'Oncology', 'Pediatrics',
      'Psychiatry', 'Pulmonology', 'Rheumatology', 'Urology',
      'Gynecology', 'Orthopedics', 'Ophthalmology', 'ENT',
      'Anesthesiology', 'Radiology', 'Pathology', 'Emergency Medicine',
      'Family Medicine', 'Internal Medicine', 'Surgery', 'Dentistry'
    ])
    .withMessage('Please select a valid specialization'),

  body('totalExperience')
    .isInt({ min: 0, max: 60 })
    .withMessage('Total experience must be between 0 and 60 years'),

  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),

  body('education.*.degree')
    .optional()
    .isIn(['MBBS', 'BDS', 'MD', 'MS', 'DM', 'MCh', 'PhD', 'Diploma', 'Fellowship'])
    .withMessage('Please provide a valid degree'),

  body('education.*.institution')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Institution name is required'),

  body('education.*.yearOfCompletion')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage('Please provide a valid year of completion'),

  body('currentWorkplace')
    .optional()
    .isArray()
    .withMessage('Current workplace must be an array'),

  body('currentWorkplace.*.hospitalName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Hospital name is required'),

  body('languagesSpoken')
    .optional()
    .isArray()
    .withMessage('Languages spoken must be an array'),

  body('languagesSpoken.*')
    .optional()
    .isIn(['Nepali', 'English', 'Hindi', 'Maithili', 'Bhojpuri', 'Newari', 'Urdu'])
    .withMessage('Please select valid languages'),

  body('consultationFee.video')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Video consultation fee must be a positive number'),

  body('consultationFee.audio')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Audio consultation fee must be a positive number'),

  body('consultationFee.chat')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Chat consultation fee must be a positive number'),

  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),

  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Please provide your password'),

  handleValidationErrors
];

// Validation rules for forgot password
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  handleValidationErrors
];

// Validation rules for reset password
const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  handleValidationErrors
];

// Validation rules for update password
const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Please provide your current password'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmNewPassword')
    .custom((confirmNewPassword, { req }) => {
      if (confirmNewPassword !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),

  handleValidationErrors
];

export {
  validatePatientSignup,
  validateDoctorSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
  handleValidationErrors
};

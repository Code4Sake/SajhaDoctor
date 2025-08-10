import * as crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createSendToken } from '../middlewares/auth.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js'

// Error handling wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Sign up new user (general signup)
const signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide firstName, lastName, email, and password.'
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      status: 'fail',
      message: 'User with this email already exists.'
    });
  }

  try {
    // Create new user with only provided fields
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'patient'
    };

    // Only add phoneNumber if provided
    if (phoneNumber) userData.phoneNumber = phoneNumber;

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });

    const newUser = await User.create(userData);

    // Check if the user model has the createEmailVerificationToken method
    if (typeof newUser.createEmailVerificationToken === 'function') {
      // Generate email verification token
      const verifyToken = newUser.createEmailVerificationToken();
      await newUser.save({ validateBeforeSave: false });

      // Try to send welcome email
      try {
        await sendWelcomeEmail(newUser, verifyToken);
      } catch (emailError) {
        console.log('Email sending failed:', emailError.message);
        // Continue with user creation even if email fails
      }
    } else {
      console.log('Warning: createEmailVerificationToken method not found on User model');
    }

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully! Please check your email to verify your account.',
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
          isVerified: newUser.isVerified,
          isActive: newUser.isActive
        }
      }
    });
  } catch (err) {
    // Log the detailed error for debugging
    console.error('Error creating user:', err);

    // Check for specific MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: errors
      });
    }

    // Check for duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        status: 'fail',
        message: `User with this ${field} already exists.`
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'There was an error creating the user. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/// Sign up patient (specific signup for patients)
const signupPatient = catchAsync(async (req, res, next) => {
    console.log("🔵 [1] Route hit: /signup/patient");
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    dateOfBirth,
    gender,
    address,
    emergencyContact
  } = req.body;
   console.log("🔵 [2] Request body parsed");


  // Log the incoming request data (remove in production)
  console.log('Signup Patient Request:', { firstName, lastName, email, phoneNumber: phoneNumber ? 'provided' : 'not provided' });

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide firstName, lastName, email, and password.'
    });
  }

  // Check if user already exists
  console.log("🔵 [3] Checking for existing user");
  const existingUser = await User.findOne({ email });
  console.log("🟢 [3.1] User exists check done");
  if (existingUser) {
    return res.status(409).json({
      status: 'fail',
      message: 'User with this email already exists.'
    });
  }

  // Declare variables outside try block for proper scoping
  let newUser = null;
  let newPatient = null;

  try {
    // Create new patient user with only the fields that are provided
    const userData = {
      firstName,
      lastName,
      email,
      password,
      userType: 'patient'
    };

    // Only add optional fields if they are provided
    if (phoneNumber) userData.phoneNumber = phoneNumber;
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
    if (gender) userData.gender = gender;
    if (address) userData.address = address;

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });

    newUser = await User.create(userData);

    // Create corresponding Patient profile with minimal required fields
    newPatient = await Patient.create({
      userId: newUser._id,
      dateOfBirth: dateOfBirth || null,
      gender: gender || 'not-specified',
      emergencyContact: emergencyContact || {
        name: '',
        relationship: '',
        phoneNumber: '',
        email: ''
      },
      medicalHistory: {
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
        pastSurgeries: [],
        familyHistory: []
      },
      insurance: {
        provider: '',
        policyNumber: '',
        groupNumber: ''
      }
    });

    // Check if the user model has the createEmailVerificationToken method
    if (typeof newUser.createEmailVerificationToken === 'function') {
      // Generate email verification token
      const verifyToken = newUser.createEmailVerificationToken();
      await newUser.save({ validateBeforeSave: false });

      // Try to send welcome email
      try {
        await sendWelcomeEmail(newUser, verifyToken);
      } catch (emailError) {
        console.log('Email sending failed:', emailError.message);
      }
    } else {
      console.log('Warning: createEmailVerificationToken method not found on User model');
    }

    res.status(201).json({
      status: 'success',
      message: 'Patient account created successfully! Please check your email to verify your account.',
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          userType: newUser.userType,
          dateOfBirth: newUser.dateOfBirth,
          gender: newUser.gender,
          isVerified: newUser.isVerified,
          isActive: newUser.isActive
        },
        patient: {
          id: newPatient._id,
          dateOfBirth: newPatient.dateOfBirth,
          gender: newPatient.gender,
          emergencyContact: newPatient.emergencyContact
        }
      }
    });
  } catch (err) {
    // Log the detailed error for debugging
    console.error('Error creating patient account:', err);

    // If patient creation fails but user was created, clean up the user
    if (newUser && newUser._id) {
      try {
        await User.findByIdAndDelete(newUser._id);
        console.log('Cleaned up user after patient creation failure');
      } catch (cleanupError) {
        console.log('Failed to cleanup user:', cleanupError.message);
      }
    }

    // Check for specific MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: errors
      });
    }

    // Check for duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        status: 'fail',
        message: `User with this ${field} already exists.`
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'There was an error creating the patient account. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// Sign up doctor (specific signup for doctors)
// Replace your signupDoctor function with this complete version

const signupDoctor = catchAsync(async (req, res, next) => {
  console.log('=== DOCTOR SIGNUP DEBUG ===');
  console.log('Full request body:', JSON.stringify(req.body, null, 2));

  const {
    // User fields
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
    dateOfBirth,
    gender,
    address,

    // Doctor specific fields - EXTRACT ALL OF THEM
    licenseNumber,
    nmc_registration,
    primarySpecialization,
    secondarySpecializations = [],
    totalExperience,
    consultationFee, // ← This was missing!
    languagesSpoken = ['English', 'Nepali'],
    availability, // ← This was missing!
    education = [],
    currentWorkplace = [],
    bio,
    specialistIn = [],
    availableForEmergency = false,
    emergencyContactNumber,

    // Legacy support for old field names
    experience
  } = req.body;

  console.log('Extracted availability:', JSON.stringify(availability, null, 2));
  console.log('Extracted consultationFee:', JSON.stringify(consultationFee, null, 2));

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !primarySpecialization || !licenseNumber) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide firstName, lastName, email, password, primarySpecialization, and licenseNumber.'
    });
  }

  // Additional validation for doctor fields
  if (!nmc_registration) {
    return res.status(400).json({
      status: 'fail',
      message: 'NMC registration number is required.'
    });
  }

  if (totalExperience === undefined && experience === undefined) {
    return res.status(400).json({
      status: 'fail',
      message: 'Total experience is required.'
    });
  }

  // Validate password match if confirmPassword is provided
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Passwords do not match.'
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber: phoneNumber }]
  });
  if (existingUser) {
    return res.status(409).json({
      status: 'fail',
      message: 'User with this email or phone number already exists.'
    });
  }

  // Check if doctor already exists with license/nmc
  const existingDoctor = await Doctor.findOne({
    $or: [{ licenseNumber }, { nmc_registration }]
  });
  if (existingDoctor) {
    return res.status(409).json({
      status: 'fail',
      message: 'Doctor with this license number or NMC registration already exists.'
    });
  }

  // Declare variables outside try block for proper scoping
  let newUser = null;
  let newDoctor = null;

  try {
    // Create new doctor user
    const userData = {
      firstName,
      lastName,
      email,
      password,
      userType: 'doctor'
    };

    // Add optional user fields if provided
    if (phoneNumber) userData.phoneNumber = phoneNumber;
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
    if (gender) userData.gender = gender;
    if (address) {
      userData.address = address;
    } else {
      // Default address if not provided
      userData.address = {
        province: 'Bagmati Province',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City'
      };
    }

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
    newUser = await User.create(userData);

    // Prepare doctor data
    const doctorData = {
      userId: newUser._id,
      licenseNumber,
      nmc_registration,
      primarySpecialization,
      totalExperience: totalExperience || experience || 0,
      verificationStatus: 'verified' // You can change this to 'pending' if you want manual verification
    };

    // Add optional doctor fields
    if (secondarySpecializations && secondarySpecializations.length > 0) {
      doctorData.secondarySpecializations = secondarySpecializations;
    }

    if (education && education.length > 0) {
      doctorData.education = education;
    }

    if (currentWorkplace && currentWorkplace.length > 0) {
      doctorData.currentWorkplace = currentWorkplace;
    }

    if (languagesSpoken && languagesSpoken.length > 0) {
      doctorData.languagesSpoken = languagesSpoken;
    }

    if (bio) {
      doctorData.bio = bio;
    }

    if (specialistIn && specialistIn.length > 0) {
      doctorData.specialistIn = specialistIn;
    }

    if (availableForEmergency !== undefined) {
      doctorData.availableForEmergency = availableForEmergency;
    }

    if (emergencyContactNumber) {
      doctorData.emergencyContactNumber = emergencyContactNumber;
    }

    // ✅ HANDLE CONSULTATION FEE PROPERLY
    if (consultationFee) {
      doctorData.consultationFee = {
        video: consultationFee.video || 500,
        audio: consultationFee.audio || 300,
        chat: consultationFee.chat || 200,
        inPerson: consultationFee.inPerson || 800
      };
      console.log('Set consultationFee:', doctorData.consultationFee);
    }

    // ✅ HANDLE AVAILABILITY PROPERLY - THIS WAS THE MAIN ISSUE!
    if (availability) {
      console.log('Processing availability data...');

      // Ensure we have the complete availability structure
      const defaultDay = { available: false, slots: [] };

      doctorData.availability = {
        monday: availability.monday || defaultDay,
        tuesday: availability.tuesday || defaultDay,
        wednesday: availability.wednesday || defaultDay,
        thursday: availability.thursday || defaultDay,
        friday: availability.friday || defaultDay,
        saturday: availability.saturday || defaultDay,
        sunday: availability.sunday || defaultDay
      };

      console.log('Final availability to save:', JSON.stringify(doctorData.availability, null, 2));
    } else {
      console.log('No availability data provided - using schema defaults');
    }

    console.log('Creating doctor with data:', JSON.stringify(doctorData, null, 2));
    newDoctor = await Doctor.create(doctorData);

    console.log('Doctor created successfully. Checking saved availability...');

    // Verify what was actually saved
    const savedDoctor = await Doctor.findById(newDoctor._id);
    console.log('Saved doctor availability:', JSON.stringify(savedDoctor.availability, null, 2));

    // Generate email verification token
    let verifyToken = null;
    if (typeof newUser.createEmailVerificationToken === 'function') {
      verifyToken = newUser.createEmailVerificationToken();
      await newUser.save({ validateBeforeSave: false });

      // Try to send welcome email
      try {
        await sendWelcomeEmail(newUser, verifyToken);
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.log('Email sending failed:', emailError.message);
      }
    } else {
      console.log('Warning: createEmailVerificationToken method not found on User model');
    }

    res.status(201).json({
      status: 'success',
      message: 'Doctor account created successfully! Please check your email to verify your account.',
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          userType: newUser.userType,
          isVerified: newUser.isVerified,
          isActive: newUser.isActive
        },
        doctor: {
          id: savedDoctor._id,
          primarySpecialization: savedDoctor.primarySpecialization,
          licenseNumber: savedDoctor.licenseNumber,
          nmc_registration: savedDoctor.nmc_registration,
          totalExperience: savedDoctor.totalExperience,
          verificationStatus: savedDoctor.verificationStatus,
          consultationFee: savedDoctor.consultationFee,
          availability: savedDoctor.availability, // Include this in response to verify
          languagesSpoken: savedDoctor.languagesSpoken
        }
      }
    });

  } catch (err) {
    console.error('Error creating doctor account:', err);

    // If doctor creation fails but user was created, clean up the user
    if (newUser && newUser._id) {
      try {
        await User.findByIdAndDelete(newUser._id);
        console.log('Cleaned up user after doctor creation failure');
      } catch (cleanupError) {
        console.log('Failed to cleanup user:', cleanupError.message);
      }
    }

    // Check for specific MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: errors
      });
    }

    // Check for duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
      return res.status(409).json({
        status: 'fail',
        message: `Doctor with this ${field} already exists.`
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'There was an error creating the doctor account. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// Login user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password'
    });
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      status: 'fail',
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // If everything ok, send token to client
  createSendToken(user, 200, res);
});

// Logout user
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Verify email
const verifyEmail = catchAsync(async (req, res, next) => {
  if (!req.params.token) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a verification token.'
    });
  }

  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  // If token has not expired, and there is a user, verify the email
  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Token is invalid or has expired'
    });
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully! You can now access all features.'
  });
});

// Forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
  // Check if email is provided
  if (!req.body.email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide your email address.'
    });
  }

  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no user with that email address.'
    });
  }

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: 'error',
      message: 'There was an error sending the email. Try again later.'
    });
  }
});

// Reset password
const resetPassword = catchAsync(async (req, res, next) => {
  // Check if password is provided
  if (!req.body.password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a new password.'
    });
  }

  if (!req.params.token) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a reset token.'
    });
  }

  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If token has not expired, and there is a user, set the new password
  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Token is invalid or has expired'
    });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

// Update password (for logged in users)
const updatePassword = catchAsync(async (req, res, next) => {
  // Check if required fields are provided
  if (!req.body.currentPassword || !req.body.newPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide both current and new password.'
    });
  }

  // Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Your current password is incorrect.'
    });
  }

  // If so, update password
  user.password = req.body.newPassword;
  await user.save();

  // Log user in, send JWT
  createSendToken(user, 200, res);
});

// Get current user
const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// Resend verification email
const resendVerificationEmail = catchAsync(async (req, res, next) => {
  // Check if email is provided
  if (!req.body.email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide your email address.'
    });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No user found with that email address.'
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      status: 'fail',
      message: 'This account is already verified.'
    });
  }

  // Generate new verification token
  const verifyToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendWelcomeEmail(user, verifyToken);

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent successfully!'
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: 'error',
      message: 'There was an error sending the verification email. Please try again.'
    });
  }
});

// Google OAuth success callback
const googleSuccess = catchAsync(async (req, res) => {
  // Check if user needs to complete their profile
  const needsProfileCompletion = !req.user.phoneNumber || req.user.phoneNumber === '0000000000';

  // Generate JWT token
  createSendToken(req.user, 200, res);
});

// Google OAuth failure callback
const googleFailure = (req, res) => {
  res.status(401).json({
    status: 'fail',
    message: 'Google authentication failed'
  });
};

export {
  signup,
  signupPatient,
  signupDoctor,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  getMe,
  resendVerificationEmail,
  googleSuccess,
  googleFailure
};

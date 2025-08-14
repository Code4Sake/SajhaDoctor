// routes/auth.js - Authentication Routes with Patient Profile Creation
import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
// Import Doctor model when needed
// import Doctor from '../models/Doctor.js';

const router = express.Router();

// Helper function to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Helper function to send token response
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user
    }
  });
};

// @route   POST /api/auth/signup/patient
// @desc    Register a new patient
// @access  Public
router.post('/signup/patient', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      gender,
      address,
      // Optional medical info during registration
      bloodGroup,
      emergencyContact
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
        errors: ['First name, last name, email, phone number and password are required']
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
        errors: ['A user with this email or phone number already exists']
      });
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      userType: 'patient',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address,
      isVerified: true // Auto-verify for now, implement email verification later
    });

    // Create patient profile
    const patientData = {
      userId: newUser._id
    };

    // Add optional medical info if provided
    if (bloodGroup) patientData.bloodGroup = bloodGroup;
    if (emergencyContact) patientData.emergencyContact = emergencyContact;

    const newPatient = await Patient.create(patientData);

    // Update user's last login
    newUser.lastLogin = new Date();
    await newUser.save({ validateBeforeSave: false });

    // Send token response
    createSendToken(newUser, 201, res, 'Patient registered successfully');

  } catch (error) {
    console.error('Patient Registration Error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate field error',
        errors: [`${field} already exists`]
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error creating patient account',
      error: error.message
    });
  }
});

// @route   POST /api/auth/signup/doctor
// @desc    Register a new doctor
// @access  Public
router.post('/signup/doctor', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      gender,
      address,
      licenseNumber,
      nmc_registration,
      primarySpecialization,
      experience
    } = req.body;

    // Validate required fields for doctors
    if (!firstName || !lastName || !email || !phoneNumber || !password ||
        !licenseNumber || !primarySpecialization) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
        errors: ['First name, last name, email, phone number, password, license number and specialization are required']
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
        errors: ['A user with this email or phone number already exists']
      });
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      userType: 'doctor',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address,
      isVerified: false // Doctors need manual verification
    });

    // Note: Doctor profile creation would go here
    // This requires the Doctor model which wasn't provided
    // const newDoctor = await Doctor.create({
    //   userId: newUser._id,
    //   licenseNumber,
    //   nmc_registration,
    //   primarySpecialization,
    //   experience: parseInt(experience) || 0,
    //   isVerified: false // Doctors need manual verification
    // });

    res.status(201).json({
      status: 'success',
      message: 'Doctor registration submitted successfully. Your account will be verified within 24 hours.',
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          userType: newUser.userType,
          isVerified: newUser.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Doctor Registration Error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate field error',
        errors: [`${field} already exists`]
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error creating doctor account',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
        errors: ['Email and password are required']
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
        errors: ['Incorrect email or password']
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated',
        errors: ['Your account has been deactivated. Please contact support.']
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // If this is a patient, ensure patient profile exists
    if (user.userType === 'patient') {
      let patient = await Patient.findOne({ userId: user._id });

      if (!patient) {
        // Create patient profile if it doesn't exist
        patient = await Patient.create({
          userId: user._id
        });
        console.log('Created missing patient profile for user:', user.email);
      }
    }

    // Send token
    createSendToken(user, 200, res, 'Login successful');

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during login',
      error: error.message
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // Extract token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in',
        errors: ['Please log in to access this resource']
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);    
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists',
        errors: ['The user belonging to this token no longer exists ']
      });
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'Password recently changed',
        errors: ['User recently changed password! Please log in again.']
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: currentUser
      }
    });

  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid token',
      errors: ['Please log in again']
    });
  }
});

export default router;

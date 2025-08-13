// middlewares/auth.js - Authentication Middleware
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
        errors: ['No authentication token provided']
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'fail',
          message: 'Your token has expired! Please log in again.',
          errors: ['Token expired']
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token! Please log in again.',
          errors: ['Invalid token']
        });
      }

      throw error;
    }

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
        errors: ['User not found']
      });
    }

    // Check if user is active
    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.',
        errors: ['Account deactivated']
      });
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.',
        errors: ['Password changed']
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error',
      error: error.message
    });
  }
};

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
        errors: [`Access denied. Required roles: ${roles.join(', ')}`]
      });
    }
    next();
  };
};

// Check if user is verified (for actions requiring verified users)
export const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      status: 'fail',
      message: 'Please verify your email address to access this feature.',
      errors: ['Email verification required']
    });
  }
  next();
};

// Optional auth - doesn't fail if no token provided
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // Add user to request if valid
    req.user = currentUser;
    next();
  } catch (error) {
    // If there's an error with optional auth, just continue without user
    next();
  }
};

// Check if user owns the resource (for patient/doctor specific resources)
export const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    // For routes where the resource belongs to the authenticated user
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only access your own resources.',
        errors: ['Access denied to resource']
      });
    }
    
    next();
  };
};

// Rate limiting helper
export const createRateLimit = (windowMs, max, message) => {
  return {
    windowMs,
    max,
    message: {
      status: 'error',
      message: message || 'Too many requests, please try again later.',
      errors: ['Rate limit exceeded']
    },
    standardHeaders: true,
    legacyHeaders: false,
  };
};
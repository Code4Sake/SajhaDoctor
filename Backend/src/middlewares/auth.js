// middlewares/auth.js - Debug Authentication Middleware
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
      console.log('🔍 Decoded token:', decoded);
      console.log('🔍 Token payload structure:', JSON.stringify(decoded, null, 2));
      console.log('🔍 User ID from token:', decoded.id);
      console.log('🔍 User ID type:', typeof decoded.id);
    } catch (error) {
      console.error('❌ JWT verification error:', error);

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

      return res.status(401).json({
        status: 'fail',
        message: 'Token verification failed',
        errors: [error.message]
      });
    }

    // Debug: Check what ID field exists in the token
    const possibleIdFields = ['id', '_id', 'userId', 'user_id'];
    console.log('🔍 Checking possible ID fields in token:');
    possibleIdFields.forEach(field => {
      if (decoded[field]) {
        console.log(`   ✅ ${field}: ${decoded[field]} (type: ${typeof decoded[field]})`);
      } else {
        console.log(`   ❌ ${field}: not found`);
      }
    });

    // Try to find user with different possible ID fields
    let currentUser;
    let usedIdField = null;

    for (const idField of possibleIdFields) {
      if (decoded[idField]) {
        console.log(`🔍 Attempting to find user with ${idField}: ${decoded[idField]}`);
        try {
          currentUser = await User.findById(decoded.id);
          console.log("the curren user is",decoded);

          if (currentUser) {
            usedIdField = idField;
            console.log(`✅ User found using field '${idField}':`, {
              id: currentUser._id,
              email: currentUser.email,
              userType: currentUser.userType,
              isActive: currentUser.isActive
            });
            break;
          } else {
            console.log(`❌ No user found with ${idField}: ${decoded[idField]}`);
          }
        } catch (dbError) {
          console.log(`❌ Database error when searching with ${idField}:`, dbError.message);
        }
      }
    }

    // Additional debugging: Try to find user by email if available
    if (!currentUser && decoded.email) {
      console.log(`🔍 Attempting to find user by email: ${decoded.email}`);
      try {
        console.log("this is decoded email",decoded.email);

        currentUser = await User.findOne({ email: decoded.email });

        if (currentUser) {
          console.log('✅ User found by email:', {
            id: currentUser._id,
            email: currentUser.email,
            userType: currentUser.userType
          });
          usedIdField = 'email';
        }
      } catch (dbError) {
        console.log('❌ Database error when searching by email:', dbError.message);
      }
    }

    // Debug: Check database connection and User model
    if (!currentUser) {
      console.log('🔍 Debugging database and model:');
      try {
        // Check if we can query the User collection at all
        const userCount = await User.countDocuments();
        console.log(`📊 Total users in database: ${userCount}`);

        // Try to find any user to test the connection
        const anyUser = await User.findOne().limit(1);
        if (anyUser) {
          console.log('✅ Database connection working. Sample user:', {
            id: anyUser._id,
            email: anyUser.email,
            userType: anyUser.userType
          });
        } else {
          console.log('❌ No users found in database');
        }

        // List all users for debugging (only in development)
        if (process.env.NODE_ENV === 'development' && userCount < 10) {
          const allUsers = await User.find({}, { _id: 1, email: 1, userType: 1 }).limit(10);
          console.log('🔍 All users in database:', allUsers);
        }
      } catch (dbError) {
        console.error('❌ Database connection error:', dbError);
        return res.status(500).json({
          status: 'error',
          message: 'Database connection error',
          error: process.env.NODE_ENV === 'development' ? dbError.message : 'Internal server error'
        });
      }
    }

    if (!currentUser) {
      console.log('❌ User not found after all attempts');
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does not exist.',
        errors: ['User not found'],
        debug: process.env.NODE_ENV === 'development' ? {
          tokenPayload: decoded,
          searchedFields: possibleIdFields,
          suggestion: 'Check if the user ID in the token matches the user ID in the database'
        } : undefined
      });
    }

    console.log(`✅ User authenticated successfully using field '${usedIdField}'`);

    // Check if user is active
    if (currentUser.isActive === false) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.',
        errors: ['Account deactivated']
      });
    }

    // Check if user changed password after the token was issued (only if method exists)
    if (typeof currentUser.changedPasswordAfter === 'function' &&
        currentUser.changedPasswordAfter(decoded.iat)) {
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
    console.error('❌ Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Test endpoint to check JWT token structure (add this temporarily)
export const debugToken = (req, res) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(400).json({
        status: 'fail',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      status: 'success',
      data: {
        tokenPayload: decoded,
        availableFields: Object.keys(decoded),
        recommendations: {
          id: decoded.id ? 'Found' : 'Missing',
          _id: decoded._id ? 'Found' : 'Missing',
          userId: decoded.userId ? 'Found' : 'Missing',
          email: decoded.email ? 'Found' : 'Missing'
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Token debug failed',
      error: error.message
    });
  }
};

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Authentication required',
          errors: ['User not authenticated']
        });
      }

      console.log(`🔍 Role check - User role: ${req.user.userType}, Required roles: ${roles.join(', ')}`);

      if (!roles.includes(req.user.userType)) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to perform this action.',
          errors: [`Access denied. Required roles: ${roles.join(', ')}, your role: ${req.user.userType}`]
        });
      }

      console.log('✅ Role check passed');
      next();
    } catch (error) {
      console.error('❌ Role restriction error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Authorization error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
};

// Check if user is verified (for actions requiring verified users)
export const requireVerified = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required',
        errors: ['User not authenticated']
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        status: 'fail',
        message: 'Please verify your email address to access this feature.',
        errors: ['Email verification required']
      });
    }
    next();
  } catch (error) {
    console.error('❌ Verification check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Verification check error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
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
    const currentUser = await User.findById(decoded.id || decoded._id || decoded.userId);
    if (!currentUser) {
      return next();
    }

    // Check if user changed password after the token was issued (only if method exists)
    if (typeof currentUser.changedPasswordAfter === 'function' &&
        currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // Add user to request if valid
    req.user = currentUser;
    next();
  } catch (error) {
    // If there's an error with optional auth, just continue without user
    console.log('Optional auth error (continuing):', error.message);
    next();
  }
};

// Check if user owns the resource (for patient/doctor specific resources)
export const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Authentication required',
          errors: ['User not authenticated']
        });
      }

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
    } catch (error) {
      console.error('❌ Resource ownership check error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Resource ownership check error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
};

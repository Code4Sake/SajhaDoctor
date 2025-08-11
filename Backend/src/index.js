// server.js
// Configure dotenv FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';

// Import configurations
import connectDB from './config/database.js';
import passport from './config/passport.js';

// Import all routes
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';
import searchRoutes from './routes/search.js';

// Connect to MongoDB
connectDB();

const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security middleware (helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.telemedicine-nepal.com"]
    }
  }
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',        // Added your Vite frontend origin here
  process.env.CLIENT_URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    status: 'error',
    message: 'Too many appointment booking attempts, please try again later.'
  },
  skip: (req) => !req.path.includes('/book')
});

const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    status: 'error',
    message: 'Too many search requests, please try again later.'
  }
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration (required for Passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Telemedicine Nepal API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    features: {
      authentication: 'JWT + Google OAuth',
      userTypes: ['patient', 'doctor', 'admin'],
      services: [
        'Doctor Search & Filtering',
        'Appointment Booking',
        'Real-time Availability',
        'Patient & Doctor Dashboards',
        'Medical History Management'
      ]
    },
    endpoints: {
      authentication: '/api/auth/*',
      doctors: '/api/doctors/*',
      patients: '/api/patients/*',
      appointments: '/api/appointments/*',
      search: '/api/search/*'
    }
  });
});

// API Status route
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Telemedicine Nepal API - All Systems Operational',
    timestamp: new Date().toISOString(),
    availableRoutes: {
      auth: {
        baseUrl: '/api/auth',
        routes: [
          'POST /signup/patient - Register as patient',
          'POST /signup/doctor - Register as doctor',
          'POST /login - User login',
          'POST /logout - User logout',
          'GET /me - Get current user profile',
          'GET /verify-email/:token - Verify email',
          'POST /forgot-password - Request password reset',
          'PATCH /reset-password/:token - Reset password'
        ]
      },
      doctors: {
        baseUrl: '/api/doctors',
        routes: [
          'GET / - Get all doctors (with filters)',
          'GET /:doctorId - Get doctor details',
          'PATCH /profile - Update doctor profile (auth required)',
          'PATCH /toggle-online - Toggle online status (auth required)',
          'GET /my/dashboard - Get doctor dashboard (auth required)'
        ]
      },
      patients: {
        baseUrl: '/api/patients',
        routes: [
          'GET /profile - Get patient profile (auth required)',
          'PATCH /profile - Update patient profile (auth required)',
          'GET /dashboard - Get patient dashboard (auth required)',
          'POST /medical-history - Add medical history (auth required)'
        ]
      },
      appointments: {
        baseUrl: '/api/appointments',
        routes: [
          'POST /book - Book appointment (patient auth required)',
          'GET /my-appointments - Get user appointments (auth required)',
          'GET /:appointmentId - Get appointment details (auth required)',
          'PATCH /:appointmentId/cancel - Cancel appointment (auth required)',
          'PATCH /:appointmentId/confirm - Confirm appointment (doctor auth required)',
          'GET /doctor/:doctorId/availability - Check doctor availability'
        ]
      },
      search: {
        baseUrl: '/api/search',
        routes: [
          'GET /doctors - Advanced doctor search',
          'GET /suggestions - Get search filter options'
        ]
      }
    }
  });
});

// API routes with rate limiters
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentLimiter, appointmentRoutes);
app.use('/api/search', searchLimiter, searchRoutes);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
    availableEndpoints: 'Visit /api for available routes'
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

app.use((err, req, res, next) => {
  console.error('Error Details:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID format',
      error: err.path ? `Invalid ${err.path}: ${err.value}` : 'Invalid data format'
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(400).json({
      status: 'fail',
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid authentication token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication token has expired. Please log in again.'
    });
  }

  if (err.message.includes('CORS')) {
    return res.status(403).json({
      status: 'fail',
      message: 'CORS policy violation. Origin not allowed.'
    });
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server!',
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Telemedicine Nepal API Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${process.env.NODE_ENV}
🌐 Server running on: http://localhost:${PORT}
📊 Database: Connected to MongoDB
🔐 Authentication: JWT + Google OAuth enabled
🛡️  Security: Helmet, CORS, Rate Limiting active
⏰ Started at: ${new Date().toISOString()}

📋 Available API Endpoints:
   • Authentication: http://localhost:${PORT}/api/auth
   • Doctors: http://localhost:${PORT}/api/doctors
   • Patients: http://localhost:${PORT}/api/patients
   • Appointments: http://localhost:${PORT}/api/appointments
   • Search: http://localhost:${PORT}/api/search

📖 API Documentation: http://localhost:${PORT}/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

export default app;

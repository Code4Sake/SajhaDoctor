// models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  // Reference to base User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Professional Information
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  nmc_registration: {
    type: String, // Nepal Medical Council registration
    required: true,
    unique: true
  },

  // Specialization
  primarySpecialization: {
    type: String,
    required: true,
    enum: [
      'General Medicine', 'Cardiology', 'Dermatology', 'Endocrinology',
      'Gastroenterology', 'Neurology', 'Oncology', 'Pediatrics',
      'Psychiatry', 'Pulmonology', 'Rheumatology', 'Urology',
      'Gynecology', 'Orthopedics', 'Ophthalmology', 'ENT',
      'Anesthesiology', 'Radiology', 'Pathology', 'Emergency Medicine',
      'Family Medicine', 'Internal Medicine', 'Surgery', 'Dentistry'
    ]
  },

  secondarySpecializations: [{
    type: String,
    enum: [
      'General Medicine', 'Cardiology', 'Dermatology', 'Endocrinology',
      'Gastroenterology', 'Neurology', 'Oncology', 'Pediatrics',
      'Psychiatry', 'Pulmonology', 'Rheumatology', 'Urology',
      'Gynecology', 'Orthopedics', 'Ophthalmology', 'ENT',
      'Anesthesiology', 'Radiology', 'Pathology', 'Emergency Medicine',
      'Family Medicine', 'Internal Medicine', 'Surgery', 'Dentistry'
    ]
  }],

  // Education
  education: [{
    degree: {
      type: String,
      required: true,
      enum: ['MBBS', 'BDS', 'MD', 'MS', 'DM', 'MCh', 'PhD', 'Diploma', 'Fellowship']
    },
    institution: {
      type: String,
      required: true
    },
    yearOfCompletion: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear()
    },
    country: {
      type: String,
      default: 'Nepal'
    }
  }],

  // Experience
  totalExperience: {
    type: Number,
    required: true,
    min: 0,
    max: 60 // years
  },

  currentWorkplace: [{
    hospitalName: {
      type: String,
      required: true
    },
    position: String,
    department: String,
    startDate: Date,
    isCurrentlyWorking: {
      type: Boolean,
      default: true
    },
    address: {
      province: String,
      district: String,
      municipality: String
    }
  }],

  previousWorkExperience: [{
    hospitalName: String,
    position: String,
    startDate: Date,
    endDate: Date,
    responsibilities: [String]
  }],

  // Certifications
  certifications: [{
    name: String,
    issuingOrganization: String,
    dateIssued: Date,
    expiryDate: Date,
    certificateNumber: String
  }],

  // Research and Publications
  publications: [{
    title: String,
    journal: String,
    year: Number,
    doi: String
  }],

  // Languages spoken
  languagesSpoken: [{
    type: String,
    enum: ['Nepali', 'English', 'Hindi', 'Maithili', 'Bhojpuri', 'Newari', 'Urdu']
  }],

  // Consultation Details
  consultationFee: {
    video: {
      type: Number,
      min: 0,
      default: 500 // NPR
    },
    audio: {
      type: Number,
      min: 0,
      default: 300 // NPR
    },
    chat: {
      type: Number,
      min: 0,
      default: 200 // NPR
    },
    inPerson: {
      type: Number,
      min: 0,
      default: 800 // NPR
    }
  },

  // Availability
  availability: {
    monday: {
      available: { type: Boolean, default: false },
      slots: [{ start: String, end: String }] // "09:00", "17:00"
    },
    tuesday: {
      available: { type: Boolean, default: false },
      slots: [{ start: String, end: String }]
    },
    wednesday: {
      available: { type: Boolean, default: false },
      slots: [{ start: String, end: String }]
    },
    thursday: {
      available: { type: Boolean, default: false },
      slots: [{ start: String, end: String }]
    },
    friday: {
      available: { type: Boolean, default: false },
      slots: [{ start: String, end: String }]
    },
    saturday: {
      available: { type: Boolean, default: false },
      slots: [{ start: String, end: String }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      slots: [{ start: String, end: String }]
    }
  },

  // Online Status
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: Date,

  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'verified'
  },
  verificationDocuments: [{
    documentType: {
      type: String,
      enum: ['license', 'degree', 'nmc_certificate', 'experience_letter']
    },
    documentUrl: String,
    uploadedAt: Date
  }],
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Ratings and Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalConsultations: {
    type: Number,
    default: 0
  },

  // Bio and Description
  bio: {
    type: String,
    maxlength: 1000
  },
  specialistIn: [String], // What conditions they specialize in

  // Emergency availability
  availableForEmergency: {
    type: Boolean,
    default: false
  },
  emergencyContactNumber: String,

  // Created and Updated timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for years of experience calculation
doctorSchema.virtual('experienceYears').get(function() {
  return this.totalExperience;
});

// Indexes
doctorSchema.index({ userId: 1 });
doctorSchema.index({ primarySpecialization: 1 });
doctorSchema.index({ licenseNumber: 1 });
doctorSchema.index({ nmc_registration: 1 });
doctorSchema.index({ verificationStatus: 1 });
doctorSchema.index({ isOnline: 1 });
doctorSchema.index({ averageRating: -1 });
doctorSchema.index({ 'currentWorkplace.hospitalName': 1 });

const Doctor = mongoose.model('Doctor', doctorSchema, 'doctors');
export default Doctor;

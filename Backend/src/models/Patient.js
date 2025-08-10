// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  // Reference to base User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Medical Information
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  height: {
    type: Number, // in cm
    min: 50,
    max: 250
  },
  weight: {
    type: Number, // in kg
    min: 10,
    max: 300
  },

  // Medical History
  allergies: [{
    allergen: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    notes: String
  }],

  chronicConditions: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'controlled', 'resolved']
    },
    medications: [String]
  }],

  currentMedications: [{
    medicationName: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    prescribedBy: String
  }],

  // Emergency Contact
  emergencyContact: {
    name: {
      type: String,
      required: false
    },
    relationship: String,
    phoneNumber: {
      type: String,
      required: false,
      match: [/^(\+977)?[0-9]{10}$/, 'Please provide a valid phone number']
    },
    email: String
  },

  // Insurance Information (Nepal context)
  insuranceDetails: {
    hasInsurance: {
      type: Boolean,
      default: false
    },
    insuranceProvider: String,
    policyNumber: String,
    validUntil: Date
  },

  // Consultation History (references to consultations)
  consultationHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  }],

  // Preferences
  preferredLanguage: {
    type: String,
    enum: ['Nepali', 'English', 'Hindi', 'Maithili', 'Bhojpuri', 'Newari'],
    default: 'Nepali'
  },

  // Health Goals
  healthGoals: [String],

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
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for BMI calculation
patientSchema.virtual('bmi').get(function() {
  if (this.weight && this.height) {
    const heightInMeters = this.height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Virtual for age calculation
patientSchema.virtual('age').get(function() {
  // This will be populated from User model
  return null;
});

// Indexes
patientSchema.index({ userId: 1 });
patientSchema.index({ 'emergencyContact.phoneNumber': 1 });

const Patient = mongoose.model('Patient', patientSchema, 'patients');
export default Patient;

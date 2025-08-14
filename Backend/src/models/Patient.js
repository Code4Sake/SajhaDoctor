// models/Patient.js - Patient Model
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  // Reference to User
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
    min: [50, 'Height must be at least 50 cm'],
    max: [250, 'Height cannot exceed 250 cm']
  },
  weight: {
    type: Number, // in kg
    min: [10, 'Weight must be at least 10 kg'],
    max: [500, 'Weight cannot exceed 500 kg']
  },

  // Medical History
  allergies: [{
    allergen: { type: String, required: true },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    description: String,
    diagnosedDate: Date,
    addedAt: { type: Date, default: Date.now }
  }],

  chronicConditions: [{
    condition: { type: String, required: true },
    diagnosedDate: Date,
    description: String,
    currentStatus: {
      type: String,
      enum: ['active', 'managed', 'resolved'],
      default: 'active'
    },
    addedAt: { type: Date, default: Date.now }
  }],

  currentMedications: [{
    medicationName: { type: String, required: true },
    dosage: String,
    frequency: String,
    prescribedBy: String,
    startDate: Date,
    endDate: Date,
    purpose: String,
    addedAt: { type: Date, default: Date.now }
  }],

  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String,
    email: String
  },

  // Insurance Details
  insuranceDetails: {
    hasInsurance: { type: Boolean, default: false },
    provider: String,
    policyNumber: String,
    coverageAmount: Number,
    expiryDate: Date
  },

  // Preferences
  preferredLanguage: {
    type: String,
    enum: ['english', 'nepali', 'hindi'],
    default: 'nepali'
  },

  // Health Goals
  healthGoals: [{
    goal: String,
    targetDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active'
    },
    addedAt: { type: Date, default: Date.now }
  }],

  // Dashboard Stats (calculated fields)
  totalConsultations: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastConsultationDate: Date,

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate BMI
patientSchema.virtual('bmi').get(function() {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Calculate health score (basic implementation)
patientSchema.virtual('healthScore').get(function() {
  let score = 85; // Base score

  // Reduce score for chronic conditions
  if (this.chronicConditions && this.chronicConditions.length > 0) {
    score -= this.chronicConditions.length * 5;
  }

  // Reduce score for severe allergies
  if (this.allergies) {
    const severeAllergies = this.allergies.filter(a => a.severity === 'severe');
    score -= severeAllergies.length * 3;
  }

  // Add points for recent consultations (encourage regular checkups)
  if (this.lastConsultationDate) {
    const daysSinceLastConsultation = Math.floor(
      (Date.now() - this.lastConsultationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastConsultation < 30) {
      score += 5;
    } else if (daysSinceLastConsultation > 180) {
      score -= 10;
    }
  }

  return Math.max(Math.min(score, 100), 0); // Keep between 0-100
});

// Indexes
// patientSchema.index({ userId: 1 });
// patientSchema.index({ bloodGroup: 1 });
// patientSchema.index({ createdAt: -1 });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;

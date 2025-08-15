// ===============================================================================
// models/Appointment.js - Appointment Management Model
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true,
    required: true
  },

  // Participants (referencing your existing User model)
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Appointment Details
  scheduledDateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  consultationType: {
    type: String,
    enum: ['video', 'audio', 'chat'],
    required: true
  },

  // Status Management
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },

  // Consultation Details
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  symptoms: [String],
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },

  // Payment Information (NPR - Nepalese Rupees)
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'held', 'released', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['khalti', 'esewa', 'card', 'bank_transfer'],
    required: function() {
      return this.paymentStatus !== 'pending';
    }
  },
  paymentId: String, // Payment gateway transaction ID

  // Session Information
  sessionStartTime: Date,
  sessionEndTime: Date,
  actualDuration: Number, // minutes

  // Meeting/Call Details
  meetingRoomId: String, // For video/audio calls
  meetingLink: String,

  // Post-consultation
  doctorNotes: {
    type: String,
    maxlength: 2000
  },
  diagnosis: String,
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String,

  // Cancellation Details
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'system']
  },
  cancellationTime: Date,
  refundAmount: Number,

  // Rating and Review (post-consultation)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique appointment ID
appointmentSchema.pre('save', function(next) {
  if (!this.appointmentId) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.appointmentId = `APT-${date}-${random}`;
  }
  this.updatedAt = new Date();
  next();
});

// Indexes
// appointmentSchema.index({ patientId: 1, scheduledDateTime: -1 });
// appointmentSchema.index({ doctorId: 1, scheduledDateTime: -1 });
// appointmentSchema.index({ status: 1 });
// appointmentSchema.index({ appointmentId: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointments');
export default Appointment;

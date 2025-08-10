// routes/patients.js - Patient Management Routes
import express from 'express';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { protect,} from '../middlewares/auth.js';

const router = express.Router();

// @route   GET /api/patients/profile
// @desc    Get patient profile
// @access  Private (Patient)
router.get('/profile', protect), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName email phoneNumber profilePicture address dateOfBirth gender');

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient profile not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        patient
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patient profile',
      error: error.message
    });
  }
};

// @route   PATCH /api/patients/profile
// @desc    Update patient profile
// @access  Private (Patient)
router.patch('/profile', protect), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient profile not found'
      });
    }

    // Fields that patients can update
    const allowedFields = [
      'bloodGroup', 'height', 'weight', 'allergies', 'chronicConditions',
      'currentMedications', 'emergencyContact', 'insuranceDetails',
      'preferredLanguage', 'healthGoals'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(patient, updates);
    await patient.save();

    // Also update user profile if basic info is provided
    if (req.body.userInfo) {
      const userUpdates = {};
      const allowedUserFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'dateOfBirth', 'gender'];

      Object.keys(req.body.userInfo).forEach(key => {
        if (allowedUserFields.includes(key)) {
          userUpdates[key] = req.body.userInfo[key];
        }
      });

      if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(req.user.id, userUpdates);
      }
    }

    // Fetch updated patient with populated user data
    const updatedPatient = await Patient.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName email phoneNumber profilePicture address dateOfBirth gender');

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        patient: updatedPatient
      }
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error updating patient profile',
      error: error.message
    });
  }
};

// @route   GET /api/patients/dashboard
// @desc    Get patient dashboard data
// @access  Private (Patient)
router.get('/dashboard', protect), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName profilePicture');

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient profile not found'
      });
    }

    // Import Appointment model dynamically
    const { default: Appointment } = await import('../models/Appointment.js');

    // Get appointment statistics
    const [
      upcomingAppointments,
      recentAppointments,
      appointmentStats,
      totalSpent
    ] = await Promise.all([
      // Upcoming appointments
      Appointment.find({
        patientId: req.user.id,
        scheduledDateTime: { $gte: new Date() },
        status: { $in: ['scheduled', 'confirmed'] }
      })
      .populate('doctorId', 'firstName lastName primarySpecialization profilePicture')
      .sort({ scheduledDateTime: 1 })
      .limit(5),

      // Recent completed appointments
      Appointment.find({
        patientId: req.user.id,
        status: 'completed'
      })
      .populate('doctorId', 'firstName lastName primarySpecialization')
      .sort({ scheduledDateTime: -1 })
      .limit(3),

      // Appointment statistics
      Appointment.aggregate([
        { $match: { patientId: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Total money spent
      Appointment.aggregate([
        {
          $match: {
            patientId: new mongoose.Types.ObjectId(req.user.id),
            paymentStatus: { $in: ['paid', 'released'] }
          }
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$consultationFee' }
          }
        }
      ])
    ]);

    // Calculate BMI if height and weight are available
    let bmi = null;
    if (patient.height && patient.weight) {
      const heightInMeters = patient.height / 100;
      bmi = (patient.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    res.json({
      status: 'success',
      data: {
        patient,
        stats: {
          totalConsultations: appointmentStats.reduce((sum, stat) => sum + stat.count, 0),
          completedConsultations: appointmentStats.find(s => s._id === 'completed')?.count || 0,
          upcomingConsultations: upcomingAppointments.length,
          totalSpent: totalSpent[0]?.totalSpent || 0,
          bmi: bmi ? parseFloat(bmi) : null
        },
        upcomingAppointments,
        recentAppointments,
        healthSummary: {
          bloodGroup: patient.bloodGroup,
          allergies: patient.allergies?.length || 0,
          chronicConditions: patient.chronicConditions?.length || 0,
          currentMedications: patient.currentMedications?.length || 0
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patient dashboard',
      error: error.message
    });
  }
};

// @route   POST /api/patients/medical-history
// @desc    Add medical history entry
// @access  Private (Patient)
router.post('/medical-history', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient profile not found'
      });
    }

    const { type, data } = req.body; // type: 'allergy', 'condition', 'medication'

    switch (type) {
      case 'allergy':
        patient.allergies.push(data);
        break;
      case 'condition':
        patient.chronicConditions.push(data);
        break;
      case 'medication':
        patient.currentMedications.push(data);
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid medical history type'
        });
    }

    await patient.save();

    res.json({
      status: 'success',
      message: `${type} added successfully`,
      data: {
        patient
      }
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error adding medical history',
      error: error.message
    });
  }
});

export default router;

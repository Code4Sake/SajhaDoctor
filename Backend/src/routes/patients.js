// routes/patients.js - Patient Management Routes
import express from 'express';
import mongoose from 'mongoose';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// @route   GET /api/patients/profile
// @desc    Get patient profile
// @access  Private (Patient)
router.get('/profile', protect, async (req, res) => {
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
        patient: {
          ...patient.toObject(),
          bmi: patient.bmi,
          healthScore: patient.healthScore
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patient profile',
      error: error.message
    });
  }
});

// @route   PATCH /api/patients/profile
// @desc    Update patient profile
// @access  Private (Patient)
router.patch('/profile', protect, async (req, res) => {
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
        patient: {
          ...updatedPatient.toObject(),
          bmi: updatedPatient.bmi,
          healthScore: updatedPatient.healthScore
        }
      }
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error updating patient profile',
      error: error.message
    });
  }
});

// @route   GET /api/patients/dashboard
// @desc    Get patient dashboard data
// @access  Private (Patient)
router.get('/dashboard', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName profilePicture');

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient profile not found'
      });
    }

    // Mock appointment data (replace with actual Appointment model when available)
    const mockUpcomingAppointments = [
      {
        id: 1,
        doctor: "Dr. Rajesh Sharma",
        specialization: "Cardiologist",
        date: "Today",
        time: "2:30 PM",
        type: "video",
        status: "confirmed",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 2,
        doctor: "Dr. Priya Thapa",
        specialization: "General Medicine",
        date: "Tomorrow",
        time: "10:00 AM",
        type: "audio",
        status: "pending",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
      }
    ];

    // Calculate stats
    const stats = {
      totalConsultations: patient.totalConsultations,
      upcomingConsultations: mockUpcomingAppointments.length,
      healthScore: patient.healthScore,
      totalSpent: patient.totalSpent
    };

    // Health summary
    const healthSummary = {
      bloodGroup: patient.bloodGroup || 'Not specified',
      bmi: patient.bmi,
      allergies: patient.allergies?.length || 0,
      chronicConditions: patient.chronicConditions?.length || 0,
      currentMedications: patient.currentMedications?.length || 0
    };

    // Recent activities (mock data - replace with actual activity tracking)
    const recentActivities = [
      {
        id: 1,
        type: 'consultation',
        title: 'Video consultation completed',
        subtitle: 'with Dr. Rajesh Sharma',
        time: '2 hours ago',
        icon: 'Video'
      },
      {
        id: 2,
        type: 'prescription',
        title: 'E-prescription received',
        subtitle: 'Medication for blood pressure',
        time: 'Yesterday',
        icon: 'Pill'
      }
    ];

    res.json({
      status: 'success',
      data: {
        patient: {
          ...patient.toObject(),
          bmi: patient.bmi,
          healthScore: patient.healthScore
        },
        stats,
        upcomingAppointments: mockUpcomingAppointments,
        healthSummary,
        recentActivities,
        quickStats: [
          {
            label: "Total Consultations",
            value: stats.totalConsultations.toString(),
            change: "+5 this month",
            icon: "Activity",
            color: "blue"
          },
          {
            label: "Upcoming Appointments",
            value: stats.upcomingConsultations.toString(),
            change: "Next: Today 2:30 PM",
            icon: "Calendar",
            color: "green"
          },
          {
            label: "Health Score",
            value: `${stats.healthScore}%`,
            change: "Good condition",
            icon: "TrendingUp",
            color: "purple"
          },
          {
            label: "Saved Amount",
            value: `₹${stats.totalSpent.toLocaleString()}`,
            change: "vs hospital visits",
            icon: "AlertCircle",
            color: "orange"
          }
        ]
      }
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patient dashboard',
      error: error.message
    });
  }
});

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
        patient: {
          ...patient.toObject(),
          bmi: patient.bmi,
          healthScore: patient.healthScore
        }
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
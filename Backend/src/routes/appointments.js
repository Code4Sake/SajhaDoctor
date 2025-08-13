import express from 'express';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Add logging middleware to debug route matching
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - Route: ${req.route?.path || 'No route matched yet'}`);
  next();
});

// SPECIFIC ROUTES FIRST - VERY IMPORTANT ORDER!

// @route   POST /api/appointments/book
// @desc    Book new appointment (patients only)
// @access  Private (Patient)
router.post('/book', protect, async (req, res) => {
  console.log('POST /book route hit successfully');

  try {
    if (req.user.userType !== 'patient') {
      return res.status(403).json({
        status: 'error',
        message: 'Only patients can book appointments'
      });
    }

    const {
      doctorUserId,
      scheduledDateTime,
      consultationType,
      reason,
      symptoms = [],
      priority = 'normal'
    } = req.body;

    console.log('Request body:', req.body);

    // Find doctor profile
    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if doctor is verified
    if (doctor.verificationStatus !== 'verified') {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor is not verified yet'
      });
    }

    // Validate consultation type
    if (!['video', 'audio', 'chat'].includes(consultationType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid consultation type'
      });
    }

    // Check appointment time (must be at least 30 minutes in future)
    const appointmentTime = new Date(scheduledDateTime);
    const now = new Date();
    // if (appointmentTime <= new Date(now.getTime() + 30 * 60000)) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: 'Appointment must be scheduled at least 30 minutes in advance'
    //   });
    // }

    // Check doctor availability on that day
    const dayOfWeek = appointmentTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const appointmentTimeStr = appointmentTime.toTimeString().slice(0, 5);

    const doctorAvailability = doctor.availability[dayOfWeek];
    if (!doctorAvailability || !doctorAvailability.available) {
      return res.status(400).json({
        status: 'error',
        message: `Doctor is not available on ${dayOfWeek}s`
      });
    }

    // Check if time slot is within doctor's available hours
    const isWithinHours = doctorAvailability.slots.some(slot =>
      appointmentTimeStr >= slot.start && appointmentTimeStr <= slot.end
    );

    if (!isWithinHours) {
      return res.status(400).json({
        status: 'error',
        message: 'Selected time is outside doctor\'s available hours'
      });
    }

    // Check for conflicting appointments (within 30 minutes)
    const conflictStart = new Date(appointmentTime.getTime() - 30 * 60000);
    const conflictEnd = new Date(appointmentTime.getTime() + 30 * 60000);

    const conflictingAppointment = await Appointment.findOne({
      doctorId: doctorUserId,
      scheduledDateTime: {
        $gte: conflictStart,
        $lte: conflictEnd
      },
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'This time slot is already booked'
      });
    }

    // Get consultation fee
    const consultationFee = doctor.consultationFee[consultationType];

    // Create appointment
    const appointment = new Appointment({

      patientId: req.user.id,
      doctorId: doctorUserId,
      scheduledDateTime: appointmentTime,
      consultationType,
      reason,
      symptoms,
      priority,
      consultationFee
    });

    await appointment.save();

    // Populate appointment data
    await appointment.populate([
      { path: 'patientId', select: 'firstName lastName phoneNumber profilePicture' },
      { path: 'doctorId', select: 'firstName lastName phoneNumber' }
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: {
        appointment
      }
    });

  } catch (error) {
    console.error('Error in /book route:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error booking appointment',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/my-appointments
// @desc    Get user's appointments
// @access  Private
router.get('/my-appointments', protect, async (req, res) => {
  console.log('GET /my-appointments route hit');

  try {
    const {
      status,
      page = 1,
      limit = 10,
      upcoming = false,
      past = false
    } = req.query;

    // Build filter
    const filter = {};
    if (req.user.userType === 'patient') {
      filter.patientId = req.user.id;
    } else if (req.user.userType === 'doctor') {
      filter.doctorId = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    if (upcoming === 'true') {
      filter.scheduledDateTime = { $gte: new Date() };
      filter.status = { $in: ['scheduled', 'confirmed'] };
    }

    if (past === 'true') {
      filter.scheduledDateTime = { $lt: new Date() };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Populate fields based on user type
    const populateFields = req.user.userType === 'patient'
      ? [{ path: 'doctorId', select: 'firstName lastName profilePicture phoneNumber' }]
      : [{ path: 'patientId', select: 'firstName lastName profilePicture phoneNumber' }];

    const appointments = await Appointment.find(filter)
      .populate(populateFields)
      .sort({ scheduledDateTime: upcoming === 'true' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalAppointments = await Appointment.countDocuments(filter);

    res.json({
      status: 'success',
      results: appointments.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAppointments / parseInt(limit)),
        totalAppointments,
        hasNext: skip + appointments.length < totalAppointments,
        hasPrev: parseInt(page) > 1
      },
      data: {
        appointments
      }
    });

  } catch (error) {
    console.error('Error in /my-appointments route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/doctor/:doctorId/availability
// @desc    Check doctor's availability for a specific date
// @access  Public
router.get('/doctor/:doctorId/availability', async (req, res) => {
  console.log('GET /doctor/:doctorId/availability route hit');

  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        status: 'error',
        message: 'Date is required'
      });
    }

    const doctor = await Doctor.findOne({ userId: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Get doctor's availability for that day
    const dayAvailability = doctor.availability[dayOfWeek];

    if (!dayAvailability || !dayAvailability.available) {
      return res.json({
        status: 'success',
        data: {
          available: false,
          slots: [],
          message: 'Doctor is not available on this day'
        }
      });
    }

    // Get existing appointments for that date
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      doctorId: req.params.doctorId,
      scheduledDateTime: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });

    // Generate available time slots (30-minute intervals)
    const availableSlots = [];

    dayAvailability.slots.forEach(slot => {
      const [startHour, startMinute] = slot.start.split(':').map(Number);
      const [endHour, endMinute] = slot.end.split(':').map(Number);

      let currentTime = new Date(requestedDate);
      currentTime.setHours(startHour, startMinute, 0, 0);

      const slotEndTime = new Date(requestedDate);
      slotEndTime.setHours(endHour, endMinute, 0, 0);

      while (currentTime < slotEndTime) {
        const slotTime = new Date(currentTime);
        const nextSlotTime = new Date(currentTime.getTime() + 30 * 60000);

        // Check if this slot conflicts with existing appointments
        const hasConflict = existingAppointments.some(apt => {
          const aptTime = new Date(apt.scheduledDateTime);
          return Math.abs(aptTime - slotTime) < 30 * 60000;
        });

        // Only include future slots (at least 30 minutes from now)
        const isInFuture = slotTime > new Date(Date.now() + 30 * 60000);

        if (!hasConflict && isInFuture) {
          availableSlots.push({
            time: slotTime.toTimeString().slice(0, 5),
            datetime: slotTime.toISOString(),
            available: true
          });
        }

        currentTime = nextSlotTime;
      }
    });

    res.json({
      status: 'success',
      data: {
        available: availableSlots.length > 0,
        date,
        dayOfWeek,
        slots: availableSlots,
        doctorInfo: {
          name: `Dr. ${doctor.userId.firstName} ${doctor.userId.lastName}`,
          specialization: doctor.primarySpecialization,
          consultationFees: doctor.consultationFee
        }
      }
    });

  } catch (error) {
    console.error('Error in /doctor/:doctorId/availability route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error checking availability',
      error: error.message
    });
  }
});

// PARAMETERIZED ROUTES LAST!

// @route   PATCH /api/appointments/:appointmentId/cancel
// @desc    Cancel appointment
// @access  Private
router.patch('/:appointmentId/cancel', protect, async (req, res) => {
  console.log('PATCH /:appointmentId/cancel route hit');

  try {
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const isAuthorized =
      appointment.patientId.toString() === req.user.id ||
      appointment.doctorId.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if appointment can be cancelled
    if (!['scheduled', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel this appointment'
      });
    }

    // Check cancellation time (at least 2 hours before for non-emergency)
    const timeUntilAppointment = appointment.scheduledDateTime - new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    if (timeUntilAppointment < twoHoursInMs && appointment.priority !== 'emergency') {
      return res.status(400).json({
        status: 'error',
        message: 'Appointments can only be cancelled at least 2 hours in advance'
      });
    }

    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason;
    appointment.cancelledBy = req.user.userType;
    appointment.cancellationTime = new Date();

    // Handle refund if payment was made
    if (appointment.paymentStatus === 'paid') {
      appointment.paymentStatus = 'refunded';
      appointment.refundAmount = appointment.consultationFee;
    }

    await appointment.save();

    res.json({
      status: 'success',
      message: 'Appointment cancelled successfully',
      data: {
        appointment
      }
    });

  } catch (error) {
    console.error('Error in /:appointmentId/cancel route:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
});

// @route   PATCH /api/appointments/:appointmentId/confirm
// @desc    Confirm appointment (doctors only)
// @access  Private (Doctor)
router.patch('/:appointmentId/confirm', protect, async (req, res) => {
  console.log('PATCH /:appointmentId/confirm route hit');

  try {
    if (req.user.userType !== 'doctor') {
      return res.status(403).json({
        status: 'error',
        message: 'Only doctors can confirm appointments'
      });
    }

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if doctor owns this appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only confirm scheduled appointments'
      });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({
      status: 'success',
      message: 'Appointment confirmed successfully',
      data: {
        appointment
      }
    });

  } catch (error) {
    console.error('Error in /:appointmentId/confirm route:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error confirming appointment',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/:appointmentId
// @desc    Get appointment details
// @access  Private
router.get('/:appointmentId', protect, async (req, res) => {
  console.log('GET /:appointmentId route hit with ID:', req.params.appointmentId);

  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('patientId', 'firstName lastName phoneNumber profilePicture address')
      .populate('doctorId', 'firstName lastName phoneNumber profilePicture');

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const isAuthorized =
      appointment.patientId._id.toString() === req.user.id ||
      appointment.doctorId._id.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.json({
      status: 'success',
      data: {
        appointment
      }
    });

  } catch (error) {
    console.error('Error in /:appointmentId route:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching appointment details',
      error: error.message
    });
  }
});

export default router;

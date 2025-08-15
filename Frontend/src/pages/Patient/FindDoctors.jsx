import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Video,
  Phone,
  MessageCircle,
  Award,
  Users,
  Calendar,
  ChevronRight,
  Heart,
  Brain,
  Eye,
  Stethoscope,
  Menu,
  Bell,
  Home,
  Settings,
  LogOut,
  X,
  CheckCircle,
  AlertTriangle,
  Loader,
  ArrowLeft,
  Plus
} from "lucide-react";

// API utility functions (matching your existing API structure)
const API_BASE_URL = "http://localhost:8000"; // Adjust as needed

const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return {
      success: true,
      data: data.data || data,
      message: data.message
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: { message: error.message }
    };
  }
};

// Mock doctors data (replace with actual API call)
const mockDoctors = [
  {
    _id: "673d123456789",
    userId: {
      _id: "673d987654321",
      firstName: "Rajesh",
      lastName: "Sharma",
      email: "rajesh.sharma@example.com",
      phoneNumber: "+9779841234567"
    },
    primarySpecialization: "Cardiology",
    totalExperience: 15,
    averageRating: 4.8,
    totalReviews: 124,
    consultationFee: {
      video: 800,
      audio: 600,
      chat: 400
    },
    currentWorkplace: [{
      hospitalName: "Grande Hospital",
      address: {
        district: "Kathmandu",
        municipality: "Kathmandu Metropolitan"
      }
    }],
    isOnline: true,
    verificationStatus: "verified",
    availability: {
      monday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
      tuesday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
      wednesday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
      thursday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
      friday: { available: true, slots: [{ start: "09:00", end: "17:00" }] }
    }
  },
  {
    _id: "673d123456790",
    userId: {
      _id: "673d987654322",
      firstName: "Priya",
      lastName: "Thapa",
      email: "priya.thapa@example.com",
      phoneNumber: "+9779841234568"
    },
    primarySpecialization: "General Medicine",
    totalExperience: 8,
    averageRating: 4.6,
    totalReviews: 89,
    consultationFee: {
      video: 600,
      audio: 450,
      chat: 300
    },
    currentWorkplace: [{
      hospitalName: "Bir Hospital",
      address: {
        district: "Kathmandu",
        municipality: "Kathmandu Metropolitan"
      }
    }],
    isOnline: false,
    verificationStatus: "verified",
    availability: {
      monday: { available: true, slots: [{ start: "10:00", end: "16:00" }] },
      tuesday: { available: true, slots: [{ start: "10:00", end: "16:00" }] },
      wednesday: { available: true, slots: [{ start: "10:00", end: "16:00" }] },
      thursday: { available: true, slots: [{ start: "10:00", end: "16:00" }] },
      friday: { available: true, slots: [{ start: "10:00", end: "16:00" }] }
    }
  }
];

// Booking Modal Component
const BookingModal = ({ doctor, isOpen, onClose, onBookingSuccess }) => {
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    consultationType: 'video',
    scheduledDateTime: '',
    date: '',
    time: '',
    reason: '',
    symptoms: [],
    priority: 'normal'
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSymptom, setNewSymptom] = useState('');

  useEffect(() => {
    if (bookingData.date && doctor) {
      fetchAvailableSlots();
    }
  }, [bookingData.date, doctor]);

  const fetchAvailableSlots = async () => {
    if (!bookingData.date || !doctor) return;
    
    setLoading(true);
    try {
      // Generate mock slots based on doctor's availability
      const selectedDate = new Date(bookingData.date);
      const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      const dayAvailability = doctor.availability[dayName];
      const slots = [];
      
      if (dayAvailability && dayAvailability.available) {
        dayAvailability.slots.forEach(slot => {
          const [startHour, startMinute] = slot.start.split(':').map(Number);
          const [endHour, endMinute] = slot.end.split(':').map(Number);
          
          for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              if (hour === endHour - 1 && minute >= endMinute) break;
              
              const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              const datetime = new Date(selectedDate);
              datetime.setHours(hour, minute, 0, 0);
              
              // Only show future slots
              if (datetime > new Date()) {
                slots.push({
                  time: timeStr,
                  datetime: datetime.toISOString(),
                  available: true
                });
              }
            }
          }
        });
      }
      
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!bookingData.scheduledDateTime || !bookingData.reason) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare booking payload
      const bookingPayload = {
        doctorUserId: doctor.userId._id,
        scheduledDateTime: bookingData.scheduledDateTime,
        consultationType: bookingData.consultationType,
        reason: bookingData.reason,
        symptoms: bookingData.symptoms,
        priority: bookingData.priority
      };

      console.log('Booking payload:', bookingPayload);

      // Make API call to book appointment
      const result = await apiRequest('/api/appointments/book', {
        method: 'POST',
        body: JSON.stringify(bookingPayload)
      });

      if (result.success) {
        onBookingSuccess(result.data);
        onClose();
        setBookingStep(1);
        setBookingData({
          consultationType: 'video',
          scheduledDateTime: '',
          date: '',
          time: '',
          reason: '',
          symptoms: [],
          priority: 'normal'
        });
      } else {
        throw new Error(result.error?.message || 'Failed to book appointment');
      }

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = () => {
    if (newSymptom.trim() && !bookingData.symptoms.includes(newSymptom.trim())) {
      setBookingData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, newSymptom.trim()]
      }));
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setBookingData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(symptom => symptom !== symptomToRemove)
    }));
  };

  const handleTimeSelect = (slot) => {
    const combinedDateTime = new Date(slot.datetime);
    setBookingData(prev => ({
      ...prev,
      time: slot.time,
      scheduledDateTime: combinedDateTime.toISOString()
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Appointment</h2>
              <p className="text-blue-100">Dr. {doctor.userId.firstName} {doctor.userId.lastName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= bookingStep ? 'bg-white text-blue-600' : 'bg-white/30 text-white'
                }`}>
                  {step}
                </div>
                {step < 3 && <div className="w-12 h-0.5 bg-white/30 ml-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Step 1: Consultation Type */}
          {bookingStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Select Consultation Type</h3>
              
              <div className="grid gap-4">
                {['video', 'audio', 'chat'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setBookingData(prev => ({ ...prev, consultationType: type }))}
                    className={`p-4 border-2 rounded-xl text-left transition-colors ${
                      bookingData.consultationType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {type === 'video' && <Video className="w-6 h-6 text-blue-600" />}
                        {type === 'audio' && <Phone className="w-6 h-6 text-green-600" />}
                        {type === 'chat' && <MessageCircle className="w-6 h-6 text-purple-600" />}
                        <div>
                          <p className="font-semibold capitalize">{type} Consultation</p>
                          <p className="text-sm text-gray-600">
                            {type === 'video' && 'Face-to-face video call'}
                            {type === 'audio' && 'Voice call only'}
                            {type === 'chat' && 'Text-based consultation'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{doctor.consultationFee[type]}</p>
                        <p className="text-xs text-gray-500">per session</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setBookingStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue to Date & Time
              </button>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {bookingStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setBookingStep(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900">Select Date & Time</h3>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time Slots */}
              {bookingData.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Available Time Slots
                  </label>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleTimeSelect(slot)}
                          className={`p-3 border-2 rounded-lg text-center transition-colors ${
                            bookingData.time === slot.time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No available slots for this date</p>
                  )}
                </div>
              )}

              <button
                onClick={() => setBookingStep(3)}
                disabled={!bookingData.scheduledDateTime}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* Step 3: Consultation Details */}
          {bookingStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setBookingStep(2)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900">Consultation Details</h3>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Consultation *
                </label>
                <textarea
                  value={bookingData.reason}
                  onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Describe your health concern or reason for consultation..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms (Optional)
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    placeholder="Add a symptom..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                  />
                  <button
                    type="button"
                    onClick={addSymptom}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {bookingData.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {bookingData.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {symptom}
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={bookingData.priority}
                  onChange={(e) => setBookingData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span>Dr. {doctor.userId.firstName} {doctor.userId.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultation Type:</span>
                    <span className="capitalize">{bookingData.consultationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>{bookingData.date} at {bookingData.time}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Fee:</span>
                    <span>₹{doctor.consultationFee[bookingData.consultationType]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || !bookingData.reason}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Success Modal Component
const BookingSuccessModal = ({ isOpen, appointment, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. You'll receive a confirmation shortly.
          </p>
          
          {appointment && (
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
              <h3 className="font-semibold mb-2">Appointment Details:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Appointment ID: {appointment.appointmentId}</p>
                <p>Date: {new Date(appointment.scheduledDateTime).toLocaleDateString()}</p>
                <p>Time: {new Date(appointment.scheduledDateTime).toLocaleTimeString()}</p>
                <p>Type: {appointment.consultationType}</p>
                <p>Status: {appointment.status}</p>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor, onBook, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDoctorName = () => {
    return `${doctor.userId.firstName} ${doctor.userId.lastName}`;
  };

  const getLocation = () => {
    const workplace = doctor.currentWorkplace?.[0];
    if (workplace?.address) {
      return `${workplace.address.municipality}, ${workplace.address.district}`;
    }
    return workplace?.hospitalName || "Location not specified";
  };

  const getConsultationModes = () => {
    return ['video', 'audio', 'chat'];
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {doctor.userId.firstName.charAt(0)}{doctor.userId.lastName.charAt(0)}
                </span>
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md ${
                  doctor.isOnline ? "bg-emerald-500" : "bg-gray-400"
                }`}
              ></div>
              {doctor.verificationStatus === 'verified' && (
                <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-bold text-gray-900 text-lg">
                  Dr. {getDoctorName()}
                </h4>
                {doctor.verificationStatus === 'verified' && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {doctor.primarySpecialization}
              </p>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">
                    {doctor.averageRating || '0.0'}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({doctor.totalReviews || 0})
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {doctor.totalExperience} years exp.
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{getLocation()}</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {doctor.isOnline ? 'Available now' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ₹{doctor.consultationFee?.video || 500}
            </p>
            <p className="text-xs text-gray-500">per consultation</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {getConsultationModes().map((mode, idx) => (
              <div
                key={idx}
                className="flex items-center px-3 py-2 rounded-xl text-xs bg-gray-50 text-gray-700 border border-gray-200"
              >
                {mode === "video" && (
                  <Video className="w-3 h-3 mr-1 text-blue-600" />
                )}
                {mode === "audio" && (
                  <Phone className="w-3 h-3 mr-1 text-green-600" />
                )}
                {mode === "chat" && (
                  <MessageCircle className="w-3 h-3 mr-1 text-purple-600" />
                )}
                <span className="font-medium capitalize">{mode}</span>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200">
              View Profile
            </button>
            <button
              onClick={() => onBook(doctor)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Find Doctors Component
const FindDoctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  const specialties = [
    { name: "General Medicine", doctorCount: 45 },
    { name: "Cardiology", doctorCount: 23 },
    { name: "Dermatology", doctorCount: 18 },
    { name: "Neurology", doctorCount: 12 },
    { name: "Orthopedics", doctorCount: 34 },
    { name: "Pediatrics", doctorCount: 28 },
  ];

  // Fetch doctors from API
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, use mock data. Replace with actual API call
      // const result = await apiRequest('/api/doctors', { method: 'GET' });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for demonstration
      setDoctors(mockDoctors);
      
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle booking
  const handleBookDoctor = (doctor) => {
    console.log('Booking doctor:', doctor);
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  // Handle specialty selection
  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(
      selectedSpecialty?.name === specialty.name ? null : specialty
    );
  };

  // Handle successful booking
  const handleBookingSuccess = (appointment) => {
    console.log('Booking successful:', appointment);
    setBookedAppointment(appointment);
    setShowBookingModal(false);
    setShowSuccessModal(true);
    
    // Optionally refresh doctors list or show updated availability
    // fetchDoctors();
  };

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.userId.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.userId.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.primarySpecialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty =
      !selectedSpecialty ||
      doctor.primarySpecialization.toLowerCase().includes(selectedSpecialty.name.toLowerCase());
    
    return matchesSearch && matchesSpecialty;
  });

  // Specialty Card Component
  const SpecialtyCard = ({ specialty, isActive, onClick, delay = 0 }) => {
    const specialtyIcons = {
      "General Medicine": Stethoscope,
      Cardiology: Heart,
      Dermatology: Eye,
      Neurology: Brain,
      Orthopedics: Users,
      Pediatrics: Heart,
    };

    const Icon = specialtyIcons[specialty.name] || Stethoscope;

    return (
      <button
        onClick={() => onClick(specialty)}
        className={`group relative p-6 rounded-2xl border transition-all duration-300 text-center min-w-[200px] ${
          isActive
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-xl"
            : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg"
        }`}
        style={{
          animationDelay: `${delay}ms`,
        }}
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            isActive ? "bg-white/20" : "bg-blue-50 group-hover:bg-blue-100"
          } transition-all duration-300`}
        >
          <Icon
            className={`w-8 h-8 ${isActive ? "text-white" : "text-blue-600"}`}
          />
        </div>
        <h3
          className={`font-bold mb-2 ${
            isActive ? "text-white" : "text-gray-900"
          }`}
        >
          {specialty.name}
        </h3>
        <p className={`text-sm ${isActive ? "text-blue-100" : "text-gray-600"}`}>
          {specialty.doctorCount} doctors
        </p>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchDoctors}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Perfect Doctor</h1>
            <p className="text-blue-100 text-xl mb-8">
              Connect with top healthcare professionals in Nepal
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search doctors, specialties, or conditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/20 text-lg text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Specialties Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Specialty
          </h2>
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {specialties.map((specialty, idx) => (
              <SpecialtyCard
                key={specialty.name}
                specialty={specialty}
                isActive={selectedSpecialty?.name === specialty.name}
                onClick={handleSpecialtyClick}
                delay={idx * 100}
              />
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedSpecialty
                ? `${selectedSpecialty.name} Specialists`
                : "Available Doctors"}
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">
                {filteredDoctors.length} doctors found
              </p>
              {selectedSpecialty && (
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Doctor Cards */}
          <div className="space-y-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, idx) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onBook={handleBookDoctor}
                  delay={idx * 100}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or specialty filter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
          }}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        appointment={bookedAppointment}
        onClose={() => {
          setShowSuccessModal(false);
          setBookedAppointment(null);
        }}
      />
    </div>
  );
};

export default FindDoctors;
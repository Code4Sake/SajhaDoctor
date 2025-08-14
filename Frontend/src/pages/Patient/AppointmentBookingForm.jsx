import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, AlertTriangle, Video, Phone, MessageCircle, ArrowLeft, CheckCircle, X } from 'lucide-react';

const AppointmentBookingForm = ({ doctor, onBack, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    scheduledDateTime: '',
    consultationType: 'video',
    reason: '',
    symptoms: [''],
    priority: 'normal'
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const API_BASE_URL = "http://localhost:8000";

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Priority options
  const priorityOptions = [
    { value: 'normal', label: 'Normal', color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'urgent', label: 'Urgent', color: 'text-orange-600', bg: 'bg-orange-50' },
    { value: 'emergency', label: 'Emergency', color: 'text-red-600', bg: 'bg-red-50' }
  ];

  // Consultation type options
  const consultationTypes = [
    { value: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face consultation via video' },
    { value: 'audio', label: 'Audio Call', icon: Phone, description: 'Voice consultation via phone' },
    { value: 'chat', label: 'Chat', icon: MessageCircle, description: 'Text-based consultation' }
  ];

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && doctor?._id) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, doctor?._id]);

  const fetchAvailableSlots = async (date) => {
    setLoadingAvailability(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments/doctor/${doctor.user._id}/availability?date=${date}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const result = await response.json();
      if (result.status === 'success') {
        setAvailableSlots(result.data.slots || []);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load available time slots');
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, scheduledDateTime: '' }));
  };

  const handleTimeSlotSelect = (datetime) => {
    setFormData(prev => ({ ...prev, scheduledDateTime: datetime }));
  };

  const handleSymptomChange = (index, value) => {
    const newSymptoms = [...formData.symptoms];
    newSymptoms[index] = value;
    setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
  };

  const addSymptom = () => {
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, '']
    }));
  };

  const removeSymptom = (index) => {
    if (formData.symptoms.length > 1) {
      const newSymptoms = formData.symptoms.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Filter out empty symptoms
      const filteredSymptoms = formData.symptoms.filter(symptom => symptom.trim() !== '');

      const bookingData = {
        doctorUserId: doctor.user._id,
        scheduledDateTime: formData.scheduledDateTime,
        consultationType: formData.consultationType,
        reason: formData.reason,
        symptoms: filteredSymptoms,
        priority: formData.priority
      };

      const response = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setSuccess('Appointment booked successfully!');
        setTimeout(() => {
          onBookingSuccess && onBookingSuccess(result.data.appointment);
        }, 2000);
      } else {
        setError(result.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-lg">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Successful!</h2>
          <p className="text-gray-600 mb-8">{success}</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Doctors</span>
        </button>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {doctor?.user?.firstName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
              <p className="text-emerald-600 font-semibold">Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}</p>
              <p className="text-gray-600">{doctor?.specialty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Booking Content */}
      <div className="space-y-8">
        {/* Date Selection */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Select Date</h2>
          </div>

          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            required
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Available Time Slots</h2>
            </div>

            {loadingAvailability ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-gray-600">Loading available slots...</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No available slots for this date</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTimeSlotSelect(slot.datetime)}
                    className={`p-3 rounded-xl border-2 font-medium transition-all duration-300 ${
                      formData.scheduledDateTime === slot.datetime
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Consultation Type */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Video className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Consultation Type</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consultationTypes.map((type) => (
              <label
                key={type.value}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.consultationType === type.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  value={type.value}
                  checked={formData.consultationType === type.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultationType: e.target.value }))}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <type.icon className={`w-6 h-6 ${formData.consultationType === type.value ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-semibold text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <AlertTriangle className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Priority Level</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityOptions.map((priority) => (
              <label
                key={priority.value}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.priority === priority.value
                    ? `border-${priority.value === 'emergency' ? 'red' : priority.value === 'urgent' ? 'orange' : 'blue'}-500 ${priority.bg}`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  value={priority.value}
                  checked={formData.priority === priority.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="sr-only"
                />
                <div className={`font-semibold ${formData.priority === priority.value ? priority.color : 'text-gray-700'}`}>
                  {priority.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Reason for Consultation</h2>
          </div>

          <textarea
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Please describe the reason for your consultation..."
            rows={4}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
            required
          />
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Symptoms (Optional)</h2>
          </div>

          <div className="space-y-3">
            {formData.symptoms.map((symptom, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={symptom}
                  onChange={(e) => handleSymptomChange(index, e.target.value)}
                  placeholder={`Symptom ${index + 1}`}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                />
                {formData.symptoms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSymptom(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addSymptom}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              + Add Another Symptom
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.scheduledDateTime}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              loading || !formData.scheduledDateTime
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Booking Appointment...</span>
              </div>
            ) : (
              'Book Appointment'
            )}
          </button>

          {!formData.scheduledDateTime && (
            <p className="text-center text-gray-500 text-sm mt-3">
              Please select a date and time to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;

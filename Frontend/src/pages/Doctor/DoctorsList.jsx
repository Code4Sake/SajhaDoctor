import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Video, Phone, Calendar, ChevronDown, ArrowLeft, CheckCircle, X, User, FileText, AlertTriangle, MessageCircle } from 'lucide-react';

// Booking Form Component
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
    if (selectedDate && doctor?.userId) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, doctor?.userId]);

  const fetchAvailableSlots = async (date) => {
    setLoadingAvailability(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments/doctor/${doctor.userId}/availability?date=${date}`,
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
        doctorUserId: doctor.userId,
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
              <p className="text-gray-600">{doctor?.primarySpecialization}</p>
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
            disabled={loading || !formData.scheduledDateTime || !formData.reason}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              loading || !formData.scheduledDateTime || !formData.reason
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

          {(!formData.scheduledDateTime || !formData.reason) && (
            <p className="text-center text-gray-500 text-sm mt-3">
              Please complete all required fields to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main DoctorsList Component
const DoctorsList = ({ onNavigate = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/doctors`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data && result.status == 'success') {
          setDoctors(result.data.doctors);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.message || 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleBackToDoctors = () => {
    setShowBookingForm(false);
    setSelectedDoctor(null);
  };

  const handleBookingSuccess = (appointment) => {
    console.log('Appointment booked successfully:', appointment);
    // Handle successful booking (maybe show a success message, navigate somewhere, etc.)
    setTimeout(() => {
      setShowBookingForm(false);
      setSelectedDoctor(null);
    }, 2000);
  };

  // Show booking form if requested
  if (showBookingForm && selectedDoctor) {
    return (
      <AppointmentBookingForm
        doctor={selectedDoctor}
        onBack={handleBackToDoctors}
        onBookingSuccess={handleBookingSuccess}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Doctors</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All Doctors', count: doctors.length },
    { id: 'available', label: 'Available Now', count: doctors.filter(d => d.isOnline).length },
    { id: 'cardiology', label: 'Cardiology', count: doctors.filter(d => d.primarySpecialization?.toLowerCase().includes('cardiology')).length },
    { id: 'surgery', label: 'Surgery', count: doctors.filter(d => d.primarySpecialization?.toLowerCase().includes('surgery')).length },
    { id: 'gastroenterology', label: 'Gastroenterology', count: doctors.filter(d => d.primarySpecialization?.toLowerCase().includes('gastroenterology')).length },
    { id: 'ent', label: 'ENT', count: doctors.filter(d => d.primarySpecialization?.toLowerCase().includes('ent')).length },
    { id: 'dentistry', label: 'Dentistry', count: doctors.filter(d => d.primarySpecialization?.toLowerCase().includes('dentistry')).length },
  ];

  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'experience', label: 'Experience' },
    { value: 'online', label: 'Online Status' },
    { value: 'name', label: 'Name' },
  ];

  // Filter and search doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = !searchQuery ||
      doctor.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.primarySpecialization.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'available') return matchesSearch && doctor.isOnline;

    // Filter by specialty
    return matchesSearch && doctor.primarySpecialization?.toLowerCase().includes(selectedFilter);
  });

  // Sort doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'experience':
        return (b.totalExperience || 0) - (a.totalExperience || 0);
      case 'name':
        return `${a.user.firstName} ${a.user.lastName}`.localeCompare(`${b.user.firstName} ${b.user.lastName}`);
      case 'online':
        return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with qualified healthcare professionals and book your appointment today
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedDoctors.length} doctor{sortedDoctors.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Doctors Grid */}
        {sortedDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedDoctors.map((doctor, index) => (
              <DoctorCard
                key={doctor._id || index}
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor, onBookAppointment }) => {
  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getLocationString = (address) => {
    if (!address) return 'Location not specified';
    const parts = [address.municipality, address.district, address.province].filter(Boolean);
    return parts.join(', ') || 'Location not specified';
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <div className="p-6">
        {/* Doctor Avatar and Status */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {doctor.user.firstName?.charAt(0)}{doctor.user.lastName?.charAt(0)}
            </div>
            {doctor.isOnline && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              Dr. {doctor.user.firstName} {doctor.user.lastName}
            </h3>
            <p className="text-emerald-600 font-medium">{doctor.primarySpecialization}</p>
            <div className="flex items-center space-x-1 mt-1">
              {getRatingStars(doctor.averageRating)}
              <span className="text-sm text-gray-600 ml-1">
                ({doctor.averageRating?.toFixed(1) || '0.0'}) • {doctor.totalReviews} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{getLocationString(doctor.user.address)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {doctor.totalExperience} years experience
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${doctor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={`text-sm font-medium ${doctor.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {doctor.isOnline ? 'Online Now' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Current Workplace */}
        {doctor.currentWorkplace && doctor.currentWorkplace.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2">CURRENT WORKPLACE</p>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="font-semibold text-gray-900">{doctor.currentWorkplace[0].hospitalName}</p>
              {doctor.currentWorkplace[0].position && (
                <p className="text-sm text-gray-600">{doctor.currentWorkplace[0].position}</p>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {doctor.bio && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 line-clamp-3">
              {doctor.bio}
            </p>
          </div>
        )}

        {/* Languages */}
        {doctor.languagesSpoken && doctor.languagesSpoken.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2">LANGUAGES</p>
            <div className="flex flex-wrap gap-2">
              {doctor.languagesSpoken.map((language, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        {doctor.consultationFee && (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2">CONSULTATION FEES</p>
            <div className="grid grid-cols-2 gap-2">
              {doctor.consultationFee.video && (
                <div className="bg-emerald-50 rounded-lg p-2">
                  <p className="text-xs text-emerald-600 font-medium">Video</p>
                  <p className="text-sm font-bold text-gray-900">Rs. {doctor.consultationFee.video}</p>
                </div>
              )}
              {doctor.consultationFee.audio && (
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-xs text-blue-600 font-medium">Audio</p>
                  <p className="text-sm font-bold text-gray-900">Rs. {doctor.consultationFee.audio}</p>
                </div>
              )}
              {doctor.consultationFee.chat && (
                <div className="bg-purple-50 rounded-lg p-2">
                  <p className="text-xs text-purple-600 font-medium">Chat</p>
                  <p className="text-sm font-bold text-gray-900">Rs. {doctor.consultationFee.chat}</p>
                </div>
              )}
              {doctor.consultationFee.inPerson && (
                <div className="bg-orange-50 rounded-lg p-2">
                  <p className="text-xs text-orange-600 font-medium">In Person</p>
                  <p className="text-sm font-bold text-gray-900">Rs. {doctor.consultationFee.inPerson}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onBookAppointment(doctor)}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Book Appointment
          </button>

          <div className="flex space-x-2">
            {doctor.consultationFee?.video && (
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
            )}
            {doctor.consultationFee?.audio && (
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
            )}
            {doctor.consultationFee?.chat && (
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{doctor.totalConsultations} consultations</span>
          <span className={`${doctor.verificationStatus === 'verified' ? 'text-green-600' : 'text-orange-600'}`}>
            {doctor.verificationStatus === 'verified' ? '✓ Verified' : 'Pending Verification'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;

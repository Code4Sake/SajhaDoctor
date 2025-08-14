import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Video, Phone, Calendar, ChevronDown } from 'lucide-react';

const DoctorsList = ({ onNavigate = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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



        // Check if the API returns data in a nested structure
        if (result.data && result.status == 'success') {
          setDoctors(result.data.doctors);
            console.log(doctors);

        // } else if (Array.isArray(result)) {
        //   // Same safety check for direct array response
        //   const safeDoctors = result.map(doctor => ({
        //     ...doctor,
        //     name: typeof doctor.user.firstName === 'string' ? doctor.user.firstName : 'Unknown Doctor',
        //     specialty: typeof doctor.specialty === 'string' ? doctor.specialty : 'General Medicine',
        //     location: typeof doctor.location === 'string' ? doctor.location : 'Location not specified',
        //     experience: typeof doctor.experience === 'string' ? doctor.experience : '0 years',
        //     education: typeof doctor.education === 'string' ? doctor.education : 'Not specified',
        //     hospital: typeof doctor.hospital === 'string' ? doctor.hospital : 'Not specified',
        //     nextAvailable: typeof doctor.nextAvailable === 'string' ? doctor.nextAvailable : 'Schedule not available',
        //     languages: Array.isArray(doctor.languages) ? doctor.languages.filter(lang => typeof lang === 'string') : ['English'],
        //     rating: typeof doctor.rating === 'number' ? doctor.rating : 0,
        //     reviews: typeof doctor.reviews === 'number' ? doctor.reviews : 0,
        //     consultationFee: typeof doctor.consultationFee === 'number' ? doctor.consultationFee : 0,
        //     isOnline: typeof doctor.isOnline === 'boolean' ? doctor.isOnline : false,
        //     avatar: typeof doctor.avatar === 'string' ? doctor.avatar : null
        //   }));
        //   setDoctors(safeDoctors);
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

  const bookFunc = ()=>{
    
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
  console.log(doctors);

  const filters = [
    { id: 'all', label: 'All Doctors', count: doctors.length },
    { id: 'available', label: 'Available Now', count: doctors.filter(d => d.isOnline).length },
    { id: 'general', label: 'General Medicine', count: doctors.filter(d => d.specialty === 'General Medicine').length },
    { id: 'cardiology', label: 'Cardiology', count: doctors.filter(d => d.specialty === 'Cardiology').length },
    { id: 'pediatrics', label: 'Pediatrics', count: doctors.filter(d => d.specialty === 'Pediatrics').length },
    { id: 'dermatology', label: 'Dermatology', count: doctors.filter(d => d.specialty === 'Dermatology').length },
    { id: 'orthopedics', label: 'Orthopedics', count: doctors.filter(d => d.specialty === 'Orthopedics').length },
    { id: 'gynecology', label: 'Gynecology', count: doctors.filter(d => d.specialty === 'Gynecology').length }
  ];

  const sortOptions = [
    { id: 'rating', label: 'Highest Rated' },
    { id: 'reviews', label: 'Most Reviewed' },
    { id: 'experience', label: 'Most Experienced' },
    { id: 'fee-low', label: 'Lowest Fee' },
    { id: 'fee-high', label: 'Highest Fee' },
    { id: 'availability', label: 'Available First' }
  ];

  // Filter and sort doctors with additional safety checks
  const filteredDoctors = doctors
    .filter(doctor => {
      // Add safety check here too
      if (!doctor || typeof doctor !== 'object') return false;

      const name = typeof doctor.user.firstName === 'string' ? doctor.user.firstName : '';
    //   const specialty = typeof doctor.specialty === 'string' ? doctor.specialty : '';
    //   const location = typeof doctor.location === 'string' ? doctor.location : '';

    //   const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                       specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                       location.toLowerCase().includes(searchQuery.toLowerCase());

    //   const matchesFilter = selectedFilter === 'all' ||
    //                       (selectedFilter === 'available' && doctor.isOnline) ||
    //                       specialty.toLowerCase().includes(selectedFilter.toLowerCase());

    //   return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'reviews': return (b.reviews || 0) - (a.reviews || 0);
        case 'experience': return parseInt(b.experience || '0') - parseInt(a.experience || '0');
        case 'fee-low': return (a.consultationFee || 0) - (b.consultationFee || 0);
        case 'fee-high': return (b.consultationFee || 0) - (a.consultationFee || 0);
        case 'availability': return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
        default: return 0;
      }
    });

  return (
    <div className="pb-20 lg:pb-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Enhanced Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Find Doctors</h1>
              <p className="text-gray-600 text-lg">Connect with {doctors.length} qualified healthcare professionals across Nepal</p>
            </div>

            {/* Enhanced Search and Sort */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:w-auto">
              <div className="flex-1 lg:w-96 relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, specialties, locations..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm transition-all duration-300"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 bg-white cursor-pointer"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filter Tags */}
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                {filter.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedFilter === filter.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-6 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> of <span className="font-semibold text-gray-900">{doctors.length}</span> doctors
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        </div>

        {/* Enhanced Doctors Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group hover:-translate-y-2">

              {/* Card Header */}
              <div className="relative p-6">
                {/* Online Status Badge */}
                {doctor.isOnline && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                    Online
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-lg ${
                      doctor.isOnline
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}>
                      {doctor.avatar || doctor.user.firstName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300 truncate">
                        {doctor.user.firstName}
                      </h3>
                      <p className="text-emerald-600 font-semibold mb-2">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{doctor.rating}</span>
                        <span className="text-gray-500 text-sm">({doctor.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {/* <span className="truncate">
                      {doctor.location} • {doctor.experience} experience
                    </span> */}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {/* <span className="truncate">
                      {doctor.nextAvailable}
                    </span> */}
                  </div>

                  <div className="text-sm text-gray-600">
                    {/* <span className="font-medium">Education:</span> {doctor.education} */}
                  </div>

                  <div className="text-sm text-gray-600">
                    {/* <span className="font-medium">Hospital:</span> {doctor.hospital} */}
                  </div>


                </div>

                {/* Consultation Fee */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Consultation Fee</span>
                    <div className="text-right">
                      {/* <span className="text-lg font-bold text-emerald-600">NPR {doctor.consultationFee}</span> */}
                      <div className="text-xs text-gray-500">per session</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => onNavigate('book-appointment')}
                    className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      doctor.isOnline
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!doctor.isOnline}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {doctor.isOnline ? (
                        <>
                          <Video className="w-4 h-4" />
                          <span onClick={bookFunc}>Book Now</span>
                        </>
                      ) : (
                        <span>Unavailable</span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => onNavigate('doctor-profile')}
                    className="px-4 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                  >
                    View Profile
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 cursor-pointer">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </button>
                  </div>
                  <button
                    onClick={() => onNavigate('schedule')}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredDoctors.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No doctors found</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more doctors.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredDoctors.length > 0 && filteredDoctors.length === doctors.length && (
          <div className="text-center mt-12">
            <button className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Load More Doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;

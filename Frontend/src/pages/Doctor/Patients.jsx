// src/pages/Doctor/Patients.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreVertical, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  Activity, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  MessageCircle, 
  Video, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Star, 
  ChevronDown, 
  ChevronRight, 
  ArrowUpDown, 
  UserPlus,
  Stethoscope,
  Pill,
  Camera,
  Upload,
  X
} from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock patient data
  const mockPatients = [
    {
      id: 1,
      name: "Ramesh Thapa",
      age: 45,
      gender: "Male",
      phone: "+977-9841234567",
      email: "ramesh.thapa@gmail.com",
      address: "Kathmandu, Nepal",
      bloodType: "O+",
      status: "active",
      lastVisit: "2024-08-08",
      nextAppointment: "2024-08-15 14:30",
      condition: "Hypertension",
      priority: "medium",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      medicalHistory: ["Hypertension (2020)", "Diabetes Type 2 (2022)"],
      currentMedications: ["Lisinopril 10mg", "Metformin 500mg"],
      allergies: ["Penicillin"],
      insuranceId: "INS-001-2024",
      emergencyContact: {
        name: "Sita Thapa",
        relationship: "Wife",
        phone: "+977-9841234568"
      },
      totalVisits: 12,
      rating: 4.8,
      notes: "Regular follow-up required for blood pressure monitoring."
    },
    {
      id: 2,
      name: "Sita Sharma",
      age: 32,
      gender: "Female",
      phone: "+977-9841234569",
      email: "sita.sharma@gmail.com",
      address: "Pokhara, Nepal",
      bloodType: "A+",
      status: "active",
      lastVisit: "2024-08-10",
      nextAppointment: "2024-08-16 15:15",
      condition: "Diabetes Management",
      priority: "high",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332b265?w=150&h=150&fit=crop&crop=face",
      medicalHistory: ["Gestational Diabetes (2019)", "Type 2 Diabetes (2021)"],
      currentMedications: ["Insulin", "Metformin 850mg"],
      allergies: ["Sulfa drugs"],
      insuranceId: "INS-002-2024",
      emergencyContact: {
        name: "Ram Sharma",
        relationship: "Husband",
        phone: "+977-9841234570"
      },
      totalVisits: 18,
      rating: 4.9,
      notes: "Requires regular glucose monitoring and dietary counseling."
    },
    {
      id: 3,
      name: "Kumar Rai",
      age: 28,
      gender: "Male",
      phone: "+977-9841234571",
      email: "kumar.rai@gmail.com",
      address: "Lalitpur, Nepal",
      bloodType: "B+",
      status: "inactive",
      lastVisit: "2024-07-15",
      nextAppointment: null,
      condition: "Anxiety Disorder",
      priority: "urgent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      medicalHistory: ["Anxiety Disorder (2023)", "Depression (2023)"],
      currentMedications: ["Sertraline 50mg", "Alprazolam 0.25mg"],
      allergies: ["None known"],
      insuranceId: "INS-003-2024",
      emergencyContact: {
        name: "Maya Rai",
        relationship: "Mother",
        phone: "+977-9841234572"
      },
      totalVisits: 8,
      rating: 4.7,
      notes: "Requires psychiatric follow-up. Last session showed improvement."
    },
    {
      id: 4,
      name: "Priya Gurung",
      age: 38,
      gender: "Female",
      phone: "+977-9841234573",
      email: "priya.gurung@gmail.com",
      address: "Bhaktapur, Nepal",
      bloodType: "AB+",
      status: "active",
      lastVisit: "2024-08-09",
      nextAppointment: "2024-08-17 10:00",
      condition: "Migraine",
      priority: "low",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      medicalHistory: ["Chronic Migraine (2018)", "Tension Headaches (2020)"],
      currentMedications: ["Sumatriptan", "Propranolol 40mg"],
      allergies: ["Aspirin"],
      insuranceId: "INS-004-2024",
      emergencyContact: {
        name: "Binod Gurung",
        relationship: "Brother",
        phone: "+977-9841234574"
      },
      totalVisits: 15,
      rating: 4.6,
      notes: "Responds well to preventive medication. Lifestyle modifications recommended."
    }
  ];

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  // Filter and search logic
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let valueA, valueB;
    
    switch(sortBy) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'age':
        valueA = a.age;
        valueB = b.age;
        break;
      case 'lastVisit':
        valueA = new Date(a.lastVisit);
        valueB = new Date(b.lastVisit);
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const handlePatientSelect = (patientId) => {
    setSelectedPatients(prev => {
      if (prev.includes(patientId)) {
        return prev.filter(id => id !== patientId);
      } else {
        return [...prev, patientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === sortedPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(sortedPatients.map(p => p.id));
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(prev => prev.filter(p => p.id !== patientId));
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Patient Card Component
  const PatientCard = ({ patient }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group relative">
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={selectedPatients.includes(patient.id)}
          onChange={() => handlePatientSelect(patient.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
      
      <div className="absolute top-4 right-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="text-center mb-4 mt-4">
        <img 
          src={patient.avatar} 
          alt={patient.name} 
          className="w-20 h-20 rounded-full mx-auto mb-3 shadow-md object-cover" 
        />
        <h3 className="text-xl font-bold text-gray-900 mb-1">{patient.name}</h3>
        <p className="text-gray-600 text-sm">{patient.age} years • {patient.gender}</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
            {patient.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
            {patient.priority}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Stethoscope className="w-4 h-4" />
          <span>{patient.condition}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>{patient.rating}/5 ({patient.totalVisits} visits)</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={() => handleViewPatient(patient)}
          className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        <button className="py-2 px-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
          <MessageCircle className="w-4 h-4" />
        </button>
        <button className="py-2 px-3 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
          <Video className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Patient List Row Component
  const PatientListRow = ({ patient }) => (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedPatients.includes(patient.id)}
          onChange={() => handlePatientSelect(patient.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src={patient.avatar} 
            alt={patient.name} 
            className="w-10 h-10 rounded-full object-cover shadow-sm" 
          />
          <div>
            <p className="font-semibold text-gray-900">{patient.name}</p>
            <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{patient.condition}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{patient.phone}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
          {patient.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {new Date(patient.lastVisit).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
          {patient.priority}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleViewPatient(patient)}
            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
            title="View Patient"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors" title="Message">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors" title="Video Call">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" title="More Options">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Patients</h1>
              <p className="text-gray-600">Manage and monitor your patients</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add Patient</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-900">{patients.length}</p>
                  <p className="text-blue-700 font-medium">Total Patients</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-900">{patients.filter(p => p.status === 'active').length}</p>
                  <p className="text-green-700 font-medium">Active Patients</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-900">{patients.filter(p => p.nextAppointment).length}</p>
                  <p className="text-orange-700 font-medium">Scheduled</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-900">4.8</p>
                  <p className="text-purple-700 font-medium">Avg Rating</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="new">New</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="age">Sort by Age</option>
                  <option value="lastVisit">Sort by Last Visit</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedPatients.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedPatients.length} selected</span>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                    Delete Selected
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <div className="w-5 h-5 space-y-1">
                    <div className="h-1 bg-current rounded-full"></div>
                    <div className="h-1 bg-current rounded-full"></div>
                    <div className="h-1 bg-current rounded-full"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPatients.length === sortedPatients.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Condition</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Visit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPatients.map((patient) => (
                    <PatientListRow key={patient.id} patient={patient} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sortedPatients.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Add First Patient
            </button>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Patient Info */}
                <div className="lg:col-span-1">
                  <div className="text-center mb-6">
                    <img 
                      src={selectedPatient.avatar} 
                      alt={selectedPatient.name} 
                      className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg object-cover" 
                    />
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedPatient.name}</h3>
                    <p className="text-gray-600">{selectedPatient.age} years • {selectedPatient.gender}</p>
                    <div className="flex items-center justify-center space-x-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPatient.status)}`}>
                        {selectedPatient.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedPatient.priority)}`}>
                        {selectedPatient.priority}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{selectedPatient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{selectedPatient.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{selectedPatient.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-3 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Emergency Contact</span>
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-red-800"><strong>{selectedPatient.emergencyContact.name}</strong></p>
                        <p className="text-sm text-red-700">{selectedPatient.emergencyContact.relationship}</p>
                        <p className="text-sm text-red-700">{selectedPatient.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Basic Medical Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3">Primary Condition</h4>
                        <p className="text-blue-800">{selectedPatient.condition}</p>
                      </div>
                      <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-3">Blood Type</h4>
                        <p className="text-green-800 text-2xl font-bold">{selectedPatient.bloodType}</p>
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Medical History</span>
                      </h4>
                      <div className="space-y-2">
                        {selectedPatient.medicalHistory.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Medications */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Pill className="w-5 h-5" />
                        <span>Current Medications</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedPatient.currentMedications.map((medication, idx) => (
                          <div key={idx} className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                            <span className="text-purple-800 font-medium">{medication}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                      <h4 className="font-semibold text-red-900 mb-4 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Allergies</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, idx) => (
                          <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Visit Statistics */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
                        <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-900">{selectedPatient.totalVisits}</p>
                        <p className="text-sm text-orange-700">Total Visits</p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
                        <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-yellow-900">{selectedPatient.rating}</p>
                        <p className="text-sm text-yellow-700">Rating</p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
                        <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm font-bold text-indigo-900">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                        <p className="text-sm text-indigo-700">Last Visit</p>
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedPatient.notes && (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Clinical Notes</h4>
                        <p className="text-gray-700">{selectedPatient.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors">
                        <Calendar className="w-5 h-5" />
                        <span>Schedule Appointment</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>Send Message</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-purple-700 transition-colors">
                        <Video className="w-5 h-5" />
                        <span>Video Call</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-orange-700 transition-colors">
                        <FileText className="w-5 h-5" />
                        <span>Create Prescription</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+977-9841234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="patient@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full address"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Condition</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter primary medical condition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Known Allergies</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter allergies (comma-separated)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ID</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter insurance ID"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+977-9841234568"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                  >
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
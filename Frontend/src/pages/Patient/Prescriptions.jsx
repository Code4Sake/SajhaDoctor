import React, { useState } from 'react';
import { 
  Pill, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  ShoppingCart,
  Truck,
  Phone
} from 'lucide-react';
import Layout from '../Layout';

const PrescriptionCard = ({ prescription, onDownload, onReorder, delay = 0 }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{prescription.prescriptionId}</h3>
            <p className="text-gray-600">{prescription.doctor}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{prescription.date}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
            {getStatusIcon(prescription.status)}
            <span className="ml-1 capitalize">{prescription.status}</span>
          </span>
          <p className="text-sm text-gray-500 mt-2">{prescription.medications.length} medications</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {prescription.medications.map((med, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-900">{med.name}</p>
              <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{med.duration}</p>
              <p className="text-xs text-gray-500">{med.instructions}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{prescription.diagnosis}</span>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onDownload(prescription)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
          </button>
          
          {prescription.status === 'active' && (
            <button
              onClick={() => onReorder(prescription)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Reorder</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PharmacyCard = ({ pharmacy, onContact, onOrder }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{pharmacy.name}</h4>
            <p className="text-sm text-gray-600">{pharmacy.address}</p>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-sm text-green-600 font-medium">⭐ {pharmacy.rating}</span>
              <span className="text-sm text-gray-500">• {pharmacy.distance}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onContact(pharmacy)}
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Phone className="w-4 h-4 text-gray-600" />
          </button>
          
          <button
            onClick={() => onOrder(pharmacy)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium"
          >
            Order Here
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Truck className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Delivery: {pharmacy.deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">{pharmacy.hours}</span>
          </div>
        </div>
        
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
          Available
        </span>
      </div>
    </div>
  );
};

const Prescriptions = () => {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const prescriptions = [
    {
      id: 1,
      prescriptionId: "RX-2024-001",
      doctor: "Dr. Rajesh Sharma",
      date: "Dec 15, 2024",
      status: "active",
      diagnosis: "Hypertension",
      medications: [
        {
          name: "Amlodipine 5mg",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take with food"
        },
        {
          name: "Metoprolol 50mg",
          dosage: "50mg",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take before meals"
        }
      ]
    },
    {
      id: 2,
      prescriptionId: "RX-2024-002",
      doctor: "Dr. Priya Thapa",
      date: "Dec 10, 2024",
      status: "completed",
      diagnosis: "Respiratory Infection",
      medications: [
        {
          name: "Azithromycin 500mg",
          dosage: "500mg",
          frequency: "Once daily",
          duration: "5 days",
          instructions: "Complete full course"
        }
      ]
    },
    {
      id: 3,
      prescriptionId: "RX-2024-003",
      doctor: "Dr. Anjana Poudel",
      date: "Nov 28, 2024",
      status: "expired",
      diagnosis: "Skin Allergy",
      medications: [
        {
          name: "Cetirizine 10mg",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "14 days",
          instructions: "Take at bedtime"
        }
      ]
    }
  ];

  const nearbyPharmacies = [
    {
      id: 1,
      name: "MedPlus Pharmacy",
      address: "Thamel, Kathmandu",
      rating: 4.8,
      distance: "0.5 km",
      deliveryTime: "30 mins",
      hours: "Open 24/7"
    },
    {
      id: 2,
      name: "Apex Pharmacy",
      address: "New Road, Kathmandu",
      rating: 4.6,
      distance: "1.2 km",
      deliveryTime: "45 mins",
      hours: "8 AM - 10 PM"
    },
    {
      id: 3,
      name: "HealthCare Pharmacy",
      address: "Durbarmarg, Kathmandu",
      rating: 4.7,
      distance: "0.8 km",
      deliveryTime: "35 mins",
      hours: "9 AM - 9 PM"
    }
  ];

  const handleDownload = (prescription) => {
    console.log('Downloading prescription:', prescription.prescriptionId);
    // Implement download functionality
  };

  const handleReorder = (prescription) => {
    console.log('Reordering prescription:', prescription.prescriptionId);
    // Implement reorder functionality
  };

  const handleContactPharmacy = (pharmacy) => {
    console.log('Contacting pharmacy:', pharmacy.name);
    // Implement contact functionality
  };

  const handleOrderFromPharmacy = (pharmacy) => {
    console.log('Ordering from pharmacy:', pharmacy.name);
    // Implement order functionality
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Prescriptions & Pharmacy</h1>
            <p className="text-blue-100 text-lg">Manage your prescriptions and order medications</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'prescriptions'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              My Prescriptions
            </button>
            
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'pharmacy'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              Nearby Pharmacies
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'prescriptions' ? (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search prescriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-6">
              {filteredPrescriptions.map((prescription, idx) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onDownload={handleDownload}
                  onReorder={handleReorder}
                  delay={idx * 100}
                />
              ))}
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prescriptions Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Available Pharmacies</p>
                    <p className="text-3xl font-bold text-gray-900">{nearbyPharmacies.length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-2xl">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Average Delivery</p>
                    <p className="text-3xl font-bold text-gray-900">35 min</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-2xl">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">24/7 Available</p>
                    <p className="text-3xl font-bold text-gray-900">1</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-2xl">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Pharmacies */}
            <div className="space-y-4">
              {nearbyPharmacies.map((pharmacy, idx) => (
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  onContact={handleContactPharmacy}
                  onOrder={handleOrderFromPharmacy}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Prescriptions;
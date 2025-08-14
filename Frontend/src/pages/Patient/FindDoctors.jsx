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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const links = [
    { label: "Home", to: "/home/PatientDashboard", icon: Home },
    {
      label: "Appointments",
      to: "/home/PatientDashboard/Appointment",
      icon: Calendar,
    },
    {
      label: "Find Doctors",
      to: "/home/PatientDashboard/FindDoctors",
      icon: Stethoscope,
    },
    {
      label: "Settings",
      to: "/home/PatientDashboard/Settings",
      icon: Settings,
    },
    { label: "Logout", to: "/logout", icon: LogOut },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static lg:shadow-none`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-700">HealthApp</h2>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <nav className="mt-6">
        <ul className="flex flex-col space-y-2 px-4">
          {links.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  location.pathname === to
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
                onClick={toggleSidebar}
              >
                <Icon className="w-5 h-5 mr-3" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Header Component
const Header = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
      <h1 className="text-xl font-bold text-blue-700">Appointments</h1>
      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=32&h=32&fit=crop&crop=face"
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover shadow-sm"
          />
          <span className="font-medium text-gray-700">Ramesh</span>
        </div>
      </div>
    </header>
  );
};

// Mobile Bottom Navigation
const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/home/PatientDashboard", icon: Home },
    {
      label: "Appointments",
      to: "/home/PatientDashboard/Appointment",
      icon: Calendar,
    },
    {
      label: "Doctors",
      to: "/home/PatientDashboard/FindDoctors",
      icon: Stethoscope,
    },
    {
      label: "Settings",
      to: "/home/PatientDashboard/Settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner flex justify-around items-center lg:hidden z-50">
      {navItems.map(({ label, to, icon: Icon }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium ${
              active ? "text-blue-700" : "text-gray-600 hover:text-blue-700"
            }`}
          >
            <Icon
              className={`w-6 h-6 mb-1 ${
                active ? "text-blue-700" : "text-gray-600"
              }`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

const DoctorCard = ({ doctor, onBook, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${delay}ms`,
        animation: "slideInUp 0.6s ease-out forwards",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md ${
                  doctor.isOnline ? "bg-emerald-500" : "bg-gray-400"
                }`}
              ></div>
              {doctor.verified && (
                <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-bold text-gray-900 text-lg">
                  {doctor.name}
                </h4>
                {doctor.verified && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {doctor.specialization}
              </p>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">
                    {doctor.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({doctor.reviews})
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {doctor.experience}
                </span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {doctor.patients}+ patients
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{doctor.location}</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Available {doctor.availability}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ₹{doctor.consultationFee}
            </p>
            <p className="text-xs text-gray-500">per consultation</p>
            {doctor.discount && (
              <p className="text-xs text-green-600 font-semibold mt-1">
                {doctor.discount}% OFF
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {doctor.consultationModes.map((mode, idx) => (
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
        animation: "slideInUp 0.6s ease-out forwards",
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

const FindDoctors = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({
    availability: "all",
    experience: "all",
    consultationMode: "all",
    priceRange: "all",
  });

  const specialties = [
    { name: "General Medicine", doctorCount: 45 },
    { name: "Cardiology", doctorCount: 23 },
    { name: "Dermatology", doctorCount: 18 },
    { name: "Neurology", doctorCount: 12 },
    { name: "Orthopedics", doctorCount: 34 },
    { name: "Pediatrics", doctorCount: 28 },
  ];
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch doctors
  const API_BASE_URL = "";
  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const fetchDoctors = async () => {
      setLoading(true);
      const result = await apiRequest("/api/doctors", {
        method: "GET",
        withCredentials: true,
      });

      if (result.success) {
        setDoctors(result.data);
      } else {
        setError(result.error?.message || "Failed to fetch doctors");
      }
      setLoading(false);
    };

    useEffect(() => {
      fetchDoctors();
    }, []);

    if (loading) return <p>Loading doctors...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const handleBookDoctor = (doctor) => {
      console.log(`Booking appointment with ${doctor.name}`);
      // Add booking logic here
    };

    const handleSpecialtyClick = (specialty) => {
      setSelectedSpecialty(
        selectedSpecialty?.name === specialty.name ? null : specialty
      );
    };

    const filteredDoctors = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        !selectedSpecialty ||
        doctor.specialization
          .toLowerCase()
          .includes(selectedSpecialty.name.toLowerCase());
      return matchesSearch && matchesSpecialty;
    });
    console.log(filteredDoctors);

    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        hiiiii
        <style jsx>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-auto pb-16">
          {" "}
          {/* padding bottom for mobile nav */}
          <Header toggleSidebar={toggleSidebar} />
          <main className="p-6 space-y-8 overflow-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-4">
                  Find Your Perfect Doctor
                </h1>
                <p className="text-blue-100 text-lg">
                  Connect with top healthcare professionals in Nepal
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search doctors, specialties, or conditions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-medium transition-all duration-200 ${
                      showFilters
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="rating">Sort by Rating</option>
                    <option value="price">Sort by Price</option>
                    <option value="experience">Sort by Experience</option>
                    <option value="availability">Sort by Availability</option>
                  </select>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        value={filters.availability}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            availability: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All</option>
                        <option value="today">Available Today</option>
                        <option value="tomorrow">Available Tomorrow</option>
                        <option value="week">This Week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience
                      </label>
                      <select
                        value={filters.experience}
                        onChange={(e) =>
                          setFilters({ ...filters, experience: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All</option>
                        <option value="5+">5+ Years</option>
                        <option value="10+">10+ Years</option>
                        <option value="15+">15+ Years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Mode
                      </label>
                      <select
                        value={filters.consultationMode}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            consultationMode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All</option>
                        <option value="video">Video Call</option>
                        <option value="audio">Audio Call</option>
                        <option value="chat">Chat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        value={filters.priceRange}
                        onChange={(e) =>
                          setFilters({ ...filters, priceRange: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All</option>
                        <option value="0-500">₹0 - ₹500</option>
                        <option value="500-1000">₹500 - ₹1000</option>
                        <option value="1000+">₹1000+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Specialties */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Browse by Specialty
              </h2>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
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

            {/* Results */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSpecialty
                    ? `${selectedSpecialty.name} Specialists`
                    : "Available Doctors"}
                </h2>
                <p className="text-gray-600">
                  {filteredDoctors.length} doctors found
                </p>
              </div>

              <div className="space-y-6">
                {filteredDoctors.map((doctor, idx) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBook={handleBookDoctor}
                    delay={idx * 100}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    );
  };
};

export default FindDoctors;

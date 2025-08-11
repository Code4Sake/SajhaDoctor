import React, { useState } from 'react';
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  User, 
  Calendar, 
  PlayCircle,
  Pause,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  MessageSquare,
  FileText,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Minimize2,
  Maximize2,
  Settings,
  Users,
  Activity,
  Star,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

// Enhanced Card Component
const DashboardCard = ({ title, children, className = "", delay = 0, action, icon: Icon }) => (
  <div 
    className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-500 ${className}`}
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'slideInUp 0.6s ease-out forwards'
    }}
  >
    {title && (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-6 h-6 text-blue-600" />}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-3">
          {action}
          <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    )}
    {children}
  </div>
);

// Active Consultation Card
const ActiveConsultationCard = ({ consultation, onAction, delay = 0 }) => {
  const getTypeColor = (type) => {
    switch(type) {
      case 'video': return 'from-blue-500 to-blue-600';
      case 'audio': return 'from-green-500 to-green-600';
      case 'chat': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-5 h-5 text-white" />;
      case 'audio': return <Phone className="w-5 h-5 text-white" />;
      case 'chat': return <MessageCircle className="w-5 h-5 text-white" />;
      default: return <User className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div 
      className={`bg-gradient-to-r ${getTypeColor(consultation.type)} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            {getTypeIcon(consultation.type)}
          </div>
          <div>
            <h4 className="font-bold text-lg">{consultation.patientName}</h4>
            <p className="text-white/80 text-sm">{consultation.reason}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-white/80">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{consultation.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{consultation.startTime}</span>
          </div>
        </div>
        <span className="text-sm font-medium capitalize">{consultation.type} call</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onAction('join', consultation)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Join</span>
          </button>
          <button 
            onClick={() => onAction('end', consultation)}
            className="bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End</span>
          </button>
        </div>
        <div className="text-right">
          <p className="font-bold">₹{consultation.fee}</p>
          <p className="text-xs text-white/80">Session fee</p>
        </div>
      </div>
    </div>
  );
};

// Upcoming Consultation Card
const UpcomingConsultationCard = ({ consultation, onAction, delay = 0 }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4 text-blue-600" />;
      case 'audio': return <Phone className="w-4 h-4 text-green-600" />;
      case 'chat': return <MessageCircle className="w-4 h-4 text-purple-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50/50';
      case 'high': return 'border-l-orange-500 bg-orange-50/50';
      case 'medium': return 'border-l-blue-500 bg-blue-50/50';
      case 'low': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-300 bg-gray-50/50';
    }
  };

  return (
    <div 
      className={`bg-white rounded-2xl border-l-4 ${getPriorityColor(consultation.priority)} border-r border-t border-b border-gray-100 p-4 hover:shadow-md transition-all duration-300`}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={consultation.patientAvatar} 
            alt={consultation.patientName} 
            className="w-12 h-12 rounded-xl object-cover shadow-sm" 
          />
          <div>
            <h4 className="font-bold text-gray-900">{consultation.patientName}</h4>
            <p className="text-sm text-gray-600">{consultation.reason}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getTypeIcon(consultation.type)}
          <span className="text-xs text-gray-500 capitalize">{consultation.type}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{consultation.scheduledTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{consultation.date}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onAction('start', consultation)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Start
          </button>
          <button 
            onClick={() => onAction('reschedule', consultation)}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Chat Interface Component
const ChatInterface = ({ consultation, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 h-96 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src={consultation.patientAvatar} 
            alt={consultation.patientName} 
            className="w-10 h-10 rounded-xl object-cover" 
          />
          <div>
            <h4 className="font-semibold text-gray-900">{consultation.patientName}</h4>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((message, idx) => (
          <div key={idx} className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
              message.sender === 'doctor' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <Smile className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <button 
            onClick={handleSendMessage}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Video Call Interface Component
const VideoCallInterface = ({ consultation, isActive, onAction }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Main Video */}
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-xl font-semibold">{consultation.patientName}</p>
            <p className="text-gray-400">Video call in progress...</p>
          </div>
        </div>

        {/* Picture in Picture - Doctor's video */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-xl border-2 border-white/20 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm">You</p>
          </div>
        </div>

        {/* Call Info */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording</span>
            <span className="text-sm">•</span>
            <span className="text-sm">15:32</span>
          </div>
        </div>

        {/* Screen Share Indicator */}
        {isScreenSharing && (
          <div className="absolute top-16 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <ScreenShare className="w-4 h-4" />
              <span>Screen sharing</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full transition-colors ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isVideoOff ? <CameraOff className="w-6 h-6 text-white" /> : <Camera className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-full transition-colors ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <ScreenShare className="w-6 h-6 text-white" />
          </button>

          <button className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
            <MessageSquare className="w-6 h-6 text-white" />
          </button>

          <button className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
            <Settings className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => onAction('end', consultation)}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-white text-sm">
            {consultation.patientName} • {consultation.reason}
          </p>
        </div>
      </div>
    </div>
  );
};

const Consultations = () => {
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [selectedTab, setSelectedTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Sample data
  const activeConsultations = [
    {
      id: 1,
      patientName: "Kumar Rai",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      reason: "Mental health consultation",
      type: "video",
      duration: "15:32",
      startTime: "2:00 PM",
      fee: 1500
    }
  ];

  const upcomingConsultations = [
    {
      id: 2,
      patientName: "Ramesh Thapa",
      patientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      reason: "Follow-up consultation",
      type: "video",
      scheduledTime: "3:30 PM",
      date: "Today",
      priority: "medium",
      fee: 800
    },
    {
      id: 3,
      patientName: "Sita Sharma",
      patientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b332b265?w=100&h=100&fit=crop&crop=face",
      reason: "Diabetes management",
      type: "chat",
      scheduledTime: "4:00 PM",
      date: "Today",
      priority: "high",
      fee: 600
    },
    {
      id: 4,
      patientName: "Maya Gurung",
      patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      reason: "General consultation",
      type: "audio",
      scheduledTime: "10:00 AM",
      date: "Tomorrow",
      priority: "low",
      fee: 500
    }
  ];

  const sampleMessages = [
    { sender: 'patient', text: 'Hello Doctor, I have been experiencing some anxiety lately.', time: '2:05 PM' },
    { sender: 'doctor', text: 'Hello! I understand. Can you tell me more about when these feelings started?', time: '2:06 PM' },
    { sender: 'patient', text: 'It started about 2 weeks ago, especially during work hours.', time: '2:07 PM' },
    { sender: 'doctor', text: 'I see. Are there any specific triggers that you\'ve noticed?', time: '2:08 PM' }
  ];

  const handleConsultationAction = (action, consultation) => {
    console.log(`${action} consultation:`, consultation);
    
    if (action === 'join' || action === 'start') {
      setActiveConsultation(consultation);
    } else if (action === 'end') {
      setActiveConsultation(null);
    }
  };

  const handleSendMessage = (message) => {
    console.log('Sending message:', message);
    // Handle message sending logic
  };

  const consultationStats = [
    { label: "Active Now", value: activeConsultations.length, color: "green", icon: Activity },
    { label: "Today's Total", value: "8", color: "blue", icon: Calendar },
    { label: "This Week", value: "45", color: "purple", icon: Users },
    { label: "Avg Rating", value: "4.9", color: "yellow", icon: Star }
  ];

  return (
    <div className="space-y-8">
      {/* Video Call Interface */}
      <VideoCallInterface 
        consultation={activeConsultation}
        isActive={activeConsultation?.type === 'video'}
        onAction={handleConsultationAction}
      />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Consultation Hub</h1>
              <p className="text-purple-100 text-lg">Conduct video calls, audio calls, and chat consultations</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <MessageCircle className="w-8 h-8 mb-2" />
                <p className="font-bold text-xl">{activeConsultations.length}</p>
                <p className="text-sm text-purple-100">Active Now</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {consultationStats.map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-3">
                <stat.icon className="w-8 h-8 text-white/80" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-purple-100">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Consultations */}
      {activeConsultations.length > 0 && (
        <DashboardCard title="Active Consultations" icon={Activity} delay={100}>
          <div className="space-y-4">
            {activeConsultations.map((consultation, idx) => (
              <ActiveConsultationCard
                key={consultation.id}
                consultation={consultation}
                onAction={handleConsultationAction}
                delay={idx * 100}
              />
            ))}
          </div>
        </DashboardCard>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Consultations */}
        <div className="lg:col-span-2">
          <DashboardCard 
            title="Upcoming Consultations" 
            icon={Calendar}
            delay={200}
            action={
              <button className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Consultation</span>
              </button>
            }
          >
            {/* Tabs and Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setSelectedTab('upcoming')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTab === 'upcoming' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setSelectedTab('completed')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTab === 'completed' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Completed
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50/50 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="chat">Chat</option>
                  </select>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search consultations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
                />
              </div>
            </div>

            {/* Consultations List */}
            <div className="space-y-4">
              {upcomingConsultations.map((consultation, idx) => (
                <UpcomingConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onAction={handleConsultationAction}
                  delay={idx * 50}
                />
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-1">
          <DashboardCard title="Quick Chat" icon={MessageCircle} delay={300}>
            {upcomingConsultations.length > 0 && (
              <ChatInterface
                consultation={upcomingConsultations.find(c => c.type === 'chat') || upcomingConsultations[0]}
                messages={sampleMessages}
                onSendMessage={handleSendMessage}
              />
            )}
          </DashboardCard>
        </div>
      </div>

      {/* Quick Actions */}
      <DashboardCard title="Quick Actions" delay={400}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group border border-blue-200">
            <div className="bg-blue-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Start Video Call</p>
              <p className="text-sm text-gray-600">Begin instant video consultation</p>
            </div>
          </button>

          <button className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group border border-green-200">
            <div className="bg-green-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Audio Call</p>
              <p className="text-sm text-gray-600">Start voice consultation</p>
            </div>
          </button>

          <button className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group border border-purple-200">
            <div className="bg-purple-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Chat Session</p>
              <p className="text-sm text-gray-600">Begin text consultation</p>
            </div>
          </button>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Consultations;
import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Star,
  Download,
  Archive,
  Trash2,
  User,
  Calendar,
  FileText,
  Image as ImageIcon,
  Mic,
  VideoIcon,
  Heart,
  Activity,
  TrendingUp,
  Users,
  MessageSquare,
  PhoneCall
} from 'lucide-react';

const Consultations = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showChatOptions, setShowChatOptions] = useState(false);

  // Sample consultation data
  const consultations = [
    {
      id: 1,
      doctor: "Dr. Rajesh Sharma",
      specialization: "Cardiologist",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Your recent test results look good. Continue with the current medication.",
      timestamp: "2 mins ago",
      unread: 2,
      isOnline: true,
      consultationType: "video",
      status: "active",
      rating: 4.8,
      totalConsultations: 5,
      messages: [
        {
          id: 1,
          sender: "doctor",
          content: "Hello! How are you feeling today?",
          timestamp: "10:30 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "patient",
          content: "I'm feeling much better since starting the medication. The chest pain has reduced significantly.",
          timestamp: "10:32 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "doctor",
          content: "That's excellent news! Your recent test results look good. Continue with the current medication.",
          timestamp: "10:35 AM",
          type: "text"
        },
        {
          id: 4,
          sender: "doctor",
          content: "I've uploaded your prescription. Please follow the dosage instructions carefully.",
          timestamp: "10:36 AM",
          type: "file",
          fileName: "Prescription_Jan2025.pdf"
        }
      ]
    },
    {
      id: 2,
      doctor: "Dr. Priya Thapa",
      specialization: "General Medicine",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Please schedule a follow-up appointment next week.",
      timestamp: "1 hour ago",
      unread: 0,
      isOnline: false,
      consultationType: "audio",
      status: "completed",
      rating: 4.6,
      totalConsultations: 3,
      messages: [
        {
          id: 1,
          sender: "doctor",
          content: "Good morning! I've reviewed your symptoms from our last consultation.",
          timestamp: "9:15 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "patient",
          content: "Yes, the headaches are still persisting, especially in the morning.",
          timestamp: "9:17 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "doctor",
          content: "I recommend starting with this medication. Please schedule a follow-up appointment next week.",
          timestamp: "9:20 AM",
          type: "text"
        }
      ]
    },
    {
      id: 3,
      doctor: "Dr. Anjana Poudel",
      specialization: "Dermatologist",
      avatar: "https://images.unsplash.com/photo-1594824750103-34b3c9e19bb8?w=100&h=100&fit=crop&crop=face",
      lastMessage: "The treatment is showing good results. Continue for 2 more weeks.",
      timestamp: "3 hours ago",
      unread: 1,
      isOnline: true,
      consultationType: "chat",
      status: "active",
      rating: 4.9,
      totalConsultations: 2,
      messages: [
        {
          id: 1,
          sender: "patient",
          content: "The skin condition seems to be improving after using the prescribed cream.",
          timestamp: "Yesterday",
          type: "text"
        },
        {
          id: 2,
          sender: "doctor",
          content: "That's great to hear! The treatment is showing good results. Continue for 2 more weeks.",
          timestamp: "Yesterday",
          type: "text"
        }
      ]
    },
    {
      id: 4,
      doctor: "Dr. Suresh Karki",
      specialization: "Orthopedic",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Your X-ray results are normal. No fractures detected.",
      timestamp: "1 day ago",
      unread: 0,
      isOnline: false,
      consultationType: "video",
      status: "completed",
      rating: 4.7,
      totalConsultations: 1,
      messages: [
        {
          id: 1,
          sender: "doctor",
          content: "I've reviewed your X-ray results. Everything looks normal, no fractures detected.",
          timestamp: "Yesterday",
          type: "text"
        },
        {
          id: 2,
          sender: "patient",
          content: "That's a relief! What about the pain I'm still experiencing?",
          timestamp: "Yesterday",
          type: "text"
        },
        {
          id: 3,
          sender: "doctor",
          content: "The pain should subside with rest and physiotherapy. I'll prescribe some anti-inflammatory medication.",
          timestamp: "Yesterday",
          type: "text"
        }
      ]
    }
  ];

  const getConsultationTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Phone className="w-4 h-4" />;
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-600';
      case 'completed': return 'text-blue-600';
      case 'pending': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const ConsultationCard = ({ consultation, onClick, isActive }) => (
    <div 
      onClick={() => onClick(consultation)}
      className={`group p-4 rounded-2xl transition-all duration-200 cursor-pointer border ${
        isActive 
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' 
          : 'bg-white hover:bg-gray-50 border-gray-100'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img 
            src={consultation.avatar} 
            alt={consultation.doctor}
            className="w-14 h-14 rounded-2xl object-cover shadow-md"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
            consultation.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md">
            {getConsultationTypeIcon(consultation.consultationType)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-gray-900 text-sm truncate">{consultation.doctor}</h4>
            <div className="flex items-center space-x-2">
              {consultation.unread > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {consultation.unread}
                </span>
              )}
              <span className="text-xs text-gray-500">{consultation.timestamp}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-xs mb-2">{consultation.specialization}</p>
          
          <p className="text-gray-700 text-sm line-clamp-2 mb-2">
            {consultation.lastMessage}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-xs text-gray-600">{consultation.rating}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-600">{consultation.totalConsultations} consultations</span>
            </div>
            <span className={`text-xs font-semibold capitalize ${getStatusColor(consultation.status)}`}>
              {consultation.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message, isOwn }) => (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isOwn 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        {message.type === 'file' ? (
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isOwn ? 'bg-white/20' : 'bg-blue-100'}`}>
              <FileText className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`font-medium text-sm ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                {message.fileName}
              </p>
              <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
                Click to download
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
        <p className={`text-xs mt-2 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );

  const ChatInterface = ({ consultation }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={consultation.avatar} 
                alt={consultation.doctor}
                className="w-12 h-12 rounded-2xl object-cover shadow-md"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                consultation.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{consultation.doctor}</h3>
              <p className="text-gray-600 text-sm">{consultation.specialization}</p>
              <p className="text-xs text-green-600">
                {consultation.isOnline ? 'Online now' : 'Last seen 2 hours ago'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-green-100 text-green-600 rounded-2xl hover:bg-green-200 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-3 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowChatOptions(!showChatOptions)}
                className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showChatOptions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Download className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Download Chat</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Archive className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Archive Chat</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center space-x-3">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Delete Chat</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {consultation.messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isOwn={message.sender === 'patient'} 
          />
        ))}
      </div>
      
      {/* Message Input */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  console.log('Sending message:', message);
                  setMessage('');
                }
              }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                if (message.trim()) {
                  console.log('Sending message:', message);
                  setMessage('');
                }
              }}
              disabled={!message.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         consultation.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active') return matchesSearch && consultation.status === 'active';
    if (filterType === 'unread') return matchesSearch && consultation.unread > 0;
    return matchesSearch && consultation.consultationType === filterType;
  });

  const totalConsultations = consultations.length;
  const activeConsultations = consultations.filter(c => c.status === 'active').length;
  const unreadMessages = consultations.reduce((sum, c) => sum + c.unread, 0);
  const averageRating = (consultations.reduce((sum, c) => sum + c.rating, 0) / consultations.length).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 rounded-3xl text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">My Consultations 💬</h1>
          <p className="text-purple-100 text-lg mb-6">Stay connected with your healthcare providers</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <MessageSquare className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-2xl font-bold">{totalConsultations}</p>
              <p className="text-sm text-purple-100">Total Chats</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Activity className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-2xl font-bold">{activeConsultations}</p>
              <p className="text-sm text-purple-100">Active</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <MessageCircle className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-2xl font-bold">{unreadMessages}</p>
              <p className="text-sm text-purple-100">Unread</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Star className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-2xl font-bold">{averageRating}</p>
              <p className="text-sm text-purple-100">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Consultation List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Consultations</h3>
              
              {/* Search and Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search consultations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All', icon: MessageCircle },
                    { key: 'active', label: 'Active', icon: Activity },
                    { key: 'unread', label: 'Unread', icon: MessageSquare },
                    { key: 'video', label: 'Video', icon: Video },
                    { key: 'audio', label: 'Audio', icon: Phone }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => setFilterType(filter.key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        filterType === filter.key
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <filter.icon className="w-4 h-4" />
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Consultation Cards */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredConsultations.map(consultation => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onClick={setActiveChat}
                  isActive={activeChat?.id === consultation.id}
                />
              ))}
              
              {filteredConsultations.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No consultations found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          {activeChat ? (
            <ChatInterface consultation={activeChat} />
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center h-[600px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a Consultation</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Choose a consultation from the list to start or continue your conversation with your healthcare provider.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultations;
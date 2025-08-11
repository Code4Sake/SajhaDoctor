import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Stethoscope, AlertTriangle, Loader } from 'lucide-react';

const RealAiSymptomChatbot = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm Dr. AI, powered by Google's Gemini AI. I can help analyze your symptoms and provide health guidance. What symptoms are you experiencing today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Replace with your Google Gemini API key (FREE from Google AI Studio)
  const GEMINI_API_KEY = 'AIzaSyDz55PYdESq77f3hfRba7877leCsTb-UbE';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Medical prompt to guide AI responses
  const createMedicalPrompt = (userSymptom) => {
    return `You are Dr. AI, a helpful medical assistant for HealthCare Nepal telemedicine platform. A patient is describing their symptoms. 

Patient's symptom/concern: "${userSymptom}"

Please respond as a helpful medical AI assistant following these guidelines:
1. Be empathetic and professional
2. Ask relevant follow-up questions if needed
3. Provide general health advice (not a diagnosis)
4. Suggest when to see a doctor
5. Always remind them this is not a substitute for professional medical care
6. Keep responses concise but helpful
7. If it seems serious, advise immediate medical attention
8. Suggest appropriate specialist if relevant (cardiologist, dermatologist, etc.)

Respond in a caring, professional medical assistant tone:`;
  };

  const callGeminiAPI = async (userMessage) => {
    try {
      const prompt = createMedicalPrompt(userMessage);
      
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I apologize, but I'm having trouble connecting to my medical database right now. For immediate medical concerns, please contact a healthcare provider directly or call emergency services if it's urgent.";
    }
  };

  // Fallback responses if API fails (for demo purposes)
  const fallbackResponses = {
    'fever': "I understand you have a fever. This could indicate an infection. Please monitor your temperature, stay hydrated, and consider seeing a doctor if it persists above 101°F or if you develop other concerning symptoms.",
    'headache': "Headaches can have various causes. Try resting in a quiet, dark room and staying hydrated. If headaches are severe, frequent, or accompanied by vision changes, please consult a doctor.",
    'chest pain': "⚠️ Chest pain should be taken seriously. If you're experiencing severe chest pain, shortness of breath, or pain radiating to your arm/jaw, please seek immediate medical attention or call emergency services.",
    'cough': "A persistent cough can have many causes. Stay hydrated, avoid irritants, and monitor for other symptoms. If the cough persists for more than a week or is accompanied by fever/blood, please see a doctor.",
    'default': "Thank you for sharing your symptoms with me. While I can provide general guidance, it's important to consult with a qualified healthcare provider for proper diagnosis and treatment. Would you like me to help you find available doctors on our platform?"
  };

  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return response;
      }
    }
    return fallbackResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let aiResponse;

    // Try API first, fallback to mock responses
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
      aiResponse = await callGeminiAPI(inputMessage);
    } else {
      // Use fallback responses for demo
      aiResponse = getFallbackResponse(inputMessage);
    }

    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: aiResponse,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);

    // Add follow-up suggestions after AI response
    setTimeout(() => {
      const suggestionMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: "Would you like me to:\n• Find available doctors near you\n• Book a consultation\n• Get more health tips\n• Ask about other symptoms",
        timestamp: new Date(),
        isActions: true
      };
      setMessages(prev => [...prev, suggestionMessage]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSymptoms = [
    "I have a fever",
    "Headache and fatigue", 
    "Chest pain",
    "Persistent cough",
    "Stomach ache",
    "Difficulty breathing"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Symptom Checker</h1>
                <p className="text-sm text-gray-600">Powered by Google Gemini AI</p>
              </div>
            </div>
            <div className="ml-auto">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} p-2 rounded-full`}>
                    {message.type === 'user' ? 
                      <User className="w-4 h-4 text-white" /> : 
                      <Bot className="w-4 h-4 text-white" />
                    }
                  </div>
                  <div className={`p-4 rounded-2xl ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">Dr. AI is analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Symptom Buttons */}
          {messages.length <= 2 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">Quick symptoms to check:</p>
              <div className="flex flex-wrap gap-2">
                {quickSymptoms.map((symptom, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(symptom)}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms..."
                  className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-800">
                  <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealAiSymptomChatbot;
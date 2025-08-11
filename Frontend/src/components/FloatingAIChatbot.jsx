import React, { useState } from 'react';
import { X, Minimize2, MessageCircle, Stethoscope } from 'lucide-react';

const FloatingChatbaseChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Floating chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] cursor-pointer">
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse cursor-pointer"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7" />
            <div className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              <Stethoscope className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </button>
        
        <div className="absolute bottom-20 right-0 mb-2 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4" />
            <span>Ask Dr. HealthCareNepal</span>
          </div>
          <div className="absolute top-full right-6 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-500 ease-in-out ${
        isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Dr. HealthCareNepal</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-blue-100">Online • Ready to help</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chatbase Iframe */}
        {!isMinimized && (
          <div className="h-[536px] rounded-b-2xl overflow-hidden">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/qi8YEUjvZqtE1n9kuu0bd"
              width="100%"
              height="100%"
              frameBorder="0"
              className="w-full h-full"
              title="Dr. HealthCareNepal"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingChatbaseChatbot;
import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  X,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AICopilotProps {
  onSendMessage: (message: string, context?: string) => Promise<string>;
  initialHistory?: ChatMessage[];
  context?: string;
}

export const AICopilot: React.FC<AICopilotProps> = ({
  onSendMessage,
  initialHistory = [],
  context = 'dashboard'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialHistory);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('aiCopilotOpen');
    if (savedState) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('aiCopilotOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage.content, context);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update unread count if closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setUnreadCount(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleOpen}
          className={`
            w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-white
            ${isOpen ? 'bg-slate-900 rotate-90 scale-90' : 'bg-elite-600 hover:bg-elite-700 hover:scale-105'}
            text-white
          `}
          aria-label="Toggle AI Copilot"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </div>

      {/* AI Copilot Interface */}
      {isOpen && (
        <div
          className={`
            fixed bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col z-40 overflow-hidden
            transition-all duration-300 origin-bottom-right
            ${isMinimized
              ? 'bottom-24 right-8 w-96 h-16'
              : 'bottom-28 right-8 w-96 h-[600px]'
            }
            animate-fade-in-up
          `}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 shadow-md flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-elite-600 rounded-sm flex items-center justify-center mr-4 shadow-glow">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">Elite AI</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Operations Agent • {context}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-slate-800 rounded transition-colors"
                  aria-label={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-elite-50 rounded-full flex items-center justify-center mb-4">
                      <Lightbulb className="w-8 h-8 text-elite-600" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Welcome to Elite AI</h4>
                    <p className="text-sm text-slate-600 max-w-xs">
                      Ask me about leads, schedule, reports, or anything else. I'm here to help!
                    </p>
                    <div className="mt-6 space-y-2 w-full max-w-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Try asking:</p>
                      {['Show me today\'s schedule', 'How many new leads?', 'Generate a report'].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => setInputValue(suggestion)}
                          className="w-full text-left px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-700 hover:border-elite-300 hover:text-elite-700 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest my-2">
                      Today
                    </div>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`
                            p-4 rounded-lg text-sm max-w-[90%] leading-relaxed
                            ${message.role === 'user'
                              ? 'bg-slate-800 text-white rounded-tr-none shadow-md'
                              : 'bg-white border border-slate-200 rounded-tl-none shadow-sm text-slate-700'
                            }
                          `}
                        >
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-4 rounded-lg rounded-tl-none shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Elite..."
                    disabled={isLoading}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-elite-500 transition-all pr-24 placeholder:text-slate-400 font-medium disabled:opacity-50"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label="Clear chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="p-1.5 bg-elite-900 text-white rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send message"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

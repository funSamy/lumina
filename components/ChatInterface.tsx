import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { sendBrandChatMessage } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const responseText = await sendBrandChatMessage(userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="text-indigo-400" size={20} />
              <h3 className="font-semibold text-white">Brand Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-10">
                <p>Hello! I can help you refine your brand identity, write copy, or suggest marketing ideas.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-indigo-400" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <span className={`font-bold ${msg.role === 'model' ? 'text-white' : ''}`} {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      h1: ({node, ...props}) => <h3 className="text-base font-bold mt-3 mb-1 text-white" {...props} />,
                      h2: ({node, ...props}) => <h4 className="text-sm font-bold mt-3 mb-1 text-white" {...props} />,
                      h3: ({node, ...props}) => <h5 className="text-xs font-bold uppercase tracking-wider mt-3 mb-1 text-slate-400" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-slate-500 pl-3 italic my-2 text-slate-400" {...props} />,
                      code: ({node, ...props}) => <code className="bg-black/30 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
             {loading && (
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                   <Bot size={14} className="text-indigo-400" />
                 </div>
                 <div className="bg-slate-800 rounded-2xl rounded-tl-sm p-3 flex items-center gap-1">
                   <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your brand..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};
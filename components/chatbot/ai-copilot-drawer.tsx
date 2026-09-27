'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChatMessage } from '@/types/chatbot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Sparkles, X, Send, Bot, Trash2, ExternalLink } from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-init',
  sender: 'assistant',
  content: 'Hello! I am your **HeatRetrofit AI Copilot**, connected to FortyGuard thermal sensors and backend ROI calculation engines. Ask me any question in natural language!',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestedActions: [
    'Why is my building at risk?',
    'What\'s my best retrofit?',
    'Compare shading and insulation',
    'Show my ROI',
    'Run a roof-insulation simulation',
  ],
};

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Copilot query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'AI Copilot is temporarily unavailable. Your building analysis and thermal dashboard remain fully functional.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white/95 dark:bg-[#070c1a]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-cyan-500/20 shadow-2xl flex flex-col justify-between transition-all duration-300 animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-dark-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <Bot className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">HeatRetrofit AI Copilot</h3>
              <Badge variant="cyan" pulse className="text-[9px]">AI ENGINE</Badge>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Connected to FortyGuard & Calculation Services</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
              )}
              <div className="max-w-[88%] space-y-2">
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-tr-none shadow-md font-medium'
                      : 'bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {/* Structured UI Tool Result Card */}
                {msg.dataRef && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-cyan-500/30 text-[11px] font-mono space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">{msg.dataRef.title}</span>
                      <Badge variant="cyan" className="text-[9px]">TOOL RESULT</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                      {Object.entries(msg.dataRef.metrics).map(([k, v]) => (
                        <div key={k} className="bg-white dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 block text-[9px]">{k}</span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex justify-end">
                      <Link
                        href="/analysis"
                        onClick={onClose}
                        className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-bold flex items-center gap-1 transition-colors"
                      >
                        View Detailed Analysis <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Quick Action Suggestion Chips */}
                {msg.suggestedActions && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action)}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-900 hover:bg-cyan-500/15 text-[10px] text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-700 hover:border-cyan-500/40 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] text-slate-400 dark:text-slate-500 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono py-2">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-spin" /> Querying FortyGuard & calculation engine...
          </div>
        )}
      </div>

      {/* Query Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-dark-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI Copilot about heat retrofits..."
            className="flex-1 px-4 py-2.5 rounded-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <Button variant="primary" size="md" type="submit" disabled={loading} icon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/types/chatbot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Sparkles, X, Send, Bot, User, ArrowRight } from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content: 'Hello! I am your **HeatRetrofit AI Copilot**, connected to FortyGuard thermal sensors. I can explain building heat stress, run what-if energy scenarios, or recommend climate interventions. What would you like to ask?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Why is my roof surface temperature 56.8°C?',
        'What retrofit gives fastest payback?',
        'Calculate cool roof + window film ROI',
      ],
    },
  ]);

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
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Copilot query error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-dark-950/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-2xl flex flex-col justify-between transition-transform duration-300 animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">HeatRetrofit AI Copilot</h3>
              <Badge variant="cyan" pulse className="text-[9px]">LIVE</Badge>
            </div>
            <p className="text-[10px] text-slate-400">Powered by FortyGuard Heat Intelligence</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-dark-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {msg.dataRef && (
                  <div className="p-3 rounded-xl bg-dark-950 border border-cyan-500/30 text-[11px] font-mono space-y-1.5">
                    <div className="font-bold text-cyan-400">{msg.dataRef.title}</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      {Object.entries(msg.dataRef.metrics).map(([k, v]) => (
                        <div key={k} className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[9px]">{k}</span>
                          <span className="font-bold text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.suggestedActions && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-[10px] text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] text-slate-500 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono py-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" /> Analyzing FortyGuard thermal telemetry...
          </div>
        )}
      </div>

      {/* Query Input */}
      <div className="p-4 border-t border-slate-800 bg-dark-900/60">
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <Button variant="primary" size="md" type="submit" disabled={loading} icon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

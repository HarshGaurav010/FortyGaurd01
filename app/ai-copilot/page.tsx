'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Send,
  Sparkles,
  Flame,
  Trash2,
  Building2,
  Thermometer,
  Zap,
  TrendingDown,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage } from '@/types/chatbot';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'assistant',
    content:
      'Hello! I am your **HeatRetrofit AI Copilot**, connected directly to FortyGuard microclimate land surface temperature (LST) telemetry, building physics models, and 20-year financial ROI calculators.\n\nAsk me any question in natural language regarding your building\'s thermal vulnerabilities, cooling energy demand, or retrofit priorities.',
    timestamp: 'Just now',
    suggestedActions: [
      'Why is my roof the biggest heat source?',
      'Which retrofit has the fastest payback?',
      'How much cooling demand could I reduce?',
      'What should I retrofit first?',
    ],
  },
];

const SUGGESTED_PROMPTS = [
  {
    label: 'Why is my roof the biggest heat source?',
    desc: 'Diagnose surface thermal absorption & solar irradiance',
    category: 'Thermal Stress',
  },
  {
    label: 'Which retrofit has the fastest payback?',
    desc: 'Calculate CapEx vs utility savings for top interventions',
    category: 'ROI & Finance',
  },
  {
    label: 'How much cooling demand could I reduce?',
    desc: 'Quantify HVAC load reduction across all interventions',
    category: 'Energy Impact',
  },
  {
    label: 'Why is the south facade vulnerable?',
    desc: 'Inspect window-to-wall ratio and solar heat gain coefficients',
    category: 'Envelope Vulnerability',
  },
  {
    label: 'What should I retrofit first?',
    desc: 'Prioritized roadmap based on energy ROI & upfront cost',
    category: 'Recommendation',
  },
  {
    label: 'Compare cool roof vs window film.',
    desc: 'Side-by-side payback, energy savings, and NPV audit',
    category: 'Comparison',
  },
];

function formatMessageContent(text: string) {
  // Convert markdown bold **text** to <strong> and handle linebreaks
  const paragraphs = text.split('\n');
  return (
    <div className="space-y-2">
      {paragraphs.map((p, idx) => {
        if (!p.trim()) return <div key={idx} className="h-1" />;

        // Handle list items
        if (p.trim().startsWith('- ') || p.trim().startsWith('• ')) {
          const bulletContent = p.trim().replace(/^[-•]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-brand-500 font-bold leading-relaxed">•</span>
              <span dangerouslySetInnerHTML={{ __html: renderBold(bulletContent) }} />
            </div>
          );
        }

        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: renderBold(p) }} className="leading-relaxed" />
        );
      })}
    </div>
  );
}

function renderBold(str: string): string {
  return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>');
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data && data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('AI Copilot request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content:
            'AI Copilot is temporarily unavailable. Your building analysis and thermal dashboard remain fully functional.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="violet" pulse className="px-3 py-1">
                <Bot className="w-3.5 h-3.5" /> AI THERMAL COPILOT
              </Badge>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                ONLINE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ask Anything About Your Building
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Ground truth heat intelligence powered by FortyGuard satellite LST, 3D envelope heat transfer calculations, and 20-year retrofit financial ROI models.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleClearHistory}
              title="Reset conversation"
            >
              Clear Chat
            </Button>
            <Link href="/analysis">
              <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Thermal Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Main Layout: Chat Area + Context Sidebar ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left Column: Interactive Chat Panel ────────────── */}
          <div className="lg:col-span-8 flex flex-col">
            <GlassCard
              variant="default"
              className="flex flex-col h-[700px] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-card"
            >
              {/* Chat Session Top Bar */}
              <div className="px-5 py-3.5 border-b border-gray-200 dark:border-white/08 bg-white/70 dark:bg-dark-950/70 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                        HeatRetrofit Assistant
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-medium">
                        FortyGuard Telemetry Grounded
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Context: Desert Commerce Center (Phoenix, Arizona, USA)
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Ready</span>
                </div>
              </div>

              {/* Messages Thread Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center shrink-0 mt-0.5 text-violet-600 dark:text-violet-400 shadow-sm">
                          <Flame className="w-4 h-4" />
                        </div>
                      )}

                      <div className="max-w-[85%] sm:max-w-[80%] space-y-2.5">
                        {/* Bubble */}
                        <div
                          className={`p-4 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed ${isUser
                              ? 'bg-gradient-to-r from-brand-500 to-amber-600 text-white rounded-tr-none font-medium'
                              : 'bg-slate-100/90 dark:bg-[#0c1220] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none'
                            }`}
                        >
                          {formatMessageContent(msg.content)}
                        </div>

                        {/* Structured Tool Result Card if present */}
                        {msg.dataRef && (
                          <div className="p-4 rounded-2xl bg-white dark:bg-dark-950/90 border border-brand-200 dark:border-brand-500/30 text-xs font-mono space-y-3 shadow-card">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/08">
                              <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[11px]">
                                {msg.dataRef.title}
                              </span>
                              <Badge variant="brand" className="text-[9px]">
                                TELEMETRY CALCULATION
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                              {Object.entries(msg.dataRef.metrics).map(([k, v]) => (
                                <div
                                  key={k}
                                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200/80 dark:border-white/08"
                                >
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider truncate">
                                    {k}
                                  </span>
                                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                    {v}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-1 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                                Source: FortyGuard Telemetry & Building Physics
                              </span>
                              <Link
                                href="/analysis"
                                className="text-brand-600 dark:text-brand-400 hover:text-brand-500 font-semibold flex items-center gap-1 transition-colors"
                              >
                                View Thermal Map <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Suggested Follow-up Actions */}
                        {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.suggestedActions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(action)}
                                disabled={loading}
                                className="px-3 py-1.5 rounded-full bg-white dark:bg-dark-900 hover:bg-brand-50 dark:hover:bg-brand-500/15 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/40 transition-all text-left shadow-sm disabled:opacity-50"
                              >
                                💬 {action}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div
                          className={`text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 w-fit">
                    <div className="w-6 h-6 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 animate-spin">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                      Querying FortyGuard telemetry & physics engine...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3.5 sm:p-4 border-t border-gray-200 dark:border-white/08 bg-white/80 dark:bg-dark-950/80 backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="space-y-2"
                >
                  <div className="relative flex items-center">
                    <textarea
                      ref={textareaRef}
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder="Ask anything about heat retrofits, cooling energy, or payback..."
                      disabled={loading}
                      className="w-full resize-none py-3 pl-4 pr-12 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-300 dark:border-white/12 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all font-sans max-h-32"
                    />
                    <button
                      type="submit"
                      disabled={!inputQuery.trim() || loading}
                      className="absolute right-2 p-2 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:hover:bg-brand-500 text-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      aria-label="Send query"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    <span className="hidden sm:inline">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-[10px]">Enter ↵</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-[10px]">Shift + Enter</kbd> for newline
                    </span>
                    <span className="sm:hidden">Tap send to query</span>
                    <span>FortyGuard AI v2.4</span>
                  </div>
                </form>
              </div>
            </GlassCard>
          </div>

          {/* ── Right Column: Telemetry Context & Suggested Prompts ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Suggested Questions Card */}
            <GlassCard variant="default" className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3.5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-500" />
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Suggested Prompts
                  </h2>
                </div>
                <Badge variant="brand" className="text-[9px]">INTERACTIVE</Badge>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Click any prompt below to query the live calculation engine:
              </p>

              <div className="space-y-2">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.label)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-dark-900 hover:bg-brand-50 dark:hover:bg-brand-500/10 border border-slate-200 dark:border-white/08 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all group shadow-sm disabled:opacity-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                        {prompt.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {prompt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Active Telemetry & Building Context Card */}
            <GlassCard variant="default" className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-4 shadow-card font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/08">
                <div className="flex items-center gap-2 font-sans font-bold text-slate-900 dark:text-white text-xs">
                  <Building2 className="w-4 h-4 text-cyan-500" />
                  Building Context
                </div>
                <Badge variant="cyan" className="text-[9px]">MODELED CONTEXT</Badge>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200 dark:border-white/06">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Building ID</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">BLD-PHX-2024-001</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200 dark:border-white/06">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Peak Roof LST</span>
                  <span className="font-bold text-rose-500 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> 56.8°C
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200 dark:border-white/06">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Thermal Stress</span>
                  <span className="font-bold text-amber-500">84 / 100 (HIGH)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200 dark:border-white/06">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Top Vulnerability</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right text-[11px]">Uninsulated Dark Roof</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Baseline Energy</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">3,840,000 kWh/yr</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/retrofits"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-brand-50/70 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 text-[11px] font-semibold hover:bg-brand-100/70 dark:hover:bg-brand-500/20 transition-all font-sans"
                >
                  <span>Explore Retrofit ROI Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>

            {/* Backed Intelligence Specs */}
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-dark-900/50 border border-gray-200 dark:border-white/06 text-slate-600 dark:text-slate-400 text-xs space-y-2">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero Fake Intelligence
              </div>
              <p className="text-[11px] leading-relaxed">
                All AI responses originate from deterministic physics calculations, validated heat-island coefficients, and verified FortyGuard thermal data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

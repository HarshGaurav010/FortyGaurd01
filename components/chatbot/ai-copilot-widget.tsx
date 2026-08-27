'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, MessageSquare, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AICopilotDrawer } from './ai-copilot-drawer';

export const AICopilotWidget: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <GlassCard variant="glow" className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            <Badge variant="violet" pulse className="px-3 py-1">
              <Bot className="w-3.5 h-3.5" /> AGENTIC CLIMATE COPILOT
            </Badge>

            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Instant AI Thermal Diagnostics & Retrofit Explanations
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Ask HeatRetrofit AI Copilot questions in natural language. Powered by FortyGuard heat intelligence, the Copilot analyzes roof surface LST, predicts HVAC energy savings, and explains complex climate-tech calculations in plain English.
            </p>

            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Natural language thermal stress diagnostic reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Live What-If parameter guidance & setpoint recommendations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Instant financial payback & 20-year NPV breakdown
              </li>
            </ul>

            <div className="pt-2">
              <Button
                variant="glow"
                size="lg"
                icon={<MessageSquare className="w-4 h-4" />}
                onClick={() => setDrawerOpen(true)}
              >
                Launch AI Copilot Assistant →
              </Button>
            </div>
          </div>

          {/* Interactive Chat Sample Preview Card */}
          <div className="space-y-3 p-5 rounded-2xl bg-dark-950/90 border border-slate-800 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-slate-400 ml-2">copilot-stream.terminal</span>
              </div>
              <Badge variant="cyan" className="text-[9px]">4.8ms Latency</Badge>
            </div>

            <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-slate-300">
              <span className="text-cyan-400 font-bold">User:</span> Why is my building roof registering 56.8°C thermal stress?
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-300">
                <Flame className="w-4 h-4 text-rose-400" /> Copilot Analysis:
              </div>
              <p className="text-[11px] leading-normal text-slate-300">
                FortyGuard heat grid shows your uninsulated black membrane roof absorbs 88% of incoming solar irradiance (920 W/m²). Applying SRI 108 Cool Coating drops surface heat by 24.7°C, saving $31,200/yr with 1.6yr payback.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Floating Trigger Launcher */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-glow hover:scale-105 transition-all text-xs"
        >
          <Bot className="w-5 h-5 text-slate-950 animate-bounce" />
          <span>AI Copilot</span>
        </button>
      </div>

      <AICopilotDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

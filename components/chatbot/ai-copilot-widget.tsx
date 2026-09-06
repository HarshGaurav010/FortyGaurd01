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
            <Badge variant="brand" pulse className="px-3 py-1">
              <Bot className="w-3.5 h-3.5" /> AGENTIC CLIMATE COPILOT
            </Badge>

            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Instant AI Thermal Diagnostics & Retrofit Explanations
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Ask HeatRetrofit AI Copilot questions in natural language. Powered by FortyGuard heat intelligence, the Copilot analyzes roof surface LST, predicts HVAC energy savings, and explains complex climate-tech calculations in plain English.
            </p>

            <ul className="space-y-2 text-xs font-mono text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Natural language thermal stress diagnostic reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500" /> Live What-If parameter guidance & setpoint recommendations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" /> Instant financial payback & 20-year NPV breakdown
              </li>
            </ul>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={<MessageSquare className="w-4 h-4" />}
                onClick={() => setDrawerOpen(true)}
              >
                Launch AI Copilot Assistant
              </Button>
            </div>
          </div>

          {/* Interactive Chat Sample Preview Card */}
          <div className="space-y-3 p-5 rounded-3xl bg-white dark:bg-dark-950 border border-gray-100 dark:border-white/08 shadow-card font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/08">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-gray-400 dark:text-gray-500 ml-2">copilot-stream.terminal</span>
              </div>
              <Badge variant="brand" className="text-[9px]">4.8ms Latency</Badge>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-dark-900 border border-gray-100 dark:border-white/08 text-gray-800 dark:text-gray-200">
              <span className="text-brand-500 font-bold">User:</span> Why is my building roof registering 56.8°C thermal stress?
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-500/08 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 text-gray-800 dark:text-gray-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-600 dark:text-brand-400">
                <Flame className="w-4 h-4 text-brand-500" /> Copilot Analysis:
              </div>
              <p className="text-[11px] leading-normal text-gray-600 dark:text-gray-300">
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
          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-glow hover:scale-105 transition-all duration-200 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Bot className="w-4 h-4 text-white" />
          <span>AI Copilot</span>
        </button>
      </div>

      <AICopilotDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

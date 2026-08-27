'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Database, Cpu, Layers, Sliders, DollarSign, Bot, ArrowRight, ShieldCheck } from 'lucide-react';

export const ProjectFramework: React.FC = () => {
  const highLevelSteps = [
    { num: '01', title: 'Get Heat Intelligence', desc: 'Ingest FortyGuard microclimate land surface temperature & solar irradiance' },
    { num: '02', title: 'Model & Analyze', desc: 'Calculate envelope heat stress score & identify vulnerability hotspots' },
    { num: '03', title: 'Recommend & Simulate', desc: 'Rank high-impact retrofits & run real-time what-if energy parameter models' },
    { num: '04', title: 'Empower Users', desc: 'Deliver 20-year ROI financial audits & natural language AI Copilot guidance' },
  ];

  const architectureFlow = [
    { name: 'FortyGuard Heat Data', icon: <Database className="w-4 h-4 text-cyan-400" /> },
    { name: 'Data Processing', icon: <Cpu className="w-4 h-4 text-indigo-400" /> },
    { name: 'Thermal / Cooling Model', icon: <Layers className="w-4 h-4 text-amber-400" /> },
    { name: 'Retrofit Recommendation', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { name: 'What-If Simulation', icon: <Sliders className="w-4 h-4 text-cyan-400" /> },
    { name: 'ROI Engine', icon: <DollarSign className="w-4 h-4 text-indigo-400" /> },
    { name: 'AI Copilot', icon: <Bot className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <section id="framework" className="py-20 bg-dark-900 border-t border-slate-800/80 relative overflow-hidden bg-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="violet" className="px-3.5 py-1">
            TECHNICAL ARCHITECTURE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            End-to-End Heat Retrofit Framework
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From raw satellite and terrestrial sensor telemetry to automated retrofit ROI calculations and agentic guidance.
          </p>
        </div>

        {/* High Level 4-Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highLevelSteps.map((step, idx) => (
            <GlassCard key={idx} variant="interactive" className="p-6 relative">
              <div className="text-3xl font-black font-mono text-cyan-500/30 mb-2">{step.num}</div>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Deeper System Flow Pipeline */}
        <GlassCard variant="glow" className="p-6">
          <div className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest mb-6 text-center">
            System Data Pipeline Architecture
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {architectureFlow.map((node, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-800 backdrop-blur-md font-mono text-xs text-white">
                  {node.icon}
                  <span>{node.name}</span>
                </div>
                {index < architectureFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-cyan-500/60 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

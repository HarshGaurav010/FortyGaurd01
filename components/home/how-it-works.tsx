'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Cpu, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Building Address & Parameters',
      description: 'Input your building location, floor area, glass-to-wall ratio, and HVAC age to fetch localized FortyGuard thermal telemetry.',
    },
    {
      step: '02',
      title: 'Automated 3D Heat Diagnostic',
      description: 'Our engine projects FortyGuard microclimate surface temperatures onto your building envelope to identify roof & facade hotspots.',
    },
    {
      step: '03',
      title: 'Select Climate Interventions',
      description: 'Review rank-ordered retrofit packages (Cool Roof, Spectrally Selective Window Film, Smart HVAC Controls) tailored to your building.',
    },
    {
      step: '04',
      title: 'Simulate What-If Returns & Export',
      description: 'Tune parameter sliders in real time, calculate 20-year net cash flows, and generate executive ROI audit reports.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-dark-900 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="cyan" className="px-3.5 py-1">
            STEP-BY-STEP WORKFLOW
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How HeatRetrofit AI Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            A streamlined 4-step workflow to turn microclimate heat intelligence into actionable building decarbonization projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <GlassCard key={idx} variant="glow" className="p-6 relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-cyan-400">{item.step}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

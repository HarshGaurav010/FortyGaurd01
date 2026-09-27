'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { Thermometer, DollarSign, Bot, Zap, ShieldCheck, BarChart3 } from 'lucide-react';

const FEATURES = [
  {
    icon: <Thermometer className="w-5 h-5" />,
    iconBg: 'bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400',
    badge: { label: 'FortyGuard API', variant: 'rose' as const },
    title: 'Hyperlocal Thermal Diagnostics',
    description: 'Ingest FortyGuard Land Surface Temperature and solar irradiance data at 100m resolution to identify roof and facade heat stress hotspots.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    iconBg: 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400',
    badge: { label: 'Retrofit Catalog', variant: 'cyan' as const },
    title: 'AI-Ranked Retrofit Interventions',
    description: 'Receive rank-ordered building envelope retrofits (Cool Roof SRI 108, Spectrally Selective Glazing, HVAC VFDs) tailored to your heat exposure profile.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    badge: { label: 'What-If Engine', variant: 'amber' as const },
    title: 'Real-Time Energy Simulation',
    description: 'Tune roof reflectance SRI, window SHGC, insulation R-value, and HVAC COP sliders to see live monthly kWh demand reductions and cumulative cost savings.',
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    badge: { label: 'ROI Engine', variant: 'green' as const },
    title: '20-Year Financial ROI Analysis',
    description: 'Calculate CapEx, annual utility savings, NPV, IRR, and carbon offset tonnage to produce investment-grade retrofit ROI audit reports for stakeholder review.',
  },
  {
    icon: <Bot className="w-5 h-5" />,
    iconBg: 'bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400',
    badge: { label: 'AI Copilot', variant: 'violet' as const },
    title: 'Thermal Intelligence Copilot',
    description: 'Ask natural language questions about your building data. The AI Copilot uses FortyGuard telemetry and calculation results to provide grounded, cited guidance.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    iconBg: 'bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400',
    badge: { label: 'Reports', variant: 'brand' as const },
    title: 'Executive Audit Reports',
    description: 'Export polished, print-ready PDF reports with thermal diagnosis, intervention package schedules, and financial projections for client and investor presentations.',
  },
];

export const FeatureCards: React.FC = () => (
  <section id="features" className="py-24 border-t border-gray-100 dark:border-white/06">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <Badge variant="brand">Core Platform Capabilities</Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Everything you need to decarbonize a building
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          From raw satellite heat data to actionable retrofit ROI — HeatRetrofit AI handles the full stack.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <GlassCard key={f.title} variant="interactive" className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${f.iconBg}`}>
                {f.icon}
              </div>
              <Badge variant={f.badge.variant}>{f.badge.label}</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

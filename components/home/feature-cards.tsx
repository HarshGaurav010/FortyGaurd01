'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Flame, ShieldCheck, DollarSign, Compass, Sliders, Bot, ArrowRight } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      id: 'thermal-stress-score',
      title: 'Thermal Stress Score',
      icon: <Flame className="w-6 h-6 text-rose-400" />,
      description: 'Calculates a 0-100 building vulnerability rating based on FortyGuard surface heat, roof membrane LST, and HVAC age.',
      ctaText: 'Analyze Score',
      link: '/analysis',
      accent: 'rose',
    },
    {
      id: 'ai-retrofit-rec',
      title: 'AI Retrofit Recommendation',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      description: 'Engineered ranking algorithm suggesting optimal cool roof coatings, solar window films, and wall insulation packages.',
      ctaText: 'View Interventions',
      link: '/retrofits',
      accent: 'emerald',
    },
    {
      id: 'energy-roi-calc',
      title: 'Energy & ROI Calculator',
      icon: <DollarSign className="w-6 h-6 text-amber-400" />,
      description: 'Computes annual utility cost avoidance, capital expenditure, simple payback period, and 20-year net present value.',
      ctaText: 'Calculate Returns',
      link: '/reports',
      accent: 'amber',
    },
    {
      id: 'orientation-advisor',
      title: 'Orientation Advisor',
      icon: <Compass className="w-6 h-6 text-cyan-400" />,
      description: 'Directional solar irradiance analytics evaluating South and West facade heat loads based on building orientation.',
      ctaText: 'Explore Facade Gains',
      link: '/analysis',
      accent: 'cyan',
    },
    {
      id: 'what-if-simulator',
      title: 'What-If Simulator',
      icon: <Sliders className="w-6 h-6 text-indigo-400" />,
      description: 'Real-time parameter tuning for roof albedo SRI, glass SHGC, added R-value insulation, and thermostat setpoint.',
      ctaText: 'Run Simulation',
      link: '/simulator',
      accent: 'indigo',
    },
    {
      id: 'ai-copilot',
      title: 'AI Copilot Assistant',
      icon: <Bot className="w-6 h-6 text-cyan-400" />,
      description: 'Natural language agentic assistant answering complex questions about building thermodynamics and climate retrofits.',
      ctaText: 'Ask AI Copilot',
      link: '/#copilot',
      accent: 'cyan',
    },
  ];

  return (
    <section id="features" className="py-20 bg-dark-950 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="cyan" className="px-3.5 py-1">
            CORE PLATFORM CAPABILITIES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Heat-Aware Analytics
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Everything needed to identify building thermal bottlenecks, simulate intervention packages, and justify CapEx investments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((card) => (
            <GlassCard
              key={card.id}
              variant="interactive"
              className="flex flex-col justify-between h-full p-6 space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-dark-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/60">
                <Link
                  href={card.link}
                  className="inline-flex items-center gap-2 text-xs font-bold font-mono text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-transform"
                >
                  <span>{card.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

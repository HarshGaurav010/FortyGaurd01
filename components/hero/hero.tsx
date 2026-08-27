'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { BuildingViewer } from '@/components/building/building-viewer';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Activity, Zap, TrendingDown, Thermometer } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/05 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy Left Col (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="cyan" pulse className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider">
                <Flame className="w-3.5 h-3.5 text-cyan-400" /> AI-POWERED · DATA-DRIVEN · HEAT-AWARE
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-sans">
              Build Cooler. <br />
              <span className="text-gradient-cyan">Save Energy.</span> <br />
              <span className="text-gradient-amber">Prove It.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              HeatRetrofit AI combines hyperlocal heat intelligence with building characteristics to identify thermal weaknesses, recommend high-impact retrofits, and estimate the energy and financial impact before you invest.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/analysis">
                <Button variant="glow" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  Analyze Your Building →
                </Button>
              </Link>
              <Link href="/simulator">
                <Button variant="secondary" size="lg" icon={<Sparkles className="w-4 h-4 text-cyan-400" />}>
                  Explore Demo
                </Button>
              </Link>
            </div>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 font-mono">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">1.5m²</div>
                <div className="text-xs text-slate-400 font-sans">FortyGuard Heat Grid</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">-48%</div>
                <div className="text-xs text-slate-400 font-sans">Peak Cooling Energy Cut</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">&lt; 2 Yrs</div>
                <div className="text-xs text-slate-400 font-sans">Average CapEx Payback</div>
              </div>
            </div>
          </div>

          {/* Hero 3D Building Element Right Col (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Outer Glowing Border Box */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-amber-500/30 rounded-3xl blur-md opacity-75 animate-pulse-glow" />
              <BuildingViewer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

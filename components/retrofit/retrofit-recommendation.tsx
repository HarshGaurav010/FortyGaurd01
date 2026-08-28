'use client';

import React from 'react';
import { RetrofitRecommendation } from '@/lib/retrofit/types';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, SunMedium, ShieldCheck, Layers, Cpu, Sprout, AlertCircle, ArrowUpRight } from 'lucide-react';
import { AssumptionsPanel } from './assumptions-panel';

interface RetrofitRecommendationProps {
  recommendations: RetrofitRecommendation[];
  onSelectRetrofitForSimulation?: (retrofitId: string) => void;
}

export const RetrofitRecommendationSection: React.FC<RetrofitRecommendationProps> = ({
  recommendations,
  onSelectRetrofitForSimulation,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'EXTERNAL_SHADING':
        return <SunMedium className="w-5 h-5 text-amber-400" />;
      case 'COOL_ROOF':
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case 'ROOF_INSULATION':
        return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'SOLAR_GLAZING':
        return <SunMedium className="w-5 h-5 text-cyan-400" />;
      case 'HVAC_UPGRADE':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'VEGETATION':
        return <Sprout className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-amber-400 font-bold">🥇 RANK #1</span>;
    if (rank === 2) return <span className="text-slate-300 font-bold">🥈 RANK #2</span>;
    if (rank === 3) return <span className="text-amber-600 font-bold">🥉 RANK #3</span>;
    return <span className="text-slate-400 font-bold">RANK #{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="cyan" pulse className="mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI RETROFIT RECOMMENDATION ENGINE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Targeted Climate Interventions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Ranked based on FortyGuard microclimate heat vulnerability matching, estimated energy reduction, and payback return.
          </p>
        </div>
      </div>

      {/* Assumptions Banner */}
      <AssumptionsPanel />

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <GlassCard key={rec.retrofit.id} variant="interactive" className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-dark-950 border border-slate-800">
                    {getIcon(rec.retrofit.id)}
                  </div>
                  <span className="text-xs font-mono">{getRankBadge(rec.priorityRank)}</span>
                </div>
                <Badge variant={rec.thermalImpact === 'HIGH' ? 'rose' : 'amber'}>
                  {rec.thermalImpact} IMPACT
                </Badge>
              </div>

              <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                {rec.retrofit.name}
              </h3>

              {/* WHY Reason */}
              <div className="p-3 rounded-xl bg-dark-950/90 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  WHY THIS RETROFIT APPLIES:
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">{rec.reason}</p>
              </div>

              {/* Key Metric Grid */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs p-3 rounded-xl bg-dark-950/60 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Energy Cut</span>
                  <span className="text-sm font-bold text-emerald-400">{rec.estimatedEnergyImpact.formattedRange}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Payback</span>
                  <span className="text-sm font-bold text-cyan-300">{rec.estimatedPaybackYears.formattedRange}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800/60 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">Est. Investment Range:</span>
                  <span className="text-xs font-bold text-white">{rec.estimatedCostUSD.formattedRange}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 italic">Score: {rec.score}/100</span>
              {onSelectRetrofitForSimulation && (
                <button
                  onClick={() => onSelectRetrofitForSimulation(rec.retrofit.id)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                >
                  Simulate Scenario <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

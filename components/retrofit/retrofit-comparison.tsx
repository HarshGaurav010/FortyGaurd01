'use client';

import React from 'react';
import { RetrofitIntervention } from '@/types/retrofit';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Flame, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface RetrofitComparisonProps {
  interventions: RetrofitIntervention[];
  combinedPackage?: {
    packageName: string;
    totalCostUSD: number;
    annualSavingsUSD: number;
    combinedEnergyReductionPct: number;
    overallPaybackYears: number;
    overall20YrROIPct: number;
    totalCarbonOffsetTons20Yr: number;
  };
}

export const RetrofitComparison: React.FC<RetrofitComparisonProps> = ({ interventions, combinedPackage }) => {
  return (
    <GlassCard variant="glow" className="p-6 space-y-6 overflow-x-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">Retrofit Intervention Comparison Matrix</h3>
          <p className="text-xs text-slate-400 font-mono">
            Side-by-side thermal performance, cost per sq ft, annual utility bill reduction & payback period
          </p>
        </div>
        <Badge variant="cyan"><Sparkles className="w-3 h-3" /> AI RANKED</Badge>
      </div>

      {combinedPackage && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-dark-900 to-indigo-950/40 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" /> {combinedPackage.packageName}
            </span>
            <Badge variant="emerald">OPTIMAL BUNDLE</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-dark-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Investment</span>
              <span className="text-sm font-bold text-white">{formatCurrency(combinedPackage.totalCostUSD)}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-dark-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Annual Bill Reduction</span>
              <span className="text-sm font-bold text-amber-400">{formatCurrency(combinedPackage.annualSavingsUSD)}/yr</span>
            </div>
            <div className="p-2.5 rounded-lg bg-dark-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Combined Energy Cut</span>
              <span className="text-sm font-bold text-emerald-400">-{combinedPackage.combinedEnergyReductionPct}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-dark-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Portfolio Payback</span>
              <span className="text-sm font-bold text-cyan-300">{combinedPackage.overallPaybackYears} Yrs (+{combinedPackage.overall20YrROIPct}% 20-Yr ROI)</span>
            </div>
          </div>
        </div>
      )}

      <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4">Intervention Strategy</th>
            <th className="py-3 px-4">Thermal Impact</th>
            <th className="py-3 px-4">Est. CapEx</th>
            <th className="py-3 px-4">Annual Savings</th>
            <th className="py-3 px-4">Payback</th>
            <th className="py-3 px-4">20-Yr ROI</th>
            <th className="py-3 px-4 text-right">Rank</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {interventions.map((item) => (
            <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="py-4 px-4 font-sans font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                {item.name}
              </td>
              <td className="py-4 px-4 font-bold text-emerald-400">
                -{item.expectedCoolingEnergyReductionPct}% kWh / -{item.expectedTempReductionC}°C
              </td>
              <td className="py-4 px-4 font-bold text-white">
                {formatCurrency(item.estTotalCostUSD)}
              </td>
              <td className="py-4 px-4 font-bold text-amber-400">
                {formatCurrency(item.expectedAnnualSavingsUSD)}/yr
              </td>
              <td className="py-4 px-4 font-bold text-cyan-300">
                {item.paybackPeriodYears} Yrs
              </td>
              <td className="py-4 px-4 font-bold text-indigo-400">
                +{item.roi20YearPct}%
              </td>
              <td className="py-4 px-4 text-right">
                <Badge variant={item.recommendedRank === 1 ? 'emerald' : 'slate'}>
                  #{item.recommendedRank}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
};

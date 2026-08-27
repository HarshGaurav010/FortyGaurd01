'use client';

import React from 'react';
import { RetrofitIntervention } from '@/types/retrofit';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Flame, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface RetrofitComparisonProps {
  interventions: RetrofitIntervention[];
}

export const RetrofitComparison: React.FC<RetrofitComparisonProps> = ({ interventions }) => {
  return (
    <GlassCard variant="glow" className="p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">Retrofit Intervention Comparison Matrix</h3>
          <p className="text-xs text-slate-400 font-mono">
            Side-by-side thermal performance, cost per sq ft, annual utility bill reduction & payback period
          </p>
        </div>
        <Badge variant="cyan"><Sparkles className="w-3 h-3" /> AI RANKED</Badge>
      </div>

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

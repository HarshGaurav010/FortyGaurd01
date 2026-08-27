'use client';

import React, { useState } from 'react';
import { RetrofitIntervention } from '@/types/retrofit';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { SunMedium, ShieldCheck, Layers, Cpu, Sparkles, ArrowRight, DollarSign, Clock, Leaf } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

interface RetrofitCardProps {
  intervention: RetrofitIntervention;
  onSimulate?: (intervention: RetrofitIntervention) => void;
}

export const RetrofitCard: React.FC<RetrofitCardProps> = ({ intervention, onSimulate }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case 'SunMedium': return <SunMedium className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <>
      <GlassCard variant="interactive" className="flex flex-col justify-between h-full p-6">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-dark-950 border border-slate-800">
                {getIcon(intervention.iconName)}
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                  RANK #{intervention.recommendedRank} INTERVENTION
                </span>
                <h4 className="text-base font-bold text-white tracking-tight leading-snug">{intervention.name}</h4>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-5 leading-relaxed">{intervention.shortDescription}</p>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80 mb-5 font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-400">Cooling Energy Cut</div>
              <div className="text-sm font-bold text-emerald-400">-{intervention.expectedCoolingEnergyReductionPct}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Payback Period</div>
              <div className="text-sm font-bold text-cyan-400">{intervention.paybackPeriodYears} Yrs</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Est. Total Investment</div>
              <div className="text-sm font-bold text-white">{formatCurrency(intervention.estTotalCostUSD)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Annual Savings</div>
              <div className="text-sm font-bold text-amber-400">{formatCurrency(intervention.expectedAnnualSavingsUSD)}/yr</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => setModalOpen(true)}>
            View Specs
          </Button>
          {onSimulate && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onSimulate(intervention)}>
              Simulate →
            </Button>
          )}
        </div>
      </GlassCard>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={intervention.name}>
        <div className="space-y-6 text-sm text-slate-300">
          <p className="leading-relaxed">{intervention.detailedSpecs}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
              <span className="text-slate-400 text-xs block">Unit Cost</span>
              <span className="text-base font-bold text-white">${intervention.estCostPerSqFt} / sq ft</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
              <span className="text-slate-400 text-xs block">Total CapEx</span>
              <span className="text-base font-bold text-cyan-400">{formatCurrency(intervention.estTotalCostUSD)}</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
              <span className="text-slate-400 text-xs block">Surface Temp Drop</span>
              <span className="text-base font-bold text-rose-400">-{intervention.expectedTempReductionC}°C</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
              <span className="text-slate-400 text-xs block">Annual CO₂ Offset</span>
              <span className="text-base font-bold text-emerald-400">{intervention.carbonOffsetTonsPerYear} tons</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
              <span className="text-slate-400 text-xs block">20-Yr ROI</span>
              <span className="text-base font-bold text-indigo-400">+{intervention.roi20YearPct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
              <span className="text-slate-400 text-xs block">Implementation</span>
              <Badge variant={intervention.implementationEase === 'EASY' ? 'emerald' : 'amber'}>
                {intervention.implementationEase}
              </Badge>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

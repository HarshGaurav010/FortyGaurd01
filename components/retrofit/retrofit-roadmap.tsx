'use client';

import React from 'react';
import { RetrofitRoadmap } from '@/lib/retrofit/types';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Layers, ArrowDown } from 'lucide-react';

interface RetrofitRoadmapProps {
  roadmap: RetrofitRoadmap;
}

export const RetrofitRoadmapSection: React.FC<RetrofitRoadmapProps> = ({ roadmap }) => {
  return (
    <GlassCard variant="glow" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <Badge variant="cyan" pulse className="mb-2">
            <Layers className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" /> SEQUENCED DECARBONIZATION
          </Badge>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">AI Retrofit Implementation Roadmap</h3>
          <p className="text-xs text-gray-600 dark:text-slate-400 font-mono">
            Phased intervention schedule optimized to minimize upfront disruption and maximize early cash flow payback.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200 dark:border-slate-800 text-right">
            <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Total Investment</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{roadmap.totalRoadmapInvestment}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200 dark:border-slate-800 text-right">
            <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Portfolio Payback</span>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">{roadmap.overallRoadmapPayback}</span>
          </div>
        </div>
      </div>

      {/* Steps Pipeline */}
      <div className="space-y-4 relative">
        {roadmap.steps.map((step, index) => (
          <React.Fragment key={step.retrofitId}>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0c1426]/80 border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {step.stepNumber}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">PHASE {step.stepNumber}:</span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white font-sans">{step.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-slate-300 font-sans leading-relaxed">{step.rationale}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-white dark:bg-[#080e1c] border border-gray-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Est. Cost</span>
                  <span className="font-bold text-gray-900 dark:text-white text-[11px]">{step.estimatedCostRange}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#080e1c] border border-gray-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Annual Savings</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">{step.estimatedAnnualSavings}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#080e1c] border border-gray-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Payback</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-300 text-[11px]">{step.estimatedPayback}</span>
                </div>
              </div>
            </div>

            {index < roadmap.steps.length - 1 && (
              <div className="flex justify-center my-1">
                <ArrowDown className="w-4 h-4 text-cyan-500/50 animate-bounce" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </GlassCard>
  );
};

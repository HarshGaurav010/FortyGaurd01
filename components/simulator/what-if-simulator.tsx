'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RetrofitOptionId, MultiRetrofitSimulationResult } from '@/lib/retrofit/types';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssumptionsPanel } from '@/components/retrofit/assumptions-panel';
import { Sliders, RefreshCw, Zap, DollarSign, Calendar, ShieldCheck, SunMedium, Layers, Cpu, Sprout, ArrowRight, Activity, CheckSquare, Square } from 'lucide-react';
import { formatCurrency, formatEnergy } from '@/lib/utils/formatters';

interface RetrofitChoice {
  id: RetrofitOptionId;
  name: string;
  category: string;
  icon: React.ReactNode;
}

const RETROFIT_CHOICES: RetrofitChoice[] = [
  { id: 'EXTERNAL_SHADING', name: 'External Solar Louvers & Shading', category: 'Facade Shading', icon: <SunMedium className="w-4 h-4 text-amber-400" /> },
  { id: 'ROOF_INSULATION', name: 'Roof Insulation (R-20+)', category: 'Envelope Insulation', icon: <Layers className="w-4 h-4 text-indigo-400" /> },
  { id: 'COOL_ROOF', name: 'High-Albedo Cool Roof (SRI 108)', category: 'Reflective Surface', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" /> },
  { id: 'SOLAR_GLAZING', name: 'Solar-Control Glazing Film', category: 'Fenestration', icon: <SunMedium className="w-4 h-4 text-cyan-400" /> },
  { id: 'HVAC_UPGRADE', name: 'Smart AI HVAC & Chiller VFDs', category: 'Mechanical Systems', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
  { id: 'VEGETATION', name: 'Biosolar Green Roof Canopy', category: 'Green Infrastructure', icon: <Sprout className="w-4 h-4 text-emerald-400" /> },
];

export const WhatIfSimulator: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<RetrofitOptionId[]>(['COOL_ROOF', 'SOLAR_GLAZING', 'HVAC_UPGRADE']);
  const [simulation, setSimulation] = useState<MultiRetrofitSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRate, setUserRate] = useState<number>(0.14);

  const runSimulation = useCallback(async (ids: RetrofitOptionId[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/retrofits/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedRetrofitIds: ids,
          userElectricityRateUSD: userRate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSimulation(data.simulation);
      }
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setLoading(false);
    }
  }, [userRate]);

  useEffect(() => {
    runSimulation(selectedIds);
  }, [runSimulation, selectedIds]);

  const toggleRetrofit = (id: RetrofitOptionId) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSimulateClick = () => {
    runSimulation(selectedIds);
  };

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <GlassCard variant="glow" className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">Multi-Retrofit What-If Scenario Engine</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Select combinations of building retrofits to simulate compound thermal stress reduction & portfolio ROI.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => {
                const defaults: RetrofitOptionId[] = ['COOL_ROOF', 'SOLAR_GLAZING'];
                setSelectedIds(defaults);
                runSimulation(defaults);
              }}
            >
              Reset Defaults
            </Button>
            <Button
              variant="glow"
              size="md"
              disabled={loading}
              onClick={handleSimulateClick}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Simulating...' : 'Simulate Scenario →'}
            </Button>
          </div>
        </div>

        {/* Checkboxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {RETROFIT_CHOICES.map((choice) => {
            const isChecked = selectedIds.includes(choice.id);
            return (
              <div
                key={choice.id}
                onClick={() => toggleRetrofit(choice.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? 'bg-cyan-500/10 dark:bg-cyan-950/40 border-cyan-500/50 shadow-sm dark:shadow-glow text-slate-900 dark:text-white'
                    : 'bg-white/80 dark:bg-dark-950/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm">{choice.icon}</div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">{choice.category}</span>
                    <span className="font-bold text-slate-900 dark:text-white font-sans">{choice.name}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Assumptions Panel */}
        <AssumptionsPanel customElectricityRate={userRate} />
      </GlassCard>

      {/* CURRENT vs SIMULATED Comparison Section */}
      {simulation && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CURRENT Baseline Card */}
            <GlassCard variant="glow" className="p-5 space-y-4 border-rose-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">CURRENT BASELINE</span>
                <Badge variant="rose">UNMODIFIED</Badge>
              </div>

              <div className="space-y-3 font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Thermal Stress Score</span>
                  <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                    {simulation.baseline.thermalStressScore}/100 ({simulation.baseline.stressCategory})
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Cooling Heat Stress Load</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{simulation.baseline.coolingStressKW} kW</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Energy Impact Rating</span>
                  <Badge variant="rose" className="mt-1">{simulation.baseline.energyImpactLevel}</Badge>
                </div>
              </div>
            </GlassCard>

            {/* SIMULATED Scenario Card */}
            <GlassCard variant="glow" className="p-5 space-y-4 border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">SIMULATED SCENARIO</span>
                <Badge variant="emerald">PACKAGE SIMULATION</Badge>
              </div>

              <div className="space-y-3 font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Simulated Thermal Stress</span>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {simulation.simulated.thermalStressScore}/100 ({simulation.simulated.stressCategory})
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Simulated Cooling Stress</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{simulation.simulated.coolingStressKW} kW</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Simulated Energy Rating</span>
                  <Badge variant="emerald" className="mt-1">{simulation.simulated.energyImpactLevel}</Badge>
                </div>
              </div>
            </GlassCard>

            {/* DELTAS & REDUCTION Summary Card */}
            <GlassCard variant="glow" className="p-5 space-y-4 border-cyan-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">IMPACT DELTA</span>
                <Badge variant="cyan">COMPOUND CUT</Badge>
              </div>

              <div className="space-y-3 font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Modeled Cooling Cut</span>
                  <span className="text-2xl font-extrabold text-cyan-700 dark:text-cyan-300">-{simulation.deltas.combinedEnergyReductionPct}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Cooling Heat Reduction</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">-{simulation.deltas.coolingStressDropKW} kW</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Indoor Temp Drop</span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">-{simulation.deltas.indoorTempDropC}°C</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Financial Return Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <MetricCard
              title="Estimated Investment"
              value={simulation.financials.estimatedInvestmentUSD.formatted}
              subtext="Illustrative CapEx range"
              icon={<ShieldCheck className="w-5 h-5" />}
              accentColor="cyan"
            />
            <MetricCard
              title="Estimated Annual Savings"
              value={simulation.financials.estimatedAnnualSavingsUSD.formatted}
              subtext={`$${simulation.assumptionsUsed.electricityRateUSD}/kWh rate`}
              change="Utility Cut"
              isPositive={true}
              icon={<DollarSign className="w-5 h-5" />}
              accentColor="amber"
            />
            <MetricCard
              title="Estimated Payback"
              value={simulation.financials.estimatedPaybackYears.formatted}
              subtext="Simple break-even"
              change="Payback"
              isPositive={true}
              icon={<Calendar className="w-5 h-5" />}
              accentColor="emerald"
            />
            <MetricCard
              title="20-Year NPV"
              value={simulation.financials.twentyYearNPVUSD.formatted}
              subtext={`10-Yr Total: ${simulation.financials.tenYearSavingsUSD.formatted}`}
              change="Net Value"
              isPositive={true}
              icon={<Zap className="w-5 h-5" />}
              accentColor="violet"
            />
          </div>
        </div>
      )}
    </div>
  );
};

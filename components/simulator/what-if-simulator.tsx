'use client';

import React, { useState, useMemo } from 'react';
import { WhatIfSimulationInput, SimulationResult } from '@/types/analysis';
import { DEFAULT_BUILDING_PROFILE } from '@/lib/models/building-thermal-model';
import { runWhatIfSimulation } from '@/lib/calculations/roi-calculator';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThermalCharts } from '@/components/analytics/thermal-charts';
import { Sliders, RefreshCw, Zap, DollarSign, Calendar, Flame, ShieldCheck, Thermometer } from 'lucide-react';
import { formatCurrency, formatEnergy, formatPercent } from '@/lib/utils/formatters';

export const WhatIfSimulator: React.FC = () => {
  const [params, setParams] = useState<WhatIfSimulationInput>({
    buildingId: DEFAULT_BUILDING_PROFILE.id,
    roofReflectance: 0.85,
    windowFilmSHGC: 0.28,
    wallInsulationAddRValue: 12,
    greenRoofCoveragePct: 0,
    smartHvacOptimization: true,
    thermostatSetpointC: 23.5,
  });

  const simulation: SimulationResult = useMemo(() => {
    return runWhatIfSimulation(DEFAULT_BUILDING_PROFILE, params);
  }, [params]);

  const handleReset = () => {
    setParams({
      buildingId: DEFAULT_BUILDING_PROFILE.id,
      roofReflectance: 0.85,
      windowFilmSHGC: 0.28,
      wallInsulationAddRValue: 12,
      greenRoofCoveragePct: 0,
      smartHvacOptimization: true,
      thermostatSetpointC: 23.5,
    });
  };

  return (
    <div className="space-y-8">
      {/* Control Sliders & Interactive Parameters */}
      <GlassCard variant="glow" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white tracking-wide">What-If Retrofit Parameter Engine</h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Adjust envelope albedo, window film solar heat gain coefficient, wall insulation R-value & setpoint
            </p>
          </div>
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleReset}>
            Reset Defaults
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Roof Reflectance (SRI) */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-950/80 border border-slate-800">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Roof Albedo Reflectance</span>
              <span className="text-cyan-400">{(params.roofReflectance * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.95"
              step="0.05"
              value={params.roofReflectance}
              onChange={(e) => setParams({ ...params, roofReflectance: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Dark Asphalt (10%)</span>
              <span>Cool Coating (95%)</span>
            </div>
          </div>

          {/* Window Film SHGC */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-950/80 border border-slate-800">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Window Film SHGC</span>
              <span className="text-amber-400">{params.windowFilmSHGC.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.85"
              step="0.05"
              value={params.windowFilmSHGC}
              onChange={(e) => setParams({ ...params, windowFilmSHGC: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>High Performance (0.15)</span>
              <span>Clear Glass (0.85)</span>
            </div>
          </div>

          {/* Wall Insulation R-Value */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-950/80 border border-slate-800">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Wall Insulation R-Value</span>
              <span className="text-indigo-400">+{params.wallInsulationAddRValue} R</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="2"
              value={params.wallInsulationAddRValue}
              onChange={(e) => setParams({ ...params, wallInsulationAddRValue: parseInt(e.target.value) })}
              className="w-full accent-indigo-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Uninsulated (0)</span>
              <span>High EIFS (+30)</span>
            </div>
          </div>

          {/* Thermostat Setpoint */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-950/80 border border-slate-800">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Thermostat Setpoint</span>
              <span className="text-rose-400">{params.thermostatSetpointC}°C</span>
            </div>
            <input
              type="range"
              min="21.0"
              max="26.0"
              step="0.5"
              value={params.thermostatSetpointC}
              onChange={(e) => setParams({ ...params, thermostatSetpointC: parseFloat(e.target.value) })}
              className="w-full accent-rose-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>21.0°C (Overcooled)</span>
              <span>26.0°C (Eco)</span>
            </div>
          </div>

          {/* Green Roof Coverage */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-950/80 border border-slate-800">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Green Roof Coverage</span>
              <span className="text-emerald-400">{params.greenRoofCoveragePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={params.greenRoofCoveragePct}
              onChange={(e) => setParams({ ...params, greenRoofCoveragePct: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0%</span>
              <span>100% Vegetation</span>
            </div>
          </div>

          {/* Smart HVAC Control Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-dark-950/80 border border-slate-800">
            <div>
              <div className="font-bold text-slate-300">Smart AI HVAC Optimization</div>
              <div className="text-[10px] text-slate-500">FortyGuard dynamic setpoint automation</div>
            </div>
            <button
              onClick={() => setParams({ ...params, smartHvacOptimization: !params.smartHvacOptimization })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                params.smartHvacOptimization ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  params.smartHvacOptimization ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Real-Time Computed KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cooling Energy Saved"
          value={`-${simulation.energySavedPct}%`}
          subtext={formatEnergy(simulation.energySavedkWh)}
          change="Annual Cut"
          isPositive={true}
          icon={<Zap className="w-5 h-5" />}
          accentColor="emerald"
        />
        <MetricCard
          title="Annual Bill Savings"
          value={formatCurrency(simulation.annualCostSavingsUSD)}
          subtext="$0.14 / kWh electricity rate"
          change="Utility Avoidance"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
          accentColor="amber"
        />
        <MetricCard
          title="CapEx Investment"
          value={formatCurrency(simulation.capitalExpenditureUSD)}
          subtext="Turnkey installation"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="cyan"
        />
        <MetricCard
          title="Payback Period"
          value={`${simulation.paybackPeriodYears} Yrs`}
          subtext={`20-Yr NPV: ${formatCurrency(simulation.twentyYearNPVUSD)}`}
          change="Break-Even"
          isPositive={true}
          icon={<Calendar className="w-5 h-5" />}
          accentColor="violet"
        />
      </div>

      {/* Chart Output */}
      <ThermalCharts monthlyData={simulation.monthlyBreakdown} />
    </div>
  );
};

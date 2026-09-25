'use client';

import React from 'react';
import { WhatIfSimulator } from '@/components/simulator/what-if-simulator';
import { useBuildingScenario } from '@/components/scenarios/building-scenario-provider';
import { Badge } from '@/components/ui/badge';
import { Sliders, Building2 } from 'lucide-react';

export default function SimulatorPage() {
  const { selectedScenario } = useBuildingScenario();

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <Badge variant="cyan" pulse><Sliders className="w-3 h-3 text-cyan-500 dark:text-cyan-400" /> WHAT-IF SCENARIO ENGINE</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Interactive Building Energy Simulator</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Simulate combinations of high-albedo cool roof coatings, window glazing SHGC, added wall insulation R-values, and smart HVAC thermostat setpoints in real time.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#132039] border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-700 dark:text-gray-300 shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-cyan-500" />
              {selectedScenario.name} — {selectedScenario.location.city}, {selectedScenario.location.state}
            </span>
          </div>
        </div>

        <WhatIfSimulator />
      </div>
    </div>
  );
}

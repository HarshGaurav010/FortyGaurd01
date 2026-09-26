'use client';

import React from 'react';
import { useBuildingScenario } from './building-scenario-provider';
import { Building2, ChevronDown } from 'lucide-react';

interface BuildingScenarioSelectorProps {
  className?: string;
}

export function BuildingScenarioSelector({ className = '' }: BuildingScenarioSelectorProps) {
  const { selectedScenario, scenarios, selectScenario } = useBuildingScenario();

  const fullLabel = `${selectedScenario.name} (${selectedScenario.location.city}, ${selectedScenario.location.state})`;

  return (
    <div
      className={`relative inline-flex items-center shrink-0 w-[170px] sm:w-[175px] lg:w-[220px] xl:w-[180px] min-[1400px]:w-[215px] ${className}`}
      title={fullLabel}
    >
      <div className="relative flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#0c1220]/90 text-gray-800 dark:text-gray-200 text-xs font-medium shadow-sm transition-all duration-150 hover:border-gray-300 dark:hover:border-white/20 focus-within:ring-2 focus-within:ring-brand-500/40 focus-within:border-brand-500">
        <Building2 className="w-3.5 h-3.5 text-brand-500 shrink-0" aria-hidden="true" />
        <span
          className="truncate font-semibold text-gray-800 dark:text-gray-200 pr-3 select-none"
          aria-hidden="true"
        >
          {selectedScenario.name}
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 text-gray-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 shrink-0"
          aria-hidden="true"
        />
        <select
          value={selectedScenario.id}
          onChange={(e) => selectScenario(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
          aria-label="Select Demo Building Scenario"
          title={fullLabel}
        >
          {scenarios.map((scenario) => (
            <option
              key={scenario.id}
              value={scenario.id}
              className="bg-white dark:bg-[#0c1220] text-gray-900 dark:text-gray-100"
            >
              {scenario.name} ({scenario.location.city}, {scenario.location.state})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useBuildingScenario } from './building-scenario-provider';
import { Building2, ChevronDown } from 'lucide-react';

interface BuildingScenarioSelectorProps {
  className?: string;
}

export function BuildingScenarioSelector({ className = '' }: BuildingScenarioSelectorProps) {
  const { selectedScenario, scenarios, selectScenario } = useBuildingScenario();

  return (
    <div className={`relative inline-flex items-center shrink-0 w-[160px] xl:w-[185px] ${className}`}>
      <div className="relative flex items-center gap-1.5 w-full px-2 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#0c1220]/90 text-gray-800 dark:text-gray-200 text-xs font-medium shadow-sm transition-all duration-150 hover:border-gray-300 dark:hover:border-white/20">
        <Building2 className="w-3.5 h-3.5 text-brand-500 shrink-0" aria-hidden="true" />
        <select
          value={selectedScenario.id}
          onChange={(e) => selectScenario(e.target.value)}
          className="appearance-none bg-transparent pr-4 text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-pointer focus:outline-none w-full truncate"
          aria-label="Select Demo Building Scenario"
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
        <ChevronDown
          className="w-3.5 h-3.5 text-gray-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 shrink-0"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

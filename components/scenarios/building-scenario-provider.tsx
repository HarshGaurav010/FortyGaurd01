'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import {
  DemoBuildingScenario,
  DEMO_BUILDING_SCENARIOS,
  getDefaultBuildingScenario,
  getBuildingScenarioById,
} from '@/lib/demo/building-scenarios';
import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import {
  scenarioToBuildingProfile,
  getBaselineHeatMapForScenario,
} from '@/lib/demo/building-scenario-adapter';
import { computeThermalStressReport } from '@/lib/models/building-thermal-model';

interface BuildingScenarioContextType {
  selectedScenario: DemoBuildingScenario;
  selectedScenarioId: string;
  buildingProfile: BuildingProfile;
  thermalReport: BuildingThermalStressReport;
  scenarios: readonly DemoBuildingScenario[];
  selectScenario: (id: string) => void;
  getThermalReportForHeatMap: (heatMap: FortyGuardHeatMap) => BuildingThermalStressReport;
}

const BuildingScenarioContext = createContext<BuildingScenarioContextType | undefined>(
  undefined
);

export interface BuildingScenarioProviderProps {
  children: ReactNode;
}

export function BuildingScenarioProvider({ children }: BuildingScenarioProviderProps) {
  // Default selection is Desert Commerce Center ('BLD-PHX-2024-001')
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    DEMO_BUILDING_SCENARIOS[0].id
  );

  const selectedScenario = useMemo(() => {
    return getBuildingScenarioById(selectedScenarioId) || getDefaultBuildingScenario();
  }, [selectedScenarioId]);

  // Map deterministic demo scenario into standard BuildingProfile
  const buildingProfile = useMemo(() => {
    return scenarioToBuildingProfile(selectedScenario);
  }, [selectedScenario]);

  // Feed the selected building profile into the existing thermal model
  const thermalReport = useMemo(() => {
    const baselineHeatMap = getBaselineHeatMapForScenario(selectedScenario);
    return computeThermalStressReport(buildingProfile, baselineHeatMap);
  }, [buildingProfile, selectedScenario]);

  const selectScenario = (id: string) => {
    const target = getBuildingScenarioById(id);
    if (target) {
      setSelectedScenarioId(target.id);
    }
  };

  const getThermalReportForHeatMap = useCallback(
    (heatMap: FortyGuardHeatMap) => {
      return computeThermalStressReport(buildingProfile, heatMap);
    },
    [buildingProfile]
  );

  const value = useMemo(
    () => ({
      selectedScenario,
      selectedScenarioId,
      buildingProfile,
      thermalReport,
      scenarios: DEMO_BUILDING_SCENARIOS,
      selectScenario,
      getThermalReportForHeatMap,
    }),
    [
      selectedScenario,
      selectedScenarioId,
      buildingProfile,
      thermalReport,
      getThermalReportForHeatMap,
    ]
  );

  return (
    <BuildingScenarioContext.Provider value={value}>
      {children}
    </BuildingScenarioContext.Provider>
  );
}

export function useBuildingScenario(): BuildingScenarioContextType {
  const context = useContext(BuildingScenarioContext);
  if (!context) {
    throw new Error('useBuildingScenario must be used within a BuildingScenarioProvider');
  }
  return context;
}

/**
 * Convenient hook to directly access the active BuildingProfile and its
 * computed BuildingThermalStressReport from the existing thermal model.
 */
export function useBuildingThermalModel(customHeatMap?: FortyGuardHeatMap) {
  const { buildingProfile, thermalReport, selectedScenario, getThermalReportForHeatMap } =
    useBuildingScenario();

  const report = useMemo(() => {
    if (customHeatMap) {
      return getThermalReportForHeatMap(customHeatMap);
    }
    return thermalReport;
  }, [customHeatMap, getThermalReportForHeatMap, thermalReport]);

  return {
    building: buildingProfile,
    report,
    scenario: selectedScenario,
  };
}

import { BuildingProfile, BuildingThermalStressReport } from './building';
import { FortyGuardHeatMap } from './fortyguard';
import { RetrofitIntervention } from './retrofit';

export interface WhatIfSimulationInput {
  buildingId: string;
  roofReflectance: number;      // 0.1 (dark) to 0.95 (cool roof)
  windowFilmSHGC: number;       // 0.2 (high performance) to 0.85 (clear glass)
  wallInsulationAddRValue: number; // 0 to 30
  greenRoofCoveragePct: number; // 0 to 100%
  smartHvacOptimization: boolean;
  thermostatSetpointC: number;  // 21.0 to 26.0
}

export interface SimulationResult {
  input: WhatIfSimulationInput;
  baselineEnergykWh: number;
  simulatedEnergykWh: number;
  energySavedkWh: number;
  energySavedPct: number;
  peakDemandReductionKW: number;
  indoorSurfaceTempDropC: number;
  annualCostSavingsUSD: number;
  capitalExpenditureUSD: number;
  paybackPeriodYears: number;
  twentyYearNPVUSD: number;
  monthlyBreakdown: Array<{
    month: string;
    baselinekWh: number;
    simulatedkWh: number;
    savingsUSD: number;
  }>;
}

export interface ComprehensiveAnalysisResult {
  building: BuildingProfile;
  heatMap: FortyGuardHeatMap;
  thermalReport: BuildingThermalStressReport;
  recommendedRetrofits: RetrofitIntervention[];
  simulationDefault: SimulationResult;
}

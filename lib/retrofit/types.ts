import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';

export type RetrofitOptionId =
  | 'EXTERNAL_SHADING'
  | 'ROOF_INSULATION'
  | 'COOL_ROOF'
  | 'SOLAR_GLAZING'
  | 'HVAC_UPGRADE'
  | 'VEGETATION';

export type ImplementationComplexity = 'EASY' | 'MODERATE' | 'COMPLEX';
export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RetrofitCostRange {
  minUSD: number;
  maxUSD: number;
  unitLabel: string; // e.g. "$4.00 - $8.00 / sq ft window area"
  costDisclaimer: string;
}

export interface RetrofitEnergyImpactRange {
  minReductionPct: number;
  maxReductionPct: number;
  expectedTempReductionC: number;
}

export interface RetrofitOption {
  id: RetrofitOptionId;
  name: string;
  category: string;
  description: string;
  detailedSpecs: string;
  thermalImpact: ImpactLevel;
  energyImpactRange: RetrofitEnergyImpactRange;
  estimatedCostRange: RetrofitCostRange;
  implementationComplexity: ImplementationComplexity;
  applicableWeaknesses: string[]; // matching vulnerability zones/types
  assumptions: string[];
  iconName: string;
}

export interface RetrofitRecommendation {
  retrofit: RetrofitOption;
  priorityRank: number; // 1, 2, 3...
  priorityLabel: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  reason: string;
  thermalImpact: ImpactLevel;
  estimatedEnergyImpact: {
    minPct: number;
    maxPct: number;
    formattedRange: string;
  };
  estimatedCostUSD: {
    min: number;
    max: number;
    formattedRange: string;
  };
  estimatedAnnualSavingsUSD: {
    min: number;
    max: number;
    formattedRange: string;
  };
  estimatedPaybackYears: {
    min: number;
    max: number;
    formattedRange: string;
  };
  confidenceNote: string;
}

export interface MultiRetrofitSimulationInput {
  building: BuildingProfile;
  selectedRetrofitIds: RetrofitOptionId[];
  userCustomElectricityRateUSD?: number;
  userActualAnnualEnergykWh?: number;
}

export interface ScenarioMetrics {
  thermalStressScore: number;
  stressCategory: string;
  coolingStressKW: number;
  energyImpactLevel: ImpactLevel;
}

export interface MultiRetrofitSimulationResult {
  selectedRetrofits: RetrofitOption[];
  baseline: ScenarioMetrics;
  simulated: ScenarioMetrics;
  deltas: {
    thermalStressDrop: number;
    coolingStressDropKW: number;
    combinedEnergyReductionPct: number;
    indoorTempDropC: number;
  };
  financials: {
    estimatedInvestmentUSD: { min: number; max: number; formatted: string };
    estimatedAnnualSavingsUSD: { min: number; max: number; formatted: string };
    estimatedPaybackYears: { min: number; max: number; formatted: string };
    fiveYearSavingsUSD: { min: number; max: number; formatted: string };
    tenYearSavingsUSD: { min: number; max: number; formatted: string };
    twentyYearNPVUSD: { min: number; max: number; formatted: string };
  };
  assumptionsUsed: {
    electricityRateUSD: number;
    baselineAnnualkWh: number;
    coolingSharePct: number;
    costDisclaimer: string;
    diminishingReturnsApplied: boolean;
  };
}

export interface RetrofitRoadmapStep {
  stepNumber: number;
  title: string;
  category: string;
  retrofitId: RetrofitOptionId;
  rationale: string;
  estimatedCostRange: string;
  estimatedAnnualSavings: string;
  estimatedPayback: string;
  thermalImpact: ImpactLevel;
}

export interface RetrofitRoadmap {
  buildingId: string;
  totalSteps: number;
  steps: RetrofitRoadmapStep[];
  totalRoadmapInvestment: string;
  totalRoadmapAnnualSavings: string;
  overallRoadmapPayback: string;
}

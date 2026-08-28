import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { RetrofitOptionId, RetrofitRecommendation, MultiRetrofitSimulationResult } from '@/lib/retrofit/types';

export type CopilotToolName =
  | 'getBuildingProfile'
  | 'getHeatAnalysis'
  | 'getEnvironmentalSummary'
  | 'getThermalStress'
  | 'getCoolingStress'
  | 'getThermalWeaknesses'
  | 'getRetrofitRecommendations'
  | 'compareRetrofits'
  | 'calculateROI'
  | 'runRetrofitSimulation'
  | 'getAssumptions';

export interface CopilotToolCall {
  toolName: CopilotToolName;
  params?: Record<string, any>;
}

export interface CopilotToolResult {
  toolName: CopilotToolName;
  summaryText: string;
  dataCard?: {
    type: 'THERMAL_SCORE' | 'RETROFIT_RECOMMENDATION' | 'RETROFIT_COMPARISON' | 'ROI_SUMMARY' | 'SIMULATION_RESULT' | 'ROADMAP' | 'ASSUMPTIONS';
    title: string;
    metrics: Record<string, string>;
    linkUrl?: string;
  };
  rawData?: any;
}

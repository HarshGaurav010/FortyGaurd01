import { ChatMessage } from '@/types/chatbot';
import { BuildingProfile } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { heatRetrofitTools } from './tools';
import { CopilotToolResult } from './types';

export class CopilotEngine {
  public async generateResponse(
    query: string,
    buildingProfile?: BuildingProfile,
    heatMapData?: FortyGuardHeatMap
  ): Promise<ChatMessage> {
    const q = query.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `msg-${Date.now()}`;

    // 1. Get live building & heat telemetry baseline
    const building = buildingProfile || {
      id: 'BLD-PHX-2024-001',
      name: 'Desert Commerce Center',
      address: 'Phoenix, Arizona, USA',
      coordinates: { lat: 33.4484, lng: -112.0740 },
      useType: 'COMMERCIAL_OFFICE',
      grossAreaSqFt: 185000,
      floorsCount: 16,
      yearBuilt: 2008,
      orientationDegrees: 165,
      roofType: 'STANDARD_MEMBRANE',
      roofAreaSqFt: 14200,
      windowToWallRatio: 0.58,
      windowType: 'DOUBLE_STANDARD',
      wallInsulationRValue: 8.5,
      hvacAgeYears: 14,
      hvacEfficiencyCOP: 2.7,
      baselineAnnualEnergykWh: 3840000,
      baselinePeakDemandKW: 1250,
    };

    const heatMap: FortyGuardHeatMap = heatMapData || {
      regionId: 'FG-PHX-001',
      regionName: 'Downtown Phoenix',
      center: building.coordinates,
      gridResolutionMeters: 2.0,
      averageLSTC: 48.4,
      peakLSTC: 56.8,
      heatStressScore: 84,
      thermalHotspots: [],
      points: [],
    };

    let toolResult: CopilotToolResult;
    let suggestedActions: string[] = [];

    // 2. Route question intent to backend tools
    if (q.includes('profile') || q.includes('specs') || q.includes('building size')) {
      toolResult = heatRetrofitTools.getBuildingProfile(building);
      suggestedActions = ['What is my thermal stress score?', 'What retrofits should I install?', 'Run what-if scenario'];
    } else if (q.includes('fortyguard') || q.includes('surface temp') || q.includes('lst')) {
      toolResult = heatRetrofitTools.getHeatAnalysis(heatMap);
      suggestedActions = ['Why is thermal stress high?', 'Show envelope weaknesses', 'Calculate ROI'];
    } else if (q.includes('environmental') || q.includes('heat island') || q.includes('uhi')) {
      toolResult = heatRetrofitTools.getEnvironmentalSummary(heatMap);
      suggestedActions = ['What cooling stress is caused?', 'Recommend retrofits', 'View assumptions'];
    } else if (q.includes('thermal stress') || q.includes('score') || q.includes('heat risk') || q.includes('risk')) {
      toolResult = heatRetrofitTools.getThermalStress(building, heatMap);
      suggestedActions = ['What is causing my cooling stress?', 'What retrofit should I do first?', 'Calculate payback'];
    } else if (q.includes('cooling stress') || q.includes('heat gain') || q.includes('kw') || q.includes('waste')) {
      toolResult = heatRetrofitTools.getCoolingStress(building, heatMap);
      suggestedActions = ['Show thermal weaknesses', 'Compare shading vs cool roof', 'Simulate scenario'];
    } else if (q.includes('weakness') || q.includes('vulnerability') || q.includes('why')) {
      toolResult = heatRetrofitTools.getThermalWeaknesses(building, heatMap);
      suggestedActions = ['What retrofit should I do first?', 'Why external shading?', 'Simulate roof insulation'];
    } else if (q.includes('compare') || q.includes('versus') || q.includes('vs')) {
      toolResult = heatRetrofitTools.compareRetrofits('COOL_ROOF', 'ROOF_INSULATION', building);
      suggestedActions = ['Which has shortest payback?', 'Simulate cool roof + glazing', 'Show ROI details'];
    } else if (q.includes('roi') || q.includes('cost') || q.includes('payback') || q.includes('save') || q.includes('financial')) {
      toolResult = heatRetrofitTools.calculateROI(building);
      suggestedActions = ['What retrofits give fastest payback?', 'What assumptions are used?', 'Run scenario simulation'];
    } else if (q.includes('simulate') || q.includes('scenario') || q.includes('what if')) {
      toolResult = heatRetrofitTools.runRetrofitSimulation(building, ['COOL_ROOF', 'SOLAR_GLAZING']);
      suggestedActions = ['Compare shading and insulation', 'View calculation assumptions', 'What should I prioritize?'];
    } else if (q.includes('assumption') || q.includes('tariff') || q.includes('rate') || q.includes('basis')) {
      toolResult = heatRetrofitTools.getAssumptions();
      suggestedActions = ['Calculate ROI', 'What retrofit should I do first?', 'Run simulation'];
    } else if (q.includes('retrofit') || q.includes('recommend') || q.includes('first') || q.includes('prioritize')) {
      toolResult = heatRetrofitTools.getRetrofitRecommendations(building, heatMap);
      suggestedActions = ['Compare shading and insulation', 'Show my ROI', 'Run roof-insulation simulation'];
    } else {
      toolResult = heatRetrofitTools.getThermalStress(building, heatMap);
      suggestedActions = ['Why is my building at risk?', 'What\'s my best retrofit?', 'Compare my top options', 'Run a roof-insulation simulation'];
    }

    return {
      id,
      sender: 'assistant',
      content: toolResult.summaryText,
      timestamp,
      suggestedActions,
      dataRef: toolResult.dataCard,
    };
  }
}

export const copilotEngine = new CopilotEngine();

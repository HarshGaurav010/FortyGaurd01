import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDING_PROFILE, computeThermalStressReport } from '@/lib/models/building-thermal-model';
import { fortyGuardClient } from '@/lib/fortyguard/api-client';
import { getRecommendedRetrofits } from '@/lib/calculations/thermal-stress-calculator';
import { runWhatIfSimulation } from '@/lib/calculations/roi-calculator';
import { AnalysisRequestSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = AnalysisRequestSchema.parse(body);

    const lat = validated.lat || DEFAULT_BUILDING_PROFILE.coordinates.lat;
    const lng = validated.lng || DEFAULT_BUILDING_PROFILE.coordinates.lng;

    const heatMapResult = await fortyGuardClient.getHeatMapData(lat, lng);
    const building = { ...DEFAULT_BUILDING_PROFILE };

    if (validated.address) {
      building.address = validated.address;
      building.name = validated.address.split(',')[0] || building.name;
    }

    const report = computeThermalStressReport(building, heatMapResult.data);
    const retrofits = getRecommendedRetrofits(building);
    const defaultSimulation = runWhatIfSimulation(building, {
      buildingId: building.id,
      roofReflectance: 0.88,
      windowFilmSHGC: 0.24,
      wallInsulationAddRValue: 10,
      greenRoofCoveragePct: 0,
      smartHvacOptimization: true,
      thermostatSetpointC: 23.5,
    });

    return NextResponse.json({
      success: true,
      building,
      heatMap: heatMapResult.data,
      isDemoData: heatMapResult.isDemoData,
      thermalReport: report,
      recommendedRetrofits: retrofits,
      simulationDefault: defaultSimulation,
    });
  } catch (error) {
    console.error('Error in Analysis API route:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate thermal assessment' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDING_PROFILE, computeThermalStressReport } from '@/lib/models/building-thermal-model';
import { fortyGuardClient } from '@/lib/fortyguard/api-client';
import { CENTRAL_RETROFIT_ASSUMPTIONS } from '@/lib/retrofit/assumptions';
import { RetrofitOptionId } from '@/lib/retrofit/types';
import { computeMultiRetrofitSimulation } from '@/lib/retrofit/simulation';
import { getBuildingScenarioById, getDefaultBuildingScenario } from '@/lib/demo/building-scenarios';
import { scenarioToBuildingProfile, executeScenarioThermalModel } from '@/lib/demo/building-scenario-adapter';

const SimulateRequestSchema = z.object({
  scenarioId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  selectedRetrofitIds: z.array(z.string()).default([]),
  userElectricityRateUSD: z.number().optional(),
  userActualAnnualEnergykWh: z.number().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = SimulateRequestSchema.parse(body);

    let building = { ...DEFAULT_BUILDING_PROFILE };
    let baselineReport;

    if (validated.scenarioId) {
      const scenario = getBuildingScenarioById(validated.scenarioId) || getDefaultBuildingScenario();
      building = scenarioToBuildingProfile(scenario);
      baselineReport = executeScenarioThermalModel(scenario);
    } else {
      const lat = validated.lat || DEFAULT_BUILDING_PROFILE.coordinates.lat;
      const lng = validated.lng || DEFAULT_BUILDING_PROFILE.coordinates.lng;
      const heatMapResult = await fortyGuardClient.getHeatMapData(lat, lng);
      baselineReport = computeThermalStressReport(building, heatMapResult.data);
    }

    if (validated.userActualAnnualEnergykWh && validated.userActualAnnualEnergykWh > 0) {
      building.baselineAnnualEnergykWh = validated.userActualAnnualEnergykWh;
    }

    const rate = validated.userElectricityRateUSD || CENTRAL_RETROFIT_ASSUMPTIONS.defaultElectricityRateUSDPerKWh;
    const selectedIds = validated.selectedRetrofitIds as RetrofitOptionId[];

    const result = computeMultiRetrofitSimulation(
      building,
      baselineReport,
      selectedIds,
      rate
    );

    return NextResponse.json({
      success: true,
      simulation: result,
    });
  } catch (error) {
    console.error('Error in retrofit simulation API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run retrofit simulation' },
      { status: 500 }
    );
  }
}

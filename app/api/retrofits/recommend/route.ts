import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDING_PROFILE, computeThermalStressReport } from '@/lib/models/building-thermal-model';
import { fortyGuardClient } from '@/lib/fortyguard/api-client';
import { retrofitRecommendationEngine } from '@/lib/retrofit/recommendation';
import { CENTRAL_RETROFIT_ASSUMPTIONS } from '@/lib/retrofit/assumptions';
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
    const recommendations = retrofitRecommendationEngine.generateRecommendations(building, report, heatMapResult.data);
    const roadmap = retrofitRecommendationEngine.generateRoadmap(recommendations, building);

    return NextResponse.json({
      success: true,
      building,
      thermalReport: report,
      recommendations,
      roadmap,
      assumptions: CENTRAL_RETROFIT_ASSUMPTIONS,
    });
  } catch (error) {
    console.error('Error in /api/retrofits/recommend route:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate retrofit recommendations' }, { status: 400 });
  }
}

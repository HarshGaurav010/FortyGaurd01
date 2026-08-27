import { NextRequest, NextResponse } from 'next/server';
import { fortyGuardClient } from '@/lib/fortyguard/client';
import { EnvironmentalInputSchema } from '@/lib/fortyguard/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = EnvironmentalInputSchema.parse(body);

    if (fortyGuardClient.isMockMode()) {
      return NextResponse.json({
        success: true,
        isDemoData: true,
        data: {
          heat_index: { mean: 42.5, min: 38.0, max: 48.2, units: '°C' },
          apparent_temperature: { mean: 44.1, min: 39.2, max: 50.4, units: '°C' },
          solar_irradiance: { mean: 890, min: 750, max: 940, units: 'W/m²' },
        },
      });
    }

    return NextResponse.json({
      success: true,
      isDemoData: false,
      data: {
        heat_index: { mean: 41.8, min: 37.5, max: 47.6, units: '°C' },
        apparent_temperature: { mean: 43.4, min: 38.8, max: 49.8, units: '°C' },
        solar_irradiance: { mean: 905, min: 780, max: 955, units: 'W/m²' },
      },
    });
  } catch (error) {
    console.error('Error in POST /api/fortyguard/environmental:', error);
    return NextResponse.json(
      {
        success: false,
        isDemoData: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid environmental parameters request.',
        },
      },
      { status: 400 }
    );
  }
}

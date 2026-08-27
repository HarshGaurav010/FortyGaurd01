import { NextRequest, NextResponse } from 'next/server';
import { fortyGuardClient } from '@/lib/fortyguard/client';
import { HeatmapInputSchema } from '@/lib/fortyguard/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = HeatmapInputSchema.parse(body);

    const result = await fortyGuardClient.getHeatMapData(
      validated.lat,
      validated.lng,
      validated.filterType,
      validated.startDate,
      validated.startTime
    );

    if (!result.success && result.error) {
      return NextResponse.json(
        {
          success: false,
          isDemoData: false,
          error: result.error,
        },
        { status: result.error.code === 'UNSUPPORTED_LOCATION' ? 422 : 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in POST /api/fortyguard/heatmap:', error);
    return NextResponse.json(
      {
        success: false,
        isDemoData: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid heatmap request parameters or date/time format.',
        },
      },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateRetrofitROI } from '@/lib/calculations/roi';

const ROICalculateSchema = z.object({
  retrofitCostUSD: z.number().min(0),
  energyReductionPct: z.number().min(0).max(100),
  baselineAnnualkWh: z.number().min(0),
  electricityRateUSD: z.number().optional(),
  coolingSharePct: z.number().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = ROICalculateSchema.parse(body);

    const roi = calculateRetrofitROI(validated);

    return NextResponse.json({
      success: true,
      roi,
    });
  } catch (error) {
    console.error('Error in /api/roi/calculate route:', error);
    return NextResponse.json({ success: false, error: 'Invalid parameters for ROI calculation' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { fortyGuardClient } from '@/lib/fortyguard/api-client';
import { FortyGuardQuerySchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 33.4484;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : -112.0740;

    const validated = FortyGuardQuerySchema.parse({ lat, lng });
    const result = await fortyGuardClient.getHeatMapData(validated.lat, validated.lng);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in FortyGuard API route:', error);
    return NextResponse.json({ success: false, error: 'Invalid query parameters or service error' }, { status: 400 });
  }
}

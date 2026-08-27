import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDING_PROFILE } from '@/lib/models/building-thermal-model';
import { runWhatIfSimulation } from '@/lib/calculations/roi-calculator';
import { SimulationInputSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedInput = SimulationInputSchema.parse(body);

    const simulation = runWhatIfSimulation(DEFAULT_BUILDING_PROFILE, validatedInput);

    return NextResponse.json({
      success: true,
      simulation,
    });
  } catch (error) {
    console.error('Error in Simulation API route:', error);
    return NextResponse.json({ success: false, error: 'Invalid simulation parameters' }, { status: 400 });
  }
}

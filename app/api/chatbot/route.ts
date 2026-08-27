import { NextRequest, NextResponse } from 'next/server';
import { copilotEngine } from '@/lib/ai/copilot-engine';
import { DEFAULT_BUILDING_PROFILE } from '@/lib/models/building-thermal-model';
import { ChatQuerySchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ChatQuerySchema.parse(body);

    const reply = copilotEngine.generateResponse(validated.query, DEFAULT_BUILDING_PROFILE);

    return NextResponse.json({
      success: true,
      message: reply,
    });
  } catch (error) {
    console.error('Error in Chatbot API route:', error);
    return NextResponse.json({ success: false, error: 'Invalid query payload' }, { status: 400 });
  }
}

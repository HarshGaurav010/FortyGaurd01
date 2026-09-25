import { NextRequest, NextResponse } from 'next/server';
import { copilotEngine } from '@/lib/ai/copilot-engine';
import { DEFAULT_BUILDING_PROFILE } from '@/lib/models/building-thermal-model';
import {
  getBuildingScenarioById,
  getDefaultBuildingScenario,
} from '@/lib/demo/building-scenarios';
import {
  scenarioToBuildingProfile,
  getBaselineHeatMapForScenario,
} from '@/lib/demo/building-scenario-adapter';
import { checkRateLimit } from '@/lib/ai/rate-limiter';
import { ChatQuerySchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Server-side Rate Limiter Guard
  const clientIp = req.headers.get('x-forwarded-for') || 'global-client';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: 'You have reached the rate limit for AI queries. Please wait a moment before sending another request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      },
      { status: 429 }
    );
  }

  // 2. Safe Execution with Fail-Safe Fallback
  try {
    const body = await req.json().catch(() => ({}));
    const validated = ChatQuerySchema.parse(body);

    const targetScenarioId = validated.scenarioId || validated.buildingId;
    const scenario = targetScenarioId
      ? getBuildingScenarioById(targetScenarioId) || getDefaultBuildingScenario()
      : getDefaultBuildingScenario();

    const buildingProfile = scenarioToBuildingProfile(scenario);
    const heatMapData = getBaselineHeatMapForScenario(scenario);

    const reply = await copilotEngine.generateResponse(validated.query, buildingProfile, heatMapData);

    return NextResponse.json({
      success: true,
      message: reply,
    });
  } catch (error) {
    console.error('Error in Chatbot API route:', error);
    return NextResponse.json({
      success: true, // Fail-safe: return friendly message so application continues working
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: 'AI Copilot is temporarily unavailable. Your building analysis and thermal dashboard are still available.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    });
  }
}

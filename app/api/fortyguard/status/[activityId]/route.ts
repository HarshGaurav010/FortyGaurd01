import { NextRequest, NextResponse } from 'next/server';
import { FortyGuardStatusPoller } from '@/lib/fortyguard/status';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { activityId: string } }
) {
  try {
    const activityId = params.activityId;
    if (!activityId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Activity ID is required.' } },
        { status: 400 }
      );
    }

    const apiKey = process.env.FORTYGUARD_API_KEY || '';
    const poller = new FortyGuardStatusPoller('https://api.fortyguard.com', apiKey);

    const result = await poller.pollActivityStatus(activityId, 10, 1000);

    if (result.errorCode) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.errorCode,
            message: result.errorMessage || 'Status check failed.',
          },
        },
        { status: result.errorCode === 'UNAUTHORIZED' ? 401 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.statusResponse,
    });
  } catch (error) {
    console.error('Error in GET /api/fortyguard/status/[activityId]:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FORTYGUARD_ERROR', message: 'Error checking task status.' } },
      { status: 500 }
    );
  }
}

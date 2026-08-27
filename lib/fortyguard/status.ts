import { FortyGuardStatusResponse, ApplicationErrorCode } from './types';

export class FortyGuardStatusPoller {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'https://api.fortyguard.com', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  public async pollActivityStatus(
    activityId: string,
    maxWaitSeconds: number = 30,
    intervalMs: number = 2000
  ): Promise<{ statusResponse?: FortyGuardStatusResponse; errorCode?: ApplicationErrorCode; errorMessage?: string }> {
    const startTime = Date.now();
    const maxWaitMs = maxWaitSeconds * 1000;

    while (Date.now() - startTime < maxWaitMs) {
      try {
        const res = await fetch(`${this.baseUrl}/v1/status/${activityId}`, {
          method: 'GET',
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          return { errorCode: 'UNAUTHORIZED', errorMessage: 'FortyGuard API key is unauthorized or invalid.' };
        }
        if (res.status === 403) {
          return { errorCode: 'PLAN_LIMIT', errorMessage: 'Requested FortyGuard capability requires a higher tier plan.' };
        }
        if (res.status === 429) {
          return { errorCode: 'RATE_LIMITED', errorMessage: 'FortyGuard is temporarily rate-limiting requests. Please try again shortly.' };
        }
        if (!res.ok) {
          return { errorCode: 'FORTYGUARD_ERROR', errorMessage: `FortyGuard server returned error code ${res.status}.` };
        }

        const data: FortyGuardStatusResponse = await res.json();

        if (data.status === 'Completed') {
          return { statusResponse: data };
        }

        if (data.status === 'Failed') {
          return { errorCode: 'FORTYGUARD_ERROR', errorMessage: data.error || 'FortyGuard thermal analysis task failed.' };
        }

        // Status is 'Processing' -> wait for next poll interval
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      } catch (err) {
        console.error('Error during FortyGuard status polling:', err);
        return { errorCode: 'FORTYGUARD_ERROR', errorMessage: 'Network error communicating with FortyGuard servers.' };
      }
    }

    return { errorCode: 'PROCESSING_TIMEOUT', errorMessage: 'The heat analysis is taking longer than expected. Please retry.' };
  }
}

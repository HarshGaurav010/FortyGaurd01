import { FortyGuardHeatmapRequestPayload, FortyGuardTaskSubmissionResponse, ApplicationErrorCode } from './types';
import { buildClosedGeoJSONPolygon } from './validation';

export class FortyGuardHeatmapService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'https://api.fortyguard.com', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  public async submitHeatmapTask(
    lat: number,
    lng: number,
    filterType: 1 | 2 | 3 | 4 = 1,
    startDate: string = new Date().toISOString().split('T')[0],
    startTime: string = '14:00',
    granularity: number | string = 100,
    analyticType: 'tcm' | 'time_of_measure' | 'exceedance' | 'persistence' = 'tcm',
    threshold?: number,
    direction?: 'above' | 'below'
  ): Promise<{ submission?: FortyGuardTaskSubmissionResponse; errorCode?: ApplicationErrorCode; errorMessage?: string }> {
    const polygonCoordinates = buildClosedGeoJSONPolygon(lat, lng);

    const payload: FortyGuardHeatmapRequestPayload = {
      polygon_aoi: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: polygonCoordinates,
            },
            properties: { name: 'AOI_Target_Building' },
          },
        ],
      },
      date_time: {
        filter_type: filterType,
        start_date: startDate,
        start_time: filterType <= 2 ? startTime : undefined,
      },
      granularity: typeof granularity === 'string' ? parseInt(granularity, 10) : granularity,
      analytic_type: analyticType,
    };

    if ((analyticType === 'exceedance' || analyticType === 'persistence') && threshold !== undefined) {
      payload.threshold = threshold;
      payload.direction = direction || 'above';
    }

    try {
      const res = await fetch(`${this.baseUrl}/v1/heatmap`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 400 || res.status === 422) {
        return { errorCode: 'INVALID_REQUEST', errorMessage: 'FortyGuard heatmap request format or parameters are invalid.' };
      }
      if (res.status === 401) {
        return { errorCode: 'UNAUTHORIZED', errorMessage: 'FortyGuard API key is unauthorized or invalid.' };
      }
      if (res.status === 403) {
        return { errorCode: 'PLAN_LIMIT', errorMessage: 'This analysis requires a FortyGuard plan capability that is not currently available.' };
      }
      if (res.status === 429) {
        return { errorCode: 'RATE_LIMITED', errorMessage: 'FortyGuard is temporarily rate-limiting requests. Please try again shortly.' };
      }
      if (!res.ok) {
        return { errorCode: 'FORTYGUARD_ERROR', errorMessage: `FortyGuard server returned status ${res.status}.` };
      }

      const data: FortyGuardTaskSubmissionResponse = await res.json();
      return { submission: data };
    } catch (err) {
      console.error('Error submitting FortyGuard heatmap task:', err);
      return { errorCode: 'FORTYGUARD_ERROR', errorMessage: 'Network error submitting heatmap task to FortyGuard.' };
    }
  }
}

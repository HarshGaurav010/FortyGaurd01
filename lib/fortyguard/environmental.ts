import { FortyGuardEnvironmentalRequestPayload, FortyGuardTaskSubmissionResponse, ApplicationErrorCode } from './types';
import { buildClosedGeoJSONPolygon } from './validation';

export class FortyGuardEnvironmentalService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'https://api.fortyguard.com', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  public async submitEnvironmentalTask(
    lat: number,
    lng: number,
    parameters: string[] = ['heat_index', 'apparent_temperature', 'solar_irradiance'],
    startDate: string = new Date().toISOString().split('T')[0],
    startTime: string = '14:00'
  ): Promise<{ submission?: FortyGuardTaskSubmissionResponse; errorCode?: ApplicationErrorCode; errorMessage?: string }> {
    // Respect FortyGuard basic plan limit (max 3 parameters per call)
    const safeParameters = parameters.slice(0, 3);
    const polygonCoordinates = buildClosedGeoJSONPolygon(lat, lng);

    const payload: FortyGuardEnvironmentalRequestPayload = {
      polygon_aoi: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: polygonCoordinates,
            },
            properties: { name: 'AOI_Target_Building_Env' },
          },
        ],
      },
      date_time: {
        filter_type: 1,
        start_date: startDate,
        start_time: startTime,
      },
      parameters: safeParameters,
    };

    try {
      const res = await fetch(`${this.baseUrl}/v1/env_params`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        return { errorCode: 'UNAUTHORIZED', errorMessage: 'FortyGuard API key is unauthorized or invalid.' };
      }
      if (res.status === 403) {
        return { errorCode: 'PLAN_LIMIT', errorMessage: 'Environmental parameters plan capability is unavailable.' };
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
      console.error('Error submitting FortyGuard environmental task:', err);
      return { errorCode: 'FORTYGUARD_ERROR', errorMessage: 'Network error submitting environmental task to FortyGuard.' };
    }
  }
}

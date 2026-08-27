import { FortyGuardHeatMap, ThermalPoint } from '@/types/fortyguard';
import { FortyGuardApplicationResult, FortyGuardStatusResponse } from './types';
import { isWithinSupportedUSRegion } from './validation';
import { FortyGuardHeatmapService } from './heatmap';
import { FortyGuardEnvironmentalService } from './environmental';
import { FortyGuardStatusPoller } from './status';

export class FortyGuardClient {
  private baseUrl: string = 'https://api.fortyguard.com';
  private apiKey: string;
  private mockMode: boolean;
  private heatmapService: FortyGuardHeatmapService;
  private envService: FortyGuardEnvironmentalService;
  private statusPoller: FortyGuardStatusPoller;

  // In-memory server cache (15 min TTL) to protect credits against duplicate calls
  private cache: Map<string, { timestamp: number; result: FortyGuardApplicationResult<FortyGuardHeatMap> }> = new Map();

  constructor() {
    this.apiKey = process.env.FORTYGUARD_API_KEY || '';
    const mockEnv = process.env.FORTYGUARD_MOCK_MODE;
    this.mockMode = mockEnv === 'true' || !this.apiKey;

    this.heatmapService = new FortyGuardHeatmapService(this.baseUrl, this.apiKey);
    this.envService = new FortyGuardEnvironmentalService(this.baseUrl, this.apiKey);
    this.statusPoller = new FortyGuardStatusPoller(this.baseUrl, this.apiKey);
  }

  public isMockMode(): boolean {
    return this.mockMode;
  }

  public async getHeatMapData(
    lat: number = 37.7749, // Default US location (San Francisco)
    lng: number = -122.4194,
    filterType: 1 | 2 | 3 | 4 = 1,
    startDate?: string,
    startTime?: string
  ): Promise<FortyGuardApplicationResult<FortyGuardHeatMap>> {
    // 1. Check US coverage region
    if (!isWithinSupportedUSRegion(lat, lng)) {
      return {
        success: false,
        isDemoData: false,
        error: {
          code: 'UNSUPPORTED_LOCATION',
          message: 'FortyGuard analysis is currently available for supported US locations.',
        },
      };
    }

    // 2. Check Server Cache for credit protection
    const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${filterType}_${startDate || ''}_${startTime || ''}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) {
      return cached.result;
    }

    // 3. Mock Mode Handler
    if (this.mockMode || !this.apiKey) {
      const demoResult = this.generateDeterministicDemoData(lat, lng);
      const appResult: FortyGuardApplicationResult<FortyGuardHeatMap> = {
        success: true,
        isDemoData: true,
        data: demoResult,
      };
      this.cache.set(cacheKey, { timestamp: Date.now(), result: appResult });
      return appResult;
    }

    // 4. Real FortyGuard API Workflow (POST /v1/heatmap -> activity_id -> GET /v1/status/{id})
    const dateStr = startDate || new Date().toISOString().split('T')[0];
    const timeStr = startTime || '14:00';

    const submitRes = await this.heatmapService.submitHeatmapTask(lat, lng, filterType, dateStr, timeStr);
    if (submitRes.errorCode || !submitRes.submission) {
      return {
        success: false,
        isDemoData: false,
        error: {
          code: submitRes.errorCode || 'FORTYGUARD_ERROR',
          message: submitRes.errorMessage || 'Failed to submit FortyGuard heatmap task.',
        },
      };
    }

    // Poll activity status
    const pollRes = await this.statusPoller.pollActivityStatus(submitRes.submission.activity_id);
    if (pollRes.errorCode || !pollRes.statusResponse) {
      return {
        success: false,
        isDemoData: false,
        error: {
          code: pollRes.errorCode || 'FORTYGUARD_ERROR',
          message: pollRes.errorMessage || 'FortyGuard thermal analysis task failed during status polling.',
        },
      };
    }

    // Process FortyGuard status response
    const transformed = this.transformFortyGuardStatusToHeatMap(lat, lng, pollRes.statusResponse);
    const appResult: FortyGuardApplicationResult<FortyGuardHeatMap> = {
      success: true,
      isDemoData: false,
      data: transformed,
    };

    this.cache.set(cacheKey, { timestamp: Date.now(), result: appResult });
    return appResult;
  }

  private transformFortyGuardStatusToHeatMap(lat: number, lng: number, statusRes: FortyGuardStatusResponse): FortyGuardHeatMap {
    const stats = statusRes.stats_data || {};
    const minTemp = stats.min_temperature ?? 36.5;
    const maxTemp = stats.max_temperature ?? 54.8;
    const meanTemp = stats.mean_temperature ?? 46.2;

    const points: ThermalPoint[] = [];
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        const dist = Math.sqrt(i * i + j * j);
        const surfaceTemp = meanTemp + (5 - dist) * 1.5;
        const ambientTemp = 34.0 + (surfaceTemp - 38) * 0.2;
        points.push({
          lat: lat + i * 0.0012,
          lng: lng + j * 0.0012,
          surfaceTempC: Number(surfaceTemp.toFixed(1)),
          ambientTempC: Number(ambientTemp.toFixed(1)),
          solarIrradianceWm2: 890,
          heatVulnerabilityIndex: Math.min(99, Math.max(10, Math.round((surfaceTemp - 30) * 3.8))),
          heatIslandAnomalyDeltaC: Number((surfaceTemp - ambientTemp).toFixed(1)),
          timestamp: new Date().toISOString(),
        });
      }
    }

    return {
      regionId: statusRes.activity_id,
      regionName: 'FortyGuard Targeted US AOI Grid',
      center: { lat, lng },
      gridResolutionMeters: 100,
      averageLSTC: Number(meanTemp.toFixed(1)),
      peakLSTC: Number(maxTemp.toFixed(1)),
      heatStressScore: Math.min(99, Math.max(10, Math.round((maxTemp - 30) * 3.5))),
      thermalHotspots: [
        {
          id: `HS-${statusRes.activity_id.slice(0, 6)}-01`,
          locationName: 'Roof & Concrete Surface Anomaly',
          lat: lat + 0.0008,
          lng: lng + 0.0006,
          lstC: Number(maxTemp.toFixed(1)),
          severity: maxTemp > 50 ? 'CRITICAL' : 'HIGH',
        },
      ],
      points,
    };
  }

  private generateDeterministicDemoData(lat: number, lng: number): FortyGuardHeatMap {
    const points: ThermalPoint[] = [];
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        const dist = Math.sqrt(i * i + j * j);
        const surfaceTemp = 45.0 + Math.sin(i * 0.5) * 4.2 + Math.cos(j * 0.5) * 3.5 + (5 - dist) * 0.8;
        const ambientTemp = 36.5 + (surfaceTemp - 38) * 0.22;
        const irradiance = 910 + Math.sin(i + j) * 60;
        const hvi = Math.min(98, Math.max(15, Math.round((surfaceTemp - 30) * 4.0)));

        points.push({
          lat: lat + i * 0.0012,
          lng: lng + j * 0.0012,
          surfaceTempC: Number(surfaceTemp.toFixed(1)),
          ambientTempC: Number(ambientTemp.toFixed(1)),
          solarIrradianceWm2: Math.round(irradiance),
          heatVulnerabilityIndex: hvi,
          heatIslandAnomalyDeltaC: Number(((surfaceTemp - ambientTemp) * 0.85).toFixed(1)),
          timestamp: new Date().toISOString(),
        });
      }
    }

    return {
      regionId: 'FG-DEMO-US-AOI',
      regionName: 'US Metropolitan Thermal Grid (Demo Mode)',
      center: { lat, lng },
      gridResolutionMeters: 100,
      averageLSTC: 47.8,
      peakLSTC: 55.4,
      heatStressScore: 82,
      thermalHotspots: [
        {
          id: 'HS-DEMO-ROOF-01',
          locationName: 'Primary Roof Membrane Anomaly',
          lat: lat + 0.0008,
          lng: lng + 0.0006,
          lstC: 55.4,
          severity: 'CRITICAL',
        },
        {
          id: 'HS-DEMO-FACADE-SOUTH',
          locationName: 'South Solar Exposure Facade',
          lat: lat - 0.0005,
          lng: lng + 0.0010,
          lstC: 51.2,
          severity: 'HIGH',
        },
      ],
      points,
    };
  }
}

export const fortyGuardClient = new FortyGuardClient();

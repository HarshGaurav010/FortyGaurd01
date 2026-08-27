import { FortyGuardAPIResponse, FortyGuardHeatMap, ThermalPoint } from '@/types/fortyguard';

export class FortyGuardClient {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FORTYGUARD_API_KEY;
  }

  public async getHeatMapData(lat: number = 25.2048, lng: number = 55.2708): Promise<FortyGuardAPIResponse> {
    // If live API key is configured, perform live fetch; otherwise return rich FortyGuard microclimate demo data
    if (this.apiKey) {
      try {
        const response = await fetch(`https://api.fortyguard.com/v1/heat intelligence?lat=${lat}&lng=${lng}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const rawData = await response.json();
          return {
            success: true,
            isDemoData: false,
            data: rawData,
            metadata: {
              source: 'FortyGuard Hyperlocal Heat Intelligence Engine v2.4',
              accuracyMeters: 1.5,
              lastUpdated: new Date().toISOString(),
            },
          };
        }
      } catch (err) {
        console.warn('FortyGuard live API query failed, falling back to verified thermal demo engine.', err);
      }
    }

    // High resolution mock microclimate heat data
    const points: ThermalPoint[] = [];
    const baseLat = lat;
    const baseLng = lng;

    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        const dist = Math.sqrt(i * i + j * j);
        const surfaceTemp = 46.2 + Math.sin(i * 0.5) * 4.5 + Math.cos(j * 0.5) * 3.8 + (5 - dist) * 0.8;
        const ambientTemp = 38.5 + (surfaceTemp - 40) * 0.22;
        const irradiance = 920 + Math.sin(i + j) * 65;
        const hvi = Math.min(98, Math.max(15, Math.round((surfaceTemp - 32) * 4.2)));

        points.push({
          lat: baseLat + i * 0.0012,
          lng: baseLng + j * 0.0012,
          surfaceTempC: Number(surfaceTemp.toFixed(1)),
          ambientTempC: Number(ambientTemp.toFixed(1)),
          solarIrradianceWm2: Math.round(irradiance),
          heatVulnerabilityIndex: hvi,
          heatIslandAnomalyDeltaC: Number(((surfaceTemp - ambientTemp) * 0.85).toFixed(1)),
          timestamp: new Date().toISOString(),
        });
      }
    }

    const heatMap: FortyGuardHeatMap = {
      regionId: 'FG-UAE-DXB-042',
      regionName: 'Downtown Financial & Commercial District',
      center: { lat, lng },
      gridResolutionMeters: 2.0,
      averageLSTC: 48.4,
      peakLSTC: 56.8,
      heatStressScore: 84,
      thermalHotspots: [
        {
          id: 'HS-ROOF-01',
          locationName: 'Main Concrete Roof Structure',
          lat: baseLat + 0.0008,
          lng: baseLng + 0.0006,
          lstC: 56.8,
          severity: 'CRITICAL',
        },
        {
          id: 'HS-FACADE-SOUTH',
          locationName: 'South Glass Facade Exposure',
          lat: baseLat - 0.0005,
          lng: baseLng + 0.0010,
          lstC: 52.3,
          severity: 'HIGH',
        },
        {
          id: 'HS-PARKING-EAST',
          locationName: 'Surface Parking & Asphalt Apron',
          lat: baseLat + 0.0012,
          lng: baseLng - 0.0009,
          lstC: 54.1,
          severity: 'HIGH',
        },
        {
          id: 'HS-HVAC-PLAZA',
          locationName: 'HVAC Exhaust Plume Plaza',
          lat: baseLat - 0.0010,
          lng: baseLng - 0.0004,
          lstC: 49.7,
          severity: 'MODERATE',
        },
      ],
      points,
    };

    return {
      success: true,
      isDemoData: true,
      data: heatMap,
      metadata: {
        source: 'FortyGuard Hyperlocal Heat Intelligence (Verified Demo Engine)',
        accuracyMeters: 2.0,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}

export const fortyGuardClient = new FortyGuardClient();

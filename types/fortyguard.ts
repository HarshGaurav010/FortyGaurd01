export interface ThermalPoint {
  lat: number;
  lng: number;
  surfaceTempC: number;
  ambientTempC: number;
  solarIrradianceWm2: number;
  heatVulnerabilityIndex: number; // 0 to 100
  heatIslandAnomalyDeltaC: number;
  timestamp: string;
}

export interface FortyGuardHeatMap {
  regionId: string;
  regionName: string;
  center: { lat: number; lng: number };
  gridResolutionMeters: number;
  averageLSTC: number;
  peakLSTC: number;
  heatStressScore: number;
  thermalHotspots: Array<{
    id: string;
    locationName: string;
    lat: number;
    lng: number;
    lstC: number;
    severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  }>;
  points: ThermalPoint[];
}

export interface FortyGuardAPIResponse {
  success: boolean;
  isDemoData: boolean;
  data: FortyGuardHeatMap;
  metadata: {
    source: string;
    accuracyMeters: number;
    lastUpdated: string;
  };
}

export type HeatmapFilterType = 1 | 2 | 3 | 4;

export type HeatmapGranularity = '60m' | '80m' | '100m' | 60 | 80 | 100;

export type HeatmapAnalyticType = 'tcm' | 'time_of_measure' | 'exceedance' | 'persistence';

export type ThresholdDirection = 'above' | 'below';

export type FortyGuardActivityStatus = 'Processing' | 'Completed' | 'Failed';

export interface GeoJSONPolygonAOI {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Polygon';
      coordinates: Array<Array<[number, number]>>; // [[[lng, lat], [lng, lat], ...]]]
    };
    properties: Record<string, any>;
  }>;
}

export interface FortyGuardHeatmapRequestPayload {
  polygon_aoi: GeoJSONPolygonAOI;
  date_time: {
    filter_type: HeatmapFilterType;
    start_date: string; // YYYY-MM-DD
    start_time?: string; // HH:MM
    end_date?: string;   // YYYY-MM-DD
    end_time?: string;   // HH:MM
  };
  granularity: number | string;
  analytic_type?: HeatmapAnalyticType;
  threshold?: number;
  direction?: ThresholdDirection;
}

export interface FortyGuardEnvironmentalRequestPayload {
  polygon_aoi: GeoJSONPolygonAOI;
  date_time: {
    filter_type: HeatmapFilterType;
    start_date: string;
    start_time?: string;
    end_date?: string;
    end_time?: string;
  };
  parameters: string[]; // e.g. ['heat_index', 'apparent_temperature', 'relative_humidity', 'wet_bulb_temperature', 'solar_irradiance']
}

export interface FortyGuardTaskSubmissionResponse {
  activity_id: string;
  status: FortyGuardActivityStatus;
  message?: string;
}

export interface FortyGuardStatusResponse {
  activity_id: string;
  status: FortyGuardActivityStatus;
  progress_pct?: number;
  error?: string;
  map_data?: GeoJSONPolygonAOI;
  stats_data?: {
    min_temperature?: number;
    max_temperature?: number;
    mean_temperature?: number;
    std_deviation?: number;
    units?: string;
    distribution?: Array<{ range: string; count: number }>;
    frequency?: Record<string, number>;
  };
}

export interface FortyGuardEnvironmentalResultResponse {
  activity_id: string;
  status: FortyGuardActivityStatus;
  parameters_data?: Record<string, {
    mean: number;
    min: number;
    max: number;
    units: string;
  }>;
}

export type ApplicationErrorCode =
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'PLAN_LIMIT'
  | 'RATE_LIMITED'
  | 'PROCESSING_TIMEOUT'
  | 'FORTYGUARD_ERROR'
  | 'UNSUPPORTED_LOCATION';

export interface FortyGuardApplicationResult<T> {
  success: boolean;
  isDemoData: boolean;
  data?: T;
  error?: {
    code: ApplicationErrorCode;
    message: string;
    details?: string;
  };
}

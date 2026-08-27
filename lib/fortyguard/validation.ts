import { z } from 'zod';

// US Boundary Check Constants (Bounding box for contiguous US + Hawaii + Alaska)
const US_LAT_MIN = 18.0;
const US_LAT_MAX = 72.0;
const US_LNG_MIN = -170.0;
const US_LNG_MAX = -65.0;

export function isWithinSupportedUSRegion(lat: number, lng: number): boolean {
  return lat >= US_LAT_MIN && lat <= US_LAT_MAX && lng >= US_LNG_MIN && lng <= US_LNG_MAX;
}

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const HeatmapInputSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  filterType: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').default(() => new Date().toISOString().split('T')[0]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM').default('14:00'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  granularity: z.union([z.literal('60m'), z.literal('80m'), z.literal('100m'), z.literal(60), z.literal(80), z.literal(100)]).default(100),
  analyticType: z.enum(['tcm', 'time_of_measure', 'exceedance', 'persistence']).default('tcm'),
  threshold: z.number().optional().default(30),
  direction: z.enum(['above', 'below']).optional().default('above'),
});

export const EnvironmentalInputSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  parameters: z.array(z.string()).min(1).max(3, 'Basic plan limits maximum 3 parameters per call').default([
    'heat_index',
    'apparent_temperature',
    'solar_irradiance',
  ]),
});

export function isClosedPolygon(coordinates: Array<[number, number]>): boolean {
  if (coordinates.length < 4) return false;
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  return Math.abs(first[0] - last[0]) < 0.00001 && Math.abs(first[1] - last[1]) < 0.00001;
}

export function buildClosedGeoJSONPolygon(lat: number, lng: number, sizeDeltaDegrees: number = 0.002): Array<Array<[number, number]>> {
  const half = sizeDeltaDegrees / 2;
  const p1: [number, number] = [lng - half, lat - half];
  const p2: [number, number] = [lng + half, lat - half];
  const p3: [number, number] = [lng + half, lat + half];
  const p4: [number, number] = [lng - half, lat + half];
  const p5: [number, number] = [lng - half, lat - half]; // Closed polygon loop

  return [[p1, p2, p3, p4, p5]];
}

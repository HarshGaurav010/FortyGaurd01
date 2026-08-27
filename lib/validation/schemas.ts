import { z } from 'zod';

export const FortyGuardQuerySchema = z.object({
  lat: z.number().min(-90).max(90).optional().default(25.2048),
  lng: z.number().min(-180).max(180).optional().default(55.2708),
  buildingId: z.string().optional(),
});

export const SimulationInputSchema = z.object({
  buildingId: z.string().optional().default('BLD-DXB-2024-001'),
  roofReflectance: z.number().min(0.1).max(0.98).default(0.85),
  windowFilmSHGC: z.number().min(0.15).max(0.90).default(0.28),
  wallInsulationAddRValue: z.number().min(0).max(50).default(12),
  greenRoofCoveragePct: z.number().min(0).max(100).default(0),
  smartHvacOptimization: z.boolean().default(true),
  thermostatSetpointC: z.number().min(18.0).max(30.0).default(23.5),
});

export const ChatQuerySchema = z.object({
  query: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  buildingId: z.string().optional(),
});

export const AnalysisRequestSchema = z.object({
  buildingId: z.string().optional().default('BLD-DXB-2024-001'),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

import { BuildingProfile, BuildingUseType, RoofType, WindowType } from '@/types/building';

export interface ScenarioLocation {
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

export interface DemoBuildingScenario extends BuildingProfile {
  scenarioId: string;
  conditionDescription: string;
  roofRValue: number;
  location: ScenarioLocation;
}

export const DEMO_BUILDING_SCENARIOS: readonly DemoBuildingScenario[] = Object.freeze([
  {
    id: 'BLD-PHX-2024-001',
    scenarioId: 'desert-commerce-center',
    name: 'Desert Commerce Center',
    address: 'E Camelback Rd, Phoenix, Arizona, USA',
    location: {
      city: 'Phoenix',
      state: 'Arizona',
      country: 'USA',
      lat: 33.4484,
      lng: -112.0740,
    },
    coordinates: {
      lat: 33.4484,
      lng: -112.0740,
    },
    conditionDescription: 'extreme heat / poorer envelope',
    useType: 'COMMERCIAL_OFFICE' as BuildingUseType,
    grossAreaSqFt: 185000,
    floorsCount: 16,
    yearBuilt: 2008,
    orientationDegrees: 165,
    roofType: 'STANDARD_MEMBRANE' as RoofType,
    roofAreaSqFt: 142000,
    roofRValue: 8.5,
    windowToWallRatio: 0.58,
    windowType: 'DOUBLE_STANDARD' as WindowType,
    wallInsulationRValue: 8.5,
    hvacAgeYears: 14,
    hvacEfficiencyCOP: 2.7,
    baselineAnnualEnergykWh: 3840000,
    baselinePeakDemandKW: 1250,
  },
  {
    id: 'BLD-SEA-2024-002',
    scenarioId: 'cascadia-tech-center',
    name: 'Cascadia Tech Center',
    address: '5th Ave, Seattle, Washington, USA',
    location: {
      city: 'Seattle',
      state: 'Washington',
      country: 'USA',
      lat: 47.6062,
      lng: -122.3321,
    },
    coordinates: {
      lat: 47.6062,
      lng: -122.3321,
    },
    conditionDescription: 'efficient building',
    useType: 'COMMERCIAL_OFFICE' as BuildingUseType,
    grossAreaSqFt: 160000,
    floorsCount: 12,
    yearBuilt: 2018,
    orientationDegrees: 180,
    roofType: 'COOL_ROOF' as RoofType,
    roofAreaSqFt: 95000,
    roofRValue: 24,
    windowToWallRatio: 0.32,
    windowType: 'DOUBLE_LOW_E' as WindowType,
    wallInsulationRValue: 20,
    hvacAgeYears: 4,
    hvacEfficiencyCOP: 4.2,
    baselineAnnualEnergykWh: 2240000,
    baselinePeakDemandKW: 720,
  },
  {
    id: 'BLD-MIA-2024-003',
    scenarioId: 'miami-coastal-tower',
    name: 'Miami Coastal Tower',
    address: 'Biscayne Blvd, Miami, Florida, USA',
    location: {
      city: 'Miami',
      state: 'Florida',
      country: 'USA',
      lat: 25.7617,
      lng: -80.1918,
    },
    coordinates: {
      lat: 25.7617,
      lng: -80.1918,
    },
    conditionDescription: 'high solar exposure / high glazing',
    useType: 'COMMERCIAL_OFFICE' as BuildingUseType,
    grossAreaSqFt: 210000,
    floorsCount: 20,
    yearBuilt: 2012,
    orientationDegrees: 135,
    roofType: 'STANDARD_MEMBRANE' as RoofType,
    roofAreaSqFt: 110000,
    roofRValue: 12,
    windowToWallRatio: 0.72,
    windowType: 'SINGLE_PANE' as WindowType,
    wallInsulationRValue: 12,
    hvacAgeYears: 10,
    hvacEfficiencyCOP: 3.1,
    baselineAnnualEnergykWh: 4410000,
    baselinePeakDemandKW: 1400,
  },
  {
    id: 'BLD-DEN-2024-004',
    scenarioId: 'rocky-mountain-business-hub',
    name: 'Rocky Mountain Business Hub',
    address: '17th St, Denver, Colorado, USA',
    location: {
      city: 'Denver',
      state: 'Colorado',
      country: 'USA',
      lat: 39.7392,
      lng: -104.9903,
    },
    coordinates: {
      lat: 39.7392,
      lng: -104.9903,
    },
    conditionDescription: 'moderate/good envelope',
    useType: 'COMMERCIAL_OFFICE' as BuildingUseType,
    grossAreaSqFt: 170000,
    floorsCount: 14,
    yearBuilt: 2015,
    orientationDegrees: 180,
    roofType: 'COOL_ROOF' as RoofType,
    roofAreaSqFt: 100000,
    roofRValue: 20,
    windowToWallRatio: 0.38,
    windowType: 'DOUBLE_LOW_E' as WindowType,
    wallInsulationRValue: 18,
    hvacAgeYears: 7,
    hvacEfficiencyCOP: 3.8,
    baselineAnnualEnergykWh: 2890000,
    baselinePeakDemandKW: 950,
  },
]);

/**
 * Retrieves a deterministic demo scenario by building ID or scenario ID.
 * Returns undefined if no scenario matches the given identifier.
 */
export function getBuildingScenarioById(id: string): DemoBuildingScenario | undefined {
  if (!id) return undefined;
  const normalizedSearch = id.toLowerCase().trim();
  return DEMO_BUILDING_SCENARIOS.find(
    (scenario) =>
      scenario.id.toLowerCase() === normalizedSearch ||
      scenario.scenarioId.toLowerCase() === normalizedSearch
  );
}

/**
 * Helper to retrieve the default fallback scenario (Desert Commerce Center - Phoenix).
 */
export function getDefaultBuildingScenario(): DemoBuildingScenario {
  return DEMO_BUILDING_SCENARIOS[0];
}

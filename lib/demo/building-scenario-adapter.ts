import { BuildingProfile } from '@/types/building';
import { DemoBuildingScenario, getDefaultBuildingScenario } from '@/lib/demo/building-scenarios';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { computeThermalStressReport } from '@/lib/models/building-thermal-model';

/**
 * Adapter that maps a deterministic DemoBuildingScenario to a standard BuildingProfile.
 * Ensures the existing thermal model receives a strictly typed BuildingProfile
 * sourced deterministically from the selected demo scenario.
 * 
 * Sourced fields:
 * - building ID (id)
 * - building name (name)
 * - address & city/state/country (address, coordinates)
 * - latitude / longitude (coordinates.lat, coordinates.lng)
 * - WWR (windowToWallRatio)
 * - roof type (roofType)
 * - roof R-value (roofRValue)
 * - HVAC COP (hvacEfficiencyCOP)
 * - roof area (roofAreaSqFt)
 * - gross floor area (grossAreaSqFt)
 * - floors (floorsCount)
 */
export function scenarioToBuildingProfile(
  scenario?: DemoBuildingScenario | null
): BuildingProfile {
  const source = scenario ?? getDefaultBuildingScenario();

  return {
    id: source.id,
    name: source.name,
    address: source.address,
    coordinates: {
      lat: source.coordinates.lat,
      lng: source.coordinates.lng,
    },
    useType: source.useType,
    grossAreaSqFt: source.grossAreaSqFt,
    floorsCount: source.floorsCount,
    yearBuilt: source.yearBuilt,
    orientationDegrees: source.orientationDegrees,
    roofType: source.roofType,
    roofAreaSqFt: source.roofAreaSqFt,
    roofRValue: source.roofRValue,
    windowToWallRatio: source.windowToWallRatio,
    windowType: source.windowType,
    wallInsulationRValue: source.wallInsulationRValue,
    hvacAgeYears: source.hvacAgeYears,
    hvacEfficiencyCOP: source.hvacEfficiencyCOP,
    baselineAnnualEnergykWh: source.baselineAnnualEnergykWh,
    baselinePeakDemandKW: source.baselinePeakDemandKW,
  };
}

/**
 * Creates a baseline environmental heatmap context aligned with the building's geographic location.
 * Note: These are environmental baseline parameters for demo simulation, distinct from live FortyGuard telemetry.
 */
export function getBaselineHeatMapForScenario(
  scenario: DemoBuildingScenario
): FortyGuardHeatMap {
  const isPhoenix = scenario.id === 'BLD-PHX-2024-001';
  const isMiami = scenario.id === 'BLD-MIA-2024-003';
  const isDenver = scenario.id === 'BLD-DEN-2024-004';

  return {
    regionId: `FG-${scenario.location.city.toUpperCase().slice(0, 3)}-001`,
    regionName: `${scenario.location.city} Metro Area`,
    center: { ...scenario.coordinates },
    gridResolutionMeters: 2.0,
    averageLSTC: isPhoenix ? 48.4 : isMiami ? 42.1 : isDenver ? 36.5 : 31.8,
    peakLSTC: isPhoenix ? 56.8 : isMiami ? 49.6 : isDenver ? 43.2 : 37.4,
    heatStressScore: isPhoenix ? 82 : isMiami ? 74 : isDenver ? 58 : 39,
    thermalHotspots: [],
    points: [],
  };
}

/**
 * Direct execution helper feeding the mapped BuildingProfile into the existing thermal model calculation engine.
 */
export function executeScenarioThermalModel(
  scenario?: DemoBuildingScenario | null,
  customHeatMap?: FortyGuardHeatMap
) {
  const profile = scenarioToBuildingProfile(scenario);
  const heatMap = customHeatMap ?? getBaselineHeatMapForScenario(scenario ?? getDefaultBuildingScenario());
  return computeThermalStressReport(profile, heatMap);
}

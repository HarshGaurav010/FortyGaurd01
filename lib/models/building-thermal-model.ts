import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { DEMO_BUILDING_SCENARIOS } from '@/lib/demo/building-scenarios';

export const DEFAULT_BUILDING_PROFILE: BuildingProfile = DEMO_BUILDING_SCENARIOS[0];

export function computeThermalStressReport(
  building: BuildingProfile,
  heatMap: FortyGuardHeatMap
): BuildingThermalStressReport {
  // Compute facade solar irradiance factor based on orientation
  const orientationRad = (building.orientationDegrees * Math.PI) / 180;
  const solarFactor = 1 + Math.max(0, Math.cos(orientationRad - Math.PI)); // Peak if facing south (180 deg)

  const roofLST = heatMap.peakLSTC;
  const avgSurface = heatMap.averageLSTC;

  // Thermal stress score out of 100
  const roofWeight = (roofLST - 35) * 2.2;
  const hvacAgeWeight = building.hvacAgeYears * 1.8;
  const wwrWeight = building.windowToWallRatio * 35;
  const rawScore = Math.min(99, Math.max(20, Math.round(roofWeight * 0.4 + hvacAgeWeight * 0.3 + wwrWeight * 0.3)));

  let category: BuildingThermalStressReport['stressCategory'] = 'MODERATE';
  if (rawScore > 85) category = 'CRITICAL';
  else if (rawScore > 75) category = 'EXTREME';
  else if (rawScore > 60) category = 'HIGH';
  else if (rawScore < 40) category = 'OPTIMAL';

  const facadeGain = Math.round(building.grossAreaSqFt * building.windowToWallRatio * 0.0085 * solarFactor * (avgSurface - 24));
  const roofGain = Math.round(building.roofAreaSqFt * 0.024 * (roofLST - 24));
  const annualWasteCost = Math.round((facadeGain + roofGain) * 260 * 0.14); // $0.14/kWh average rate
  const carbonTons = Number(((building.baselineAnnualEnergykWh * 0.48) / 1000).toFixed(1));

  const normalizedSolarExposure = (solarFactor - 1) / (2 - 1);
  const solarExposureRating = Number(
    (5 + normalizedSolarExposure * 5).toFixed(1)
  );

  return {
    buildingId: building.id,
    thermalStressScore: rawScore,
    stressCategory: category,
    facadeHeatGainKW: facadeGain,
    roofHeatGainKW: roofGain,
    solarExposureRating,
    urbanHeatIslandImpactDeltaC: Number((heatMap.peakLSTC - heatMap.averageLSTC).toFixed(1)),
    annualCoolingWasteCostUSD: annualWasteCost,
    carbonFootprintTonsCO2: carbonTons,
    vulnerabilities: [
      {
        zone: 'ROOF',
        title: 'Uninsulated Dark Roof Membrane',
        description: `Roof LST reaches ${roofLST}°C under peak solar load, causing severe heat absorption into top 3 floors.`,
        heatGainContributionPct: 38,
        severity: roofLST > 50 ? 'CRITICAL' : roofLST > 42 ? 'HIGH' : 'MEDIUM',
      },
      {
        zone: 'SOUTH_FACADE',
        title: 'High SHGC Double Glazing',
        description: `South & South-East facades receive ${Math.round(880 * solarFactor)} W/m² solar load with ${Math.round(building.windowToWallRatio * 100)}% window-to-wall ratio.`,
        heatGainContributionPct: 32,
        severity: 'HIGH',
      },
      {
        zone: 'HVAC',
        title: `Degraded HVAC Efficiency (COP ${building.hvacEfficiencyCOP})`,
        description: `Chillers are ${building.hvacAgeYears} years old, consuming 34% excess electricity to meet peak heat rejection demands.`,
        heatGainContributionPct: 18,
        severity: 'HIGH',
      },
      {
        zone: 'WINDOWS',
        title: 'Lack of Solar Tinting & External Shading',
        description: 'Perimeter office zones experience severe thermal glare and 4.2°C higher local radiant temperature.',
        heatGainContributionPct: 12,
        severity: 'MEDIUM',
      },
    ],
  };
}

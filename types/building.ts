export type BuildingUseType =
  | 'COMMERCIAL_OFFICE'
  | 'RESIDENTIAL_MULTI'
  | 'RETAIL'
  | 'EDUCATIONAL'
  | 'HOSPITALITY'
  | 'INDUSTRIAL';

export type RoofType = 'STANDARD_MEMBRANE' | 'METAL' | 'CONCRETE_SLAB' | 'COOL_ROOF' | 'GREEN_ROOF';
export type WindowType = 'SINGLE_PANE' | 'DOUBLE_STANDARD' | 'DOUBLE_LOW_E' | 'TRIPLE_PANE';

export interface BuildingProfile {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  useType: BuildingUseType;
  grossAreaSqFt: number;
  floorsCount: number;
  yearBuilt: number;
  orientationDegrees: number; // 0 = North, 90 = East, 180 = South, 270 = West
  roofType: RoofType;
  roofAreaSqFt: number;
  windowToWallRatio: number; // 0.1 to 0.8
  windowType: WindowType;
  wallInsulationRValue: number;
  hvacAgeYears: number;
  hvacEfficiencyCOP: number;
  baselineAnnualEnergykWh: number;
  baselinePeakDemandKW: number;
}

export interface BuildingThermalStressReport {
  buildingId: string;
  thermalStressScore: number; // 0 - 100 (100 = extreme stress)
  stressCategory: 'OPTIMAL' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'CRITICAL';
  facadeHeatGainKW: number;
  roofHeatGainKW: number;
  solarExposureRating: number; // 0 - 10
  urbanHeatIslandImpactDeltaC: number;
  annualCoolingWasteCostUSD: number;
  carbonFootprintTonsCO2: number;
  vulnerabilities: Array<{
    zone: 'ROOF' | 'SOUTH_FACADE' | 'WEST_FACADE' | 'WINDOWS' | 'HVAC';
    title: string;
    description: string;
    heatGainContributionPct: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
}

import { RetrofitIntervention } from '@/types/retrofit';
import { BuildingProfile } from '@/types/building';

export const CATALOG_RETROFITS: RetrofitIntervention[] = [
  {
    id: 'RET-01-COOL-ROOF',
    category: 'COOL_ROOF',
    name: 'High-Albedo Cool Roof Coating (SRI 108)',
    shortDescription: 'Elastomeric solar reflective coating applied to roof membrane to reflect 88% solar radiation.',
    detailedSpecs: 'High-reflectance white acrylic coating with Solar Reflectance Index (SRI) of 108. Reduces peak roof surface temperature from 56.8°C down to 32.1°C.',
    estCostPerSqFt: 3.50,
    estTotalCostUSD: 49700,
    expectedCoolingEnergyReductionPct: 14.5,
    expectedTempReductionC: 8.2,
    expectedAnnualSavingsUSD: 31200,
    paybackPeriodYears: 1.6,
    lifespanYears: 15,
    carbonOffsetTonsPerYear: 106.8,
    roi20YearPct: 825,
    implementationEase: 'EASY',
    recommendedRank: 1,
    iconName: 'SunMedium',
  },
  {
    id: 'RET-02-WINDOW-FILM',
    category: 'WINDOW_FILM',
    name: 'Spectrally Selective Nano-Ceramic Window Film',
    shortDescription: 'Rejects 78% solar heat gain while preserving 70% visible light transmission.',
    detailedSpecs: 'Applied to interior/exterior glass surfaces. SHGC reduced from 0.65 to 0.22. Prevents hot spot uncomfortable perimeter zones.',
    estCostPerSqFt: 6.20,
    estTotalCostUSD: 66500,
    expectedCoolingEnergyReductionPct: 12.8,
    expectedTempReductionC: 4.5,
    expectedAnnualSavingsUSD: 27500,
    paybackPeriodYears: 2.4,
    lifespanYears: 12,
    carbonOffsetTonsPerYear: 94.2,
    roi20YearPct: 560,
    implementationEase: 'EASY',
    recommendedRank: 2,
    iconName: 'ShieldCheck',
  },
  {
    id: 'RET-03-EXTERIOR-INSULATION',
    category: 'WALL_INSULATION',
    name: 'EIFS Exterior Wall Thermal Insulation (R-18)',
    shortDescription: 'Exterior continuous insulation barrier eliminating thermal bridging across facade concrete.',
    detailedSpecs: 'Expanded polystyrene (EPS) board system with synthetic stucco finish. Increases wall thermal resistance from R-8.5 to R-26.5.',
    estCostPerSqFt: 14.00,
    estTotalCostUSD: 142000,
    expectedCoolingEnergyReductionPct: 11.2,
    expectedTempReductionC: 3.8,
    expectedAnnualSavingsUSD: 24100,
    paybackPeriodYears: 5.9,
    lifespanYears: 25,
    carbonOffsetTonsPerYear: 82.5,
    roi20YearPct: 240,
    implementationEase: 'COMPLEX',
    recommendedRank: 4,
    iconName: 'Layers',
  },
  {
    id: 'RET-04-GREEN-ROOF',
    category: 'GREEN_INFRASTRUCTURE',
    name: 'Extensive Biosolar Green Roof Infrastructure',
    shortDescription: 'Sedum vegetation layer providing evapotranspiration cooling, rainwater attenuation & thermal mass.',
    detailedSpecs: '4-inch engineered soil substrate with drought-tolerant sedum varieties. Drops roof surface temperature down to near-ambient.',
    estCostPerSqFt: 18.50,
    estTotalCostUSD: 198000,
    expectedCoolingEnergyReductionPct: 16.2,
    expectedTempReductionC: 9.5,
    expectedAnnualSavingsUSD: 34800,
    paybackPeriodYears: 5.7,
    lifespanYears: 30,
    carbonOffsetTonsPerYear: 128.4,
    roi20YearPct: 252,
    implementationEase: 'COMPLEX',
    recommendedRank: 5,
    iconName: 'TreeSprout',
  },
  {
    id: 'RET-05-SMART-HVAC',
    category: 'SMART_HVAC',
    name: 'AI Predictive HVAC Optimization & Variable Speed Drives',
    shortDescription: 'AI-driven dynamic chiller sequencing, occupancy load prediction & delta-T optimization.',
    detailedSpecs: 'Integrates FortyGuard microclimate forecasts into BMS thermostat setpoint automation and variable primary pumping speed controllers.',
    estCostPerSqFt: 2.10,
    estTotalCostUSD: 38850,
    expectedCoolingEnergyReductionPct: 15.8,
    expectedTempReductionC: 2.1,
    expectedAnnualSavingsUSD: 33900,
    paybackPeriodYears: 1.1,
    lifespanYears: 10,
    carbonOffsetTonsPerYear: 116.3,
    roi20YearPct: 910,
    implementationEase: 'MODERATE',
    recommendedRank: 3,
    iconName: 'Cpu',
  },
];

export function getRecommendedRetrofits(building: BuildingProfile): RetrofitIntervention[] {
  // Rank interventions according to building specific characteristics
  return CATALOG_RETROFITS.map((item) => {
    let costMultiplier = 1.0;
    if (item.category === 'COOL_ROOF') {
      item.estTotalCostUSD = Math.round(building.roofAreaSqFt * item.estCostPerSqFt);
    } else if (item.category === 'WINDOW_FILM') {
      const windowArea = building.grossAreaSqFt * building.windowToWallRatio * 0.4;
      item.estTotalCostUSD = Math.round(windowArea * item.estCostPerSqFt);
    } else if (item.category === 'SMART_HVAC') {
      item.estTotalCostUSD = Math.round(building.grossAreaSqFt * item.estCostPerSqFt);
    }
    
    // Recalculate annual savings
    item.expectedAnnualSavingsUSD = Math.round((building.baselineAnnualEnergykWh * (item.expectedCoolingEnergyReductionPct / 100)) * 0.14);
    item.paybackPeriodYears = Number((item.estTotalCostUSD / item.expectedAnnualSavingsUSD).toFixed(1));
    item.roi20YearPct = Math.round(((item.expectedAnnualSavingsUSD * 20 - item.estTotalCostUSD) / item.estTotalCostUSD) * 100);
    return item;
  }).sort((a, b) => a.paybackPeriodYears - b.paybackPeriodYears);
}

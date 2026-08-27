export type RetrofitCategory =
  | 'COOL_ROOF'
  | 'WINDOW_FILM'
  | 'WALL_INSULATION'
  | 'GREEN_INFRASTRUCTURE'
  | 'SMART_HVAC'
  | 'SOLAR_SHADING';

export interface RetrofitIntervention {
  id: string;
  category: RetrofitCategory;
  name: string;
  shortDescription: string;
  detailedSpecs: string;
  estCostPerSqFt: number;
  estTotalCostUSD: number;
  expectedCoolingEnergyReductionPct: number;
  expectedTempReductionC: number;
  expectedAnnualSavingsUSD: number;
  paybackPeriodYears: number;
  lifespanYears: number;
  carbonOffsetTonsPerYear: number;
  roi20YearPct: number;
  implementationEase: 'EASY' | 'MODERATE' | 'COMPLEX';
  recommendedRank: number;
  iconName: string;
}

export interface RetrofitComparisonMatrix {
  buildingId: string;
  interventions: RetrofitIntervention[];
  combinedPackage: {
    packageName: string;
    totalCostUSD: number;
    annualSavingsUSD: number;
    combinedEnergyReductionPct: number;
    overallPaybackYears: number;
    overall20YrROIPct: number;
    totalCarbonOffsetTons20Yr: number;
  };
}

import { CENTRAL_RETROFIT_ASSUMPTIONS } from '../retrofit/assumptions';

export interface ROICalculationInput {
  retrofitCostUSD: number;
  energyReductionPct: number;
  baselineAnnualkWh: number;
  electricityRateUSD?: number;
  coolingSharePct?: number;
}

export interface ROICalculationResult {
  annualCoolingEnergySavedkWh: number;
  annualMonetarySavingsUSD: number;
  fiveYearSavingsUSD: number;
  tenYearSavingsUSD: number;
  twentyYearNPVUSD: number;
  simplePaybackYears: number;
  assumptionsUsed: {
    electricityRateUSD: number;
    coolingSharePct: number;
    discountRatePct: number;
    escalationRatePct: number;
  };
}

export function calculateRetrofitROI(input: ROICalculationInput): ROICalculationResult {
  const rate = input.electricityRateUSD ?? CENTRAL_RETROFIT_ASSUMPTIONS.defaultElectricityRateUSDPerKWh;
  const coolingShare = input.coolingSharePct ?? CENTRAL_RETROFIT_ASSUMPTIONS.coolingEnergyShareOfTotalBuildingPct;
  const discountRate = CENTRAL_RETROFIT_ASSUMPTIONS.discountRatePct;
  const escalationRate = CENTRAL_RETROFIT_ASSUMPTIONS.annualElectricityPriceEscalationPct;

  // 1. Annual Energy Savings (kWh)
  const coolingBaselinekWh = input.baselineAnnualkWh * coolingShare;
  const annualSavedkWh = Math.round(coolingBaselinekWh * (input.energyReductionPct / 100));

  // 2. Annual Monetary Savings ($)
  const annualMonetarySavingsUSD = Math.round(annualSavedkWh * rate);

  // 3. Simple Payback (Years)
  const simplePaybackYears =
    annualMonetarySavingsUSD > 0 ? Number((input.retrofitCostUSD / annualMonetarySavingsUSD).toFixed(1)) : 0;

  // 4. Multi-Year Savings with utility price escalation
  let cumulative5Yr = 0;
  let cumulative10Yr = 0;
  let npv20Yr = -input.retrofitCostUSD;

  for (let yr = 1; yr <= 20; yr++) {
    const yrSavings = annualMonetarySavingsUSD * Math.pow(1 + escalationRate, yr - 1);
    if (yr <= 5) cumulative5Yr += yrSavings;
    if (yr <= 10) cumulative10Yr += yrSavings;

    npv20Yr += yrSavings / Math.pow(1 + discountRate, yr);
  }

  return {
    annualCoolingEnergySavedkWh: annualSavedkWh,
    annualMonetarySavingsUSD,
    fiveYearSavingsUSD: Math.round(cumulative5Yr),
    tenYearSavingsUSD: Math.round(cumulative10Yr),
    twentyYearNPVUSD: Math.round(npv20Yr),
    simplePaybackYears,
    assumptionsUsed: {
      electricityRateUSD: rate,
      coolingSharePct: coolingShare,
      discountRatePct: discountRate,
      escalationRatePct: escalationRate,
    },
  };
}

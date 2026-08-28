export interface GlobalAssumptionsConfig {
  defaultElectricityRateUSDPerKWh: number;
  coolingEnergyShareOfTotalBuildingPct: number;
  discountRatePct: number;
  annualElectricityPriceEscalationPct: number;
  costDisclaimerLabel: string;
  disclaimers: string[];
}

export const CENTRAL_RETROFIT_ASSUMPTIONS: GlobalAssumptionsConfig = {
  defaultElectricityRateUSDPerKWh: 0.14, // Commercial average grid electricity cost per kWh
  coolingEnergyShareOfTotalBuildingPct: 0.55, // 55% of office total energy goes to HVAC cooling
  discountRatePct: 0.05, // 5% NPV discount rate
  annualElectricityPriceEscalationPct: 0.03, // 3% annual electricity tariff inflation
  costDisclaimerLabel: 'Based on configurable assumptions & regional market averages',
  disclaimers: [
    'Retrofit cost estimates are illustrative ranges based on typical commercial building unit costs.',
    'Actual contractor quotes will vary by regional labor rates, structural accessibility, and material choices.',
    'Energy reduction percentages represent modeled potential cooling load drops under typical summer climate stress.',
    'Financial payback estimates assume constant building operating hours and standard utility escalation rates.',
  ],
};

// Unit cost & energy impact assumptions per retrofit type
export const RETROFIT_UNIT_ASSUMPTIONS = {
  EXTERNAL_SHADING: {
    minCostPerSqFtWindow: 12.0,
    maxCostPerSqFtWindow: 22.0,
    minEnergyCutPct: 12.0,
    maxEnergyCutPct: 17.0,
    tempDropC: 4.5,
    unitLabel: '$12 – $22 / sq ft window facade area',
  },
  ROOF_INSULATION: {
    minCostPerSqFtRoof: 5.5,
    maxCostPerSqFtRoof: 11.0,
    minEnergyCutPct: 10.0,
    maxEnergyCutPct: 15.0,
    tempDropC: 6.0,
    unitLabel: '$5.50 – $11.00 / sq ft roof area',
  },
  COOL_ROOF: {
    minCostPerSqFtRoof: 3.0,
    maxCostPerSqFtRoof: 5.5,
    minEnergyCutPct: 13.0,
    maxEnergyCutPct: 18.0,
    tempDropC: 8.5,
    unitLabel: '$3.00 – $5.50 / sq ft roof area',
  },
  SOLAR_GLAZING: {
    minCostPerSqFtWindow: 5.5,
    maxCostPerSqFtWindow: 9.5,
    minEnergyCutPct: 11.0,
    maxEnergyCutPct: 16.0,
    tempDropC: 4.0,
    unitLabel: '$5.50 – $9.50 / sq ft window area',
  },
  HVAC_UPGRADE: {
    minCostPerSqFtGross: 1.8,
    maxCostPerSqFtGross: 3.5,
    minEnergyCutPct: 14.0,
    maxEnergyCutPct: 20.0,
    tempDropC: 2.5,
    unitLabel: '$1.80 – $3.50 / sq ft gross building area',
  },
  VEGETATION: {
    minCostPerSqFtRoof: 16.0,
    maxCostPerSqFtRoof: 28.0,
    minEnergyCutPct: 14.0,
    maxEnergyCutPct: 21.0,
    tempDropC: 9.0,
    unitLabel: '$16.00 – $28.00 / sq ft roof area',
  },
};

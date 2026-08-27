import { SimulationResult, WhatIfSimulationInput } from '@/types/analysis';
import { BuildingProfile } from '@/types/building';

export function runWhatIfSimulation(
  building: BuildingProfile,
  input: WhatIfSimulationInput
): SimulationResult {
  // Base energy in kWh
  const basekWh = building.baselineAnnualEnergykWh;
  
  // Calculate individual reduction components
  // 1. Roof reflectance improvement (base reflectance 0.2 vs input)
  const roofDelta = Math.max(0, input.roofReflectance - 0.2);
  const roofSavingsPct = roofDelta * 18.5; // up to 14% energy savings for high albedo

  // 2. Window Film SHGC improvement (base SHGC 0.65 vs input)
  const shgcDelta = Math.max(0, 0.65 - input.windowFilmSHGC);
  const windowSavingsPct = shgcDelta * 22.0;

  // 3. Wall Insulation R-Value addition
  const insulationSavingsPct = Math.min(12, input.wallInsulationAddRValue * 0.45);

  // 4. Green roof evapotranspiration benefit
  const greenRoofSavingsPct = (input.greenRoofCoveragePct / 100) * 15.0;

  // 5. Smart HVAC optimization flag
  const hvacSavingsPct = input.smartHvacOptimization ? 14.0 : 0;

  // 6. Thermostat setpoint (each 1°C increase saves ~6.5% cooling energy)
  const setpointDelta = Math.max(0, input.thermostatSetpointC - 22.0);
  const setpointSavingsPct = setpointDelta * 6.5;

  // Total compound savings calculation
  const totalReductionPct = Math.min(
    48.0, // maximum practical building envelope limit
    roofSavingsPct + windowSavingsPct + insulationSavingsPct + greenRoofSavingsPct + hvacSavingsPct + setpointSavingsPct
  );

  const energySavedkWh = Math.round(basekWh * (totalReductionPct / 100));
  const simulatedkWh = basekWh - energySavedkWh;
  const annualSavingsUSD = Math.round(energySavedkWh * 0.14); // $0.14 / kWh

  // Capital Expenditure (CapEx) Estimation
  const roofCapex = input.roofReflectance > 0.6 ? building.roofAreaSqFt * 3.5 : 0;
  const windowCapex = input.windowFilmSHGC < 0.4 ? building.grossAreaSqFt * building.windowToWallRatio * 0.4 * 6.2 : 0;
  const insulationCapex = input.wallInsulationAddRValue > 5 ? building.grossAreaSqFt * 0.6 * 12.0 : 0;
  const greenRoofCapex = (input.greenRoofCoveragePct / 100) * building.roofAreaSqFt * 18.5;
  const hvacCapex = input.smartHvacOptimization ? building.grossAreaSqFt * 0.22 : 0;

  const totalCapexUSD = Math.round(roofCapex + windowCapex + insulationCapex + greenRoofCapex + hvacCapex);
  const paybackYears = annualSavingsUSD > 0 ? Number((totalCapexUSD / annualSavingsUSD).toFixed(1)) : 0;

  // 20 Year Net Present Value (NPV) with 5% discount rate & 3% annual electricity escalation
  let npv = -totalCapexUSD;
  const discountRate = 0.05;
  const escalationRate = 0.03;

  for (let year = 1; year <= 20; year++) {
    const yearSavings = annualSavingsUSD * Math.pow(1 + escalationRate, year - 1);
    npv += yearSavings / Math.pow(1 + discountRate, year);
  }

  // Monthly breakdown for charts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalMultipliers = [0.55, 0.6, 0.75, 0.95, 1.25, 1.45, 1.6, 1.55, 1.35, 1.05, 0.75, 0.6];
  const monthlyTotalFactor = seasonalMultipliers.reduce((a, b) => a + b, 0);

  const monthlyBreakdown = monthNames.map((month, i) => {
    const factor = seasonalMultipliers[i] / monthlyTotalFactor;
    const mBase = Math.round(basekWh * factor);
    const mSim = Math.round(simulatedkWh * factor);
    const mSavingsUSD = Math.round((mBase - mSim) * 0.14);
    return {
      month,
      baselinekWh: mBase,
      simulatedkWh: mSim,
      savingsUSD: mSavingsUSD,
    };
  });

  return {
    input,
    baselineEnergykWh: basekWh,
    simulatedEnergykWh: simulatedkWh,
    energySavedkWh,
    energySavedPct: Number(totalReductionPct.toFixed(1)),
    peakDemandReductionKW: Math.round(building.baselinePeakDemandKW * (totalReductionPct / 100) * 0.85),
    indoorSurfaceTempDropC: Number((totalReductionPct * 0.14).toFixed(1)),
    annualCostSavingsUSD: annualSavingsUSD,
    capitalExpenditureUSD: totalCapexUSD,
    paybackPeriodYears: paybackYears,
    twentyYearNPVUSD: Math.round(npv),
    monthlyBreakdown,
  };
}

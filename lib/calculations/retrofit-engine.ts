import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { RetrofitComparisonMatrix, RetrofitIntervention } from '@/types/retrofit';
import { getRecommendedRetrofits } from './thermal-stress-calculator';
import { runWhatIfSimulation } from './roi-calculator';

export function generateRetrofitRecommendations(
  building: BuildingProfile,
  report?: BuildingThermalStressReport,
  heatMap?: FortyGuardHeatMap
): RetrofitComparisonMatrix {
  // 1. Get base catalog scaled to building footprint using single source of truth
  const baseInterventions = getRecommendedRetrofits(building);

  // 2. Adjust priority ranking based on specific building thermal vulnerabilities
  const rankedInterventions = baseInterventions.map((item) => {
    let vulnerabilityWeight = 1.0;

    if (report?.vulnerabilities) {
      for (const vuln of report.vulnerabilities) {
        const isCritical = vuln.severity === 'CRITICAL';
        const isHigh = vuln.severity === 'HIGH';

        if (vuln.zone === 'ROOF' && (item.category === 'COOL_ROOF' || item.category === 'GREEN_INFRASTRUCTURE')) {
          vulnerabilityWeight += isCritical ? 0.4 : isHigh ? 0.25 : 0.1;
        } else if ((vuln.zone === 'SOUTH_FACADE' || vuln.zone === 'WINDOWS') && item.category === 'WINDOW_FILM') {
          vulnerabilityWeight += isCritical ? 0.35 : isHigh ? 0.2 : 0.1;
        } else if (vuln.zone === 'HVAC' && item.category === 'SMART_HVAC') {
          vulnerabilityWeight += isCritical ? 0.3 : isHigh ? 0.2 : 0.1;
        }
      }
    }

    // Weight score combines payback efficiency with vulnerability relevance
    const priorityScore = (10 / (item.paybackPeriodYears || 1)) * vulnerabilityWeight;

    return {
      ...item,
      priorityScore,
    };
  });

  // Sort by weighted priority score descending
  rankedInterventions.sort((a, b) => b.priorityScore - a.priorityScore);

  // Re-assign 1-based ranks
  const finalInterventions: RetrofitIntervention[] = rankedInterventions.map((item, index) => {
    const { priorityScore, ...rest } = item;
    return {
      ...rest,
      recommendedRank: index + 1,
    };
  });

  // 3. Compute Combined Optimal Package (Top 3 interventions: Cool Roof, Window Film, Smart HVAC)
  const topPackageItems = finalInterventions.slice(0, 3);

  const totalCostUSD = topPackageItems.reduce((sum, item) => sum + item.estTotalCostUSD, 0);
  const annualSavingsUSD = topPackageItems.reduce((sum, item) => sum + item.expectedAnnualSavingsUSD, 0);

  // Run simulation engine for precise compound physics modeling
  const simResult = runWhatIfSimulation(building, {
    buildingId: building.id,
    roofReflectance: 0.88,
    windowFilmSHGC: 0.24,
    wallInsulationAddRValue: 0,
    greenRoofCoveragePct: 0,
    smartHvacOptimization: true,
    thermostatSetpointC: 22.5,
  });

  const overallPaybackYears = annualSavingsUSD > 0 ? Number((totalCostUSD / annualSavingsUSD).toFixed(1)) : 0;
  const overall20YrROIPct = totalCostUSD > 0 ? Math.round(((annualSavingsUSD * 20 - totalCostUSD) / totalCostUSD) * 100) : 0;
  const totalCarbonOffset = topPackageItems.reduce((sum, item) => sum + item.carbonOffsetTonsPerYear, 0) * 20;

  return {
    buildingId: building.id,
    interventions: finalInterventions,
    combinedPackage: {
      packageName: 'Comprehensive High-Impact Thermal Retrofit Package',
      totalCostUSD,
      annualSavingsUSD,
      combinedEnergyReductionPct: simResult.energySavedPct,
      overallPaybackYears,
      overall20YrROIPct,
      totalCarbonOffsetTons20Yr: Math.round(totalCarbonOffset),
    },
  };
}

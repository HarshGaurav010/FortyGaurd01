import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { RetrofitOption, RetrofitRecommendation, RetrofitRoadmap } from './types';
import { FULL_RETROFIT_CATALOG } from './catalog';
import { RETROFIT_UNIT_ASSUMPTIONS, CENTRAL_RETROFIT_ASSUMPTIONS } from './assumptions';
import { computeRetrofitScore } from './ranking';
import { calculateRetrofitROI } from '../calculations/roi';
import { formatNumber } from '@/lib/utils/formatters';

export class RetrofitRecommendationEngine {
  public generateRecommendations(
    building: BuildingProfile,
    report?: BuildingThermalStressReport,
    heatMap?: FortyGuardHeatMap,
    electricityRateUSD: number = CENTRAL_RETROFIT_ASSUMPTIONS.defaultElectricityRateUSDPerKWh
  ): RetrofitRecommendation[] {
    const windowAreaSqFt = building.grossAreaSqFt * building.windowToWallRatio * 0.4;
    const roofAreaSqFt = building.roofAreaSqFt;
    const grossAreaSqFt = building.grossAreaSqFt;
    const baselinekWh = building.baselineAnnualEnergykWh;

    const vulnerabilities = report?.vulnerabilities || [];

    const rawRecommendations = FULL_RETROFIT_CATALOG.map((option) => {
      // 1. Calculate dynamic cost range for this specific building footprint
      let minCost = 0;
      let maxCost = 0;

      switch (option.id) {
        case 'EXTERNAL_SHADING':
          minCost = windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.EXTERNAL_SHADING.minCostPerSqFtWindow;
          maxCost = windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.EXTERNAL_SHADING.maxCostPerSqFtWindow;
          break;
        case 'ROOF_INSULATION':
          minCost = roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.ROOF_INSULATION.minCostPerSqFtRoof;
          maxCost = roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.ROOF_INSULATION.maxCostPerSqFtRoof;
          break;
        case 'COOL_ROOF':
          minCost = roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.COOL_ROOF.minCostPerSqFtRoof;
          maxCost = roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.COOL_ROOF.maxCostPerSqFtRoof;
          break;
        case 'SOLAR_GLAZING':
          minCost = windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.SOLAR_GLAZING.minCostPerSqFtWindow;
          maxCost = windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.SOLAR_GLAZING.maxCostPerSqFtWindow;
          break;
        case 'HVAC_UPGRADE':
          minCost = grossAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.HVAC_UPGRADE.minCostPerSqFtGross;
          maxCost = grossAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.HVAC_UPGRADE.maxCostPerSqFtGross;
          break;
        case 'VEGETATION':
          minCost = roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.VEGETATION.minCostPerSqFtRoof;
          maxCost = roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.VEGETATION.maxCostPerSqFtRoof;
          break;
      }

      minCost = Math.round(minCost);
      maxCost = Math.round(maxCost);

      const optionWithCosts: RetrofitOption = {
        ...option,
        estimatedCostRange: {
          ...option.estimatedCostRange,
          minUSD: minCost,
          maxUSD: maxCost,
        },
      };

      // 2. Match thermal weaknesses & compute explanation
      const matchedVulns = vulnerabilities.filter((v) =>
        option.applicableWeaknesses.some(
          (wKey) => v.zone.includes(wKey) || v.title.toUpperCase().includes(wKey) || v.description.toUpperCase().includes(wKey)
        )
      );

      let reason = '';
      if (matchedVulns.length > 0) {
        const topVuln = matchedVulns[0];
        reason = `${topVuln.title} (${topVuln.zone} Zone, ${topVuln.severity} severity) contributes ${topVuln.heatGainContributionPct}% of total building heat gain.`;
      } else if (option.id === 'COOL_ROOF' || option.id === 'ROOF_INSULATION') {
        reason = `Roof surface peak temperature reaches ${heatMap?.peakLSTC || 56.8}°C under high solar irradiance.`;
      } else if (option.id === 'EXTERNAL_SHADING' || option.id === 'SOLAR_GLAZING') {
        reason = `South-East facade orientation receives elevated solar radiation with ${Math.round(building.windowToWallRatio * 100)}% glass coverage.`;
      } else {
        reason = `HVAC chillers are ${building.hvacAgeYears} years old operating at COP ${building.hvacEfficiencyCOP}, consuming excess electricity.`;
      }

      // 3. Compute ROI & Payback Range using central ROI engine
      const roiMin = calculateRetrofitROI({
        retrofitCostUSD: minCost,
        energyReductionPct: option.energyImpactRange.minReductionPct,
        baselineAnnualkWh: baselinekWh,
        electricityRateUSD: electricityRateUSD,
      });

      const roiMax = calculateRetrofitROI({
        retrofitCostUSD: maxCost,
        energyReductionPct: option.energyImpactRange.maxReductionPct,
        baselineAnnualkWh: baselinekWh,
        electricityRateUSD: electricityRateUSD,
      });

      // 4. Score option
      const avgCost = (minCost + maxCost) / 2;
      const avgPayback = (roiMin.simplePaybackYears + roiMax.simplePaybackYears) / 2;

      const score = computeRetrofitScore(optionWithCosts, matchedVulns.length + 1, avgPayback, avgCost);

      return {
        retrofit: optionWithCosts,
        priorityRank: 0,
        priorityLabel: score > 75 ? 'HIGH' : score > 55 ? 'MEDIUM' : ('LOW' as any),
        score,
        reason,
        thermalImpact: option.thermalImpact,
        estimatedEnergyImpact: {
          minPct: option.energyImpactRange.minReductionPct,
          maxPct: option.energyImpactRange.maxReductionPct,
          formattedRange: `${option.energyImpactRange.minReductionPct}–${option.energyImpactRange.maxReductionPct}%`,
        },
        estimatedCostUSD: {
          min: minCost,
          max: maxCost,
          formattedRange: `$${formatNumber(minCost)} – $${formatNumber(maxCost)}`,
        },
        estimatedAnnualSavingsUSD: {
          min: roiMin.annualMonetarySavingsUSD,
          max: roiMax.annualMonetarySavingsUSD,
          formattedRange: `$${formatNumber(roiMin.annualMonetarySavingsUSD)} – $${formatNumber(roiMax.annualMonetarySavingsUSD)}/yr`,
        },
        estimatedPaybackYears: {
          min: roiMin.simplePaybackYears,
          max: roiMax.simplePaybackYears,
          formattedRange: `${roiMin.simplePaybackYears} – ${roiMax.simplePaybackYears} yrs`,
        },
        confidenceNote: 'Modeled estimate based on building profile & FortyGuard surface telemetry',
      };
    });

    // Sort by total score descending
    rawRecommendations.sort((a, b) => b.score - a.score);

    // Assign 1-based priority ranks
    return rawRecommendations.map((item, idx) => ({
      ...item,
      priorityRank: idx + 1,
    }));
  }

  public generateRoadmap(recommendations: RetrofitRecommendation[], building: BuildingProfile): RetrofitRoadmap {
    const topSteps = recommendations.slice(0, 3).map((rec, index) => ({
      stepNumber: index + 1,
      title: rec.retrofit.name,
      category: rec.retrofit.category,
      retrofitId: rec.retrofit.id,
      rationale: rec.reason,
      estimatedCostRange: rec.estimatedCostUSD.formattedRange,
      estimatedAnnualSavings: rec.estimatedAnnualSavingsUSD.formattedRange,
      estimatedPayback: rec.estimatedPaybackYears.formattedRange,
      thermalImpact: rec.thermalImpact,
    }));

    const totalMinCost = recommendations.slice(0, 3).reduce((sum, r) => sum + r.estimatedCostUSD.min, 0);
    const totalMaxCost = recommendations.slice(0, 3).reduce((sum, r) => sum + r.estimatedCostUSD.max, 0);
    const totalMinSavings = recommendations.slice(0, 3).reduce((sum, r) => sum + r.estimatedAnnualSavingsUSD.min, 0);
    const totalMaxSavings = recommendations.slice(0, 3).reduce((sum, r) => sum + r.estimatedAnnualSavingsUSD.max, 0);

    const avgPayback = totalMaxSavings > 0 ? Number(((totalMinCost + totalMaxCost) / (2 * ((totalMinSavings + totalMaxSavings) / 2))).toFixed(1)) : 0;

    return {
      buildingId: building.id,
      totalSteps: topSteps.length,
      steps: topSteps,
      totalRoadmapInvestment: `$${formatNumber(totalMinCost)} – $${formatNumber(totalMaxCost)}`,
      totalRoadmapAnnualSavings: `$${formatNumber(totalMinSavings)} – $${formatNumber(totalMaxSavings)}/yr`,
      overallRoadmapPayback: `${avgPayback} years`,
    };
  }
}

export const retrofitRecommendationEngine = new RetrofitRecommendationEngine();

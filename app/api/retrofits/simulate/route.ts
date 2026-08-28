import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDING_PROFILE, computeThermalStressReport } from '@/lib/models/building-thermal-model';
import { fortyGuardClient } from '@/lib/fortyguard/api-client';
import { FULL_RETROFIT_CATALOG } from '@/lib/retrofit/catalog';
import { RETROFIT_UNIT_ASSUMPTIONS, CENTRAL_RETROFIT_ASSUMPTIONS } from '@/lib/retrofit/assumptions';
import { RetrofitOptionId, MultiRetrofitSimulationResult, ImpactLevel } from '@/lib/retrofit/types';

const SimulateRequestSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  selectedRetrofitIds: z.array(z.string()).default([]),
  userElectricityRateUSD: z.number().optional(),
  userActualAnnualEnergykWh: z.number().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = SimulateRequestSchema.parse(body);

    const lat = validated.lat || DEFAULT_BUILDING_PROFILE.coordinates.lat;
    const lng = validated.lng || DEFAULT_BUILDING_PROFILE.coordinates.lng;

    const heatMapResult = await fortyGuardClient.getHeatMapData(lat, lng);
    const building = { ...DEFAULT_BUILDING_PROFILE };

    if (validated.userActualAnnualEnergykWh && validated.userActualAnnualEnergykWh > 0) {
      building.baselineAnnualEnergykWh = validated.userActualAnnualEnergykWh;
    }

    const rate = validated.userElectricityRateUSD || CENTRAL_RETROFIT_ASSUMPTIONS.defaultElectricityRateUSDPerKWh;
    const baselineReport = computeThermalStressReport(building, heatMapResult.data);

    // Selected Retrofit Options
    const selectedIds = new Set(validated.selectedRetrofitIds as RetrofitOptionId[]);
    const selectedOptions = FULL_RETROFIT_CATALOG.filter((opt) => selectedIds.has(opt.id));

    // Calculate Costs and Bounded Diminishing Returns Reduction %
    let totalMinCost = 0;
    let totalMaxCost = 0;
    let tempDropCAcc = 0;
    let nonSavedFraction = 1.0;

    const windowAreaSqFt = building.grossAreaSqFt * building.windowToWallRatio * 0.4;
    const roofAreaSqFt = building.roofAreaSqFt;
    const grossAreaSqFt = building.grossAreaSqFt;

    for (const opt of selectedOptions) {
      const avgReductionPct = (opt.energyImpactRange.minReductionPct + opt.energyImpactRange.maxReductionPct) / 2;
      nonSavedFraction *= 1 - avgReductionPct / 100;
      tempDropCAcc += opt.energyImpactRange.expectedTempReductionC;

      switch (opt.id) {
        case 'EXTERNAL_SHADING':
          totalMinCost += windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.EXTERNAL_SHADING.minCostPerSqFtWindow;
          totalMaxCost += windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.EXTERNAL_SHADING.maxCostPerSqFtWindow;
          break;
        case 'ROOF_INSULATION':
          totalMinCost += roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.ROOF_INSULATION.minCostPerSqFtRoof;
          totalMaxCost += roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.ROOF_INSULATION.maxCostPerSqFtRoof;
          break;
        case 'COOL_ROOF':
          totalMinCost += roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.COOL_ROOF.minCostPerSqFtRoof;
          totalMaxCost += roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.COOL_ROOF.maxCostPerSqFtRoof;
          break;
        case 'SOLAR_GLAZING':
          totalMinCost += windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.SOLAR_GLAZING.minCostPerSqFtWindow;
          totalMaxCost += windowAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.SOLAR_GLAZING.maxCostPerSqFtWindow;
          break;
        case 'HVAC_UPGRADE':
          totalMinCost += grossAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.HVAC_UPGRADE.minCostPerSqFtGross;
          totalMaxCost += grossAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.HVAC_UPGRADE.maxCostPerSqFtGross;
          break;
        case 'VEGETATION':
          totalMinCost += roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.VEGETATION.minCostPerSqFtRoof;
          totalMaxCost += roofAreaSqFt * RETROFIT_UNIT_ASSUMPTIONS.VEGETATION.maxCostPerSqFtRoof;
          break;
      }
    }

    // Bounded compound reduction percentage (capped at 48% maximum physical envelope threshold)
    const rawCompoundReductionPct = (1 - nonSavedFraction) * 100;
    const combinedReductionPct = Number(Math.min(48.0, rawCompoundReductionPct).toFixed(1));

    // Calculate simulated before/after metrics
    const thermalStressDrop = Math.round(combinedReductionPct * 0.45);
    const simulatedStressScore = Math.max(20, baselineReport.thermalStressScore - thermalStressDrop);

    let simCategory = 'MODERATE';
    if (simulatedStressScore > 85) simCategory = 'CRITICAL';
    else if (simulatedStressScore > 75) simCategory = 'EXTREME';
    else if (simulatedStressScore > 60) simCategory = 'HIGH';
    else if (simulatedStressScore < 40) simCategory = 'OPTIMAL';

    const totalBaselineCoolingKW = baselineReport.facadeHeatGainKW + baselineReport.roofHeatGainKW;
    const coolingStressDropKW = Math.round(totalBaselineCoolingKW * (combinedReductionPct / 100));
    const simulatedCoolingKW = totalBaselineCoolingKW - coolingStressDropKW;

    const simEnergyLevel: ImpactLevel = combinedReductionPct > 25 ? 'LOW' : combinedReductionPct > 12 ? 'MEDIUM' : 'HIGH';

    // Financials
    totalMinCost = Math.round(totalMinCost);
    totalMaxCost = Math.round(totalMaxCost);

    const coolingBaselinekWh = building.baselineAnnualEnergykWh * CENTRAL_RETROFIT_ASSUMPTIONS.coolingEnergyShareOfTotalBuildingPct;
    const annualSavedkWh = coolingBaselinekWh * (combinedReductionPct / 100);

    const minAnnualSavings = Math.round(annualSavedkWh * rate * 0.9);
    const maxAnnualSavings = Math.round(annualSavedkWh * rate * 1.1);

    const avgInvestment = (totalMinCost + totalMaxCost) / 2;
    const avgSavings = (minAnnualSavings + maxAnnualSavings) / 2;

    const paybackYears = avgSavings > 0 ? Number((avgInvestment / avgSavings).toFixed(1)) : 0;

    let cumulative5Yr = 0;
    let cumulative10Yr = 0;
    let npv20Yr = -avgInvestment;

    for (let yr = 1; yr <= 20; yr++) {
      const yrSavings = avgSavings * Math.pow(1 + CENTRAL_RETROFIT_ASSUMPTIONS.annualElectricityPriceEscalationPct, yr - 1);
      if (yr <= 5) cumulative5Yr += yrSavings;
      if (yr <= 10) cumulative10Yr += yrSavings;
      npv20Yr += yrSavings / Math.pow(1 + CENTRAL_RETROFIT_ASSUMPTIONS.discountRatePct, yr);
    }

    const result: MultiRetrofitSimulationResult = {
      selectedRetrofits: selectedOptions,
      baseline: {
        thermalStressScore: baselineReport.thermalStressScore,
        stressCategory: baselineReport.stressCategory,
        coolingStressKW: totalBaselineCoolingKW,
        energyImpactLevel: 'HIGH',
      },
      simulated: {
        thermalStressScore: simulatedStressScore,
        stressCategory: simCategory,
        coolingStressKW: simulatedCoolingKW,
        energyImpactLevel: simEnergyLevel,
      },
      deltas: {
        thermalStressDrop,
        coolingStressDropKW,
        combinedEnergyReductionPct: combinedReductionPct,
        indoorTempDropC: Number(Math.min(10.0, tempDropCAcc * 0.6).toFixed(1)),
      },
      financials: {
        estimatedInvestmentUSD: {
          min: totalMinCost,
          max: totalMaxCost,
          formatted: `$${totalMinCost.toLocaleString()} – $${totalMaxCost.toLocaleString()}`,
        },
        estimatedAnnualSavingsUSD: {
          min: minAnnualSavings,
          max: maxAnnualSavings,
          formatted: `$${minAnnualSavings.toLocaleString()} – $${maxAnnualSavings.toLocaleString()}/yr`,
        },
        estimatedPaybackYears: {
          min: Number((paybackYears * 0.85).toFixed(1)),
          max: Number((paybackYears * 1.15).toFixed(1)),
          formatted: `${(paybackYears * 0.85).toFixed(1)} – ${(paybackYears * 1.15).toFixed(1)} yrs`,
        },
        fiveYearSavingsUSD: {
          min: Math.round(cumulative5Yr * 0.9),
          max: Math.round(cumulative5Yr * 1.1),
          formatted: `$${Math.round(cumulative5Yr).toLocaleString()}`,
        },
        tenYearSavingsUSD: {
          min: Math.round(cumulative10Yr * 0.9),
          max: Math.round(cumulative10Yr * 1.1),
          formatted: `$${Math.round(cumulative10Yr).toLocaleString()}`,
        },
        twentyYearNPVUSD: {
          min: Math.round(npv20Yr * 0.9),
          max: Math.round(npv20Yr * 1.1),
          formatted: `$${Math.round(npv20Yr).toLocaleString()}`,
        },
      },
      assumptionsUsed: {
        electricityRateUSD: rate,
        baselineAnnualkWh: building.baselineAnnualEnergykWh,
        coolingSharePct: CENTRAL_RETROFIT_ASSUMPTIONS.coolingEnergyShareOfTotalBuildingPct * 100,
        costDisclaimer: CENTRAL_RETROFIT_ASSUMPTIONS.costDisclaimerLabel,
        diminishingReturnsApplied: true,
      },
    };

    return NextResponse.json({
      success: true,
      simulation: result,
    });
  } catch (error) {
    console.error('Error in /api/retrofits/simulate route:', error);
    return NextResponse.json({ success: false, error: 'Failed to run what-if scenario simulation' }, { status: 400 });
  }
}

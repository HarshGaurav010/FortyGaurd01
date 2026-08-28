import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { computeThermalStressReport } from '@/lib/models/building-thermal-model';
import { retrofitRecommendationEngine } from '@/lib/retrofit/recommendation';
import { calculateRetrofitROI } from '@/lib/calculations/roi';
import { runWhatIfSimulation } from '@/lib/calculations/roi-calculator';
import { CENTRAL_RETROFIT_ASSUMPTIONS } from '@/lib/retrofit/assumptions';
import { FULL_RETROFIT_CATALOG } from '@/lib/retrofit/catalog';
import { RetrofitOptionId } from '@/lib/retrofit/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { CopilotToolResult } from './types';

export class HeatRetrofitTools {
  public getBuildingProfile(building: BuildingProfile): CopilotToolResult {
    return {
      toolName: 'getBuildingProfile',
      summaryText: `Building profile for **${building.name}**: ${building.grossAreaSqFt.toLocaleString()} sq ft ${building.useType.toLowerCase().replace('_', ' ')} built in ${building.yearBuilt} with ${building.floorsCount} floors and ${Math.round(building.windowToWallRatio * 100)}% glass facade exposure.`,
      dataCard: {
        type: 'THERMAL_SCORE',
        title: `Building Baseline Specifications`,
        metrics: {
          'Building Name': building.name,
          'Gross Footprint': `${building.grossAreaSqFt.toLocaleString()} sq ft`,
          'Year Built': `${building.yearBuilt} (${building.floorsCount} Floors)`,
          'HVAC Efficiency': `COP ${building.hvacEfficiencyCOP} (${building.hvacAgeYears} yrs old)`,
        },
      },
      rawData: building,
    };
  }

  public getHeatAnalysis(heatMap: FortyGuardHeatMap): CopilotToolResult {
    const topHotspot = heatMap.thermalHotspots[0] || { locationName: 'Main Roof Slab', lstC: heatMap.peakLSTC };
    return {
      toolName: 'getHeatAnalysis',
      summaryText: `FortyGuard heat analysis for **${heatMap.regionName}** shows an average surface temperature of **${heatMap.averageLSTC}°C** and a peak thermal hotspot of **${heatMap.peakLSTC}°C** at ${topHotspot.locationName}.`,
      dataCard: {
        type: 'THERMAL_SCORE',
        title: 'FortyGuard Surface Thermal Analysis',
        metrics: {
          'Region AOI': heatMap.regionName,
          'Average Surface LST': `${heatMap.averageLSTC} °C`,
          'Peak Surface LST': `${heatMap.peakLSTC} °C`,
          'Grid Resolution': `${heatMap.gridResolutionMeters}m high-res`,
        },
      },
      rawData: heatMap,
    };
  }

  public getEnvironmentalSummary(heatMap: FortyGuardHeatMap): CopilotToolResult {
    const uhiDelta = Number((heatMap.peakLSTC - heatMap.averageLSTC).toFixed(1));
    return {
      toolName: 'getEnvironmentalSummary',
      summaryText: `Microclimate environmental summary: Urban Heat Island (UHI) anomaly delta is **+${uhiDelta}°C** above ambient microclimate grid averages.`,
      dataCard: {
        type: 'THERMAL_SCORE',
        title: 'Microclimate Environmental Summary',
        metrics: {
          'Urban Heat Island Delta': `+${uhiDelta} °C`,
          'Microclimate Grid': heatMap.regionName,
          'Heat Stress Score': `${heatMap.heatStressScore} / 100`,
        },
      },
      rawData: { uhiDelta, heatMap },
    };
  }

  public getThermalStress(building: BuildingProfile, heatMap: FortyGuardHeatMap): CopilotToolResult {
    const report = computeThermalStressReport(building, heatMap);
    return {
      toolName: 'getThermalStress',
      summaryText: `**${building.name}** registers a **Thermal Stress Score of ${report.thermalStressScore}/100 (${report.stressCategory})**. Driven primarily by peak roof surface temperatures reaching **${heatMap.peakLSTC}°C**.`,
      dataCard: {
        type: 'THERMAL_SCORE',
        title: 'Thermal Vulnerability Metrics',
        metrics: {
          'Thermal Stress Score': `${report.thermalStressScore}/100 (${report.stressCategory})`,
          'Peak Roof LST': `${heatMap.peakLSTC} °C`,
          'Facade Solar Exposure': `${report.solarExposureRating} / 10`,
          'Carbon Footprint': `${report.carbonFootprintTonsCO2} tons CO₂/yr`,
        },
      },
      rawData: report,
    };
  }

  public getCoolingStress(building: BuildingProfile, heatMap: FortyGuardHeatMap): CopilotToolResult {
    const report = computeThermalStressReport(building, heatMap);
    const totalKW = report.facadeHeatGainKW + report.roofHeatGainKW;
    return {
      toolName: 'getCoolingStress',
      summaryText: `Calculated cooling heat stress load is **${totalKW.toLocaleString()} kW** (${report.roofHeatGainKW.toLocaleString()} kW roof gain + ${report.facadeHeatGainKW.toLocaleString()} kW facade gain), causing **${formatCurrency(report.annualCoolingWasteCostUSD)}/year** in wasted HVAC electricity.`,
      dataCard: {
        type: 'THERMAL_SCORE',
        title: 'Cooling Load & Heat Gain Stress',
        metrics: {
          'Roof Heat Gain': `${report.roofHeatGainKW.toLocaleString()} kW`,
          'Facade Heat Gain': `${report.facadeHeatGainKW.toLocaleString()} kW`,
          'Total Heat Gain Load': `${totalKW.toLocaleString()} kW`,
          'Annual Waste Cost': `${formatCurrency(report.annualCoolingWasteCostUSD)}/yr`,
        },
      },
      rawData: { facadeGain: report.facadeHeatGainKW, roofGain: report.roofHeatGainKW, wasteCost: report.annualCoolingWasteCostUSD },
    };
  }

  public getThermalWeaknesses(building: BuildingProfile, heatMap: FortyGuardHeatMap): CopilotToolResult {
    const report = computeThermalStressReport(building, heatMap);
    const topVuln = report.vulnerabilities[0];
    return {
      toolName: 'getThermalWeaknesses',
      summaryText: `Identified envelope weaknesses: **${topVuln.title}** (${topVuln.severity} severity) accounts for **${topVuln.heatGainContributionPct}%** of total building cooling load. ${report.vulnerabilities.length} total vulnerability zones detected.`,
      dataCard: {
        type: 'THERMAL_SCORE',
        title: 'Detected Thermal Weaknesses',
        metrics: {
          'Top Weakness': topVuln.title,
          'Affected Zone': topVuln.zone,
          'Heat Contribution': `${topVuln.heatGainContributionPct}% of cooling load`,
          'Severity Level': topVuln.severity,
        },
      },
      rawData: report.vulnerabilities,
    };
  }

  public getRetrofitRecommendations(building: BuildingProfile, heatMap: FortyGuardHeatMap): CopilotToolResult {
    const report = computeThermalStressReport(building, heatMap);
    const recommendations = retrofitRecommendationEngine.generateRecommendations(building, report, heatMap);
    const topRec = recommendations[0];

    return {
      toolName: 'getRetrofitRecommendations',
      summaryText: `Rank #1 recommended intervention is **${topRec.retrofit.name}**. Rationale: ${topRec.reason} Estimated energy cut: **${topRec.estimatedEnergyImpact.formattedRange}**, estimated investment: **${topRec.estimatedCostUSD.formattedRange}**, payback in **${topRec.estimatedPaybackYears.formattedRange}**.`,
      dataCard: {
        type: 'RETROFIT_RECOMMENDATION',
        title: 'Rank #1 Recommended Climate Retrofit',
        metrics: {
          'Strategy': topRec.retrofit.name,
          'Est. Energy Cut': topRec.estimatedEnergyImpact.formattedRange,
          'Investment Range': topRec.estimatedCostUSD.formattedRange,
          'Payback': topRec.estimatedPaybackYears.formattedRange,
        },
      },
      rawData: recommendations,
    };
  }

  public compareRetrofits(retrofitIdA: string, retrofitIdB: string, building: BuildingProfile): CopilotToolResult {
    const optA = FULL_RETROFIT_CATALOG.find((r) => r.id === retrofitIdA || r.name.toLowerCase().includes(retrofitIdA.toLowerCase())) || FULL_RETROFIT_CATALOG[0];
    const optB = FULL_RETROFIT_CATALOG.find((r) => r.id === retrofitIdB || r.name.toLowerCase().includes(retrofitIdB.toLowerCase())) || FULL_RETROFIT_CATALOG[1];

    const roiA = calculateRetrofitROI({
      retrofitCostUSD: building.roofAreaSqFt * 4.0,
      energyReductionPct: (optA.energyImpactRange.minReductionPct + optA.energyImpactRange.maxReductionPct) / 2,
      baselineAnnualkWh: building.baselineAnnualEnergykWh,
    });

    const roiB = calculateRetrofitROI({
      retrofitCostUSD: building.roofAreaSqFt * 8.0,
      energyReductionPct: (optB.energyImpactRange.minReductionPct + optB.energyImpactRange.maxReductionPct) / 2,
      baselineAnnualkWh: building.baselineAnnualEnergykWh,
    });

    return {
      toolName: 'compareRetrofits',
      summaryText: `Comparison between **${optA.name}** and **${optB.name}**: ${optA.name} offers **${optA.energyImpactRange.minReductionPct}–${optA.energyImpactRange.maxReductionPct}%** energy reduction with a **${roiA.simplePaybackYears} yr** payback vs **${optB.energyImpactRange.minReductionPct}–${optB.energyImpactRange.maxReductionPct}%** reduction with **${roiB.simplePaybackYears} yr** payback.`,
      dataCard: {
        type: 'RETROFIT_COMPARISON',
        title: `Side-by-Side Retrofit Comparison`,
        metrics: {
          [optA.name]: `${roiA.simplePaybackYears} yr payback (${optA.thermalImpact} Impact)`,
          [optB.name]: `${roiB.simplePaybackYears} yr payback (${optB.thermalImpact} Impact)`,
          'Faster Payback': roiA.simplePaybackYears <= roiB.simplePaybackYears ? optA.name : optB.name,
        },
      },
      rawData: { optionA: optA, optionB: optB, roiA, roiB },
    };
  }

  public calculateROI(building: BuildingProfile, retrofitCostUSD: number = 49700, reductionPct: number = 14.5): CopilotToolResult {
    const roi = calculateRetrofitROI({
      retrofitCostUSD,
      energyReductionPct: reductionPct,
      baselineAnnualkWh: building.baselineAnnualEnergykWh,
    });

    return {
      toolName: 'calculateROI',
      summaryText: `Calculated ROI for **$${retrofitCostUSD.toLocaleString()}** investment reducing cooling load by **${reductionPct}%**: Annual utility savings of **$${roi.annualMonetarySavingsUSD.toLocaleString()}/yr**, reaching simple payback in **${roi.simplePaybackYears} years** and a 20-year NPV of **$${roi.twentyYearNPVUSD.toLocaleString()}**.`,
      dataCard: {
        type: 'ROI_SUMMARY',
        title: 'Calculated Financial Return Summary',
        metrics: {
          'Capital Investment': `$${retrofitCostUSD.toLocaleString()}`,
          'Annual Monetary Savings': `$${roi.annualMonetarySavingsUSD.toLocaleString()}/yr`,
          'Simple Payback': `${roi.simplePaybackYears} years`,
          '20-Year NPV': `$${roi.twentyYearNPVUSD.toLocaleString()}`,
        },
      },
      rawData: roi,
    };
  }

  public runRetrofitSimulation(building: BuildingProfile, selectedIds: RetrofitOptionId[] = ['COOL_ROOF', 'SOLAR_GLAZING']): CopilotToolResult {
    const sim = runWhatIfSimulation(building, {
      buildingId: building.id,
      roofReflectance: selectedIds.includes('COOL_ROOF') ? 0.88 : 0.2,
      windowFilmSHGC: selectedIds.includes('SOLAR_GLAZING') || selectedIds.includes('EXTERNAL_SHADING') ? 0.24 : 0.65,
      wallInsulationAddRValue: selectedIds.includes('ROOF_INSULATION') ? 12 : 0,
      greenRoofCoveragePct: selectedIds.includes('VEGETATION') ? 50 : 0,
      smartHvacOptimization: selectedIds.includes('HVAC_UPGRADE'),
      thermostatSetpointC: 22.5,
    });

    return {
      toolName: 'runRetrofitSimulation',
      summaryText: `Scenario simulation for selected retrofits (**${selectedIds.join(', ')}**): Cuts cooling energy by **${sim.energySavedPct}%** (${sim.energySavedkWh.toLocaleString()} kWh/yr), saving **$${sim.annualCostSavingsUSD.toLocaleString()}/yr** with an estimated payback of **${sim.paybackPeriodYears} years**.`,
      dataCard: {
        type: 'SIMULATION_RESULT',
        title: 'Multi-Retrofit Scenario Simulation',
        metrics: {
          'Combined Energy Cut': `-${sim.energySavedPct}%`,
          'Annual Cost Savings': `$${sim.annualCostSavingsUSD.toLocaleString()}/yr`,
          'Estimated Investment': `$${sim.capitalExpenditureUSD.toLocaleString()}`,
          'Scenario Payback': `${sim.paybackPeriodYears} years`,
        },
      },
      rawData: sim,
    };
  }

  public getAssumptions(): CopilotToolResult {
    return {
      toolName: 'getAssumptions',
      summaryText: `Current calculation assumptions: Commercial electricity tariff **$${CENTRAL_RETROFIT_ASSUMPTIONS.defaultElectricityRateUSDPerKWh}/kWh**, HVAC cooling share **${CENTRAL_RETROFIT_ASSUMPTIONS.coolingEnergyShareOfTotalBuildingPct * 100}%** of total building load, discount rate **${CENTRAL_RETROFIT_ASSUMPTIONS.discountRatePct * 100}%**, annual price escalation **${CENTRAL_RETROFIT_ASSUMPTIONS.annualElectricityPriceEscalationPct * 100}%**.`,
      dataCard: {
        type: 'ASSUMPTIONS',
        title: 'Calculation Basis & Model Assumptions',
        metrics: {
          'Electricity Rate': `$${CENTRAL_RETROFIT_ASSUMPTIONS.defaultElectricityRateUSDPerKWh}/kWh`,
          'Cooling Energy Share': `${CENTRAL_RETROFIT_ASSUMPTIONS.coolingEnergyShareOfTotalBuildingPct * 100}%`,
          'Discount Rate': `${CENTRAL_RETROFIT_ASSUMPTIONS.discountRatePct * 100}%`,
          'Escalation Rate': `+${CENTRAL_RETROFIT_ASSUMPTIONS.annualElectricityPriceEscalationPct * 100}%/yr`,
        },
      },
      rawData: CENTRAL_RETROFIT_ASSUMPTIONS,
    };
  }
}

export const heatRetrofitTools = new HeatRetrofitTools();

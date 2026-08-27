import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDING_PROFILE } from '@/lib/models/building-thermal-model';
import { getRecommendedRetrofits } from '@/lib/calculations/thermal-stress-calculator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const retrofits = getRecommendedRetrofits(DEFAULT_BUILDING_PROFILE);
    
    // Calculate total combined package investment & returns
    const top3 = retrofits.slice(0, 3);
    const totalCost = top3.reduce((sum, item) => sum + item.estTotalCostUSD, 0);
    const annualSavings = top3.reduce((sum, item) => sum + item.expectedAnnualSavingsUSD, 0);
    const combinedEnergyReduction = top3.reduce((sum, item) => sum + item.expectedCoolingEnergyReductionPct, 0) * 0.85; // accounts for overlap
    const paybackYears = Number((totalCost / annualSavings).toFixed(1));
    const totalCarbon20Yr = top3.reduce((sum, item) => sum + item.carbonOffsetTonsPerYear, 0) * 20;

    return NextResponse.json({
      success: true,
      buildingId: DEFAULT_BUILDING_PROFILE.id,
      interventions: retrofits,
      combinedPackage: {
        packageName: 'Optimal Energy Efficiency Package (Cool Roof + Window Film + Smart HVAC)',
        totalCostUSD: totalCost,
        annualSavingsUSD: annualSavings,
        combinedEnergyReductionPct: Number(combinedEnergyReduction.toFixed(1)),
        overallPaybackYears: paybackYears,
        overall20YrROIPct: Math.round(((annualSavings * 20 - totalCost) / totalCost) * 100),
        totalCarbonOffsetTons20Yr: Math.round(totalCarbon20Yr),
      },
    });
  } catch (error) {
    console.error('Error in ROI API route:', error);
    return NextResponse.json({ success: false, error: 'Failed to calculate ROI metrics' }, { status: 500 });
  }
}

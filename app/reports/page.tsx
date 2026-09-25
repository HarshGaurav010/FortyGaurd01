'use client';

import React, { useMemo, useState } from 'react';
import { useBuildingScenario } from '@/components/scenarios/building-scenario-provider';
import { getRecommendedRetrofits } from '@/lib/calculations/thermal-stress-calculator';
import { generateAuditPDF } from '@/lib/reports/pdf-generator';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROICharts } from '@/components/analytics/roi-charts';
import { FileText, Download, Printer, ShieldCheck, DollarSign, Leaf, Zap, Building2, Flame, Thermometer } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

export default function ReportsPage() {
  const { selectedScenario, buildingProfile, thermalReport } = useBuildingScenario();
  const [isExporting, setIsExporting] = useState(false);

  // Compute ROI and intervention schedule directly from the active building profile
  const roiData = useMemo(() => {
    const retrofits = getRecommendedRetrofits(buildingProfile);
    const top3 = retrofits.slice(0, 3);
    const totalCost = top3.reduce((sum, item) => sum + item.estTotalCostUSD, 0);
    const annualSavings = top3.reduce((sum, item) => sum + item.expectedAnnualSavingsUSD, 0);
    const combinedEnergyReduction =
      top3.reduce((sum, item) => sum + item.expectedCoolingEnergyReductionPct, 0) * 0.85;
    const paybackYears = annualSavings > 0 ? Number((totalCost / annualSavings).toFixed(1)) : 0;
    const totalCarbon20Yr = top3.reduce((sum, item) => sum + item.carbonOffsetTonsPerYear, 0) * 20;

    return {
      buildingId: buildingProfile.id,
      interventions: retrofits,
      combinedPackage: {
        packageName: 'Optimal Energy Efficiency Package (Cool Roof + Window Film + Smart HVAC)',
        totalCostUSD: totalCost,
        annualSavingsUSD: annualSavings,
        combinedEnergyReductionPct: Number(combinedEnergyReduction.toFixed(1)),
        overallPaybackYears: paybackYears,
        overall20YrROIPct: totalCost > 0 ? Math.round(((annualSavings * 20 - totalCost) / totalCost) * 100) : 0,
        totalCarbonOffsetTons20Yr: Math.round(totalCarbon20Yr),
      },
    };
  }, [buildingProfile]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      generateAuditPDF({
        selectedScenario,
        buildingProfile,
        thermalReport,
        roiData,
      });
    } catch (err) {
      console.error('Failed to generate audit PDF:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  const totalBaselineCoolingKW = thermalReport.facadeHeatGainKW + thermalReport.roofHeatGainKW;

  return (
    <div className="pt-28 pb-20 print:pt-0 print:pb-0 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 print:space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 print:pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="violet"><FileText className="w-3 h-3 text-indigo-500" /> EXECUTIVE AUDIT REPORT</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Heat Retrofit Investment & Energy Report</h1>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 ml-auto flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#132039] border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-700 dark:text-gray-300 shadow-sm print:border-slate-300">
              <Building2 className="w-3.5 h-3.5 text-cyan-500" />
              Prepared for {selectedScenario.name} — {selectedScenario.location.city}, {selectedScenario.location.state}, USA • Modeled Energy Audit
            </span>
            <div className="flex items-center gap-2.5 no-print">
              <Button variant="outline" className="gap-2 bg-white dark:bg-[#132039] border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/05 shadow-sm" onClick={handlePrint}>
                <Printer className="w-4 h-4" /> Print Report
              </Button>
              <Button
                variant="glow"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? 'Generating PDF...' : 'Export PDF Audit'}
              </Button>
            </div>
          </div>
        </div>

        {/* Building Identity & Baseline Thermal Profile Card */}
        <GlassCard variant="glow" className="p-6 print-avoid-break">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Facility Audit Specifications & Baseline Thermal Context</h2>
            </div>
            <Badge variant="cyan">ASSET ID: {selectedScenario.id}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Left: Building Specs */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Facility Architecture</h3>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Facility Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-sans">{selectedScenario.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Location:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedScenario.location.city}, {selectedScenario.location.state}, USA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Gross Floor Area:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNumber(buildingProfile.grossAreaSqFt)} sq ft ({buildingProfile.floorsCount} floors)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Roof Footprint:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNumber(buildingProfile.roofAreaSqFt)} sq ft ({buildingProfile.roofType.replace(/_/g, ' ')})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Glazing Ratio (WWR):</span>
                  <span className="font-bold text-slate-900 dark:text-white">{Math.round(buildingProfile.windowToWallRatio * 100)}% ({buildingProfile.windowType.replace(/_/g, ' ')})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Baseline Annual Energy:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNumber(buildingProfile.baselineAnnualEnergykWh)} kWh/yr</span>
                </div>
              </div>
            </div>

            {/* Right: Thermal Stress Baseline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Baseline Thermal Evaluation</h3>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Thermal Stress Score:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 font-sans">
                    {thermalReport.thermalStressScore}/100 ({thermalReport.stressCategory})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Cooling Heat Stress Load:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNumber(totalBaselineCoolingKW)} kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Facade Heat Gain:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNumber(thermalReport.facadeHeatGainKW)} kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Roof Heat Gain:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNumber(thermalReport.roofHeatGainKW)} kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Annual Cooling Penalty:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(thermalReport.annualCoolingWasteCostUSD)}/yr</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Audit Methodology:</span>
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">Modeled deterministic baseline</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {roiData && (
          <div className="space-y-8 print:space-y-5">
            {/* Top Financial Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print-avoid-break">
              <MetricCard
                title="Total CapEx Package"
                value={formatCurrency(roiData.combinedPackage.totalCostUSD)}
                subtext="Turnkey Installation"
                icon={<ShieldCheck className="w-5 h-5" />}
                accentColor="cyan"
              />
              <MetricCard
                title="Annual Utility Savings"
                value={formatCurrency(roiData.combinedPackage.annualSavingsUSD)}
                subtext="Electricity Bill Avoidance"
                change="Annual Cut"
                isPositive={true}
                icon={<DollarSign className="w-5 h-5" />}
                accentColor="amber"
              />
              <MetricCard
                title="Payback Horizon"
                value={`${roiData.combinedPackage.overallPaybackYears} Yrs`}
                subtext="Capital Recovery"
                change="Break-Even"
                isPositive={true}
                icon={<Zap className="w-5 h-5" />}
                accentColor="emerald"
              />
              <MetricCard
                title="20-Year Carbon Offset"
                value={`${roiData.combinedPackage.totalCarbonOffsetTons20Yr} t`}
                subtext="CO₂e Avoidance"
                icon={<Leaf className="w-5 h-5" />}
                accentColor="violet"
              />
            </div>

            {/* ROI Chart Curve */}
            <div className="print-avoid-break">
              <ROICharts
                capex={roiData.combinedPackage.totalCostUSD}
                annualSavings={roiData.combinedPackage.annualSavingsUSD}
                paybackYears={roiData.combinedPackage.overallPaybackYears}
              />
            </div>

            {/* Executive Summary Table */}
            <GlassCard variant="glow" className="p-6 print-avoid-break">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recommended Intervention Package Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase">
                      <th className="py-3 px-3">Intervention Strategy</th>
                      <th className="py-3 px-3">Cooling Reduction</th>
                      <th className="py-3 px-3">Est. CapEx</th>
                      <th className="py-3 px-3">Annual Savings</th>
                      <th className="py-3 px-3">Payback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                    {roiData.interventions.slice(0, 4).map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 px-3 font-sans font-bold text-slate-900 dark:text-white">{item.name}</td>
                        <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">-{item.expectedCoolingEnergyReductionPct}%</td>
                        <td className="py-3 px-3">{formatCurrency(item.estTotalCostUSD)}</td>
                        <td className="py-3 px-3 text-amber-600 dark:text-amber-400">{formatCurrency(item.expectedAnnualSavingsUSD)}/yr</td>
                        <td className="py-3 px-3 text-cyan-700 dark:text-cyan-300 font-semibold">{item.paybackPeriodYears} Yrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}

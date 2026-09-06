'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROICharts } from '@/components/analytics/roi-charts';
import { FileText, Download, Printer, ShieldCheck, DollarSign, Leaf, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export default function ReportsPage() {
  const [roiData, setRoiData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/roi')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRoiData(data);
      })
      .catch((err) => console.error('Failed to load ROI report:', err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="violet"><FileText className="w-3 h-3 text-indigo-500" /> EXECUTIVE AUDIT REPORT</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Heat Retrofit Investment & Energy Report</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Prepared for Nexus Horizon Plaza • FortyGuard Telemetry Certified
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
              Print Report
            </Button>
            <Button variant="glow" size="sm" icon={<Download className="w-4 h-4" />}>
              Export PDF Audit
            </Button>
          </div>
        </div>

        {roiData && (
          <div className="space-y-8">
            {/* Top Financial Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <ROICharts
              capex={roiData.combinedPackage.totalCostUSD}
              annualSavings={roiData.combinedPackage.annualSavingsUSD}
              paybackYears={roiData.combinedPackage.overallPaybackYears}
            />

            {/* Executive Summary Table */}
            <GlassCard variant="glow" className="p-6">
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
                    {roiData.interventions.slice(0, 4).map((item: any) => (
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

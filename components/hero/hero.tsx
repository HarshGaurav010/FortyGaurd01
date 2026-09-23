'use client';

import React, { useState, Suspense, lazy } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Flame,
  Star,
  Activity,
  DollarSign,
  Maximize2,
  TrendingDown,
  TrendingUp,
  Shield,
  Zap,
  Sparkles,
  Bot,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { DEFAULT_BUILDING_PROFILE, computeThermalStressReport } from '@/lib/models/building-thermal-model';
import { CATALOG_RETROFITS } from '@/lib/calculations/thermal-stress-calculator';
import { formatCurrency } from '@/lib/utils/formatters';

// Lazy-load the 3D scene
const OverviewHouseScene = lazy(() =>
  import('@/components/building/overview-house-scene').then((m) => ({
    default: m.OverviewHouseScene,
  }))
);

export const Hero: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  // Compute metrics from actual models and calculations
  const defaultHeatMap = {
    regionId: 'FG-PHX-001',
    regionName: 'Downtown Phoenix',
    center: DEFAULT_BUILDING_PROFILE.coordinates,
    gridResolutionMeters: 2.0,
    averageLSTC: 48.4,
    peakLSTC: 56.8,
    heatStressScore: 84,
    thermalHotspots: [],
    points: [],
  };

  const thermalReport = computeThermalStressReport(DEFAULT_BUILDING_PROFILE, defaultHeatMap);
  const topRetrofit = CATALOG_RETROFITS[0];

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-4 pb-12"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ── TOP BADGE CHIP ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" pulse>
            AI-POWERED • DATA-DRIVEN • HEAT-AWARE
          </Badge>
        </div>

        {/* ── MAIN 3-COLUMN COMPOSITION ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[320px_1fr_310px] gap-6 items-start">
          {/* ════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: Hero Headline & Microclimate Conditions      */}
          {/* ════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-6">
            {/* Headline */}
            <div className="space-y-3">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight"
              >
                Build Cooler.<br />
                <span className="text-brand-500">Save Energy.</span><br />
                <span className="text-brand-600 dark:text-brand-400">Prove It.</span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                HeatRetrofit AI combines hyperlocal heat intelligence with building characteristics to
                identify thermal weaknesses, recommend high-impact retrofits, and estimate the energy
                and financial impact before you invest.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/analysis">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-sm hover:shadow-glow-sm"
                >
                  Analyze Your Building
                </Button>
              </Link>
              <Link href="/simulator">
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white/80 dark:bg-white/05 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  Explore Demo
                </Button>
              </Link>
            </div>

            {/* Microclimate Conditions Card */}
            <GlassCard className="p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white tracking-wide uppercase font-mono">
                    Microclimate Conditions
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Updated 2 min ago • FortyGuard LST
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  title="View full heat intelligence dashboard"
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 2x2 Metric Grid with Sparklines */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Surface LST */}
                <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#101826] border border-gray-100 dark:border-white/06 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🌡️</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Surface LST</span>
                  </div>
                  <div className="text-base font-bold text-gray-900 dark:text-white font-mono">
                    {defaultHeatMap.averageLSTC.toFixed(1)} °C
                  </div>
                  {/* Mini Sparkline */}
                  <svg className="w-full h-5" viewBox="0 0 100 20" fill="none">
                    <path
                      d="M 0 14 Q 25 18, 50 11 T 100 6"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* 2. UHI Anomaly */}
                <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#101826] border border-gray-100 dark:border-white/06 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🏙️</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">UHI Anomaly</span>
                  </div>
                  <div className="text-base font-bold text-brand-600 dark:text-brand-400 font-mono">
                    +{thermalReport.urbanHeatIslandImpactDeltaC > 0 ? (thermalReport.urbanHeatIslandImpactDeltaC * 0.57).toFixed(1) : '4.8'} °C
                  </div>
                  {/* Mini Sparkline */}
                  <svg className="w-full h-5" viewBox="0 0 100 20" fill="none">
                    <path
                      d="M 0 15 Q 30 7, 60 12 T 100 4"
                      stroke="#ea580c"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* 3. Solar Irradiance */}
                <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#101826] border border-gray-100 dark:border-white/06 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">☀️</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Solar Irradiance</span>
                  </div>
                  <div className="text-base font-bold text-gray-900 dark:text-white font-mono">
                    880 W/m²
                  </div>
                  {/* Mini Sparkline */}
                  <svg className="w-full h-5" viewBox="0 0 100 20" fill="none">
                    <path
                      d="M 0 16 Q 35 4, 70 8 T 100 5"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* 4. Wind Speed */}
                <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#101826] border border-gray-100 dark:border-white/06 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">💨</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Wind Speed</span>
                  </div>
                  <div className="text-base font-bold text-gray-900 dark:text-white font-mono">
                    3.4 m/s
                  </div>
                  {/* Mini Sparkline */}
                  <svg className="w-full h-5" viewBox="0 0 100 20" fill="none">
                    <path
                      d="M 0 10 Q 25 15, 50 8 T 100 12"
                      stroke="#0ea5e9"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ════════════════════════════════════════════════════════ */}
          {/* CENTER COLUMN: Large Interactive 3D House Digital Twin    */}
          {/* ════════════════════════════════════════════════════════ */}
          <div className="relative w-full rounded-3xl bg-gradient-to-b from-gray-50/50 to-white/70 dark:from-[#0d1424] dark:to-[#080d19] border border-gray-200/80 dark:border-white/10 shadow-card overflow-hidden min-h-[520px] lg:min-h-[620px] flex flex-col justify-between">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                  <p className="text-xs text-gray-400 font-mono">Loading 3D House Digital Twin…</p>
                </div>
              }
            >
              <OverviewHouseScene
                onSelectHotspot={setSelectedHotspot}
                selectedHotspot={selectedHotspot}
              />
            </Suspense>

            {/* Top Left Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <Badge variant="brand" pulse>
                <Flame className="w-3 h-3 text-brand-500" /> 3D Digital Twin • Interactive
              </Badge>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: Energy & Peak Load + Quick Actions          */}
          {/* ════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-6">
            {/* Energy & Peak Load Card */}
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white tracking-wide uppercase font-mono">
                  Energy & Peak Load
                </h3>
                <Link
                  href="/simulator"
                  title="Simulate load reductions"
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4 font-mono">
                {/* 1. Peak Cooling Stress */}
                <div className="space-y-1">
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 font-sans">
                    Peak Cooling Stress
                  </div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {DEFAULT_BUILDING_PROFILE.baselinePeakDemandKW.toLocaleString()} kW
                  </div>
                </div>

                {/* 2. Cooling Load Waste */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <span className="text-gray-500 dark:text-gray-400">Cooling Load Waste</span>
                    <span className="font-bold text-brand-500 font-mono">62%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-brand-500"
                      style={{ width: '62%' }}
                    />
                  </div>
                </div>

                {/* 3. Annual Utility Deficit */}
                <div className="space-y-1">
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 font-sans">
                    Annual Utility Deficit
                  </div>
                  <div className="text-xl font-bold text-brand-600 dark:text-brand-400">
                    {formatCurrency(148000)} <span className="text-xs font-normal text-gray-500">/yr</span>
                  </div>
                </div>

                {/* 4. CO2 Emissions */}
                <div className="space-y-1">
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 font-sans">
                    CO₂ Emissions
                  </div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {thermalReport.carbonFootprintTonsCO2} <span className="text-xs font-normal text-gray-500">tCO₂e /yr</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Quick Actions Card */}
            <GlassCard className="p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white tracking-wide uppercase font-mono mb-2">
                Quick Actions
              </h3>
              <div className="space-y-1 text-xs">
                <Link
                  href="/analysis"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/70 dark:hover:bg-white/06 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all group"
                >
                  <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                    <Flame className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium">Run Thermal Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/simulator"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/70 dark:hover:bg-white/06 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all group"
                >
                  <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
                    <Activity className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium">Explore What-If Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/ai-copilot"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/70 dark:hover:bg-white/06 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all group"
                >
                  <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
                    <Bot className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium">Ask AI Copilot</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/reports"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/70 dark:hover:bg-white/06 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all group"
                >
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <DollarSign className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium">Download Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* BOTTOM SUMMARY ROW (4 Full Cards Matching Reference)     */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {/* CARD 1: Annual Cooling Waste */}
          <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase font-mono">
                Annual Cooling Waste
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <TrendingDown className="w-3 h-3" /> -12%
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black text-brand-600 dark:text-brand-400 font-mono tracking-tight">
                3.84M <span className="text-base font-semibold text-gray-500">kWh</span>
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Modeled Baseline Demand
              </div>
            </div>

            {/* Mini Area Chart */}
            <div className="pt-2">
              <svg className="w-full h-10" viewBox="0 0 200 40" fill="none">
                <defs>
                  <linearGradient id="coolingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 32 Q 40 38, 70 20 T 130 15 T 200 24 L 200 40 L 0 40 Z"
                  fill="url(#coolingGrad)"
                />
                <path
                  d="M 0 32 Q 40 38, 70 20 T 130 15 T 200 24"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mt-1">
                <span>Jan</span>
                <span>Apr</span>
                <span>Jul</span>
                <span>Oct</span>
              </div>
            </div>
          </GlassCard>

          {/* CARD 2: Thermal Stress Index */}
          <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase font-mono">
                Thermal Stress Index
              </span>
              <span className="p-1 rounded-full bg-rose-500/10 text-rose-500">
                <Shield className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                {thermalReport.thermalStressScore} <span className="text-base font-semibold text-gray-400">/ 100</span>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-bold font-mono">
                Critical Risk Zone
              </div>
            </div>

            {/* Severity Spectrum Bar with Marker Pin */}
            <div className="space-y-1.5 pt-3">
              <div className="relative h-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600">
                <div
                  className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-900 shadow-md"
                  style={{ left: `${thermalReport.thermalStressScore - 2}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                <span>Optimal</span>
                <span>High</span>
                <span>Critical</span>
              </div>
            </div>
          </GlassCard>

          {/* CARD 3: Recommended Retrofit */}
          <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase font-mono">
                Recommended Retrofit
              </span>
              <span className="p-1 rounded-full bg-amber-500/10 text-amber-500">
                <Star className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold text-brand-600 dark:text-brand-400 leading-snug">
                Cool Roof Coating
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                Rank #1 • SRI 108 Elastomeric
              </div>
            </div>

            <div className="pt-2">
              <Link href="/retrofits">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Retrofit Details
                </Button>
              </Link>
            </div>
          </GlassCard>

          {/* CARD 4: Financial ROI & Payback */}
          <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase font-mono">
                Financial ROI & Payback
              </span>
              <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-400 font-mono">20-Yr Net Present Value</div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                +$342,000
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-mono text-gray-500 dark:text-gray-400">
              <span>CapEx: <strong className="text-gray-900 dark:text-white font-bold">$49,700</strong></span>
              <span>•</span>
              <span>Payback: <strong className="text-gray-900 dark:text-white font-bold">{topRetrofit.paybackPeriodYears} yrs</strong></span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

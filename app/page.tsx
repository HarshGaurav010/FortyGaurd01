'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { FeatureCards } from '@/components/home/feature-cards';
import { ProjectFramework } from '@/components/home/project-framework';
import { CTASection } from '@/components/home/cta-section';
import { ScrollReveal } from '@/components/providers/scroll-reveal';
import { OverviewDigitalTwinPreview } from '@/components/digital-twin/overview-digital-twin-preview';
import { retrofitRecommendationEngine } from '@/lib/retrofit/recommendation';
import {
  useBuildingScenario,
  useBuildingThermalModel,
} from '@/components/scenarios/building-scenario-provider';
import { getBaselineHeatMapForScenario } from '@/lib/demo/building-scenario-adapter';
import { formatNumber } from '@/lib/utils/formatters';
import {
  Flame,
  ArrowRight,
  Thermometer,
  Zap,
  TrendingDown,
  Leaf,
  Sun,
  Box,
  Bot,
  Layers,
  BarChart3,
} from 'lucide-react';

export default function HomePage() {
  const { selectedScenario, buildingProfile, thermalReport: scenarioThermalReport } = useBuildingScenario();
  const { building: modelBuilding, report: modelReport, scenario: modelScenario } = useBuildingThermalModel();

  const activeScenario = selectedScenario || modelScenario;
  const activeBuilding = buildingProfile || modelBuilding;
  const activeThermalReport = scenarioThermalReport || modelReport;
  const baselineHeatMap = getBaselineHeatMapForScenario(activeScenario);

  const top3 = useMemo(() => {
    return retrofitRecommendationEngine
      .generateRecommendations(activeBuilding, activeThermalReport, baselineHeatMap)
      .slice(0, 3);
  }, [activeBuilding, activeThermalReport, baselineHeatMap]);

  return (
    <div className="space-y-0">
      {/* ══════════════════════════════════════════════════════════
          A. HERO — OPENING SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col justify-center overflow-hidden border-b border-gray-100 dark:border-white/06 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-[#050b18] dark:via-[#060c1a] dark:to-[#0a1422]">
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-brand-500/05 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-sky-500/04 rounded-full blur-[90px]" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Headline, description, stats & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="brand" pulse>
                <Flame className="w-3.5 h-3.5" /> FortyGuard Heat Intelligence
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.05]">
                Building Thermal&nbsp;
                <span className="text-brand-500">Retrofit Intelligence</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                Powered by FortyGuard hyperlocal Land Surface Temperature telemetry.
                Diagnose thermal stress, rank retrofit interventions, and calculate 20-year ROI — all in one platform.
              </p>

              {/* Key Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {[
                  { label: 'Avg Surface LST', value: `${baselineHeatMap.averageLSTC} °C`, sub: 'FortyGuard baseline', color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'Peak Roof LST', value: `${baselineHeatMap.peakLSTC} °C`, sub: 'Modeled peak', color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'Thermal Stress', value: `${activeThermalReport.thermalStressScore}/100`, sub: `${activeThermalReport.stressCategory} [modeled]`, color: 'text-amber-600 dark:text-amber-400' },
                  { label: 'UHI Anomaly', value: `+${activeThermalReport.urbanHeatIslandImpactDeltaC} °C`, sub: 'Urban heat island', color: 'text-brand-600 dark:text-brand-400' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="p-3 rounded-2xl bg-white/90 dark:bg-[#0c1426] border border-gray-200/80 dark:border-white/10 shadow-sm">
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 font-mono uppercase tracking-wider">{label}</p>
                    <p className={`text-lg sm:text-xl font-black font-mono ${color}`}>{value}</p>
                    <p className="text-[9px] text-gray-400 dark:text-slate-500 font-sans mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/analysis">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-sm hover:shadow-lg transition-all duration-200">
                    Analyze Building
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/digital-twin">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#0c1426] border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-semibold text-sm shadow-sm hover:bg-orange-50/40 dark:hover:bg-[#14203a] hover:border-brand-400 dark:hover:border-brand-500/60 hover:text-brand-950 dark:hover:text-white hover:shadow transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950">
                    <Box className="w-4 h-4 text-brand-500 shrink-0" aria-hidden="true" />
                    Explore 3D Digital Twin
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Architectural / Thermal Blueprint Schematic Card */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-3xl p-5 border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-[#09101f]/95 backdrop-blur-xl shadow-card space-y-4">
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/08 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-gray-900 dark:text-white text-[11px]">THERMAL ENVELOPE AUDIT</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/08 text-[10px] text-gray-500 dark:text-slate-400">
                    {activeScenario.id} · {activeScenario.orientationDegrees}°
                  </span>
                </div>

                {/* Technical Blueprint Visual Schematic */}
                <div className="relative h-44 rounded-2xl bg-gray-50 dark:bg-[#060c18] border border-gray-200/70 dark:border-white/08 p-3 overflow-hidden flex flex-col justify-between">
                  {/* Subtle technical architectural grid pattern */}
                  <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:12px_12px]" />

                  {/* Architectural Blueprint SVG Outline */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 dark:opacity-30" viewBox="0 0 400 180" fill="none">
                    <path d="M 60 140 L 60 70 L 160 70 L 160 40 L 320 40 L 320 140 Z" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="60" y1="105" x2="320" y2="105" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="160" y1="70" x2="160" y2="140" stroke="#f97316" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="240" cy="40" r="4" fill="#f43f5e" />
                    <circle cx="110" cy="85" r="4" fill="#f59e0b" />
                    <circle cx="280" cy="120" r="4" fill="#38bdf8" />
                  </svg>

                  {/* Telemetry Hotspot Callouts */}
                  <div className="relative z-10 flex items-start justify-between text-[10px] font-mono">
                    <div className="p-1.5 rounded-lg bg-white/95 dark:bg-[#0c162b]/95 border border-rose-500/40 shadow-sm">
                      <span className="block text-[8px] uppercase text-rose-500 font-bold">Roof Hotspot</span>
                      <span className="font-bold text-gray-900 dark:text-white">{baselineHeatMap.peakLSTC} °C LST</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/95 dark:bg-[#0c162b]/95 border border-amber-500/40 shadow-sm">
                      <span className="block text-[8px] uppercase text-amber-500 font-bold">Facade Gain</span>
                      <span className="font-bold text-gray-900 dark:text-white">{activeThermalReport.facadeHeatGainKW} kW</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between text-[10px] font-mono">
                    <div className="p-1.5 rounded-lg bg-white/95 dark:bg-[#0c162b]/95 border border-sky-500/40 shadow-sm">
                      <span className="block text-[8px] uppercase text-sky-500 font-bold">Roof Rating</span>
                      <span className="font-bold text-gray-900 dark:text-white">R-{activeScenario.roofRValue} {activeScenario.roofType === 'COOL_ROOF' ? 'Cool Roof' : 'Roof'}</span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-gray-900/80 dark:bg-black/60 text-white text-[9px]">
                      FortyGuard {activeScenario.location.city}
                    </div>
                  </div>
                </div>

                {/* Key Metric Strip */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10">
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Cooling Deficit</p>
                    <p className="text-xs font-black text-brand-600 dark:text-brand-400">${Math.round(activeThermalReport.annualCoolingWasteCostUSD / 1000)}k/yr</p>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10">
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Window-Wall</p>
                    <p className="text-xs font-black text-amber-600 dark:text-amber-400">{Math.round(activeScenario.windowToWallRatio * 100)}% WWR</p>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10">
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">HVAC COP</p>
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">{activeScenario.hvacEfficiencyCOP} COP</p>
                  </div>
                </div>

                {/* Footer link to Digital Twin */}
                <div className="pt-2 border-t border-gray-100 dark:border-white/08 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">{activeScenario.name} model</span>
                  <Link
                    href="/digital-twin"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
                  >
                    Launch BMS Console <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          B. BUILDING HEALTH SUMMARY
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="py-16 border-b border-gray-100 dark:border-white/06">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1.5">
                <Badge variant="rose">BUILDING HEALTH ASSESSMENT</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {activeScenario.name} — {activeScenario.location.city}, {activeScenario.location.state}, {activeScenario.location.country}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {activeScenario.id} · {formatNumber(activeScenario.grossAreaSqFt)} sq ft · {activeScenario.floorsCount} floors · {activeScenario.conditionDescription}
                </p>
              </div>
              <Link href="/analysis">
                <button className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Full Thermal Analysis <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                {
                  icon: <Thermometer className="w-4 h-4 text-rose-500" />,
                  label: 'Thermal Stress Index',
                  value: `${activeThermalReport.thermalStressScore}/100`,
                  sub: `${activeThermalReport.stressCategory} — Modeled`,
                  bg: 'bg-rose-50 dark:bg-rose-500/08 border-rose-200/80 dark:border-rose-500/25',
                  valueColor: 'text-rose-600 dark:text-rose-400',
                },
                {
                  icon: <Zap className="w-4 h-4 text-brand-500" />,
                  label: 'Peak Cooling Demand',
                  value: `${formatNumber(activeBuilding.baselinePeakDemandKW)} kW`,
                  sub: 'Modeled baseline',
                  bg: 'bg-white dark:bg-[#0c1426] border-gray-200/80 dark:border-white/10',
                  valueColor: 'text-gray-900 dark:text-white',
                },
                {
                  icon: <TrendingDown className="w-4 h-4 text-amber-500" />,
                  label: 'Glazing Ratio (WWR)',
                  value: `${Math.round(activeScenario.windowToWallRatio * 100)}% WWR`,
                  sub: `${activeScenario.roofType.replace(/_/g, ' ')} · R-${activeScenario.roofRValue}`,
                  bg: 'bg-amber-50 dark:bg-amber-500/08 border-amber-200/80 dark:border-amber-500/25',
                  valueColor: 'text-amber-600 dark:text-amber-400',
                },
                {
                  icon: <Flame className="w-4 h-4 text-brand-500" />,
                  label: 'Modeled Annual Deficit',
                  value: `$${Math.round(activeThermalReport.annualCoolingWasteCostUSD / 1000)}k/yr`,
                  sub: 'Energy cost waste — est.',
                  bg: 'bg-white dark:bg-[#0c1426] border-gray-200/80 dark:border-white/10',
                  valueColor: 'text-brand-600 dark:text-brand-400',
                },
                {
                  icon: <Leaf className="w-4 h-4 text-emerald-500" />,
                  label: 'Annual CO₂',
                  value: `${activeThermalReport.carbonFootprintTonsCO2} t`,
                  sub: 'Carbon impact — calc.',
                  bg: 'bg-emerald-50 dark:bg-emerald-500/08 border-emerald-200/80 dark:border-emerald-500/25',
                  valueColor: 'text-emerald-600 dark:text-emerald-400',
                },
              ].map(({ icon, label, value, sub, bg, valueColor }) => (
                <GlassCard key={label} className={`p-4 space-y-2 border ${bg}`}>
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider leading-tight">
                      {label}
                    </span>
                  </div>
                  <p className={`text-2xl font-black font-mono ${valueColor} leading-none`}>{value}</p>
                  <p className="text-[10px] text-gray-400 font-sans">{sub}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          C. THERMAL WEAKNESSES
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="py-16 border-b border-gray-100 dark:border-white/06">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <Badge variant="amber" className="mb-3">THERMAL WEAKNESSES DETECTED</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Key Heat Vulnerability Zones
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
                Identified via FortyGuard LST + building envelope thermal model
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  zone: 'Roof Membrane',
                  icon: <Sun className="w-5 h-5 text-rose-500" />,
                  severity: activeThermalReport.thermalStressScore > 50 ? 'CRITICAL' : 'MODERATE',
                  severityColor: activeThermalReport.thermalStressScore > 50
                    ? 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10'
                    : 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10',
                  metric: `${baselineHeatMap.peakLSTC} °C`,
                  metricLabel: 'Peak Roof LST',
                  contribution: '38%',
                  description: `${activeScenario.roofType.replace(/_/g, ' ')} with R-${activeScenario.roofRValue} insulation. Peak roof temperature reaches ${baselineHeatMap.peakLSTC}°C, contributing ${formatNumber(activeThermalReport.roofHeatGainKW)} kW heat gain.`,
                  source: '[FortyGuard baseline]',
                },
                {
                  zone: 'Glazing & Facade',
                  icon: <Sun className="w-5 h-5 text-amber-500" />,
                  severity: activeScenario.windowToWallRatio > 0.4 ? 'HIGH' : 'OPTIMAL',
                  severityColor: activeScenario.windowToWallRatio > 0.4
                    ? 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10'
                    : 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10',
                  metric: `${formatNumber(activeThermalReport.facadeHeatGainKW)} kW`,
                  metricLabel: 'Facade Heat Gain',
                  contribution: '32%',
                  description: `${Math.round(activeScenario.windowToWallRatio * 100)}% window-to-wall ratio facing ${activeScenario.orientationDegrees}° orientation creates substantial perimeter solar heat load in ${activeScenario.location.city}.`,
                  source: '[Modeled solar exposure]',
                },
                {
                  zone: 'HVAC & Envelope',
                  icon: <Layers className="w-5 h-5 text-blue-500" />,
                  severity: activeScenario.hvacEfficiencyCOP < 3.5 ? 'HIGH' : 'OPTIMAL',
                  severityColor: activeScenario.hvacEfficiencyCOP < 3.5
                    ? 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10'
                    : 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10',
                  metric: `${activeScenario.hvacEfficiencyCOP} COP`,
                  metricLabel: 'HVAC Efficiency',
                  contribution: '18%',
                  description: `Building HVAC system is ${activeScenario.hvacAgeYears} years old with COP of ${activeScenario.hvacEfficiencyCOP} and envelope rating of R-${activeScenario.roofRValue}.`,
                  source: '[Building specs — modeled]',
                },
              ].map(({ zone, icon, severity, severityColor, metric, metricLabel, contribution, description, source }) => (
                <GlassCard key={zone} variant="interactive" className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/60 dark:border-white/10">{icon}</div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{zone}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{contribution} heat gain contribution</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${severityColor}`}>
                      {severity}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-gray-900 dark:text-white">{metric}</span>
                    <span className="text-[10px] text-gray-500 font-sans">{metricLabel}</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>

                  <p className="text-[9px] text-gray-400 font-mono">{source}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          D. RETROFIT OPPORTUNITY PREVIEW (Top 3)
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="py-16 border-b border-gray-100 dark:border-white/06">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1.5">
                <Badge variant="green">TOP RETROFIT OPPORTUNITIES</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Rank-Ordered Interventions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  Prioritized by thermal vulnerability impact, energy savings & ROI — modeled estimates
                </p>
              </div>
              <Link href="/retrofits">
                <button className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Full Retrofit Catalog <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((r) => (
                <GlassCard key={r.retrofit.id} variant="interactive" className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {r.priorityRank}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">{r.retrofit.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{r.retrofit.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Energy Save', value: r.estimatedEnergyImpact.formattedRange, color: 'text-emerald-600 dark:text-emerald-400' },
                      { label: 'Payback', value: r.estimatedPaybackYears.formattedRange, color: 'text-gray-900 dark:text-white' },
                      { label: 'Est. CapEx', value: `$${Math.round(r.estimatedCostUSD.min / 1000)}k–$${Math.round(r.estimatedCostUSD.max / 1000)}k`, color: 'text-gray-900 dark:text-white' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/80 dark:border-white/10">
                        <p className={`text-xs font-black font-mono ${color}`}>{value}</p>
                        <p className="text-[9px] text-gray-400 dark:text-slate-500 font-sans mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-white/08 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-mono">Annual Savings (est.)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {r.estimatedAnnualSavingsUSD.formattedRange}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          E. 3D DIGITAL TWIN PREVIEW
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="py-16 border-b border-gray-100 dark:border-white/06">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1.5">
                <Badge variant="cyan">3D DIGITAL TWIN PREVIEW</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Building Digital Twin
                </h2>
                <p className="text-[10px] text-gray-500 font-mono mb-2">
                  Interactive 3D visualization of {activeScenario.name} ({activeScenario.location.city}, {activeScenario.location.state}) with FortyGuard thermal overlays
                </p>
              </div>
              <Link href="/digital-twin">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-sm hover:shadow-lg transition-all duration-200">
                  Open Full Digital Twin
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* Preview canvas - intentionally smaller than the full twin */}
            <OverviewDigitalTwinPreview />

            <p className="text-center text-xs text-gray-400 font-mono">
              Preview mode — drag to orbit &nbsp;·&nbsp; Click hotspots to inspect &nbsp;·&nbsp;
              <Link href="/digital-twin" className="text-brand-500 hover:underline">
                Open full immersive console →
              </Link>
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          F. PLATFORM CAPABILITIES
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <FeatureCards />
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          G. HOW IT WORKS / PROJECT FRAMEWORK
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal delay={0.05}>
        <ProjectFramework />
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          H. AI COPILOT & CTA SECTIONS
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal y={20}>
        <section id="copilot" className="py-16 border-b border-gray-100 dark:border-white/06">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <GlassCard variant="glow" className="p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <Badge variant="violet">
                    <Bot className="w-3.5 h-3.5" /> AI THERMAL COPILOT
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Ask Anything About Your Building
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    The AI Copilot is grounded on your FortyGuard telemetry, thermal calculations, and retrofit catalog. Get precise answers on energy savings, retrofit specifications, and financial projections — all cited to the source data.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <Link href="/ai-copilot">
                    <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all">
                      <Bot className="w-4 h-4" /> Open AI Copilot
                    </button>
                  </Link>
                  <Link href="/reports">
                    <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-white/08 border border-gray-200 dark:border-white/12 text-gray-800 dark:text-white text-sm font-semibold hover:border-brand-300 transition-all">
                      <BarChart3 className="w-4 h-4 text-brand-500" /> View Reports
                    </button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal y={20}>
        <CTASection />
      </ScrollReveal>
    </div>
  );
}

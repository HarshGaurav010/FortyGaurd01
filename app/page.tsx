import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { FeatureCards } from '@/components/home/feature-cards';
import { ProjectFramework } from '@/components/home/project-framework';
import { CTASection } from '@/components/home/cta-section';
import { ScrollReveal } from '@/components/providers/scroll-reveal';
import { OverviewDigitalTwinPreview } from '@/components/digital-twin/overview-digital-twin-preview';
import { CATALOG_RETROFITS } from '@/lib/calculations/thermal-stress-calculator';
import { DEFAULT_BUILDING_PROFILE, computeThermalStressReport } from '@/lib/models/building-thermal-model';
import {
  Flame,
  ArrowRight,
  Thermometer,
  Zap,
  TrendingDown,
  Leaf,
  Sun,
  Shield,
  AlertTriangle,
  Box,
  Bot,
  Layers,
  BarChart3,
} from 'lucide-react';

// ── Shared consistent heatmap for all Overview calculations ──
const OVERVIEW_HEATMAP = {
  regionId: 'FG-DXB-001',
  regionName: 'Downtown Financial District',
  center: DEFAULT_BUILDING_PROFILE.coordinates,
  gridResolutionMeters: 2.0,
  averageLSTC: 48.4,
  peakLSTC: 56.8,
  heatStressScore: 33,
  thermalHotspots: [],
  points: [],
};

export default function HomePage() {
  // Compute consistently from the real formula (produces 33)
  const thermalReport = computeThermalStressReport(DEFAULT_BUILDING_PROFILE, OVERVIEW_HEATMAP);
  const top3 = CATALOG_RETROFITS.slice(0, 3);

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
                  { label: 'Avg Surface LST', value: '48.4 °C', sub: 'FortyGuard telemetry', color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'Peak Roof LST', value: '56.8 °C', sub: 'Satellite measured', color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'Thermal Stress', value: `${thermalReport.thermalStressScore}/100`, sub: 'Modeled score', color: 'text-amber-600 dark:text-amber-400' },
                  { label: 'UHI Anomaly', value: `+${thermalReport.urbanHeatIslandImpactDeltaC} °C`, sub: 'Urban heat island', color: 'text-brand-600 dark:text-brand-400' },
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
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#0c1426] border border-gray-200 dark:border-white/12 text-gray-800 dark:text-white font-semibold text-sm hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-sm transition-all duration-200">
                    <Box className="w-4 h-4 text-brand-500" />
                    Explore 3D Digital Twin
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Subtle Architectural / Thermal Blueprint Schematic Card */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-3xl p-5 border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-[#09101f]/95 backdrop-blur-xl shadow-card space-y-4">
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/08 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-gray-900 dark:text-white text-[11px]">THERMAL ENVELOPE AUDIT</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/08 text-[10px] text-gray-500 dark:text-slate-400">
                    DXB-2024 · 165° SSE
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
                      <span className="font-bold text-gray-900 dark:text-white">56.8 °C LST</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/95 dark:bg-[#0c162b]/95 border border-amber-500/40 shadow-sm">
                      <span className="block text-[8px] uppercase text-amber-500 font-bold">Solar Gain</span>
                      <span className="font-bold text-gray-900 dark:text-white">880 W/m²</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between text-[10px] font-mono">
                    <div className="p-1.5 rounded-lg bg-white/95 dark:bg-[#0c162b]/95 border border-sky-500/40 shadow-sm">
                      <span className="block text-[8px] uppercase text-sky-500 font-bold">Insulation Gap</span>
                      <span className="font-bold text-gray-900 dark:text-white">R-8.5 Wall</span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-gray-900/80 dark:bg-black/60 text-white text-[9px]">
                      FortyGuard 1.5m² Grid
                    </div>
                  </div>
                </div>

                {/* Key Metric Strip */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10">
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Cooling Deficit</p>
                    <p className="text-xs font-black text-brand-600 dark:text-brand-400">$148k/yr</p>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10">
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Waste Ratio</p>
                    <p className="text-xs font-black text-amber-600 dark:text-amber-400">62%</p>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10">
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Top Payback</p>
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">1.6 yrs</p>
                  </div>
                </div>

                {/* Footer link to Digital Twin */}
                <div className="pt-2 border-t border-gray-100 dark:border-white/08 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">Nexus Horizon Villa model</span>
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
                  Nexus Horizon Villa — Dubai, UAE
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  FortyGuard heat data · Building thermal model · Real-time analysis
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
                  value: `${thermalReport.thermalStressScore}/100`,
                  sub: `${thermalReport.stressCategory} — Modeled`,
                  bg: 'bg-rose-50 dark:bg-rose-500/08 border-rose-200/80 dark:border-rose-500/25',
                  valueColor: 'text-rose-600 dark:text-rose-400',
                },
                {
                  icon: <Zap className="w-4 h-4 text-brand-500" />,
                  label: 'Peak Cooling Demand',
                  value: `${DEFAULT_BUILDING_PROFILE.baselinePeakDemandKW.toLocaleString()} kW`,
                  sub: 'Measured baseline',
                  bg: 'bg-white dark:bg-[#0c1426] border-gray-200/80 dark:border-white/10',
                  valueColor: 'text-gray-900 dark:text-white',
                },
                {
                  icon: <TrendingDown className="w-4 h-4 text-amber-500" />,
                  label: 'Cooling Load Waste',
                  value: '62%',
                  sub: 'Of total HVAC energy',
                  bg: 'bg-amber-50 dark:bg-amber-500/08 border-amber-200/80 dark:border-amber-500/25',
                  valueColor: 'text-amber-600 dark:text-amber-400',
                },
                {
                  icon: <Flame className="w-4 h-4 text-brand-500" />,
                  label: 'Modeled Annual Deficit',
                  value: `$${Math.round(thermalReport.annualCoolingWasteCostUSD / 1000)}k/yr`,
                  sub: 'Energy cost waste — est.',
                  bg: 'bg-white dark:bg-[#0c1426] border-gray-200/80 dark:border-white/10',
                  valueColor: 'text-brand-600 dark:text-brand-400',
                },
                {
                  icon: <Leaf className="w-4 h-4 text-emerald-500" />,
                  label: 'Annual CO₂',
                  value: `${thermalReport.carbonFootprintTonsCO2} t`,
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
                  severity: 'CRITICAL',
                  severityColor: 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10',
                  metric: '56.8 °C',
                  metricLabel: 'Peak Surface LST',
                  contribution: '38%',
                  description: 'Black bitumen waterproofing membrane absorbs 88% of solar radiation. Peak roof temperature reaches 56.8°C under full sun, driving severe heat gain into the top 3 floors.',
                  source: '[FortyGuard measured]',
                },
                {
                  zone: 'South-East Glazing',
                  icon: <Sun className="w-5 h-5 text-amber-500" />,
                  severity: 'HIGH',
                  severityColor: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10',
                  metric: '880 W/m²',
                  metricLabel: 'Peak Solar Irradiance',
                  contribution: '32%',
                  description: '58% window-to-wall ratio facing 165° SSE means perimeter offices receive near-peak direct solar load during working hours, creating glare and radiant discomfort.',
                  source: '[FortyGuard solar data]',
                },
                {
                  zone: 'Envelope Insulation',
                  icon: <Layers className="w-5 h-5 text-blue-500" />,
                  severity: 'HIGH',
                  severityColor: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10',
                  metric: 'R-8.5',
                  metricLabel: 'Wall Thermal Resistance',
                  contribution: '18%',
                  description: 'Perimeter concrete frame creates thermal bridging across column connections. Current R-8.5 wall insulation is well below ASHRAE 90.1 targets for hot-dry climate zones.',
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
                  Sorted by payback period — modeled estimates based on FortyGuard LST + building specs
                </p>
              </div>
              <Link href="/retrofits">
                <button className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Full Retrofit Catalog <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((r, i) => (
                <GlassCard key={r.id} variant="interactive" className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {r.recommendedRank}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">{r.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{r.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Energy Save', value: `${r.expectedCoolingEnergyReductionPct}%`, color: 'text-emerald-600 dark:text-emerald-400' },
                      { label: 'Payback', value: `${r.paybackPeriodYears} yrs`, color: 'text-gray-900 dark:text-white' },
                      { label: 'Est. CapEx', value: `$${Math.round(r.estTotalCostUSD / 1000)}k`, color: 'text-gray-900 dark:text-white' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/80 dark:border-white/10">
                        <p className={`text-sm font-black font-mono ${color}`}>{value}</p>
                        <p className="text-[9px] text-gray-400 dark:text-slate-500 font-sans mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-white/08 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-mono">Annual Savings (est.)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      +${(r.expectedAnnualSavingsUSD / 1000).toFixed(1)}k/yr
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
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  Interactive 3D visualization of Nexus Horizon Villa with live FortyGuard thermal overlays
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
                  <Link href="/analysis">
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

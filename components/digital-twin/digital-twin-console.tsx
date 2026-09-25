'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Sun,
  Shield,
  Layers,
  Activity,
  Compass,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  Building2,
  Zap,
  CheckCircle2,
  X,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ChevronLeft,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OverviewHouseScene, CameraViewPreset } from '@/components/building/overview-house-scene';
import {
  useBuildingScenario,
  useBuildingThermalModel,
} from '@/components/scenarios/building-scenario-provider';
import { getBaselineHeatMapForScenario } from '@/lib/demo/building-scenario-adapter';
import { CATALOG_RETROFITS } from '@/lib/calculations/thermal-stress-calculator';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

type ViewLayerMode = 'heatmap' | 'solar' | 'retrofit' | 'baseline';

export const DigitalTwinConsole: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewLayerMode>('heatmap');
  const [timeOfDay, setTimeOfDay] = useState<number>(14);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>('iso');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showLeftPanel, setShowLeftPanel] = useState<boolean>(true);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);

  // Consume scenario and thermal model from single source of truth provider
  const { selectedScenario, buildingProfile, thermalReport: scenarioThermalReport } = useBuildingScenario();
  const { building: modelBuilding, report: modelReport, scenario: modelScenario } = useBuildingThermalModel();

  const activeScenario = selectedScenario || modelScenario;
  const activeBuilding = buildingProfile || modelBuilding;
  const activeThermalReport = scenarioThermalReport || modelReport;
  const baselineHeatMap = getBaselineHeatMapForScenario(activeScenario);

  const topRetrofit = CATALOG_RETROFITS[0];

  const hotspotDetails: Record<
    string,
    {
      title: string;
      location: string;
      temp: string;
      anomaly: string;
      solution: string;
      solutionSpecs: string;
      savings: string;
      payback: string;
    }
  > = {
    roof: {
      title: 'Roof Membrane Hotspot',
      location: `Main Rooftop Slab (${formatNumber(activeScenario.roofAreaSqFt)} sq ft)`,
      temp: `${baselineHeatMap.peakLSTC} °C`,
      anomaly: `R-${activeScenario.roofRValue} (${activeScenario.roofType.replace(/_/g, ' ')})`,
      solution: 'High-Albedo Cool Roof Coating (SRI 108)',
      solutionSpecs:
        'Elastomeric acrylic solar-reflective coating reflecting 88% solar radiation.',
      savings: `${formatCurrency(Math.round(activeThermalReport.annualCoolingWasteCostUSD * 0.38))} /yr`,
      payback: '1.6 yrs',
    },
    facade: {
      title: 'South-East Panoramic Glazing',
      location: `${activeScenario.orientationDegrees}° Solar Exposure Facade`,
      temp: `${(baselineHeatMap.peakLSTC - 7.6).toFixed(1)} °C`,
      anomaly: `${Math.round(activeScenario.windowToWallRatio * 100)}% WWR Glazing`,
      solution: 'Spectrally Selective Nano-Ceramic Film',
      solutionSpecs:
        'Applied to interior/exterior glass surfaces to suppress solar infrared gain.',
      savings: `${formatCurrency(Math.round(activeThermalReport.annualCoolingWasteCostUSD * 0.32))} /yr`,
      payback: '2.4 yrs',
    },
    insulation: {
      title: 'Envelope Thermal Bridge',
      location: 'Ground Floor Entryway & Perimeter Walls',
      temp: `${(baselineHeatMap.averageLSTC - 3.8).toFixed(1)} °C`,
      anomaly: `R-${activeScenario.roofRValue} Insulation Profile`,
      solution: 'EIFS Wall Thermal Insulation Upgrade',
      solutionSpecs:
        'Continuous EPS barrier system boosting perimeter thermal resistance.',
      savings: `${formatCurrency(Math.round(activeThermalReport.annualCoolingWasteCostUSD * 0.18))} /yr`,
      payback: '5.9 yrs',
    },
  };

  const activeHotspot = selectedHotspot ? hotspotDetails[selectedHotspot] : null;

  // Stress category display
  const stressCategoryLabel: Record<string, { label: string; color: string }> = {
    OPTIMAL: { label: 'Optimal', color: 'text-emerald-600 dark:text-emerald-400' },
    MODERATE: { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400' },
    HIGH: { label: 'High', color: 'text-orange-600 dark:text-orange-400' },
    EXTREME: { label: 'Extreme', color: 'text-rose-600 dark:text-rose-400' },
    CRITICAL: { label: 'Critical', color: 'text-red-600 dark:text-red-400' },
  };
  const stressDisplay = stressCategoryLabel[activeThermalReport.stressCategory] ??
    stressCategoryLabel['MODERATE'];

  return (
    // Full-page immersive BMS console — occupies all space below the 80px navbar without conflicting with layout footer
    <div className="relative w-full flex flex-col bg-gray-50 dark:bg-[#03060f] select-none" style={{ height: 'calc(100svh - 80px)' }}>
      {/* ═══════════════════════════════════════════════════════════════
          TOP CONTROL BAR
      ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 z-30 h-11 flex items-center justify-between gap-2 px-3 bg-white/90 dark:bg-[#080e1c]/90 border-b border-gray-200/80 dark:border-white/08 backdrop-blur-xl text-xs font-mono">
        {/* Left: Identity */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Overview</span>
          </Link>
          <span className="text-gray-200 dark:text-gray-700">|</span>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline text-[11px] text-gray-500 dark:text-slate-400">
              Model:
            </span>
            <strong className="text-gray-900 dark:text-white">{activeScenario.name}</strong>
          </div>
          <span className="text-gray-200 dark:text-gray-700 hidden md:inline">·</span>
          <span className="text-gray-700 dark:text-gray-300 hidden md:inline truncate">
            Location:{' '}
            <strong className="text-gray-900 dark:text-white">{activeScenario.location.city}, {activeScenario.location.state}</strong>
          </span>
          <span className="text-gray-200 dark:text-gray-700 hidden lg:inline">·</span>
          <span className="text-gray-500 hidden lg:inline">{activeScenario.id} · FortyGuard LST</span>
        </div>

        {/* Center: View Presets */}
        <div className="hidden lg:flex items-center gap-0.5 p-0.5 rounded-xl bg-gray-100 dark:bg-[#0c1426] border border-gray-200/80 dark:border-white/10 shrink-0">
          {(
            [
              { id: 'iso', label: 'Isometric' },
              { id: 'south', label: 'South' },
              { id: 'east', label: 'East' },
              { id: 'north', label: 'North' },
              { id: 'plan', label: 'Top (Plan)' },
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              onClick={() => setCameraPreset(preset.id)}
              className={`px-2.5 py-1 rounded-lg transition-all text-[10px] ${cameraPreset === preset.id
                  ? 'bg-white dark:bg-[#16233b] text-gray-900 dark:text-white shadow-sm font-semibold border border-transparent dark:border-white/15'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Right: Tool Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`h-7 px-2.5 rounded-lg border text-[10px] transition-all flex items-center gap-1 ${autoRotate
                ? 'bg-brand-500 text-white border-transparent'
                : 'bg-white dark:bg-[#0c1426] text-gray-600 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <RefreshCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`h-7 px-2.5 rounded-lg border text-[10px] transition-all flex items-center gap-1 ${showHotspots
                ? 'bg-gray-100 dark:bg-[#16233b] text-gray-900 dark:text-white border-gray-300 dark:border-white/20 font-semibold'
                : 'bg-white dark:bg-[#0c1426] text-gray-500 dark:text-slate-400 border-gray-200 dark:border-white/10'
              }`}
          >
            {showHotspots ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">Markers</span>
          </button>

          {/* Panel toggles (mobile) */}
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="lg:hidden h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            {showLeftPanel ? (
              <PanelLeftClose className="w-3 h-3" />
            ) : (
              <PanelLeftOpen className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="lg:hidden h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            {showRightPanel ? (
              <PanelRightClose className="w-3 h-3" />
            ) : (
              <PanelRightOpen className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN WORKSPACE (below top bar, above bottom bar)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-11 left-0 right-0 bottom-14 flex overflow-hidden">
        {/* ── LEFT PANEL ───────────────────────────────────────────── */}
        {showLeftPanel && (
          <aside className="relative z-20 w-64 xl:w-72 shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-[#070d1a]/95 backdrop-blur-xl p-3 pb-8 gap-3.5">
            {/* BUILDING */}
            <section>
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-white/08">
                <Building2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                  BUILDING
                </span>
                <span className="ml-auto text-[9px] font-mono text-gray-400 dark:text-slate-500">{activeScenario.id}</span>
              </div>
              <dl className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                {[
                  { label: 'Name', value: activeScenario.name },
                  { label: 'Location', value: `${activeScenario.location.city}, ${activeScenario.location.state}` },
                  { label: 'Orientation', value: `${activeScenario.orientationDegrees}°`, accent: true },
                  { label: 'Gross Area', value: `${formatNumber(activeScenario.grossAreaSqFt)} sq ft` },
                  { label: 'Floors', value: `${activeScenario.floorsCount} floors` },
                  { label: 'Window-Wall', value: `${Math.round(activeScenario.windowToWallRatio * 100)}% WWR` },
                  { label: 'Roof Type', value: activeScenario.roofType.replace(/_/g, ' ') },
                  { label: 'Roof R-Val', value: `R-${activeScenario.roofRValue}` },
                  { label: 'HVAC COP', value: `${activeScenario.hvacEfficiencyCOP} COP` },
                  { label: 'Condition', value: activeScenario.conditionDescription },
                ].map(({ label, value, accent }) => (
                  <div
                    key={label}
                    className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm"
                  >
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans leading-none mb-1">
                      {label}
                    </span>
                    <span
                      className={`font-semibold truncate block leading-tight ${accent
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-gray-900 dark:text-white'
                        }`}
                      title={value}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </dl>
            </section>

            {/* LAYERS */}
            <section>
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-white/08">
                <Layers className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                  LAYERS
                </span>
                <span className="ml-auto text-[9px] font-mono text-gray-400 dark:text-slate-500">Live Shaders</span>
              </div>
              <div className="space-y-1.5">
                {[
                  {
                    id: 'heatmap' as const,
                    name: 'Thermal Stress',
                    desc: 'Surface LST Heatmap',
                    icon: <Flame className="w-3.5 h-3.5 text-rose-500" />,
                    active: 'border-rose-500/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-200 shadow-sm font-semibold',
                  },
                  {
                    id: 'solar' as const,
                    name: 'Solar Exposure',
                    desc: 'Irradiance & Facade Gain',
                    icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
                    active: 'border-amber-500/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-200 shadow-sm font-semibold',
                  },
                  {
                    id: 'retrofit' as const,
                    name: 'Cool Barrier',
                    desc: 'High-Albedo Reflective Coat',
                    icon: <Shield className="w-3.5 h-3.5 text-sky-500" />,
                    active: 'border-sky-500/60 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-200 shadow-sm font-semibold',
                  },
                  {
                    id: 'baseline' as const,
                    name: 'Structural Model',
                    desc: 'Architectural Blueprint',
                    icon: <Compass className="w-3.5 h-3.5 text-emerald-500" />,
                    active: 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-200 shadow-sm font-semibold',
                  },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setViewMode(layer.id)}
                    className={`w-full text-left p-2 rounded-xl border transition-all flex items-center gap-2.5 text-xs ${viewMode === layer.id
                        ? `${layer.active}`
                        : 'border-gray-200/70 dark:border-white/10 bg-gray-50/70 dark:bg-[#0c1426] text-gray-700 dark:text-slate-200 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#111c33]'
                      }`}
                  >
                    <span className="p-1.5 rounded-lg bg-white dark:bg-[#132039] shadow-sm shrink-0 border border-gray-100 dark:border-white/10">
                      {layer.icon}
                    </span>
                    <span className="overflow-hidden min-w-0">
                      <span className="block truncate font-medium leading-tight text-gray-900 dark:text-white">{layer.name}</span>
                      <span className="block text-[9px] font-mono text-gray-500 dark:text-slate-400 truncate leading-tight">
                        {layer.desc}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* ENVIRONMENTAL TELEMETRY */}
            <section className="mt-auto">
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-white/08">
                <Activity className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                  TELEMETRY
                </span>
                <span className="ml-auto flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  MODELED
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                {[
                  { label: 'Surface LST', value: `${baselineHeatMap.averageLSTC} °C`, color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'Roof LST Peak', value: `${baselineHeatMap.peakLSTC} °C`, color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'UHI Anomaly', value: `+${activeThermalReport.urbanHeatIslandImpactDeltaC} °C`, color: 'text-brand-600 dark:text-brand-400' },
                  { label: 'Solar Irradiance', value: `${Math.round(activeThermalReport.solarExposureRating * 115)} W/m²`, color: 'text-amber-600 dark:text-amber-400' },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm"
                  >
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans leading-none mb-1">
                      {label}
                    </span>
                    <span
                      className={`font-bold leading-tight ${color}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        )}

        {/* ── CENTER: 3D CANVAS (dominant visual hero) ────────────── */}
        <div className="relative flex-1 min-w-0">
          <OverviewHouseScene
            viewMode={viewMode}
            showHotspots={showHotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
            autoRotate={autoRotate}
            timeOfDay={timeOfDay}
            cameraPreset={cameraPreset}
          />

          {/* HOTSPOT INSPECTOR POPUP */}
          {activeHotspot && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 sm:w-96 z-40 p-4 rounded-2xl bg-white/95 dark:bg-[#0a1224]/95 border border-brand-500/40 shadow-elevated backdrop-blur-2xl space-y-3 animate-card-in pointer-events-auto">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                  <span className="text-[10px] font-bold font-mono text-brand-500 uppercase tracking-wider">
                    Hotspot Telemetry
                  </span>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  {activeHotspot.title}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mt-0.5">
                  {activeHotspot.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-[#0f1b33] border border-gray-200/70 dark:border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans">Surface LST</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {activeHotspot.temp}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans">Envelope</span>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {activeHotspot.anomaly}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[9px] text-gray-400 dark:text-slate-500 font-mono block uppercase">
                  Recommended Intervention
                </span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeHotspot.solution}
                </div>
                <p className="text-[10px] text-gray-600 dark:text-slate-300 leading-relaxed">
                  {activeHotspot.solutionSpecs}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-white/08 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans">Est. Savings</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {activeHotspot.savings}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans">Payback</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {activeHotspot.payback}
                  </span>
                </div>
                <Link href="/simulator">
                  <Button variant="primary" size="xs">
                    Simulate
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ───────────────────────────────────────────── */}
        {showRightPanel && (
          <aside className="relative z-20 w-64 xl:w-72 shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-l border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-[#070d1a]/95 backdrop-blur-xl p-3 pb-8 gap-3.5">
            {/* BUILDING HEALTH */}
            <section>
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-white/08">
                <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                  BUILDING HEALTH
                </span>
                <Badge variant="rose" className="ml-auto text-[8px] py-0 px-1.5" pulse>
                  {activeThermalReport.stressCategory}
                </Badge>
              </div>

              {/* Thermal Stress Index */}
              <div className="mb-2.5">
                <p className="text-[9px] text-gray-500 dark:text-slate-400 font-mono uppercase tracking-wider mb-1">
                  Thermal Stress Index{' '}
                  <span className="text-gray-400 dark:text-slate-500 ml-1">[modeled]</span>
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 tracking-tight leading-none">
                    {activeThermalReport.thermalStressScore}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">/ 100</span>
                  <span className={`text-xs font-bold ml-1 ${stressDisplay.color}`}>
                    {stressDisplay.label}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="relative h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600">
                    <div
                      className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-800 dark:border-gray-200 shadow"
                      style={{ left: `${Math.max(2, activeThermalReport.thermalStressScore - 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-400 dark:text-slate-500">
                    <span>0 Optimal</span>
                    <span>50 High</span>
                    <span>100 Critical</span>
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">Roof LST Peak</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{baselineHeatMap.peakLSTC} °C</span>
                  <span className="text-[8px] text-gray-400 dark:text-slate-500 block mt-0.5 font-sans">[FortyGuard]</span>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">Facade Heat Gain</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {activeThermalReport.facadeHeatGainKW} kW
                  </span>
                  <span className="text-[8px] text-gray-400 dark:text-slate-500 block mt-0.5 font-sans">[modeled]</span>
                </div>
              </dl>
            </section>

            {/* ENERGY PERFORMANCE */}
            <section>
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-white/08">
                <Zap className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                  ENERGY PERFORMANCE
                </span>
                <Link href="/analysis" className="ml-auto text-gray-400 hover:text-brand-500 transition-colors" title="Full Analysis">
                  <Maximize2 className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <p className="text-[9px] text-gray-500 dark:text-slate-400 font-sans mb-0.5">Peak Cooling Demand</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">
                    {formatNumber(activeBuilding.baselinePeakDemandKW)} kW
                    <span className="text-[9px] text-gray-400 dark:text-slate-500 font-sans ml-1">[modeled]</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Window-to-Wall Ratio</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">{Math.round(activeScenario.windowToWallRatio * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-brand-500"
                      style={{ width: `${Math.round(activeScenario.windowToWallRatio * 100)}%` }}
                    />
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-1.5">
                  {[
                    {
                      label: 'Annual Deficit',
                      value: `${formatCurrency(activeThermalReport.annualCoolingWasteCostUSD)}/yr`,
                      note: '[modeled]',
                      color: 'text-brand-600 dark:text-brand-400',
                    },
                    {
                      label: 'CO₂ Impact',
                      value: `${activeThermalReport.carbonFootprintTonsCO2} t/yr`,
                      note: '[calc.]',
                      color: 'text-emerald-600 dark:text-emerald-400',
                    },
                  ].map(({ label, value, note, color }) => (
                    <div
                      key={label}
                      className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm"
                    >
                      <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">{label}</span>
                      <span className={`font-bold ${color}`}>{value}</span>
                      <span className="text-[8px] text-gray-400 dark:text-slate-500 block mt-0.5 font-sans">{note}</span>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            {/* TOP INTERVENTION */}
            <section className="mt-1">
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-white/08">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                  TOP INTERVENTION
                </span>
                <Badge variant="green" className="ml-auto text-[8px] py-0 px-1.5">
                  Rank #1
                </Badge>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 space-y-2.5 shadow-sm">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-xs leading-snug">
                    {topRetrofit.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 font-mono">
                    CapEx: {formatCurrency(topRetrofit.estTotalCostUSD)} · Payback:{' '}
                    {topRetrofit.paybackPeriodYears} yrs
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/25 flex justify-between items-center">
                  <span className="text-emerald-700 dark:text-emerald-300 font-sans text-[10px] font-medium">
                    Est. Annual Savings
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                    +{formatCurrency(topRetrofit.expectedAnnualSavingsUSD)}/yr
                  </span>
                </div>

                <div className="flex gap-1.5 pt-0.5">
                  <Link href="/retrofits" className="flex-1">
                    <Button variant="primary" size="xs" className="w-full justify-center text-[10px] shadow-sm">
                      View Retrofits
                    </Button>
                  </Link>
                  <Link href="/simulator" className="flex-1">
                    <Button variant="outline" size="xs" className="w-full justify-center text-[10px] border-gray-300 dark:border-white/15 text-gray-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10">
                      Simulate ROI
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </aside>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM TIMELINE BAR
      ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-14 flex items-center gap-4 px-4 bg-white/95 dark:bg-[#070d1a]/95 border-t border-gray-200/80 dark:border-white/10 backdrop-blur-xl text-xs font-mono">
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-brand-500" />
          <span className="font-bold text-gray-900 dark:text-white text-[10px] font-sans uppercase tracking-wide hidden sm:inline">
            Time:
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-[11px]">
            {String(timeOfDay).padStart(2, '0')}:00
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <input
            type="range"
            min={0}
            max={23}
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(Number(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-[#14213d] rounded-lg"
          />
          <div className="hidden sm:flex justify-between text-[8px] text-gray-400 dark:text-slate-500 px-0.5">
            <span>00:00</span>
            <span>06:00</span>
            <span className="text-amber-500 font-bold">12:00 Zenith</span>
            <span className="text-rose-500 font-bold">14:00 Peak LST</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 shrink-0">
          {[
            { t: 7, label: 'Dawn' },
            { t: 14, label: 'Peak LST' },
            { t: 21, label: 'Night' },
          ].map(({ t, label }) => (
            <button
              key={t}
              onClick={() => setTimeOfDay(t)}
              className={`px-2 py-1 rounded-lg border text-[9px] font-semibold transition-all ${timeOfDay === t
                  ? 'bg-brand-500 text-white border-transparent'
                  : 'bg-gray-100 dark:bg-[#0c1426] text-gray-600 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-brand-400 dark:hover:border-brand-500'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

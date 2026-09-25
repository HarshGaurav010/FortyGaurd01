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
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
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

export const DigitalTwinWorkspace: React.FC = () => {
  // State management
  const [viewMode, setViewMode] = useState<ViewLayerMode>('heatmap');
  const [timeOfDay, setTimeOfDay] = useState<number>(14); // 14:00 Peak heat default
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>('iso');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Collapsible sidebar state for tablet / clean view
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

  // Hotspot details data matching actual catalog retrofits
  const hotspotDetails: Record<
    string,
    {
      title: string;
      location: string;
      temp: string;
      anomaly: string;
      issue: string;
      solution: string;
      solutionSpecs: string;
      savings: string;
      payback: string;
      reduction: string;
    }
  > = {
    roof: {
      title: 'Roof Membrane Hotspot',
      location: `Main Rooftop Slab (${formatNumber(activeScenario.roofAreaSqFt)} sq ft)`,
      temp: `${baselineHeatMap.peakLSTC} °C`,
      anomaly: `R-${activeScenario.roofRValue} (${activeScenario.roofType.replace(/_/g, ' ')})`,
      issue: `Solar absorption on ${activeScenario.roofType.replace(/_/g, ' ')} membrane.`,
      solution: 'High-Albedo Cool Roof Coating (SRI 108)',
      solutionSpecs: 'Elastomeric acrylic solar-reflective coating reflecting 88% solar radiation.',
      savings: `${formatCurrency(Math.round(activeThermalReport.annualCoolingWasteCostUSD * 0.38))} /yr`,
      payback: '1.6 yrs',
      reduction: '-14.5% cooling load (-8.2°C surface)',
    },
    facade: {
      title: 'South-East Panoramic Glazing',
      location: `${activeScenario.orientationDegrees}° Solar Exposure Facade`,
      temp: `${(baselineHeatMap.peakLSTC - 7.6).toFixed(1)} °C`,
      anomaly: `${Math.round(activeScenario.windowToWallRatio * 100)}% WWR Glazing`,
      issue: `Perimeter offices receive heavy solar heat load through windows.`,
      solution: 'Spectrally Selective Nano-Ceramic Film',
      solutionSpecs: 'Applied to glass surfaces to reduce solar heat gain coefficient.',
      savings: `${formatCurrency(Math.round(activeThermalReport.annualCoolingWasteCostUSD * 0.32))} /yr`,
      payback: '2.4 yrs',
      reduction: '-8.2% cooling load (-4.5°C radiant temp)',
    },
    insulation: {
      title: 'Envelope Thermal Bridge',
      location: 'Ground Floor Entryway & Perimeter Walls',
      temp: `${(baselineHeatMap.averageLSTC - 3.8).toFixed(1)} °C`,
      anomaly: `R-${activeScenario.roofRValue} Insulation Profile`,
      issue: `Envelope thermal bridging along structural column connections.`,
      solution: 'EIFS Wall Thermal Insulation Upgrade',
      solutionSpecs: 'Continuous insulation barrier system boosting envelope resistance.',
      savings: `${formatCurrency(Math.round(activeThermalReport.annualCoolingWasteCostUSD * 0.18))} /yr`,
      payback: '5.9 yrs',
      reduction: '-5.4% perimeter conduction losses',
    },
  };

  const activeHotspotInfo = selectedHotspot ? hotspotDetails[selectedHotspot] : null;

  return (
    <section id="twin" className="relative w-full overflow-hidden px-2 sm:px-4 lg:px-6 pt-1 pb-6 select-none">
      {/* ── MASTER DIGITAL TWIN CONSOLE FRAME (Dominant 3D Canvas) ───── */}
      <div className="relative w-full h-[760px] lg:h-[820px] rounded-3xl overflow-hidden border border-gray-200/90 dark:border-white/10 bg-gradient-to-b from-gray-50/80 to-white dark:from-[#090f1d] dark:to-[#03060f] shadow-card">
        {/* 1. THE 3D HOUSE DIGITAL TWIN (Spans full canvas as the primary visual hero) */}
        <div className="absolute inset-0 z-0">
          <OverviewHouseScene
            viewMode={viewMode}
            showHotspots={showHotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
            autoRotate={autoRotate}
            timeOfDay={timeOfDay}
            cameraPreset={cameraPreset}
          />
        </div>

        {/* 2. TOP FLOATING DIGITAL TWIN TOOLBAR */}
        <div className="absolute top-3 left-3 right-3 z-20 pointer-events-auto flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-white/85 dark:bg-[#0c1220]/85 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm text-xs font-mono">
          {/* Left identification */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold tracking-wider text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
              DIGITAL TWIN CONSOLE
            </span>
            <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
            <span className="text-gray-700 dark:text-gray-300 hidden sm:inline text-[11px]">
              Model: <strong className="text-gray-900 dark:text-white font-semibold">{activeScenario.name}</strong>
            </span>
            <span className="text-gray-300 dark:text-gray-700 hidden md:inline">•</span>
            <span className="text-gray-500 hidden md:inline text-[11px]">
              {activeScenario.id} · {activeScenario.location.city}, {activeScenario.location.state}
            </span>
          </div>

          {/* Right Controls: Views & Tools */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* View Elevation Presets */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/06 border border-gray-200/80 dark:border-white/08 text-[11px]">
              {(
                [
                  { id: 'iso', label: 'Isometric' },
                  { id: 'south', label: 'South (Front)' },
                  { id: 'east', label: 'East (Balcony)' },
                  { id: 'north', label: 'North (Rear)' },
                  { id: 'plan', label: 'Top (Plan)' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setCameraPreset(preset.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    cameraPreset === preset.id
                      ? 'bg-white dark:bg-[#1a2744] text-gray-900 dark:text-white shadow-sm font-semibold'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Orbit Button */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 px-2.5 rounded-xl border text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                autoRotate
                  ? 'bg-brand-500 text-white border-transparent shadow-sm'
                  : 'bg-white dark:bg-white/05 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Toggle Continuous Orbit"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Orbit</span>
            </button>

            {/* Hotspots Toggle */}
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`p-1.5 px-2.5 rounded-xl border text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                showHotspots
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-gray-300 dark:border-white/20'
                  : 'bg-white dark:bg-white/05 text-gray-400 border-gray-200 dark:border-white/10'
              }`}
              title="Toggle Hotspot Markers"
            >
              {showHotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Markers</span>
            </button>

            {/* Panel Collapse Toggles */}
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="lg:hidden p-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
              title="Toggle Left Panel"
            >
              {showLeftPanel ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="lg:hidden p-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
              title="Toggle Right Panel"
            >
              {showRightPanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 3. LEFT FLOATING CONTROL PANEL (Building Specs & Layers) */}
        {showLeftPanel && (
          <div className="absolute top-16 left-3 bottom-16 w-72 xl:w-76 z-20 pointer-events-auto flex flex-col gap-3 p-3.5 pb-8 rounded-2xl bg-white/95 dark:bg-[#070d1a]/95 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl shadow-card overflow-y-auto">
            {/* Building Info Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-white/08">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-brand-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                    BUILDING
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500">{activeScenario.id}</span>
              </div>

              {/* Compact Specs Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
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
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-1">{label}</span>
                    <span
                      className={`font-semibold truncate block ${accent ? 'text-brand-600 dark:text-brand-400' : 'text-gray-900 dark:text-white'}`}
                      title={value}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Layers Control */}
            <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-white/08">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-white/08">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                    LAYERS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500">Live Shader</span>
              </div>

              <div className="space-y-1">
                {[
                  {
                    id: 'heatmap' as const,
                    name: 'Thermal Stress',
                    desc: 'Surface LST Heatmap',
                    icon: <Flame className="w-3.5 h-3.5 text-rose-500" />,
                    activeClass: 'border-rose-500/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold',
                  },
                  {
                    id: 'solar' as const,
                    name: 'Solar Exposure',
                    desc: 'Irradiance & Facade Gain',
                    icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
                    activeClass: 'border-amber-500/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold',
                  },
                  {
                    id: 'retrofit' as const,
                    name: 'Cool Barrier',
                    desc: 'High-Albedo Reflective Coat',
                    icon: <Shield className="w-3.5 h-3.5 text-sky-500" />,
                    activeClass: 'border-sky-500/60 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold',
                  },
                  {
                    id: 'baseline' as const,
                    name: 'Structural Model',
                    desc: 'Architectural Blueprint',
                    icon: <Compass className="w-3.5 h-3.5 text-emerald-500" />,
                    activeClass: 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold',
                  },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setViewMode(layer.id)}
                    className={`w-full text-left p-2 rounded-xl border transition-all flex items-center gap-2.5 text-xs ${
                      viewMode === layer.id
                        ? `${layer.activeClass} shadow-sm`
                        : 'border-gray-200/70 dark:border-white/10 bg-gray-50/70 dark:bg-[#0c1426] text-gray-700 dark:text-slate-200 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#111c33]'
                    }`}
                  >
                    <span className="p-1 rounded-lg bg-white dark:bg-[#132039] shadow-sm shrink-0 border border-gray-100 dark:border-white/10">
                      {layer.icon}
                    </span>
                    <span className="overflow-hidden min-w-0">
                      <span className="block truncate font-medium text-gray-900 dark:text-white leading-tight">{layer.name}</span>
                      <span className="block text-[9px] font-mono text-gray-500 dark:text-slate-400 truncate leading-tight">
                        {layer.desc}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hyperlocal Telemetry Stream */}
            <div className="space-y-1.5 pt-1 border-t border-gray-100 dark:border-white/08 mt-auto">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-white/08">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                    TELEMETRY
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  MODELED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                {[
                  { label: 'Surface LST', value: `${baselineHeatMap.averageLSTC} °C`, color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'Roof LST Peak', value: `${baselineHeatMap.peakLSTC} °C`, color: 'text-rose-600 dark:text-rose-400' },
                  { label: 'UHI Anomaly', value: `+${activeThermalReport.urbanHeatIslandImpactDeltaC} °C`, color: 'text-brand-600 dark:text-brand-400' },
                  { label: 'Solar Irrad.', value: `${Math.round(activeThermalReport.solarExposureRating * 115)} W/m²`, color: 'text-amber-600 dark:text-amber-400' },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm"
                  >
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">{label}</span>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. RIGHT FLOATING HEALTH & RETROFIT STATUS PANEL */}
        {showRightPanel && (
          <div className="absolute top-16 right-3 bottom-16 w-72 xl:w-76 z-20 pointer-events-auto flex flex-col gap-3 p-3.5 pb-8 rounded-2xl bg-white/95 dark:bg-[#070d1a]/95 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl shadow-card overflow-y-auto">
            {/* Building Health Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-white/08">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                    BUILDING HEALTH
                  </span>
                </div>
                <Badge variant="rose" className="text-[8px] py-0 px-1.5" pulse>
                  {activeThermalReport.stressCategory}
                </Badge>
              </div>

              {/* Stress Index Dial */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-mono">Thermal Stress Index</span>
                  <span className="text-xs text-gray-400 font-mono">[modeled]</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 tracking-tight leading-none">
                    {activeThermalReport.thermalStressScore}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">/ 100</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-1">
                    {activeThermalReport.stressCategory}
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 right-0 bg-gray-200/70 dark:bg-gray-800/70"
                    style={{ width: `${Math.max(0, 100 - activeThermalReport.thermalStressScore)}%` }}
                  />
                </div>
              </div>

              {/* Envelope Vulnerabilities Quick List */}
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">Roof LST Peak</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{baselineHeatMap.peakLSTC} °C</span>
                  <span className="text-[8px] text-gray-400 block mt-0.5">[FortyGuard]</span>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">Facade Heat Gain</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{activeThermalReport.facadeHeatGainKW} kW</span>
                  <span className="text-[8px] text-gray-400 block mt-0.5">[modeled]</span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-white/08">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-white/08">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-brand-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                    ENERGY PERFORMANCE
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Peak Cooling Demand</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatNumber(activeBuilding.baselinePeakDemandKW)} kW</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                  <div className="flex justify-between mb-1 items-baseline">
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 font-sans">Window-to-Wall</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">{Math.round(activeScenario.windowToWallRatio * 100)}% WWR</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-brand-500"
                      style={{ width: `${Math.round(activeScenario.windowToWallRatio * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">Annual Deficit</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">{formatCurrency(activeThermalReport.annualCoolingWasteCostUSD)}/yr</span>
                    <span className="text-[8px] text-gray-400 block mt-0.5">[modeled]</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 shadow-sm">
                    <span className="text-[9px] text-gray-500 dark:text-slate-400 block font-sans mb-0.5">CO₂ Impact</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeThermalReport.carbonFootprintTonsCO2} t/yr</span>
                    <span className="text-[8px] text-gray-400 block mt-0.5">[calc.]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Retrofit Recommendation */}
            <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-white/08 mt-auto">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-white/08">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                    TOP INTERVENTION
                  </span>
                </div>
                <Badge variant="green" className="text-[8px] py-0 px-1.5">
                  Rank #1
                </Badge>
              </div>

              <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200/70 dark:border-white/10 space-y-2 shadow-sm">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-snug">
                    {topRetrofit.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 font-mono">
                    CapEx: {formatCurrency(topRetrofit.estTotalCostUSD)} · Payback: {topRetrofit.paybackPeriodYears} yrs
                  </p>
                </div>

                <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/25 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 dark:text-emerald-300 font-sans text-[10px] font-medium">Est. Annual Savings</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">+{formatCurrency(topRetrofit.expectedAnnualSavingsUSD)}/yr</span>
                </div>

                <div className="pt-0.5 flex gap-1.5">
                  <Link href="/retrofits" className="flex-1">
                    <Button variant="primary" size="xs" className="w-full justify-center text-[11px] shadow-sm">
                      View Retrofits
                    </Button>
                  </Link>
                  <Link href="/analysis" className="flex-1">
                    <Button variant="outline" size="xs" className="w-full justify-center text-[11px] border-gray-300 dark:border-white/15 text-gray-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10">
                      Full Audit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. HOTSPOT INSPECTOR POPUP (when clicked) */}
        {activeHotspotInfo && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 sm:w-96 z-30 p-4 rounded-2xl bg-white/95 dark:bg-[#0c1220]/95 border border-brand-500/50 shadow-elevated backdrop-blur-2xl space-y-3 animate-card-in pointer-events-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
                <span className="text-[11px] font-bold font-mono text-brand-500 uppercase tracking-wider">
                  Hotspot Telemetry
                </span>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                {activeHotspotInfo.title}
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                {activeHotspotInfo.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-gray-50 dark:bg-white/04 border border-gray-100 dark:border-white/06 text-xs font-mono">
              <div>
                <span className="text-[9px] text-gray-400 block font-sans">Surface LST</span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  {activeHotspotInfo.temp}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block font-sans">Envelope</span>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {activeHotspotInfo.anomaly}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[9px] text-gray-400 font-mono block uppercase">Recommended Intervention</span>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeHotspotInfo.solution}
              </div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                {activeHotspotInfo.solutionSpecs}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-white/08 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[9px] text-gray-400 block font-sans">Est. Savings</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {activeHotspotInfo.savings}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block font-sans">Payback</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {activeHotspotInfo.payback}
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

        {/* 6. BOTTOM FLOATING TIMELINE STRIP */}
        <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-auto px-4 py-2.5 rounded-2xl bg-white/85 dark:bg-[#0c1220]/85 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl shadow-card flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
          {/* Time & Solar Trajectory Slider */}
          <div className="flex-1 w-full flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] font-sans">
                Time:
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-[11px]">
                {String(timeOfDay).padStart(2, '0')}:00 HRS
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-0.5">
              <input
                type="range"
                min={0}
                max={23}
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[8px] text-gray-400">
                <span>00:00</span>
                <span>06:00 (Dawn)</span>
                <span className="text-amber-500 font-bold">12:00 (Zenith)</span>
                <span className="text-rose-500 font-bold">14:00 (Peak LST)</span>
                <span>18:00 (Dusk)</span>
                <span>23:00</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setTimeOfDay(14)}
              className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all ${
                timeOfDay === 14
                  ? 'bg-brand-500 text-white border-transparent'
                  : 'bg-gray-100 dark:bg-white/05 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-400'
              }`}
            >
              14:00 Peak LST
            </button>
            <button
              onClick={() => setTimeOfDay(10)}
              className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all ${
                timeOfDay === 10
                  ? 'bg-brand-500 text-white border-transparent'
                  : 'bg-gray-100 dark:bg-white/05 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-400'
              }`}
            >
              10:00 Morning
            </button>
            <button
              onClick={() => setTimeOfDay(21)}
              className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all ${
                timeOfDay === 21
                  ? 'bg-brand-500 text-white border-transparent'
                  : 'bg-gray-100 dark:bg-white/05 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-400'
              }`}
            >
              21:00 Night
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

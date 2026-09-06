'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, RefreshCw, Flame, Sun, Shield, Compass, ArrowRight } from 'lucide-react';
import { OverviewHouseScene } from '@/components/building/overview-house-scene';

type LayerMode = 'heatmap' | 'solar' | 'retrofit' | 'baseline';

/**
 * OverviewDigitalTwinPreview
 *
 * A compact, read-only digital twin preview widget for the Overview (/) page.
 * Intentionally smaller than the full-page DigitalTwinConsole at /digital-twin.
 * Provides basic layer switching and hotspot visibility toggle.
 */
export const OverviewDigitalTwinPreview: React.FC = () => {
  const [viewMode, setViewMode] = useState<LayerMode>('heatmap');
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-card bg-white dark:bg-[#06091a]">
      {/* Preview Canvas */}
      <div className="relative h-[420px] sm:h-[520px]">
        <OverviewHouseScene
          viewMode={viewMode}
          showHotspots={showHotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
          autoRotate={autoRotate}
          timeOfDay={14}
          cameraPreset="iso"
        />

        {/* Small floating controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          {/* Layer switcher */}
          <div className="flex flex-col gap-1 p-1 rounded-2xl bg-white/90 dark:bg-[#0c1220]/90 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl shadow-card">
            {[
              { id: 'heatmap' as const, icon: <Flame className="w-3.5 h-3.5 text-rose-500" />, title: 'Thermal' },
              { id: 'solar' as const, icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, title: 'Solar' },
              { id: 'retrofit' as const, icon: <Shield className="w-3.5 h-3.5 text-sky-500" />, title: 'Retrofit' },
              { id: 'baseline' as const, icon: <Compass className="w-3.5 h-3.5 text-emerald-500" />, title: 'Structural' },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setViewMode(layer.id)}
                title={layer.title}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === layer.id
                    ? 'bg-brand-500/15 ring-1 ring-brand-500/50'
                    : 'hover:bg-gray-100 dark:hover:bg-white/08'
                }`}
              >
                {layer.icon}
              </button>
            ))}
          </div>

          {/* Utility buttons */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Orbit"
            className={`p-2 rounded-xl border backdrop-blur-xl shadow-card transition-all ${
              autoRotate
                ? 'bg-brand-500 text-white border-transparent'
                : 'bg-white/90 dark:bg-[#0c1220]/90 border-gray-200/80 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            title="Toggle Markers"
            className={`p-2 rounded-xl border backdrop-blur-xl shadow-card transition-all ${
              showHotspots
                ? 'bg-white/90 dark:bg-[#0c1220]/90 border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300'
                : 'bg-white/90 dark:bg-[#0c1220]/90 border-gray-200/80 dark:border-white/10 text-gray-400'
            }`}
          >
            {showHotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom CTA Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-white/95 dark:from-[#06091a]/95 to-transparent pt-12 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {viewMode === 'heatmap' && 'FortyGuard Land Surface Temperature · Thermal Stress Mode'}
              {viewMode === 'solar' && 'Solar Irradiance · 880 W/m² at 165° SSE orientation'}
              {viewMode === 'retrofit' && 'High-Albedo Cool Roof Coating (SRI 108) · Retrofit Mode'}
              {viewMode === 'baseline' && 'Structural Blueprint · 16-Floor Commercial Building'}
            </p>
          </div>
          <Link href="/digital-twin">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all">
              Full Digital Twin <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Eye, Thermometer, ShieldAlert, Cpu, Activity } from 'lucide-react';

export const ThermalExplanation: React.FC = () => {
  return (
    <section className="py-24 border-t border-gray-100 dark:border-white/06 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="brand">
            HYPERLOCAL HEAT INTELLIGENCE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Powered by FortyGuard Microclimate Telemetry
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Generic weather station data misses local microclimate anomalies. FortyGuard captures Land Surface Temperature (LST), solar load, and urban heat island effects down to 1.5-meter spatial resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="interactive" className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/15 border border-sky-100 dark:border-sky-500/25 flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Land Surface Temperature (LST)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Measures true radiated surface temperatures on roofs, parking lots, and facades—which often exceed ambient air temperature by up to 22°C under direct solar radiation.
            </p>
            <div className="pt-2 font-mono text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
              Target Precision: 1.5m² Grid Resolution
            </div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Urban Heat Island (UHI) Penalty</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Quantifies local heat retention anomalies caused by surrounding asphalt, concrete structures, and HVAC exhaust plumes that elevate baseline cooling demand.
            </p>
            <div className="pt-2 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Microclimate Anomaly Delta: +8.4°C
            </div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Solar Radiance & Orientation</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Integrates solar azimuth angle and glazing heat transfer coefficients (SHGC) to calculate exact directional heat gain across East, South, and West building facades.
            </p>
            <div className="pt-2 font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              Peak Solar Irradiance: 920 W/m²
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

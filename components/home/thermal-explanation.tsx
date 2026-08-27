'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Eye, Thermometer, ShieldAlert, Cpu, Activity } from 'lucide-react';

export const ThermalExplanation: React.FC = () => {
  return (
    <section className="py-20 bg-dark-950 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="cyan" className="px-3.5 py-1">
            HYPERLOCAL HEAT INTELLIGENCE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Powered by FortyGuard Microclimate Telemetry
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Generic weather station data misses local microclimate anomalies. FortyGuard captures Land Surface Temperature (LST), solar load, and urban heat island effects down to 1.5-meter spatial resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="interactive" className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Land Surface Temperature (LST)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Measures true radiated surface temperatures on roofs, parking lots, and facades—which often exceed ambient air temperature by up to 22°C under direct solar radiation.
            </p>
            <div className="pt-2 font-mono text-[11px] text-cyan-400">
              Target Precision: 1.5m² Grid Resolution
            </div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Urban Heat Island (UHI) Penalty</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quantifies local heat retention anomalies caused by surrounding asphalt, concrete structures, and HVAC exhaust plumes that elevate baseline cooling demand.
            </p>
            <div className="pt-2 font-mono text-[11px] text-indigo-400">
              Microclimate Anomaly Delta: +8.4°C
            </div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Solar Radiance & Orientation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Integrates solar azimuth angle and glazing heat transfer coefficients (SHGC) to calculate exact directional heat gain across East, South, and West building facades.
            </p>
            <div className="pt-2 font-mono text-[11px] text-amber-400">
              Peak Solar Irradiance: 920 W/m²
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

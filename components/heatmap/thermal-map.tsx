'use client';

import React, { useState } from 'react';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Layers, Thermometer, ShieldAlert } from 'lucide-react';
import { formatTemperature } from '@/lib/utils/formatters';

interface ThermalMapProps {
  heatMapData: FortyGuardHeatMap;
}

export const ThermalMap: React.FC<ThermalMapProps> = ({ heatMapData }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(heatMapData.thermalHotspots[0]?.id || null);

  const activeHotspot = heatMapData.thermalHotspots.find((h) => h.id === selectedHotspot) || heatMapData.thermalHotspots[0];

  return (
    <GlassCard variant="glow" className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white tracking-wide">Hyperlocal Heat Intelligence Grid</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            FortyGuard Urban Thermal Sensor Network • Resolution: {heatMapData.gridResolutionMeters}m²
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="amber">AVG LST: {formatTemperature(heatMapData.averageLSTC)}</Badge>
          <Badge variant="rose" pulse>PEAK LST: {formatTemperature(heatMapData.peakLSTC)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heat Map Microclimate Spatial Grid */}
        <div className="lg:col-span-2 relative h-80 rounded-xl bg-dark-950 border border-slate-800 overflow-hidden p-4 flex flex-col justify-between bg-grid">
          {/* Cyber map background effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/30 via-slate-900/60 to-rose-950/40 pointer-events-none" />

          {/* Grid points visualization */}
          <div className="relative z-10 grid grid-cols-7 gap-2 my-auto">
            {heatMapData.points.slice(0, 35).map((point, idx) => {
              const temp = point.surfaceTempC;
              let bg = 'bg-emerald-500/30 border-emerald-500/50 text-emerald-300';
              if (temp > 52) bg = 'bg-rose-500/40 border-rose-500/70 text-rose-300 animate-pulse';
              else if (temp > 46) bg = 'bg-amber-500/40 border-amber-500/70 text-amber-300';
              else if (temp > 40) bg = 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300';

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-center font-mono text-[10px] backdrop-blur-md transition-transform hover:scale-110 cursor-pointer ${bg}`}
                  title={`Lat: ${point.lat.toFixed(4)}, Lng: ${point.lng.toFixed(4)} - Temp: ${point.surfaceTempC}°C`}
                >
                  <div>{point.surfaceTempC}°C</div>
                  <div className="text-[8px] opacity-75">{point.heatVulnerabilityIndex} HVI</div>
                </div>
              );
            })}
          </div>

          {/* Floating Map Legend */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {heatMapData.regionName}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-400" /> &lt;40°C</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400" /> 40-50°C</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> &gt;50°C Peak</span>
            </div>
          </div>
        </div>

        {/* Hotspots Sidebar */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Identified Hotspots ({heatMapData.thermalHotspots.length})
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {heatMapData.thermalHotspots.map((hotspot) => {
              const isSelected = hotspot.id === activeHotspot?.id;
              return (
                <div
                  key={hotspot.id}
                  onClick={() => setSelectedHotspot(hotspot.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-dark-900 border-cyan-500/50 shadow-glow'
                      : 'bg-dark-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{hotspot.locationName}</span>
                    <span className="font-mono text-xs text-rose-400 font-extrabold">{hotspot.lstC}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{hotspot.id}</span>
                    <Badge variant={hotspot.severity === 'CRITICAL' ? 'rose' : 'amber'} className="text-[9px] py-0">
                      {hotspot.severity}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {activeHotspot && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Thermal Intervention Target
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Applying cool coatings to {activeHotspot.locationName} reduces thermal load by up to {formatTemperature(activeHotspot.lstC - 32)}.
              </p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

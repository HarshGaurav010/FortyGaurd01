'use client';

import React, { useEffect, useState } from 'react';
import { FortyGuardHeatMap } from '@/types/fortyguard';
import { ThermalMap } from '@/components/heatmap/thermal-map';
import { MetricCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { Flame, Thermometer, ShieldAlert, Activity, MapPin, RefreshCw } from 'lucide-react';
import { formatTemperature } from '@/lib/utils/formatters';

export default function DashboardPage() {
  const [heatMap, setHeatMap] = useState<FortyGuardHeatMap | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHeatData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fortyguard?lat=25.2048&lng=55.2708');
      const json = await res.json();
      if (json.success) {
        setHeatMap(json.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard heat data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatData();
  }, []);

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="cyan" pulse><Activity className="w-3 h-3 text-cyan-500 dark:text-cyan-400" /> FORTYGUARD TELEMETRY</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hyperlocal Heat Intelligence Dashboard</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Downtown Financial District • Spatial Resolution: 2.0m² • Telemetry Sync Active
            </p>
          </div>
          <button
            onClick={fetchHeatData}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-cyan-700 dark:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Average Land Surface Temp"
            value={heatMap ? formatTemperature(heatMap.averageLSTC) : '48.4°C'}
            subtext="Baseline Urban Surface Heat"
            icon={<Thermometer className="w-5 h-5" />}
            accentColor="amber"
          />
          <MetricCard
            title="Peak Roof Surface LST"
            value={heatMap ? formatTemperature(heatMap.peakLSTC) : '56.8°C'}
            subtext="Uninsulated Membrane Roof"
            change="Critical Zone"
            isPositive={false}
            icon={<Flame className="w-5 h-5" />}
            accentColor="rose"
          />
          <MetricCard
            title="Heat Stress Score"
            value={heatMap ? `${heatMap.heatStressScore}/100` : '84/100'}
            subtext="Extreme Vulnerability Category"
            icon={<ShieldAlert className="w-5 h-5" />}
            accentColor="violet"
          />
          <MetricCard
            title="Identified Thermal Hotspots"
            value={heatMap ? heatMap.thermalHotspots.length : 4}
            subtext="Target Intervention Zones"
            icon={<MapPin className="w-5 h-5" />}
            accentColor="cyan"
          />
        </div>

        {/* Heat Map Component */}
        {heatMap ? (
          <ThermalMap heatMapData={heatMap} />
        ) : (
          <GlassCard variant="glow" className="p-12 text-center text-slate-400 font-mono">
            Loading FortyGuard microclimate thermal telemetry...
          </GlassCard>
        )}
      </div>
    </div>
  );
}

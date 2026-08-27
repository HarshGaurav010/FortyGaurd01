'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';
import { Flame, Zap, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatters';

interface ThermalChartsProps {
  monthlyData: Array<{
    month: string;
    baselinekWh: number;
    simulatedkWh: number;
    savingsUSD: number;
  }>;
}

export const ThermalCharts: React.FC<ThermalChartsProps> = ({ monthlyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Cooling Energy Load comparison (kWh) */}
      <GlassCard variant="glow" className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Monthly Cooling Energy Demand (kWh)
            </h3>
            <p className="text-xs text-slate-400 font-mono">Baseline vs Retrofitted Building Performance</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Baseline
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Retrofitted
            </span>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="simulatedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#070c1a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`${formatNumber(val, 0)} kWh`, '']}
              />
              <Area type="monotone" dataKey="baselinekWh" name="Baseline kWh" stroke="#ef4444" fillOpacity={1} fill="url(#baselineColor)" strokeWidth={2} />
              <Area type="monotone" dataKey="simulatedkWh" name="Retrofitted kWh" stroke="#06b6d4" fillOpacity={1} fill="url(#simulatedColor)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Monthly Financial Electricity Savings ($) */}
      <GlassCard variant="glow" className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" /> Monthly Utility Bill Savings ($)
            </h3>
            <p className="text-xs text-slate-400 font-mono">Net Electricity Cost Avoidance ($0.14/kWh)</p>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#070c1a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`$${formatNumber(val, 0)} Savings`, '']}
              />
              <Bar dataKey="savingsUSD" name="Savings ($)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

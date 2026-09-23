'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';
import { DollarSign, ShieldCheck, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import { useTheme } from '@/components/providers/theme-provider';

interface ROIChartsProps {
  capex: number;
  annualSavings: number;
  paybackYears: number;
}

export const ROICharts: React.FC<ROIChartsProps> = ({ capex, annualSavings, paybackYears }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate 20-year cumulative cash flow timeline
  const timelineData = Array.from({ length: 21 }, (_, year) => {
    const cumulativeSavings = annualSavings * year * Math.pow(1.03, year * 0.5); // 3% tariff escalation
    const netCashFlow = Math.round(cumulativeSavings - capex);
    return {
      year: `Yr ${year}`,
      netCashFlow,
      initialCapex: -capex,
      paybackPoint: 0,
    };
  });

  return (
    <GlassCard variant="default" className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> 20-Year Cumulative Investment ROI Curve
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Initial CapEx: {formatCurrency(capex)} • Annual Savings: {formatCurrency(annualSavings)}/yr (Modeled)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
            PAYBACK: {paybackYears} YEARS
          </div>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'} />
            <XAxis
              dataKey="year"
              stroke={isDark ? '#94a3b8' : '#64748b'}
              fontSize={11}
              tickLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#475569' }}
            />
            <YAxis
              stroke={isDark ? '#94a3b8' : '#64748b'}
              fontSize={11}
              tickLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#475569' }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0c1220' : '#ffffff',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0',
                borderRadius: '12px',
                color: isDark ? '#ffffff' : '#0f172a',
                fontSize: '12px',
                boxShadow: isDark
                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
              }}
              itemStyle={{ color: isDark ? '#34d399' : '#059669', fontWeight: 600 }}
              labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}
              formatter={(val: number) => [formatCurrency(val), 'Net Value']}
            />
            <ReferenceLine y={0} stroke={isDark ? '#475569' : '#cbd5e1'} strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="netCashFlow"
              name="Cumulative Net Cash Flow"
              stroke={isDark ? '#10b981' : '#059669'}
              strokeWidth={3}
              dot={{ r: 3, fill: isDark ? '#10b981' : '#059669' }}
              activeDot={{ r: 7, fill: isDark ? '#34d399' : '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 mb-1">Break-Even Horizon</div>
          <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{paybackYears} Years</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 mb-1">10-Year Net Cash Flow</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(annualSavings * 10 - capex)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#0c1426] border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 mb-1">20-Year Net Value Created</div>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(annualSavings * 20 * 1.2 - capex)}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

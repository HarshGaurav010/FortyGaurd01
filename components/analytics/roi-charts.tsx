'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';
import { DollarSign, ShieldCheck, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface ROIChartsProps {
  capex: number;
  annualSavings: number;
  paybackYears: number;
}

export const ROICharts: React.FC<ROIChartsProps> = ({ capex, annualSavings, paybackYears }) => {
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
    <GlassCard variant="glow" className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> 20-Year Cumulative Investment ROI Curve
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Initial CapEx: {formatCurrency(capex)} • Annual Savings: {formatCurrency(annualSavings)}/yr
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            PAYBACK: {paybackYears} YEARS
          </div>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#070c1a',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: number) => [formatCurrency(val), 'Net Value']}
            />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="netCashFlow"
              name="Cumulative Net Cash Flow"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 3, fill: '#10b981' }}
              activeDot={{ r: 7, fill: '#34d399' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <div className="text-slate-400 mb-1">Break-Even Horizon</div>
          <div className="text-sm font-bold text-cyan-400">{paybackYears} Years</div>
        </div>
        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <div className="text-slate-400 mb-1">10-Year Net Cash Flow</div>
          <div className="text-sm font-bold text-emerald-400">
            {formatCurrency(annualSavings * 10 - capex)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <div className="text-slate-400 mb-1">20-Year Net Value Created</div>
          <div className="text-sm font-bold text-indigo-400">
            {formatCurrency(annualSavings * 20 * 1.2 - capex)}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

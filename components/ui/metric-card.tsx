import React from 'react';
import { GlassCard } from './glass-card';
import { cn } from '@/lib/utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  accentColor?: 'cyan' | 'amber' | 'violet' | 'emerald' | 'rose';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  change,
  isPositive,
  icon,
  accentColor = 'cyan',
  className,
}) => {
  const accentStyles = {
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    violet: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  };

  return (
    <GlassCard variant="interactive" className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        {icon && <div className={cn('p-2.5 rounded-xl border', accentStyles[accentColor])}>{icon}</div>}
      </div>
      <div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-1 font-mono">{value}</div>
        <div className="flex items-center gap-2 text-xs">
          {change && (
            <span className={cn('font-semibold', isPositive ? 'text-emerald-400' : 'text-amber-400')}>
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-400">{subtext}</span>}
        </div>
      </div>
    </GlassCard>
  );
};

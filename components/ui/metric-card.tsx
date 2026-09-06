'use client';

import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

type AccentColor = 'brand' | 'orange' | 'green' | 'cyan' | 'violet' | 'amber' | 'rose' | 'emerald';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  accentColor?: AccentColor;
  className?: string;
}

const iconBgMap: Record<AccentColor, string> = {
  brand:   'bg-brand-50   dark:bg-brand-500/15  text-brand-600  dark:text-brand-400',
  orange:  'bg-orange-50  dark:bg-orange-500/15 text-orange-600 dark:text-orange-400',
  green:   'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  cyan:    'bg-sky-50     dark:bg-sky-500/15    text-sky-600    dark:text-sky-400',
  violet:  'bg-violet-50  dark:bg-violet-500/15 text-violet-600 dark:text-violet-400',
  amber:   'bg-amber-50   dark:bg-amber-500/15  text-amber-600  dark:text-amber-400',
  rose:    'bg-rose-50    dark:bg-rose-500/15   text-rose-600   dark:text-rose-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};

const valueColorMap: Record<AccentColor, string> = {
  brand:   'text-brand-600   dark:text-brand-400',
  orange:  'text-orange-600  dark:text-orange-400',
  green:   'text-emerald-600 dark:text-emerald-400',
  cyan:    'text-sky-600     dark:text-sky-400',
  violet:  'text-violet-600  dark:text-violet-400',
  amber:   'text-amber-600   dark:text-amber-400',
  rose:    'text-rose-600    dark:text-rose-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  change,
  isPositive,
  icon,
  accentColor = 'brand',
  className,
}) => (
  <div
    className={clsx(
      'rounded-2xl border border-gray-100 dark:border-white/08',
      'bg-white dark:bg-[#141e2e]',
      'shadow-card',
      'p-4 space-y-3',
      'transition-all duration-200',
      'hover:border-gray-200 dark:hover:border-white/14 hover:-translate-y-0.5',
      className,
    )}
  >
    {/* Header row */}
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight tracking-wide uppercase">
        {title}
      </p>
      {icon && (
        <div className={clsx('p-2 rounded-xl shrink-0', iconBgMap[accentColor])}>
          <span className="w-4 h-4 flex items-center justify-center" aria-hidden>
            {icon}
          </span>
        </div>
      )}
    </div>

    {/* Value */}
    <p className={clsx('text-2xl font-bold tracking-tight leading-none', valueColorMap[accentColor])}>
      {value}
    </p>

    {/* Footer row */}
    {(subtext || change !== undefined) && (
      <div className="flex items-center justify-between gap-2">
        {subtext && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{subtext}</p>
        )}
        {change !== undefined && (
          <span
            className={clsx(
              'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-50    dark:bg-rose-500/12    text-rose-700    dark:text-rose-400',
            )}
          >
            {isPositive
              ? <TrendingUp  className="w-3 h-3" aria-hidden />
              : <TrendingDown className="w-3 h-3" aria-hidden />}
            {change}
          </span>
        )}
      </div>
    )}
  </div>
);

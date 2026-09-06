'use client';

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'default' | 'brand' | 'orange' | 'green' | 'cyan' | 'violet' | 'amber' | 'rose' | 'emerald' | 'slate';
  pulse?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantMap: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-100 dark:bg-white/08 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10',
  brand:   'bg-brand-50  dark:bg-brand-500/15  text-brand-700  dark:text-brand-400  border-brand-200  dark:border-brand-500/30',
  orange:  'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30',
  green:   'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
  cyan:    'bg-sky-50    dark:bg-sky-500/15     text-sky-700    dark:text-sky-400    border-sky-200    dark:border-sky-500/30',
  violet:  'bg-violet-50 dark:bg-violet-500/15  text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/30',
  amber:   'bg-amber-50  dark:bg-amber-500/15   text-amber-700  dark:text-amber-400  border-amber-200  dark:border-amber-500/30',
  rose:    'bg-rose-50   dark:bg-rose-500/15    text-rose-700   dark:text-rose-400   border-rose-200   dark:border-rose-500/30',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
  slate:   'bg-slate-100  dark:bg-slate-500/15  text-slate-700  dark:text-slate-400  border-slate-200  dark:border-slate-500/30',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  pulse = false,
  className,
  children,
}) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5',
      'px-2.5 py-1',
      'rounded-full border',
      'text-[11px] font-semibold tracking-wider uppercase',
      'leading-none select-none',
      variantMap[variant],
      className,
    )}
  >
    {pulse && (
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
      </span>
    )}
    {children}
  </span>
);

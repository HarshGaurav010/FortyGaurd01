'use client';

import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  variant?: 'default' | 'glow' | 'interactive' | 'flat';
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  [key: string]: unknown;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  className,
  children,
  as: Tag = 'div',
  ...rest
}) => (
  <Tag
    className={clsx(
      /* Base */
      'rounded-3xl',
      'border',
      'bg-white dark:bg-[#141e2e]',

      /* Variant-specific overrides */
      variant === 'default' && [
        'border-gray-100 dark:border-white/08',
        'shadow-card',
      ],
      variant === 'glow' && [
        'border-brand-200/60 dark:border-brand-500/20',
        'shadow-card shadow-glow',
      ],
      variant === 'interactive' && [
        'border-gray-100 dark:border-white/08',
        'shadow-card',
        'transition-all duration-200 cursor-default',
        'hover:border-brand-200 dark:hover:border-brand-500/35',
        'hover:shadow-card hover:shadow-glow-sm',
        'hover:-translate-y-0.5',
      ],
      variant === 'flat' && [
        'border-gray-100 dark:border-white/06',
        'shadow-none',
      ],

      className,
    )}
    {...rest}
  >
    {children}
  </Tag>
);

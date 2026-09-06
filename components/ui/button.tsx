'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: [
    'bg-brand-500 hover:bg-brand-600 text-white',
    'border border-transparent',
    'shadow-sm hover:shadow-glow-sm',
  ].join(' '),

  secondary: [
    'bg-gray-100 dark:bg-white/08 hover:bg-gray-200 dark:hover:bg-white/12',
    'text-gray-700 dark:text-gray-200',
    'border border-gray-200 dark:border-white/10',
  ].join(' '),

  outline: [
    'bg-transparent hover:bg-gray-50 dark:hover:bg-white/06',
    'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
    'border border-gray-200 dark:border-white/12 hover:border-brand-300 dark:hover:border-brand-500/50',
  ].join(' '),

  ghost: [
    'bg-transparent hover:bg-gray-100 dark:hover:bg-white/06',
    'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
    'border border-transparent',
  ].join(' '),

  glow: [
    'bg-brand-500 hover:bg-brand-600 text-white',
    'border border-transparent',
    'shadow-glow hover:shadow-glow',
  ].join(' '),

  danger: [
    'bg-red-500 hover:bg-red-600 text-white',
    'border border-transparent',
    'shadow-sm',
  ].join(' '),
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'px-2.5 py-1   text-xs  gap-1.5',
  sm: 'px-3.5 py-1.5 text-xs  gap-1.5 font-medium',
  md: 'px-4.5 py-2   text-sm  gap-2   font-medium',
  lg: 'px-6   py-2.5 text-sm  gap-2   font-semibold',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center',
        'rounded-full font-medium',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'select-none',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left'  && <span className="shrink-0" aria-hidden>{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && <span className="shrink-0" aria-hidden>{icon}</span>}
        </>
      )}
    </button>
  );
};

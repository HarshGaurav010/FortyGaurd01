import React from 'react';
import { cn } from '@/lib/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'interactive' | 'solid';
  gradientBorder?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  gradientBorder = false,
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel',
    glow: 'glass-panel-glow',
    interactive: 'glass-card-interactive cursor-pointer',
    solid: 'bg-dark-900/90 border border-slate-800 shadow-xl backdrop-blur-xl',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 transition-all duration-300 overflow-hidden',
        variantStyles[variant],
        gradientBorder && 'before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-cyan-500/30 before:via-violet-500/30 before:to-amber-500/30 before:rounded-2xl before:-z-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

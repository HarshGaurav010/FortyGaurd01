import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 hover:from-cyan-400 hover:to-cyan-500 shadow-glow font-bold',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/60 backdrop-blur-md',
    outline: 'bg-transparent border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50',
    glow: 'bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-glow hover:brightness-110',
  };

  return (
    <button className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

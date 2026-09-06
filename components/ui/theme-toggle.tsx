'use client';

import React from 'react';
import { useTheme } from '@/components/providers/theme-provider';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
        theme === 'dark'
          ? 'bg-dark-900/80 text-amber-300 hover:text-amber-200 border border-slate-700/80 hover:border-amber-400/40 shadow-sm'
          : 'bg-white/90 text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-cyan-400/60 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 text-slate-700" />
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-medium">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

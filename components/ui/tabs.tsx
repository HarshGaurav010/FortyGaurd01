'use client';

import React from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => (
  <div
    role="tablist"
    aria-label="View options"
    className={clsx(
      'inline-flex items-center gap-0.5',
      'p-1 rounded-xl',
      'bg-gray-100 dark:bg-white/06',
      'border border-gray-200 dark:border-white/08',
      className,
    )}
  >
    {tabs.map((tab) => {
      const active = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active}
          aria-controls={`panel-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'inline-flex items-center gap-1.5',
            'px-3 py-1.5 rounded-lg',
            'text-xs font-medium',
            'transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            active
              ? 'bg-white dark:bg-[#1c2b40] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-transparent',
          )}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      );
    })}
  </div>
);

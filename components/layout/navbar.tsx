'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

const NAV_LINKS = [
  { label: 'Overview', href: '/', id: 'overview' },
  { label: 'Thermal Analysis', href: '/analysis', id: 'analysis' },
  { label: '3D Digital Twin', href: '/digital-twin', id: 'twin' },
  { label: 'Retrofits & ROI', href: '/retrofits', id: 'retrofits' },
  { label: 'What-If Simulator', href: '/simulator', id: 'simulator' },
  { label: 'Reports', href: '/reports', id: 'reports' },
  { label: 'AI Copilot', href: '/ai-copilot', id: 'copilot' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="p-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {theme === 'dark'
        ? <Sun className="w-4 h-4" aria-hidden />
        : <Moon className="w-4 h-4" aria-hidden />}
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* ── Floating Navbar ────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-4 sm:px-6 lg:px-8
          transition-all duration-300
          ${scrolled ? 'py-2.5' : 'py-4'}
        `}
        role="banner"
      >
        <div
          className={`
            w-full max-w-[1400px] mx-auto
            flex items-center justify-between
            px-4 sm:px-5
            rounded-2xl border
            backdrop-blur-xl
            transition-all duration-300
            ${scrolled
              ? 'py-2.5 bg-white/90 dark:bg-[#0c1220]/90 border-gray-200/80 dark:border-white/10 shadow-navbar'
              : 'py-3   bg-white/80 dark:bg-[#0c1220]/70 border-gray-200/60 dark:border-white/07 shadow-sm'
            }
          `}
        >
          {/* ── Left — Logo ─────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
            aria-label="HeatRetrofit AI — Home"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-4 h-4 text-white" aria-hidden />
            </div>
            <div className="leading-none">
              <div className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                HEATRETROFIT <span className="text-brand-500">AI</span>
              </div>
              <div className="text-[9px] font-medium text-gray-400 dark:text-gray-500 tracking-widest uppercase">
                FortyGuard Microclimate
              </div>
            </div>
          </Link>

          {/* ── Center — Navigation (desktop) ───────────────────── */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`
                  px-3.5 py-2 rounded-xl text-sm font-medium
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                  ${isActive(link.href)
                    ? 'bg-brand-50 dark:bg-brand-500/12 text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/06'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right — Controls ────────────────────────────────── */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* FG-LIVE status */}
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              FG-LIVE
            </span>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* CTA */}
            <Link
              href="/analysis"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-sm hover:shadow-glow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Analyze Building
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/06 transition-all duration-200"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ───────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="absolute top-20 left-4 right-4 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 shadow-elevated overflow-hidden">
            <nav className="p-3 space-y-0.5" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`
                    flex items-center px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                    ${isActive(link.href)
                      ? 'bg-brand-50 dark:bg-brand-500/12 text-brand-600 dark:text-brand-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/06'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="px-3 pb-3 pt-0 flex flex-col gap-2 border-t border-gray-100 dark:border-white/06 mt-1 pt-3">
              {/* FG-LIVE */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                FORTYGUARD LIVE
              </div>
              <Link
                href="/analysis"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all duration-200"
              >
                Analyze Building
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Spacer to push content below fixed header ───────────── */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}

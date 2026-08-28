'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

// Lazy-load the 3D scene to avoid SSR issues and improve first paint
const HeroBuildingScene = dynamic(
  () => import('@/components/building/hero-building-scene').then((m) => ({ default: m.HeroBuildingScene })),
  { ssr: false }
);

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = heroRef.current;
    if (!el || prefersReduced) return;

    const eyebrow = el.querySelector('[data-hero="eyebrow"]');
    const headline = el.querySelector('[data-hero="headline"]');
    const desc = el.querySelector('[data-hero="desc"]');
    const ctas = el.querySelector('[data-hero="ctas"]');
    const stats = el.querySelector('[data-hero="stats"]');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(eyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.3)
      .fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5)
      .fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
      .fromTo(ctas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.15)
      .fromTo(stats, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 1.35);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid min-h-[85vh]">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 3D Building Digital Twin — background layer behind all content */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full">
          <HeroBuildingScene />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy Left Col (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div data-hero="eyebrow" className="inline-flex items-center gap-2" style={{ opacity: 0 }}>
              <Badge variant="cyan" pulse className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider">
                <Flame className="w-3.5 h-3.5 text-cyan-400" /> AI-POWERED · DATA-DRIVEN · HEAT-AWARE
              </Badge>
            </div>

            <h1 data-hero="headline" className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-sans" style={{ opacity: 0 }}>
              Build Cooler. <br />
              <span className="text-gradient-cyan">Save Energy.</span> <br />
              <span className="text-gradient-amber">Prove It.</span>
            </h1>

            <p data-hero="desc" className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed" style={{ opacity: 0 }}>
              HeatRetrofit AI combines hyperlocal heat intelligence with building characteristics to identify thermal weaknesses, recommend high-impact retrofits, and estimate the energy and financial impact before you invest.
            </p>

            <div data-hero="ctas" className="flex flex-wrap items-center gap-4 pt-4" style={{ opacity: 0 }}>
              <Link href="/analysis">
                <Button variant="glow" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  Analyze Your Building →
                </Button>
              </Link>
              <Link href="/simulator">
                <Button variant="secondary" size="lg" icon={<Sparkles className="w-4 h-4 text-cyan-400" />}>
                  Explore Demo
                </Button>
              </Link>
            </div>

            {/* Micro Stats Row */}
            <div data-hero="stats" className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 font-mono" style={{ opacity: 0 }}>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">1.5m²</div>
                <div className="text-xs text-slate-400 font-sans">FortyGuard Heat Grid</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">-48%</div>
                <div className="text-xs text-slate-400 font-sans">Peak Cooling Energy Cut</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">&lt; 2 Yrs</div>
                <div className="text-xs text-slate-400 font-sans">Average CapEx Payback</div>
              </div>
            </div>
          </div>

          {/* Right col — intentionally empty on desktop (building is in the background layer) */}
          <div className="lg:col-span-5 hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 border-t border-gray-100 dark:border-white/06 relative overflow-hidden bg-grid">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <GlassCard variant="glow" className="p-10 md:p-14 space-y-6">
          <Badge variant="brand" pulse className="px-4 py-1 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5" /> FORTYGUARD INTELLIGENCE ENGINE
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Ready to Optimize Your Building’s Thermal Stress?
          </h2>

          <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Uncover roof and facade heat bottlenecks, quantify cooling energy bill savings, and present ROI-backed climate intervention proposals today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/analysis">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Analyze Your Building
              </Button>
            </Link>
            <Link href="/simulator">
              <Button variant="outline" size="lg" icon={<Sparkles className="w-4 h-4 text-brand-500" />}>
                Explore What-If Simulator
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

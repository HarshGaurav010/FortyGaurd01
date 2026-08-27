'use client';

import React from 'react';
import { CATALOG_RETROFITS } from '@/lib/calculations/thermal-stress-calculator';
import { RetrofitCard } from '@/components/retrofit/retrofit-card';
import { RetrofitComparison } from '@/components/retrofit/retrofit-comparison';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Layers, Sparkles } from 'lucide-react';

export default function RetrofitsPage() {
  return (
    <div className="pt-28 pb-20 bg-dark-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <Badge variant="cyan" pulse><ShieldCheck className="w-3 h-3 text-cyan-400" /> CLIMATE TECH CATALOG</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Thermal Retrofit Interventions</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            High-impact building envelope retrofits engineered to mitigate land surface heat, reduce solar heat gain, and lower peak HVAC cooling demand.
          </p>
        </div>

        {/* Retrofit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATALOG_RETROFITS.map((item) => (
            <RetrofitCard key={item.id} intervention={item} />
          ))}
        </div>

        {/* Comparison Matrix */}
        <RetrofitComparison interventions={CATALOG_RETROFITS} />
      </div>
    </div>
  );
}

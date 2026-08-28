'use client';

import React, { useMemo } from 'react';
import { DEFAULT_BUILDING_PROFILE, computeThermalStressReport } from '@/lib/models/building-thermal-model';
import { retrofitRecommendationEngine } from '@/lib/retrofit/recommendation';
import { RetrofitRecommendationSection } from '@/components/retrofit/retrofit-recommendation';
import { RetrofitRoadmapSection } from '@/components/retrofit/retrofit-roadmap';
import { RetrofitComparison } from '@/components/retrofit/retrofit-comparison';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Layers, Sparkles } from 'lucide-react';

export default function RetrofitsPage() {
  const { recommendations, roadmap, baseReport } = useMemo(() => {
    const report = computeThermalStressReport(DEFAULT_BUILDING_PROFILE, {
      regionId: 'FG-UAE-DXB-042',
      regionName: 'Downtown Financial District',
      center: DEFAULT_BUILDING_PROFILE.coordinates,
      gridResolutionMeters: 2.0,
      averageLSTC: 48.4,
      peakLSTC: 56.8,
      heatStressScore: 84,
      thermalHotspots: [],
      points: [],
    });
    const recs = retrofitRecommendationEngine.generateRecommendations(DEFAULT_BUILDING_PROFILE, report);
    const rm = retrofitRecommendationEngine.generateRoadmap(recs, DEFAULT_BUILDING_PROFILE);
    return { recommendations: recs, roadmap: rm, baseReport: report };
  }, []);

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

        {/* Retrofit Recommendation Engine */}
        <RetrofitRecommendationSection recommendations={recommendations} />

        {/* Phased Roadmap */}
        {roadmap && <RetrofitRoadmapSection roadmap={roadmap} />}
      </div>
    </div>
  );
}

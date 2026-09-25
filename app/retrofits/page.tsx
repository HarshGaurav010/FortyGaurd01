'use client';

import React, { useMemo } from 'react';
import { useBuildingScenario } from '@/components/scenarios/building-scenario-provider';
import { getBaselineHeatMapForScenario } from '@/lib/demo/building-scenario-adapter';
import { retrofitRecommendationEngine } from '@/lib/retrofit/recommendation';
import { RetrofitRecommendationSection } from '@/components/retrofit/retrofit-recommendation';
import { RetrofitRoadmapSection } from '@/components/retrofit/retrofit-roadmap';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Building2 } from 'lucide-react';

export default function RetrofitsPage() {
  const { selectedScenario, buildingProfile, thermalReport } = useBuildingScenario();

  const { recommendations, roadmap } = useMemo(() => {
    const baselineHeatMap = getBaselineHeatMapForScenario(selectedScenario);
    const recs = retrofitRecommendationEngine.generateRecommendations(
      buildingProfile,
      thermalReport,
      baselineHeatMap
    );
    const rm = retrofitRecommendationEngine.generateRoadmap(recs, buildingProfile);
    return { recommendations: recs, roadmap: rm };
  }, [selectedScenario, buildingProfile, thermalReport]);

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <Badge variant="cyan" pulse><ShieldCheck className="w-3 h-3 text-cyan-500 dark:text-cyan-400" /> CLIMATE TECH CATALOG</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Thermal Retrofit Interventions</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              High-impact building envelope retrofits engineered to mitigate land surface heat, reduce solar heat gain, and lower peak HVAC cooling demand.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#132039] border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-700 dark:text-gray-300 shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-cyan-500" />
              {selectedScenario.name} — {selectedScenario.location.city}, {selectedScenario.location.state}
            </span>
          </div>
        </div>

        {/* Retrofit Recommendation Engine */}
        <RetrofitRecommendationSection recommendations={recommendations} />

        {/* Phased Roadmap */}
        {roadmap && <RetrofitRoadmapSection roadmap={roadmap} />}
      </div>
    </div>
  );
}

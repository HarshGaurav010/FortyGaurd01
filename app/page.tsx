import React from 'react';
import { Hero } from '@/components/hero/hero';
import { ThermalExplanation } from '@/components/home/thermal-explanation';
import { ProjectFramework } from '@/components/home/project-framework';
import { FeatureCards } from '@/components/home/feature-cards';
import { HowItWorks } from '@/components/home/how-it-works';
import { BuildingViewer } from '@/components/building/building-viewer';
import { RetrofitComparison } from '@/components/retrofit/retrofit-comparison';
import { WhatIfSimulator } from '@/components/simulator/what-if-simulator';
import { AICopilotWidget } from '@/components/chatbot/ai-copilot-widget';
import { CTASection } from '@/components/home/cta-section';
import { ScrollReveal } from '@/components/providers/scroll-reveal';
import { CATALOG_RETROFITS } from '@/lib/calculations/thermal-stress-calculator';
import { Badge } from '@/components/ui/badge';
import { Flame, Layers, DollarSign, Bot } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section — has its own GSAP entrance, no ScrollReveal needed */}
      <Hero />

      {/* 2. Thermal Intelligence Explanation */}
      <ScrollReveal>
        <ThermalExplanation />
      </ScrollReveal>

      {/* 3. Project Framework */}
      <ScrollReveal delay={0.05}>
        <ProjectFramework />
      </ScrollReveal>

      {/* 4. Core Features Cards */}
      <ScrollReveal delay={0.05}>
        <FeatureCards />
      </ScrollReveal>

      {/* 5. How HeatRetrofit AI Works */}
      <ScrollReveal delay={0.05}>
        <HowItWorks />
      </ScrollReveal>

      {/* 6. Interactive Building & Heat Visualization Section */}
      <ScrollReveal>
        <section id="building-demo" className="py-20 bg-dark-950 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge variant="cyan" className="px-3.5 py-1">
                3D THERMAL MODEL CANVAS
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Interactive 3D Building Heat Stress Viewer
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Toggle between Thermal Stress Map, Solar Exposure, and Cool Barrier Layer views to inspect building envelope bottlenecks in real time.
              </p>
            </div>
            <BuildingViewer />
          </div>
        </section>
      </ScrollReveal>

      {/* 7. Retrofit Comparison Section */}
      <ScrollReveal>
        <section id="retrofits" className="py-20 bg-dark-900 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge variant="violet" className="px-3.5 py-1">
                INTERVENTION MATRIX
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Rank-Ordered Retrofit Interventions
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Tailored climate interventions evaluated for cooling energy reduction, surface temperature drop, CapEx, and payback period.
              </p>
            </div>
            <RetrofitComparison interventions={CATALOG_RETROFITS} />
          </div>
        </section>
      </ScrollReveal>

      {/* 8. Energy + ROI Section */}
      <ScrollReveal>
        <section id="simulator" className="py-20 bg-dark-950 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge variant="amber" className="px-3.5 py-1">
                WHAT-IF ENERGY ENGINE
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Interactive Energy & ROI Simulator
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Adjust roof reflectance SRI, window film SHGC, and insulation R-values to see live monthly kWh demand reductions and cumulative 20-year cash flow.
              </p>
            </div>
            <WhatIfSimulator />
          </div>
        </section>
      </ScrollReveal>

      {/* 9. AI Copilot Showcase Section */}
      <ScrollReveal>
        <section id="copilot" className="py-20 bg-dark-900 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AICopilotWidget />
          </div>
        </section>
      </ScrollReveal>

      {/* 10. Call to Action */}
      <ScrollReveal y={30}>
        <CTASection />
      </ScrollReveal>
    </div>
  );
};

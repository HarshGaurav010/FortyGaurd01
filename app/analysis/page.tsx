'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ComprehensiveAnalysisResult } from '@/types/analysis';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BuildingViewer } from '@/components/building/building-viewer';
import { RetrofitCard } from '@/components/retrofit/retrofit-card';
import { Search, Flame, ShieldCheck, Zap, DollarSign, Leaf, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

import { RetrofitRecommendationSection } from '@/components/retrofit/retrofit-recommendation';
import { RetrofitRoadmapSection } from '@/components/retrofit/retrofit-roadmap';
import { retrofitRecommendationEngine } from '@/lib/retrofit/recommendation';

export default function AnalysisPage() {
  const [addressInput, setAddressInput] = useState('Financial District, San Francisco, CA');
  const [latInput, setLatInput] = useState<number>(37.7749);
  const [lngInput, setLngInput] = useState<number>(-122.4194);
  const [filterType, setFilterType] = useState<1 | 2 | 3 | 4>(1);
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('14:00');
  
  const [analysisData, setAnalysisData] = useState<ComprehensiveAnalysisResult | null>(null);
  const [isDemoData, setIsDemoData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    setLoadingStage('Preparing thermal analysis...');

    try {
      // Stage 1: Validate & Submit Heatmap Request
      setLoadingStage('Processing FortyGuard heat intelligence...');
      const heatmapRes = await fetch('/api/fortyguard/heatmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: latInput,
          lng: lngInput,
          filterType,
          startDate,
          startTime,
          granularity: 100,
        }),
      });

      const heatmapJson = await heatmapRes.json();

      if (!heatmapRes.ok || !heatmapJson.success) {
        if (heatmapJson.error?.code === 'UNSUPPORTED_LOCATION') {
          setErrorMessage('FortyGuard analysis is currently available for supported US locations.');
        } else {
          setErrorMessage(heatmapJson.error?.message || 'FortyGuard thermal analysis failed. Please check inputs.');
        }
        setLoading(false);
        return;
      }

      // Stage 2: Calculate Building Thermal Stress & Retrofits
      setLoadingStage('Building thermal profile...');
      const analysisRes = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: addressInput,
          lat: latInput,
          lng: lngInput,
        }),
      });

      const analysisJson = await analysisRes.json();
      if (analysisJson.success) {
        setAnalysisData({
          ...analysisJson,
          heatMap: heatmapJson.data || analysisJson.heatMap,
        });
        setIsDemoData(Boolean(heatmapJson.isDemoData));
      }
    } catch (err) {
      console.error('Failed to run analysis:', err);
      setErrorMessage('Network error communicating with server.');
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  }, [addressInput, filterType, latInput, lngInput, startDate, startTime]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const recommendations = analysisData
    ? retrofitRecommendationEngine.generateRecommendations(analysisData.building, analysisData.thermalReport, analysisData.heatMap)
    : [];

  const roadmap = analysisData ? retrofitRecommendationEngine.generateRoadmap(recommendations, analysisData.building) : null;

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="cyan" pulse><Flame className="w-3 h-3 text-cyan-500 dark:text-cyan-400" /> FORTYGUARD THERMAL AUDIT</Badge>
            {isDemoData && (
              <Badge variant="amber" className="font-mono font-bold tracking-wider">
                DEMO DATA
              </Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Building Thermal Stress Assessment</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Analyze Land Surface Temperature (LST) and microclimate heat stress using official FortyGuard telemetry (US supported regions).
          </p>

          {/* Form Controls */}
          <GlassCard variant="glow" className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400 block font-sans font-bold">Building Address</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-800">
                  <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="bg-transparent text-slate-900 dark:text-white focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400 block font-sans font-bold">Latitude (-90 to 90)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latInput}
                  onChange={(e) => setLatInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400 block font-sans font-bold">Longitude (-180 to 180)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lngInput}
                  onChange={(e) => setLngInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400 block font-sans font-bold">Analysis Filter</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(parseInt(e.target.value) as any)}
                  className="w-full px-3.5 py-2 rounded-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-800 text-cyan-700 dark:text-cyan-300 focus:outline-none font-semibold"
                >
                  <option value={1}>Single Hour (filter_type: 1)</option>
                  <option value={2}>Range of Hours (filter_type: 2)</option>
                  <option value={3}>Single Day (filter_type: 3)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                <span>Granularity: 100m</span> • <span>Coverage: US Only</span>
              </div>
              <Button
                variant="glow"
                size="md"
                onClick={runAnalysis}
                disabled={loading}
                icon={loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              >
                {loading ? loadingStage : 'Analyze Building'}
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <GlassCard variant="glow" className="p-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin mx-auto" />
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{loadingStage}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fetching FortyGuard microclimate land surface temperature telemetry...</p>
          </GlassCard>
        )}

        {/* Analysis Results */}
        {!loading && analysisData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Thermal Stress Score"
                value={`${analysisData.thermalReport.thermalStressScore}/100`}
                subtext={analysisData.thermalReport.stressCategory}
                change="VULNERABILITY"
                isPositive={false}
                icon={<Flame className="w-5 h-5" />}
                accentColor="rose"
              />
              <MetricCard
                title="Annual Cooling Waste"
                value={formatCurrency(analysisData.thermalReport.annualCoolingWasteCostUSD)}
                subtext="Heat Gain Excess Cost"
                icon={<DollarSign className="w-5 h-5" />}
                accentColor="amber"
              />
              <MetricCard
                title="Facade Solar Exposure"
                value={`${analysisData.thermalReport.solarExposureRating} / 10`}
                subtext="South-East Orientation"
                icon={<Zap className="w-5 h-5" />}
                accentColor="cyan"
              />
              <MetricCard
                title="Carbon Footprint"
                value={`${analysisData.thermalReport.carbonFootprintTonsCO2} t`}
                subtext="CO₂e Annual Emissions"
                icon={<Leaf className="w-5 h-5" />}
                accentColor="emerald"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <BuildingViewer />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">Identified Envelope Vulnerabilities</h3>

                <div className="space-y-3">
                  {analysisData.thermalReport.vulnerabilities.map((vuln, i) => (
                    <GlassCard key={i} variant="interactive" className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{vuln.title}</span>
                        <Badge variant={vuln.severity === 'CRITICAL' ? 'rose' : 'amber'}>
                          {vuln.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{vuln.description}</p>
                      <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                        Heat Gain Contribution: {vuln.heatGainContributionPct}% of total building cooling load
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Retrofit Recommendation Section */}
            <RetrofitRecommendationSection recommendations={recommendations} />

            {/* AI Retrofit Roadmap Section */}
            {roadmap && <RetrofitRoadmapSection roadmap={roadmap} />}
          </div>
        )}
      </div>
    </div>
  );
}

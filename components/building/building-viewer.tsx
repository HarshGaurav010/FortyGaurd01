'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Flame, Sun, Layers, Eye, RefreshCw, Info } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ModernVillaMesh } from '@/components/building/modern-villa-mesh';


export const BuildingViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'heatmap' | 'solar' | 'retrofit' | 'baseline'>('heatmap');
  const [autoRotate, setAutoRotate] = useState(true);

  const tabs = [
    { id: 'heatmap', label: 'Thermal Stress Map', icon: <Flame className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> },
    { id: 'solar', label: 'Solar Exposure', icon: <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> },
    { id: 'retrofit', label: 'Cool Barrier Layer', icon: <Layers className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> },
    { id: 'baseline', label: 'Structural Model', icon: <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> },
  ];

  return (
    <div className="relative w-full h-[480px] lg:h-[560px] rounded-3xl glass-panel overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col">
      {/* Header Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-dark-950/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <Tabs tabs={tabs} activeTab={viewMode} onChange={(id) => setViewMode(id as any)} />
        <div className="flex items-center gap-2">
          <Badge variant={viewMode === 'retrofit' ? 'emerald' : 'cyan'}>
            {viewMode.toUpperCase()} MODE
          </Badge>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full border transition-colors ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Auto Rotation"
          >
            <RefreshCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [6.5, 4.2, 6.5], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          <ambientLight intensity={viewMode === 'baseline' ? 1.1 : 0.65} />
          {/* Key Sun Light — shifts warm amber in Solar mode */}
          <directionalLight
            position={[8, 14, 7]}
            intensity={viewMode === 'solar' ? 1.8 : 1.3}
            color={viewMode === 'solar' ? '#fde68a' : '#f8fafc'}
            castShadow
          />
          {/* Cool Sky Hemisphere Fill */}
          <hemisphereLight args={['#c7d2fe', '#0f172a', 0.4]} />
          {/* Thermal Accent Point Light — glows red/amber in heat mode */}
          <pointLight
            position={[0, 5, 2]}
            intensity={viewMode === 'heatmap' ? 1.2 : viewMode === 'solar' ? 0.8 : 0.3}
            color={viewMode === 'heatmap' ? '#f43f5e' : viewMode === 'solar' ? '#f59e0b' : '#38bdf8'}
          />
          {/* Cool Blue Ambient for Retrofit mode */}
          <pointLight
            position={[-4, 3, -4]}
            intensity={viewMode === 'retrofit' ? 0.9 : 0.2}
            color="#22d3ee"
          />

          <ModernVillaMesh viewMode={viewMode} autoRotate={autoRotate} />

          <OrbitControls
            enableZoom={true}
            minDistance={4.5}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.08}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      </div>

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3.5 rounded-2xl bg-white/85 dark:bg-dark-950/85 border border-slate-200 dark:border-slate-800 backdrop-blur-xl text-xs font-mono">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">
            {viewMode === 'heatmap' && 'Peak Thermal Stress: Dark red zones indicate roof LST exceeding 56.8°C.'}
            {viewMode === 'solar' && 'Solar Load Density: Direct solar radiation vector on South-East glass facade.'}
            {viewMode === 'retrofit' && 'High-Albedo Cool Barrier: Reflects 88% solar radiation, dropping surface heat.'}
            {viewMode === 'baseline' && 'Baseline Envelope: Uninsulated concrete structure without climate retrofits.'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span>Drag to Rotate</span> • <span>Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
};

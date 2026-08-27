'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Flame, Sun, Layers, Eye, RefreshCw, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface BuildingMeshProps {
  viewMode: 'heatmap' | 'solar' | 'retrofit' | 'baseline';
  autoRotate: boolean;
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({ viewMode, autoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  // Materials based on view mode
  const materials = useMemo(() => {
    const isHeat = viewMode === 'heatmap';
    const isSolar = viewMode === 'solar';
    const isRetro = viewMode === 'retrofit';

    return {
      // Main concrete tower body
      body: new THREE.MeshStandardMaterial({
        color: isHeat ? '#1e293b' : isSolar ? '#0f172a' : isRetro ? '#0f2942' : '#1e293b',
        roughness: 0.3,
        metalness: 0.8,
      }),
      // South Facade Glass panels - hottest in heat mode
      southFacade: new THREE.MeshStandardMaterial({
        color: isHeat ? '#ef4444' : isSolar ? '#f59e0b' : isRetro ? '#06b6d4' : '#38bdf8',
        emissive: isHeat ? '#dc2626' : isSolar ? '#d97706' : isRetro ? '#0891b2' : '#0284c7',
        emissiveIntensity: isHeat ? 0.6 : isSolar ? 0.5 : 0.3,
        roughness: 0.1,
        metalness: 0.9,
      }),
      // Roof slab - critical heat hotspot
      roof: new THREE.MeshStandardMaterial({
        color: isHeat ? '#f43f5e' : isSolar ? '#fbbf24' : isRetro ? '#10b981' : '#64748b',
        emissive: isHeat ? '#e11d48' : isSolar ? '#f59e0b' : isRetro ? '#059669' : '#334155',
        emissiveIntensity: isHeat ? 0.8 : isSolar ? 0.4 : 0.4,
        roughness: 0.2,
      }),
      // Cool roof barrier layer overlay
      coolCoating: new THREE.MeshStandardMaterial({
        color: '#22d3ee',
        emissive: '#06b6d4',
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: isRetro ? 0.85 : 0.0,
      }),
      // Windows standard grid
      windowGrid: new THREE.MeshStandardMaterial({
        color: isHeat ? '#f97316' : isSolar ? '#eab308' : isRetro ? '#0ea5e9' : '#64748b',
        roughness: 0.1,
      }),
    };
  }, [viewMode]);

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Base Podium */}
      <mesh position={[0, 0.3, 0]} material={materials.body}>
        <boxGeometry args={[3.2, 0.6, 3.2]} />
      </mesh>

      {/* Main Office Tower */}
      <mesh position={[0, 2.4, 0]} material={materials.body}>
        <boxGeometry args={[2.2, 3.6, 2.2]} />
      </mesh>

      {/* South Facade Glass Panels (Hotspot Area) */}
      <mesh position={[0, 2.4, 1.11]} material={materials.southFacade}>
        <planeGeometry args={[2.0, 3.4]} />
      </mesh>

      {/* Roof Surface Slab */}
      <mesh position={[0, 4.22, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.roof}>
        <planeGeometry args={[2.18, 2.18]} />
      </mesh>

      {/* Cool Roof Insulation Layer Overlay */}
      {viewMode === 'retrofit' && (
        <mesh position={[0, 4.25, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.coolCoating}>
          <planeGeometry args={[2.2, 2.2]} />
        </mesh>
      )}

      {/* Decorative Architectural Columns & Solar Sensors */}
      <mesh position={[-1.05, 2.4, 1.05]} material={materials.windowGrid}>
        <cylinderGeometry args={[0.04, 0.04, 3.6, 12]} />
      </mesh>
      <mesh position={[1.05, 2.4, 1.05]} material={materials.windowGrid}>
        <cylinderGeometry args={[0.04, 0.04, 3.6, 12]} />
      </mesh>

      {/* Hotspot Markers / Callouts */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0, 4.5, 0]}>
          <Html distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="px-2.5 py-1 rounded-lg bg-dark-950/90 border border-rose-500/40 text-[11px] font-mono text-rose-300 font-bold whitespace-nowrap shadow-glow backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {viewMode === 'retrofit' ? 'Cool Roof: 32.1°C (-24.7°C)' : 'Roof Peak LST: 56.8°C'}
            </div>
          </Html>
        </group>
      </Float>

      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <group position={[0.9, 2.2, 1.2]}>
          <Html distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="px-2.5 py-1 rounded-lg bg-dark-950/90 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold whitespace-nowrap shadow-glow backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {viewMode === 'solar' ? 'Irradiance: 880 W/m²' : 'South Facade Heat Gain'}
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
};

export const BuildingViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'heatmap' | 'solar' | 'retrofit' | 'baseline'>('heatmap');
  const [autoRotate, setAutoRotate] = useState(true);

  const tabs = [
    { id: 'heatmap', label: 'Thermal Stress Map', icon: <Flame className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'solar', label: 'Solar Exposure', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'retrofit', label: 'Cool Barrier Layer', icon: <Layers className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'baseline', label: 'Structural Model', icon: <Eye className="w-3.5 h-3.5 text-cyan-400" /> },
  ];

  return (
    <div className="relative w-full h-[480px] lg:h-[540px] rounded-2xl glass-panel overflow-hidden border border-cyan-500/20 shadow-2xl flex flex-col">
      {/* Header Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-dark-950/75 p-2 rounded-xl border border-slate-800 backdrop-blur-md">
        <Tabs tabs={tabs} activeTab={viewMode} onChange={(id) => setViewMode(id as any)} />
        <div className="flex items-center gap-2">
          <Badge variant={viewMode === 'retrofit' ? 'emerald' : 'cyan'}>
            {viewMode.toUpperCase()} MODE
          </Badge>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg border transition-colors ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Auto Rotation"
          >
            <RefreshCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [4.5, 3.5, 5.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 15, 8]} intensity={1.4} color={viewMode === 'solar' ? '#f59e0b' : '#ffffff'} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#38bdf8" />

          <BuildingMesh viewMode={viewMode} autoRotate={autoRotate} />

          <OrbitControls enableZoom={true} minDistance={3.5} maxDistance={9.5} maxPolarAngle={Math.PI / 2.05} />
        </Canvas>
      </div>

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-xl bg-dark-950/85 border border-slate-800 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">
            {viewMode === 'heatmap' && 'Peak Thermal Stress: Dark red zones indicate roof LST exceeding 56.8°C.'}
            {viewMode === 'solar' && 'Solar Load Density: Direct solar radiation vector on South-East glass facade.'}
            {viewMode === 'retrofit' && 'High-Albedo Cool Barrier: Reflects 88% solar radiation, dropping surface heat.'}
            {viewMode === 'baseline' && 'Baseline Envelope: Uninsulated concrete structure without climate retrofits.'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <span>Drag to Rotate</span> • <span>Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
};

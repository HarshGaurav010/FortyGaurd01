'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { ModernVillaMesh } from './modern-villa-mesh';
import { useTheme } from '@/components/providers/theme-provider';

export type CameraViewPreset = 'iso' | 'south' | 'east' | 'north' | 'plan';

interface OverviewHouseSceneProps {
  viewMode?: 'heatmap' | 'solar' | 'retrofit' | 'baseline';
  showHotspots?: boolean;
  selectedHotspot?: string | null;
  onSelectHotspot?: (id: string) => void;
  autoRotate?: boolean;
  timeOfDay?: number; // 0 to 24
  cameraPreset?: CameraViewPreset;
}

export const OverviewHouseScene: React.FC<OverviewHouseSceneProps> = ({
  viewMode = 'heatmap',
  showHotspots = true,
  selectedHotspot = null,
  onSelectHotspot,
  autoRotate = false,
  timeOfDay = 14,
  cameraPreset = 'iso',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Compute sun light position and color based on timeOfDay (0 - 24)
  const sunConfig = React.useMemo(() => {
    const normalizedHour = ((timeOfDay - 12) / 12) * Math.PI;
    const isNight = timeOfDay < 6 || timeOfDay > 19;

    const sunX = Math.sin(normalizedHour) * 12;
    const sunY = Math.max(2.0, Math.sin(Math.acos(Math.min(1, Math.abs(normalizedHour) / Math.PI))) * 16);
    const sunZ = 8 * Math.cos(normalizedHour);

    let sunColor = '#fffbeb';
    let sunIntensity = 1.7;

    if (timeOfDay >= 6 && timeOfDay < 9) {
      sunColor = '#fde68a'; // morning warm
      sunIntensity = 1.3;
    } else if (timeOfDay >= 9 && timeOfDay <= 16) {
      sunColor = '#ffffff'; // intense midday sun
      sunIntensity = 1.8;
    } else if (timeOfDay > 16 && timeOfDay <= 19) {
      sunColor = '#fb923c'; // sunset golden hour
      sunIntensity = 1.4;
    } else {
      sunColor = '#94a3b8'; // moonlight
      sunIntensity = 0.55;
    }

    return {
      position: [sunX, sunY, sunZ] as [number, number, number],
      color: sunColor,
      intensity: sunIntensity,
      isNight,
    };
  }, [timeOfDay]);

  // Handle camera presets smoothly
  useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;
    const target = new THREE.Vector3(0, 1.0, 0);

    let pos: [number, number, number] = [5.8, 3.6, 5.8];

    switch (cameraPreset) {
      case 'south': // South Elevation (Front Entrance)
        pos = [0, 1.8, 6.8];
        break;
      case 'east': // East Elevation (Side View & Balcony)
        pos = [6.8, 1.8, 0];
        break;
      case 'north': // North Elevation (Rear Facade)
        pos = [0, 1.8, -6.8];
        break;
      case 'plan': // Top View (Plan Blueprint)
        pos = [0, 8.8, 0.01];
        break;
      case 'iso':
      default:
        pos = [5.8, 3.6, 5.8];
        break;
    }

    ctrl.object.position.set(...pos);
    ctrl.target.copy(target);
    ctrl.update();
  }, [cameraPreset]);

  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      {/* ── THREE.JS R3F CANVAS ──────────────────────────────────── */}
      <Canvas
        camera={{ position: [5.8, 3.6, 5.8], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
        className="w-full h-full"
      >
        {/* Sky Ambient Light */}
        <ambientLight
          intensity={sunConfig.isNight ? 0.35 : isDark ? 0.55 : 0.95}
          color={sunConfig.isNight ? '#0b1329' : isDark ? '#1e293b' : '#ffffff'}
        />

        {/* Dynamic Sun Position Light */}
        <directionalLight
          position={sunConfig.position}
          intensity={sunConfig.intensity}
          color={sunConfig.color}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        {/* Fill Sky Light */}
        <hemisphereLight
          args={[
            sunConfig.isNight ? '#0f172a' : '#e0f2fe',
            sunConfig.isNight ? '#020617' : '#f1f5f9',
            sunConfig.isNight ? 0.4 : 0.65,
          ]}
        />

        {/* Night Window & Interior Glow Pointlights */}
        {(sunConfig.isNight || isDark) && (
          <>
            <pointLight position={[0.4, 2.3, 0.3]} intensity={2.2} color="#fbbf24" distance={4.5} />
            <pointLight position={[-1.2, 0.9, 0.2]} intensity={1.6} color="#f59e0b" distance={3.8} />
            <pointLight position={[-5, 4, -4]} intensity={0.7} color="#38bdf8" distance={9} />
          </>
        )}

        {/* Mode Specific Thermal Emissive Point Lights */}
        {viewMode === 'heatmap' && (
          <pointLight position={[0, 4.2, 0]} intensity={1.8} color="#f43f5e" distance={5} />
        )}
        {viewMode === 'solar' && (
          <pointLight position={[1.5, 3.5, 1.5]} intensity={1.6} color="#f59e0b" distance={6} />
        )}
        {viewMode === 'retrofit' && (
          <pointLight position={[-1, 4.2, 0]} intensity={1.5} color="#22d3ee" distance={5} />
        )}

        {/* The Reconstructed Modernist Villa Mesh */}
        <ModernVillaMesh
          viewMode={viewMode}
          autoRotate={autoRotate}
          showOverviewHotspots={showHotspots}
          onSelectHotspot={onSelectHotspot}
          selectedHotspot={selectedHotspot}
          theme={isDark ? 'dark' : 'light'}
        />

        {/* Smooth Orbit Controls with subtle damping */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          minDistance={3.8}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.05}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* ── VERTICAL TEMPERATURE SCALE LEGEND ────────────────────── */}
      {viewMode === 'heatmap' && (
        <div className="absolute top-4 left-4 z-10 p-3 rounded-2xl bg-white/90 dark:bg-[#0c1220]/90 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl shadow-card font-mono text-[10px] space-y-2 pointer-events-none">
          <div className="font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            LST Scale
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-28 rounded-full bg-gradient-to-b from-[#ef4444] via-[#f59e0b] via-[#38bdf8] to-[#10b981]" />
            <div className="flex flex-col justify-between h-28 text-[9px] text-gray-500 dark:text-gray-400 font-mono">
              <span className="text-rose-600 dark:text-rose-400 font-bold">56.8°C Peak</span>
              <span>48.4°C Avg</span>
              <span>40.0°C</span>
              <span>32.0°C</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">24.0°C Amb</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

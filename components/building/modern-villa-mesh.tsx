'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface ModernVillaMeshProps {
  viewMode?: 'heatmap' | 'solar' | 'retrofit' | 'baseline';
  autoRotate?: boolean;
  showOverviewHotspots?: boolean;
  onSelectHotspot?: (id: string) => void;
  selectedHotspot?: string | null;
  theme?: 'light' | 'dark';
}

export const ModernVillaMesh: React.FC<ModernVillaMeshProps> = ({
  viewMode = 'heatmap',
  autoRotate = false,
  showOverviewHotspots = true,
  onSelectHotspot,
  selectedHotspot,
  theme = 'light',
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  const isDark = theme === 'dark';

  // Architectural materials tailored for digital twin visualization
  const mats = useMemo(() => {
    const isHeat = viewMode === 'heatmap';
    const isSolar = viewMode === 'solar';
    const isRetro = viewMode === 'retrofit';

    return {
      // Main exterior walls — warm architectural alabaster in light mode, technical slate in dark mode
      stucco: new THREE.MeshStandardMaterial({
        color: isHeat
          ? isDark ? '#1f2b3e' : '#233044'
          : isSolar
            ? isDark ? '#1c2637' : '#e5dfd5'
            : isRetro
              ? isDark ? '#132338' : '#e2dbcf'
              : isDark
                ? '#253347'
                : '#f4f0e8',
        roughness: 0.32,
        metalness: 0.05,
      }),
      // Dark architectural feature panels & louvers (seen on South & East elevations)
      darkAccent: new THREE.MeshStandardMaterial({
        color: isDark ? '#131f33' : '#2b3544',
        roughness: 0.45,
        metalness: 0.35,
      }),
      // Foundation plinth / patio stone
      foundation: new THREE.MeshStandardMaterial({
        color: isDark ? '#162234' : '#e5dec9',
        roughness: 0.75,
      }),
      // Lawn / landscaping ground plane
      groundLawn: new THREE.MeshStandardMaterial({
        color: isDark ? '#0c1828' : '#27422e',
        roughness: 0.9,
      }),
      // Pavement pathway
      paver: new THREE.MeshStandardMaterial({
        color: isDark ? '#1c283c' : '#d5cdc0',
        roughness: 0.7,
      }),
      // Ground floor glass windows & doors
      glassGround: new THREE.MeshStandardMaterial({
        color: isHeat
          ? '#f97316'
          : isSolar
            ? '#f59e0b'
            : isRetro
              ? '#38bdf8'
              : isDark
                ? '#fbbf24'
                : '#94a3b8',
        emissive: isHeat
          ? '#ea580c'
          : isSolar
            ? '#d97706'
            : isRetro
              ? '#0284c7'
              : isDark
                ? '#d97706'
                : '#000000',
        emissiveIntensity: isDark ? 0.8 : isHeat ? 0.5 : 0.05,
        roughness: 0.08,
        metalness: 0.85,
        transparent: true,
        opacity: isDark ? 0.92 : 0.75,
      }),
      // Iconic upper corner panoramic glass (the primary solar heat vulnerability zone)
      glassUpperCorner: new THREE.MeshStandardMaterial({
        color: isHeat
          ? '#ef4444'
          : isSolar
            ? '#f59e0b'
            : isRetro
              ? '#22d3ee'
              : isDark
                ? '#fbbf24'
                : '#38bdf8',
        emissive: isHeat
          ? '#dc2626'
          : isSolar
            ? '#f59e0b'
            : isRetro
              ? '#06b6d4'
              : isDark
                ? '#f59e0b'
                : '#0284c7',
        emissiveIntensity: isDark ? 0.95 : isHeat ? 0.85 : 0.2,
        roughness: 0.04,
        metalness: 0.95,
        transparent: true,
        opacity: 0.9,
      }),
      // Upper Balcony Glass Railing
      glassBalustrade: new THREE.MeshStandardMaterial({
        color: isRetro ? '#22d3ee' : isDark ? '#38bdf8' : '#cbd5e1',
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.8,
      }),
      // Roof surface slab (critical heat island zone)
      roofSlab: new THREE.MeshStandardMaterial({
        color: isHeat
          ? '#ef4444'
          : isSolar
            ? '#fbbf24'
            : isRetro
              ? '#10b981'
              : isDark
                ? '#1e293b'
                : '#cbd5e1',
        emissive: isHeat
          ? '#dc2626'
          : isSolar
            ? '#f59e0b'
            : isRetro
              ? '#059669'
              : '#000000',
        emissiveIntensity: isHeat ? 0.85 : isRetro ? 0.5 : 0.0,
        roughness: 0.35,
      }),
      // High-Albedo Cool Coating overlay (retrofit layer)
      coolRoofCoating: new THREE.MeshStandardMaterial({
        color: '#22d3ee',
        emissive: '#06b6d4',
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: isRetro ? 0.92 : 0.0,
      }),
      // Rooftop Photovoltaic Solar Panel / Canopy
      solarPanel: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        emissive: isRetro ? '#0284c7' : '#000000',
        emissiveIntensity: isRetro ? 0.4 : 0,
        roughness: 0.15,
        metalness: 0.95,
      }),
      solarFrame: new THREE.MeshStandardMaterial({
        color: '#64748b',
        roughness: 0.4,
        metalness: 0.8,
      }),
      // Dark window mullions / frames
      windowFrame: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.3,
        metalness: 0.8,
      }),
      // Landscape foliage & trunk
      treeTrunk: new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.9 }),
      treeFoliage: new THREE.MeshStandardMaterial({
        color: isDark ? '#14532d' : '#22543d',
        roughness: 0.75,
      }),
    };
  }, [viewMode, isDark]);

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* ============================================================ */}
      {/* 1. SITE FOUNDATION & LANDSCAPING (Blueprint footprint)        */}
      {/* ============================================================ */}
      {/* Site lawn ground plane */}
      <mesh position={[0, -0.05, 0]} receiveShadow material={mats.groundLawn}>
        <boxGeometry args={[7.8, 0.1, 7.0]} />
      </mesh>

      {/* Raised Concrete Foundation Plinth */}
      <mesh position={[0.1, 0.06, -0.1]} receiveShadow material={mats.foundation}>
        <boxGeometry args={[5.6, 0.12, 4.8]} />
      </mesh>

      {/* Front Entrance Paved Walkway (South) */}
      <mesh position={[0.4, 0.13, 1.8]} receiveShadow material={mats.paver}>
        <boxGeometry args={[1.6, 0.04, 2.0]} />
      </mesh>

      {/* Entrance low steps */}
      <mesh position={[0.3, 0.16, 0.9]} receiveShadow material={mats.paver}>
        <boxGeometry args={[1.3, 0.06, 0.45]} />
      </mesh>

      {/* Decorative Garden Planter Box & Low-poly Architecture Tree */}
      <mesh position={[-2.0, 0.14, 1.7]} material={mats.darkAccent}>
        <boxGeometry args={[1.2, 0.12, 1.2]} />
      </mesh>
      {/* Tree Trunk */}
      <mesh position={[-2.0, 0.6, 1.7]} material={mats.treeTrunk}>
        <cylinderGeometry args={[0.045, 0.065, 0.9, 8]} />
      </mesh>
      {/* Tree Foliage Clusters */}
      <mesh position={[-2.0, 1.2, 1.7]} material={mats.treeFoliage}>
        <sphereGeometry args={[0.4, 14, 14]} />
      </mesh>
      <mesh position={[-1.85, 1.42, 1.72]} material={mats.treeFoliage}>
        <sphereGeometry args={[0.3, 12, 12]} />
      </mesh>

      {/* Small shrub on right corner */}
      <mesh position={[2.2, 0.35, 1.7]} material={mats.treeFoliage}>
        <sphereGeometry args={[0.24, 10, 10]} />
      </mesh>

      {/* ============================================================ */}
      {/* 2. GROUND FLOOR VOLUMES (South Elevation Main Entrance)       */}
      {/* ============================================================ */}
      {/* Ground Left Wing (Stucco with Ribbon Window) */}
      <mesh position={[-1.2, 0.8, 0.05]} castShadow receiveShadow material={mats.stucco}>
        <boxGeometry args={[2.1, 1.36, 2.7]} />
      </mesh>

      {/* South Facade Horizontal Ribbon Window (Left) */}
      <mesh position={[-1.15, 0.8, 1.41]} material={mats.glassGround}>
        <planeGeometry args={[1.5, 0.38]} />
      </mesh>
      <mesh position={[-1.15, 0.8, 1.405]} material={mats.windowFrame}>
        <boxGeometry args={[1.56, 0.44, 0.02]} />
      </mesh>

      {/* Ground Center Recessed Entrance Foyer */}
      <mesh position={[0.3, 0.8, 0.3]} material={mats.stucco}>
        <boxGeometry args={[1.3, 1.36, 1.2]} />
      </mesh>
      {/* Main Entrance Dark Front Door */}
      <mesh position={[0.25, 0.72, 0.91]} material={mats.darkAccent}>
        <planeGeometry args={[0.85, 1.2]} />
      </mesh>

      {/* Cantilevered Overhang Entrance Canopy Slab */}
      <mesh position={[0.3, 1.5, 1.15]} castShadow material={mats.stucco}>
        <boxGeometry args={[1.7, 0.12, 1.3]} />
      </mesh>

      {/* Ground Right Wing: Dark Vertical Louvers / Feature Wall (East view) */}
      <mesh position={[1.55, 0.8, 0.05]} castShadow receiveShadow material={mats.darkAccent}>
        <boxGeometry args={[1.4, 1.36, 2.5]} />
      </mesh>
      {/* Small square service window on East Elevation */}
      <mesh position={[2.26, 0.72, 0.1]} rotation={[0, Math.PI / 2, 0]} material={mats.glassGround}>
        <planeGeometry args={[0.42, 0.42]} />
      </mesh>

      {/* Rear Backyard (North Elevation) Sliding Glass Doors */}
      <mesh position={[-0.1, 0.75, -1.31]} rotation={[0, Math.PI, 0]} material={mats.glassGround}>
        <planeGeometry args={[2.5, 1.2]} />
      </mesh>

      {/* Ground-to-First Floor Intermediary Slab */}
      <mesh position={[0.1, 1.52, -0.05]} material={mats.stucco}>
        <boxGeometry args={[4.6, 0.12, 3.2]} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. FIRST FLOOR (Second Level & Iconic Panoramic Corner Glass) */}
      {/* ============================================================ */}
      {/* Upper Left Master Bedroom Block (Stucco with window) */}
      <mesh position={[-1.25, 2.3, 0.0]} castShadow receiveShadow material={mats.stucco}>
        <boxGeometry args={[1.9, 1.44, 2.4]} />
      </mesh>
      {/* Upper Left South Window */}
      <mesh position={[-1.25, 2.32, 1.21]} material={mats.glassGround}>
        <planeGeometry args={[1.3, 0.65]} />
      </mesh>

      {/* Upper Right Suite: The Iconic Corner Panoramic Window (South & East) */}
      <mesh position={[0.42, 2.3, 0.2]} material={mats.darkAccent}>
        <boxGeometry args={[1.5, 1.38, 1.5]} />
      </mesh>

      {/* South Facing Large Glass Facade (Major Solar Heat Load Vector) */}
      <mesh position={[0.42, 2.32, 0.96]} material={mats.glassUpperCorner}>
        <planeGeometry args={[1.7, 1.15]} />
      </mesh>
      {/* East Facing Large Glass Facade */}
      <mesh position={[1.28, 2.32, 0.2]} rotation={[0, Math.PI / 2, 0]} material={mats.glassUpperCorner}>
        <planeGeometry args={[1.5, 1.15]} />
      </mesh>

      {/* Architectural Window Mullions / Corner Post */}
      <mesh position={[1.275, 2.32, 0.955]} material={mats.windowFrame}>
        <boxGeometry args={[0.05, 1.22, 0.05]} />
      </mesh>
      <mesh position={[0.42, 2.32, 0.965]} material={mats.windowFrame}>
        <boxGeometry args={[0.02, 1.22, 0.02]} />
      </mesh>

      {/* Cantilevered Balcony / Terrace on the East Side */}
      <mesh position={[1.75, 1.55, 0.0]} castShadow material={mats.stucco}>
        <boxGeometry args={[1.1, 0.1, 2.3]} />
      </mesh>
      {/* Balcony Glass Balustrade / Railing */}
      <mesh position={[2.29, 1.9, 0.0]} rotation={[0, Math.PI / 2, 0]} material={mats.glassBalustrade}>
        <planeGeometry args={[2.3, 0.65]} />
      </mesh>
      <mesh position={[1.75, 1.9, 1.14]} material={mats.glassBalustrade}>
        <planeGeometry args={[1.1, 0.65]} />
      </mesh>
      <mesh position={[1.75, 1.9, -1.14]} rotation={[0, Math.PI, 0]} material={mats.glassBalustrade}>
        <planeGeometry args={[1.1, 0.65]} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. ROOF LEVEL & SOLAR CANOPY (Top View / Plan)                */}
      {/* ============================================================ */}
      {/* Roof Parapet Walls */}
      <mesh position={[-1.25, 3.12, 0.0]} material={mats.stucco}>
        <boxGeometry args={[2.0, 0.22, 2.5]} />
      </mesh>
      <mesh position={[0.42, 3.08, 0.1]} material={mats.stucco}>
        <boxGeometry args={[1.8, 0.2, 2.2]} />
      </mesh>

      {/* Main Roof Surface Slab (Target for Cool Roof / LST Hotspot) */}
      <mesh position={[-0.4, 3.16, 0.0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.roofSlab}>
        <planeGeometry args={[3.2, 2.0]} />
      </mesh>

      {/* High-Albedo Cool Roof Coating Overlay Layer */}
      {viewMode === 'retrofit' && (
        <mesh position={[-0.4, 3.18, 0.0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.coolRoofCoating}>
          <planeGeometry args={[3.25, 2.05]} />
        </mesh>
      )}

      {/* Rooftop Solar Pergola / Photovoltaic Panels */}
      <group position={[0.3, 3.4, -0.3]} rotation={[0.2, 0, 0]}>
        <mesh position={[-0.6, -0.15, -0.4]} material={mats.solarFrame}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
        </mesh>
        <mesh position={[0.6, -0.15, -0.4]} material={mats.solarFrame}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
        </mesh>
        <mesh position={[-0.6, -0.1, 0.4]} material={mats.solarFrame}>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
        </mesh>
        <mesh position={[0.6, -0.1, 0.4]} material={mats.solarFrame}>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.solarPanel}>
          <boxGeometry args={[1.4, 1.0, 0.03]} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 5. HOTSPOT MARKERS & CONTEXTUAL CALLOUTS                     */}
      {/* ============================================================ */}
      {showOverviewHotspots && (
        <>
          {/* HOTSPOT 1: Roof LST (Heat Absorption High) - Positioned safely below top toolbar */}
          <group position={[0.4, 3.3, -0.1]}>
            {/* Orange glowing anchor point on roof */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.3} />
            </mesh>

            <Html
              position={[0.25, -0.25, 0.35]}
              distanceFactor={8}
              zIndexRange={[100, 0]}
              center={false}
            >
              <div
                onClick={() => onSelectHotspot?.('roof')}
                className={`
                  p-2.5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer select-none min-w-[185px]
                  ${isDark
                    ? 'bg-[#0a1329]/95 border-brand-500/50 hover:border-brand-500 text-white shadow-glow'
                    : 'bg-white/95 border-gray-200/90 hover:border-brand-500 text-gray-900 shadow-card'
                  }
                  ${selectedHotspot === 'roof' ? 'ring-2 ring-brand-500' : ''}
                `}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold text-rose-500 tracking-wider uppercase font-mono">
                    Issue Detected
                  </span>
                  <span className="text-gray-400 text-xs font-mono">›</span>
                </div>
                <div className="text-xs font-bold leading-snug font-sans text-gray-900 dark:text-white">Roof LST: 56.8 °C</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mb-1.5">Heat Absorption High</div>
                <div className="pt-1.5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">High-Albedo Cool Roof</span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mt-0.5">
                  Est. Savings: <span className="text-emerald-600 dark:text-emerald-400 font-bold">$31.2k/yr</span>
                </div>
              </div>
            </Html>
          </group>

          {/* HOTSPOT 2: South Glass Facade (High Solar Heat Gain) - Positioned neatly without left panel clipping */}
          <group position={[-0.8, 2.3, 1.25]}>
            {/* Orange anchor dot on glass */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.3} />
            </mesh>

            <Html
              position={[-1.3, 0.1, 0.2]}
              distanceFactor={8}
              zIndexRange={[100, 0]}
              center={false}
            >
              <div
                onClick={() => onSelectHotspot?.('facade')}
                className={`
                  p-2.5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer select-none min-w-[185px]
                  ${isDark
                    ? 'bg-[#0a1329]/95 border-brand-500/50 hover:border-brand-500 text-white shadow-glow'
                    : 'bg-white/95 border-gray-200/90 hover:border-brand-500 text-gray-900 shadow-card'
                  }
                  ${selectedHotspot === 'facade' ? 'ring-2 ring-brand-500' : ''}
                `}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold text-amber-500 tracking-wider uppercase font-mono">
                    Issue Detected
                  </span>
                  <span className="text-gray-400 text-xs font-mono">›</span>
                </div>
                <div className="text-xs font-bold leading-snug font-sans text-gray-900 dark:text-white">South Glass Facade</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mb-1.5">High Solar Heat Gain</div>
                <div className="pt-1.5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Nano-Ceramic Film</span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mt-0.5">
                  Est. Savings: <span className="text-emerald-600 dark:text-emerald-400 font-bold">$18.7k/yr</span>
                </div>
              </div>
            </Html>
          </group>

          {/* HOTSPOT 3: Insulation Gap (Heat Leakage Moderate) */}
          <group position={[1.4, 0.9, 0.8]}>
            {/* Orange anchor dot on wall */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.3} />
            </mesh>

            <Html
              position={[0.2, -0.15, 0]}
              distanceFactor={8}
              zIndexRange={[100, 0]}
              center={false}
            >
              <div
                onClick={() => onSelectHotspot?.('insulation')}
                className={`
                  p-2.5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer select-none min-w-[185px]
                  ${isDark
                    ? 'bg-[#0a1329]/95 border-brand-500/50 hover:border-brand-500 text-white shadow-glow'
                    : 'bg-white/95 border-gray-200/90 hover:border-brand-500 text-gray-900 shadow-card'
                  }
                  ${selectedHotspot === 'insulation' ? 'ring-2 ring-brand-500' : ''}
                `}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold text-amber-500 tracking-wider uppercase font-mono">
                    Issue Detected
                  </span>
                  <span className="text-gray-400 text-xs font-mono">›</span>
                </div>
                <div className="text-xs font-bold leading-snug font-sans text-gray-900 dark:text-white">Insulation Gap</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mb-1.5">Heat Leakage Moderate</div>
                <div className="pt-1.5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Wall Insulation Upgrade</span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 font-mono mt-0.5">
                  Est. Savings: <span className="text-emerald-600 dark:text-emerald-400 font-bold">$12.4k/yr</span>
                </div>
              </div>
            </Html>
          </group>
        </>
      )}
    </group>
  );
};

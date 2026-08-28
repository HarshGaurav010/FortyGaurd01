'use client';

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  WebGL availability detection                                       */
/* ------------------------------------------------------------------ */
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Procedural Building Mesh — 20-floor digital twin                   */
/* ------------------------------------------------------------------ */
interface ProceduralBuildingProps {
  mouseTarget: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
  prefersReduced: boolean;
  isMobile: boolean;
}

const ProceduralBuilding: React.FC<ProceduralBuildingProps> = ({
  mouseTarget,
  scrollProgress,
  prefersReduced,
  isMobile,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentRot = useRef({ x: 0, y: 0 });

  const floorCount = isMobile ? 12 : 20;
  const floorHeight = 0.22;
  const towerWidth = 1.6;
  const towerDepth = 1.2;
  const gapBetweenFloors = 0.03;

  // Materials — memoized for performance
  const mats = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({
      color: '#0d1520',
      roughness: 0.5,
      metalness: 0.7,
      transparent: true,
      opacity: 0.35,
    }),
    edge: new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.12,
    }),
    facade: new THREE.MeshStandardMaterial({
      color: '#0f2a42',
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.3,
      emissive: '#06b6d4',
      emissiveIntensity: 0.08,
    }),
    roofHot: new THREE.MeshStandardMaterial({
      color: '#f97316',
      emissive: '#ea580c',
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.45,
    }),
    roofCool: new THREE.MeshStandardMaterial({
      color: '#06b6d4',
      emissive: '#22d3ee',
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.2,
    }),
    wireframe: new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    }),
  }), []);

  // Floor geometries
  const floors = useMemo(() => {
    const arr: { yPos: number; isHot: boolean }[] = [];
    for (let i = 0; i < floorCount; i++) {
      const yPos = i * (floorHeight + gapBetweenFloors);
      const isHot = i >= floorCount - 3; // Top 3 floors are thermally stressed
      arr.push({ yPos, isHot });
    }
    return arr;
  }, [floorCount, floorHeight, gapBetweenFloors]);

  const towerTop = floorCount * (floorHeight + gapBetweenFloors);

  // Smooth cursor-reactive rotation + scroll parallax
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    if (!prefersReduced) {
      // Cursor rotation — slow, heavy lerp (0.02 factor)
      const targetX = mouseTarget.current.y * 0.12;  // max ±0.12 rad
      const targetY = mouseTarget.current.x * 0.12;
      currentRot.current.x += (targetX - currentRot.current.x) * 0.02;
      currentRot.current.y += (targetY - currentRot.current.y) * 0.02;

      groupRef.current.rotation.x = currentRot.current.x;
      groupRef.current.rotation.y = currentRot.current.y + 0.3; // slight base offset

      // Scroll parallax — subtle Y drift and opacity
      const sp = scrollProgress.current;
      groupRef.current.position.y = -1 + sp * -2.5;
    } else {
      groupRef.current.rotation.y += clampedDelta * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} rotation={[0, 0.3, 0]}>
      {/* Base podium */}
      <mesh position={[0, -0.15, 0]} material={mats.body}>
        <boxGeometry args={[towerWidth + 0.6, 0.25, towerDepth + 0.6]} />
      </mesh>

      {/* Stacked floor slabs */}
      {floors.map((floor, i) => (
        <group key={i} position={[0, floor.yPos, 0]}>
          {/* Floor slab */}
          <mesh material={floor.isHot ? mats.roofHot : mats.body}>
            <boxGeometry args={[towerWidth, floorHeight, towerDepth]} />
          </mesh>
          {/* Facade accent on front face every 2 floors */}
          {i % 2 === 0 && (
            <mesh position={[0, 0, towerDepth / 2 + 0.001]} material={mats.facade}>
              <planeGeometry args={[towerWidth - 0.08, floorHeight - 0.02]} />
            </mesh>
          )}
        </group>
      ))}

      {/* Tower wireframe overlay */}
      <mesh position={[0, towerTop / 2 - 0.1, 0]} material={mats.wireframe}>
        <boxGeometry args={[towerWidth + 0.02, towerTop + 0.02, towerDepth + 0.02]} />
      </mesh>

      {/* Emissive edge lines — vertical pillars */}
      {[
        [-towerWidth / 2, 0, -towerDepth / 2],
        [towerWidth / 2, 0, -towerDepth / 2],
        [-towerWidth / 2, 0, towerDepth / 2],
        [towerWidth / 2, 0, towerDepth / 2],
      ].map(([x, , z], i) => (
        <mesh key={`pillar-${i}`} position={[x, towerTop / 2 - 0.1, z]} material={mats.edge}>
          <boxGeometry args={[0.015, towerTop, 0.015]} />
        </mesh>
      ))}

      {/* Rooftop accent — thermal glow */}
      <mesh position={[0, towerTop + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.roofHot}>
        <planeGeometry args={[towerWidth - 0.1, towerDepth - 0.1]} />
      </mesh>

      {/* Cool roof overlay (subtle) */}
      <mesh position={[0, towerTop + 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.roofCool}>
        <planeGeometry args={[towerWidth * 0.6, towerDepth * 0.6]} />
      </mesh>

      {/* Ambient particle points — subtle floating heat particles */}
      <HeatParticles count={isMobile ? 30 : 80} spread={3} height={towerTop + 1} />
    </group>
  );
};

/* ------------------------------------------------------------------ */
/*  Subtle floating heat particles                                     */
/* ------------------------------------------------------------------ */
const HeatParticles: React.FC<{ count: number; spread: number; height: number }> = ({
  count,
  spread,
  height,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;

      // Gradient: bottom=cyan, top=orange
      const t = pos[i * 3 + 1] / height;
      col[i * 3] = 0.13 + t * 0.84;       // R
      col[i * 3 + 1] = 0.83 - t * 0.45;   // G
      col[i * 3 + 2] = 0.93 - t * 0.75;   // B
    }
    return { positions: pos, colors: col };
  }, [count, spread, height]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.15; // Slow upward drift
      if (arr[i * 3 + 1] > height) arr[i * 3 + 1] = 0;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.35} sizeAttenuation />
    </points>
  );
};

/* ------------------------------------------------------------------ */
/*  Scene wrapper with lighting                                        */
/* ------------------------------------------------------------------ */
interface SceneContentProps {
  mouseTarget: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
  prefersReduced: boolean;
  isMobile: boolean;
}

const SceneContent: React.FC<SceneContentProps> = (props) => {
  const { gl } = useThree();

  // Cap pixel ratio for performance
  useEffect(() => {
    const maxDpr = props.isMobile ? 1.0 : 1.5;
    gl.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  }, [gl, props.isMobile]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#e2e8f0" />
      <pointLight position={[-3, 4, -2]} intensity={0.25} color="#22d3ee" distance={15} />
      <pointLight position={[3, 6, 2]} intensity={0.15} color="#f97316" distance={12} />
      <ProceduralBuilding {...props} />
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Static fallback for no-WebGL environments                          */
/* ------------------------------------------------------------------ */
const StaticFallback: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
    <div className="relative w-48 h-80 opacity-20">
      {/* Simple CSS building silhouette */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-72 bg-gradient-to-t from-cyan-900/30 to-slate-900/20 border border-cyan-500/10 rounded-sm" />
      <div className="absolute bottom-72 left-1/2 -translate-x-1/2 w-28 h-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-sm" />
      {/* Window grid dots */}
      {Array.from({ length: 8 }).map((_, row) => (
        <div key={row} className="absolute flex gap-2 left-1/2 -translate-x-1/2" style={{ bottom: `${row * 32 + 16}px` }}>
          {Array.from({ length: 4 }).map((_, col) => (
            <div key={col} className="w-1.5 h-3 bg-cyan-500/10 rounded-[1px]" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main exported component                                            */
/* ------------------------------------------------------------------ */
export const HeroBuildingScene: React.FC = () => {
  const [webGLReady, setWebGLReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebGLReady(isWebGLAvailable());
    setIsMobile(window.innerWidth < 768);
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Normalized cursor tracking (not directly assigned — stored for lerp in useFrame)
    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;  // -1 to +1
      mouseTarget.current.y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to +1
    };

    // Scroll progress tracking (0 = top, 1 = one viewport down)
    const handleScroll = () => {
      scrollProgress.current = Math.min(window.scrollY / window.innerHeight, 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!webGLReady) {
    return <StaticFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Suspense fallback={<StaticFallback />}>
        <Canvas
          camera={{ position: [3, 2.5, 4.5], fov: 40 }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <SceneContent
            mouseTarget={mouseTarget}
            scrollProgress={scrollProgress}
            prefersReduced={prefersReduced}
            isMobile={isMobile}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

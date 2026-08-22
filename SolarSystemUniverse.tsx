'use client';

import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import WarpStars from './WarpStars';
import CelestialBody, { type CelestialPlanetConfig } from './CelestialBody';
import type { AnalysisResult, ExtractionStatus } from '@/lib/types';

interface SolarSystemUniverseProps {
  analysis: AnalysisResult | null;
  status: ExtractionStatus;
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string | null) => void;
}

function scoreToColor(score: number): { primary: string; emissive: string } {
  if (score >= 80) return { primary: '#10b981', emissive: '#059669' };
  if (score >= 60) return { primary: '#f59e0b', emissive: '#d97706' };
  if (score >= 40) return { primary: '#f97316', emissive: '#ea580c' };
  return { primary: '#f43f5e', emissive: '#e11d48' };
}

// ── 3D Camera Traversal Director ─────────────────────────────────────────────

function CameraDirector({
  targetPos,
  isWarping,
  hasSelection,
}: {
  targetPos: THREE.Vector3 | null;
  isWarping: boolean;
  hasSelection: boolean;
}) {
  const { camera, controls } = useThree();
  const desiredCamPos = useRef(new THREE.Vector3(0, 14, 22));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (targetPos) {
      // Zoom into target planet with slight elevation offset
      desiredCamPos.current.set(
        targetPos.x * 1.15 + (targetPos.x > 0 ? 2.5 : -2.5),
        targetPos.y + 2.2,
        targetPos.z * 1.15 + 3.8
      );
      desiredTarget.current.copy(targetPos);
    } else if (isWarping) {
      desiredCamPos.current.set(0, 4, 12);
      desiredTarget.current.set(0, 0, 0);
    } else {
      // Full celestial system overview
      desiredCamPos.current.set(0, 16, 26);
      desiredTarget.current.set(0, 0, 0);
    }

    camera.position.lerp(desiredCamPos.current, delta * (hasSelection ? 3.5 : 2.0));
    if (controls && (controls as any).target) {
      (controls as any).target.lerp(desiredTarget.current, delta * 3.5);
    }
  });

  return null;
}

// ── The Central Sun (Impact Score Core) ──────────────────────────────────────

function SunCore({
  analysis,
  isSelected,
  onSelect,
}: {
  analysis: AnalysisResult | null;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const sunRef = useRef<THREE.Mesh>(null!);
  const coronaRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const score = analysis?.impactScore.score ?? 88;
  const grade = analysis?.impactScore.grade ?? 'A+';
  const colors = useMemo(() => (analysis ? scoreToColor(score) : { primary: '#8b5cf6', emissive: '#6d28d9' }), [analysis, score]);

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
      coronaRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic point light cast from Sun across whole galaxy */}
      <pointLight position={[0, 0, 0]} intensity={3.5} color={colors.primary} distance={45} decay={1.5} />
      <pointLight position={[0, 0, 0]} intensity={2.0} color="#ffffff" distance={20} />

      {/* Pulsing Corona / Solar Flare */}
      <mesh ref={coronaRef} scale={1.6}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={hovered || isSelected ? 0.45 : 0.22}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sun Plasma Sphere */}
      <mesh
        ref={sunRef}
        scale={hovered ? 1.12 : isSelected ? 1.08 : 1.0}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1.75, 64, 64]} />
        <MeshDistortMaterial
          color={colors.primary}
          emissive={colors.emissive}
          emissiveIntensity={isSelected ? 2.2 : hovered ? 1.8 : 1.3}
          distort={0.35}
          speed={2.5}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Central Sun Holographic Badge */}
      <Html center distanceFactor={14} position={[0, 2.5, 0]} style={{ pointerEvents: 'none' }}>
        <div
          className="transition-all duration-300"
          style={{
            background: isSelected
              ? 'rgba(15, 15, 28, 0.95)'
              : hovered
              ? 'rgba(10, 10, 20, 0.85)'
              : 'rgba(5, 5, 10, 0.7)',
            border: `1px solid ${isSelected ? colors.primary : `${colors.primary}50`}`,
            boxShadow: `0 0 30px ${colors.primary}60, inset 0 0 15px ${colors.primary}30`,
            backdropFilter: 'blur(16px)',
            padding: '6px 14px',
            borderRadius: '24px',
            color: '#ffffff',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          <span
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
              boxShadow: `0 0 10px ${colors.primary}`,
              animation: 'pulse 2s infinite',
            }}
          />
          <span style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em' }}>
            {analysis ? 'IMPACT SUN' : 'COSMIC CORE'}
          </span>
          <span
            style={{
              background: colors.primary,
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '11px',
            }}
          >
            {analysis ? `${score} (${grade})` : 'READY'}
          </span>
        </div>
      </Html>
    </group>
  );
}

// ── Asteroid Belt ────────────────────────────────────────────────────────────

function AsteroidBelt() {
  const count = 160;
  const beltMeshRef = useRef<THREE.InstancedMesh>(null!);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const asteroids = useMemo(() => {
    const arr = [];
    const minRadius = 14.5;
    const maxRadius = 16.5;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.1;
      const r = minRadius + Math.random() * (maxRadius - minRadius);
      const y = (Math.random() - 0.5) * 1.8;
      const scale = 0.06 + Math.random() * 0.12;
      arr.push({ angle, r, y, scale, speed: 0.08 + Math.random() * 0.05 });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (beltMeshRef.current) {
      asteroids.forEach((ast, i) => {
        const currentAngle = ast.angle + state.clock.elapsedTime * ast.speed;
        dummy.position.set(Math.cos(currentAngle) * ast.r, ast.y, Math.sin(currentAngle) * ast.r);
        dummy.scale.setScalar(ast.scale);
        dummy.rotation.set(currentAngle * 2, currentAngle, 0);
        dummy.updateMatrix();
        beltMeshRef.current.setMatrixAt(i, dummy.matrix);
      });
      beltMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={beltMeshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#64748b" roughness={0.9} metalness={0.2} />
    </instancedMesh>
  );
}

// ── Main Scene ───────────────────────────────────────────────────────────────

function Scene({
  analysis,
  status,
  selectedPlanetId,
  onSelectPlanet,
}: SolarSystemUniverseProps) {
  const [selectedWorldPos, setSelectedWorldPos] = useState<THREE.Vector3 | null>(null);
  const isWarping = ['uploading', 'extracting', 'analyzing'].includes(status);

  // Configuration for 7 Planets + 1 Satellite Probe
  const planets = useMemo<CelestialPlanetConfig[]>(() => {
    const hookScore = analysis?.impactScore.subScores.hook ?? 82;
    const toneScore = analysis?.impactScore.subScores.tone ?? 75;
    const engageScore = analysis?.engagementPotential.score ?? 85;
    const ctaStrength = analysis?.ctaDetection.ctaStrength ?? 'strong';
    const ctaScore = analysis?.impactScore.subScores.cta ?? 78;

    return [
      {
        id: 'hook',
        name: 'Hook Horizon',
        category: 'Hook Analysis',
        score: hookScore,
        scoreLabel: `${analysis ? `${analysis.hookAnalysis.rating}/10` : `${hookScore}%`}`,
        color: '#f43f5e',
        emissiveColor: '#be123c',
        size: 0.55,
        orbitRadius: 4.8,
        orbitSpeed: 0.45,
        orbitTilt: 0.35,
        orbitOffset: 0.2,
        description: 'First impression power & scroll-stopping rating',
      },
      {
        id: 'tone',
        name: 'Tone Atmosphere',
        category: 'Tone & Voice',
        score: toneScore,
        scoreLabel: analysis?.toneDetection.primaryTone || `${toneScore}%`,
        color: '#06b6d4',
        emissiveColor: '#0891b2',
        size: 0.65,
        orbitRadius: 7.2,
        orbitSpeed: 0.35,
        orbitTilt: -0.4,
        orbitOffset: 1.8,
        description: 'Emotional resonance, clarity & persona fit',
      },
      {
        id: 'engagement',
        name: 'Engagement World',
        category: 'Engagement Potential',
        score: engageScore,
        scoreLabel: analysis?.engagementPotential.level.toUpperCase() || 'HIGH',
        color: '#10b981',
        emissiveColor: '#047857',
        size: 0.72,
        orbitRadius: 9.8,
        orbitSpeed: 0.26,
        orbitTilt: 0.25,
        orbitOffset: 3.2,
        moonsCount: 1,
        description: 'Virality odds, shareability & conversation drivers',
      },
      {
        id: 'cta',
        name: 'CTA Flare',
        category: 'Call to Action',
        score: ctaScore,
        scoreLabel: ctaStrength.toUpperCase(),
        color: '#f59e0b',
        emissiveColor: '#b45309',
        size: 0.58,
        orbitRadius: 12.2,
        orbitSpeed: 0.22,
        orbitTilt: -0.3,
        orbitOffset: 4.6,
        description: 'Conversion trigger clarity & reader direction',
      },
      {
        id: 'platforms',
        name: 'Platform Giant',
        category: 'Platform Intelligence',
        score: 80,
        scoreLabel: '3 MOONS',
        color: '#8b5cf6',
        emissiveColor: '#6d28d9',
        size: 1.05,
        orbitRadius: 18.0,
        orbitSpeed: 0.16,
        orbitTilt: 0.45,
        orbitOffset: 0.8,
        moonsCount: 3,
        description: 'Tailored algorithms for LinkedIn, X (Twitter) & Instagram',
      },
      {
        id: 'hashtags',
        name: 'Hashtag Saturn',
        category: 'Hashtag Intelligence',
        score: 84,
        scoreLabel: `${analysis ? analysis.hashtagIntelligence.suggested.length : 8} TAGS`,
        color: '#ec4899',
        emissiveColor: '#be185d',
        size: 0.9,
        orbitRadius: 21.5,
        orbitSpeed: 0.12,
        orbitTilt: -0.35,
        orbitOffset: 2.5,
        hasRings: true,
        ringsColor: '#f472b6',
        description: 'Suggested, trending and high-conversion hashtags',
      },
      {
        id: 'suggestions',
        name: 'Improvement Outpost',
        category: 'Actionable Advice',
        score: 90,
        scoreLabel: `${analysis ? analysis.improvementSuggestions.length : 4} TIPS`,
        color: '#38bdf8',
        emissiveColor: '#0284c7',
        size: 0.62,
        orbitRadius: 24.8,
        orbitSpeed: 0.09,
        orbitTilt: 0.5,
        orbitOffset: 4.1,
        description: 'Priority suggestions to boost content ROI',
      },
      {
        id: 'rewrite',
        name: 'AI Rewrite Station',
        category: 'Before vs After',
        score: 95,
        scoreLabel: 'DIFF READY',
        color: '#a855f7',
        emissiveColor: '#7e22ce',
        size: 0.48,
        orbitRadius: 27.5,
        orbitSpeed: 0.07,
        orbitTilt: -0.2,
        orbitOffset: 5.5,
        description: 'Instant side-by-side comparison & AI optimized copy',
      },
    ];
  }, [analysis]);

  // When selection changes via external prop
  useEffect(() => {
    if (!selectedPlanetId) {
      setSelectedWorldPos(null);
    } else if (selectedPlanetId === 'sun') {
      setSelectedWorldPos(new THREE.Vector3(0, 0, 0));
    }
  }, [selectedPlanetId]);

  const handleSelectPlanet = (id: string, worldPos: THREE.Vector3) => {
    setSelectedWorldPos(worldPos);
    onSelectPlanet(id);
  };

  const handleSelectSun = () => {
    setSelectedWorldPos(new THREE.Vector3(0, 0, 0));
    onSelectPlanet('sun');
  };

  const handleBackgroundClick = () => {
    setSelectedWorldPos(null);
    onSelectPlanet(null);
  };

  return (
    <>
      <ambientLight intensity={0.25} />
      
      {/* Starfield & Hyperspace Warp */}
      <WarpStars isWarping={isWarping} />

      {/* Invisible backdrop sphere to reset selection on background click */}
      <mesh onClick={handleBackgroundClick} visible={false}>
        <sphereGeometry args={[120, 16, 16]} />
        <meshBasicMaterial side={THREE.BackSide} />
      </mesh>

      {/* Central Sun */}
      <SunCore
        analysis={analysis}
        isSelected={selectedPlanetId === 'sun'}
        onSelect={handleSelectSun}
      />

      {/* Asteroid Belt */}
      <AsteroidBelt />

      {/* 7 Orbiting Celestial Planets + Probe */}
      {planets.map((planet) => (
        <CelestialBody
          key={planet.id}
          config={planet}
          isSelected={selectedPlanetId === planet.id}
          onSelect={handleSelectPlanet}
        />
      ))}

      {/* Camera Interpolator */}
      <CameraDirector
        targetPos={selectedWorldPos}
        isWarping={isWarping}
        hasSelection={!!selectedPlanetId}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={48}
        autoRotate={!selectedPlanetId && !isWarping}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}

export default function SolarSystemUniverse(props: SolarSystemUniverseProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 bg-[#030307] pointer-events-auto overflow-hidden">
      <Canvas
        camera={{ position: [0, 16, 26], fov: 48 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}

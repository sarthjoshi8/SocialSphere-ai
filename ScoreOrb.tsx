'use client';

import { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, MeshDistortMaterial, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

interface ScoreOrbProps {
  data: AnalysisResult['impactScore'];
}

function scoreToColor(score: number): string {
  if (score >= 80) return '#10b981'; // Emerald
  if (score >= 60) return '#f59e0b'; // Amber
  if (score >= 40) return '#f97316'; // Orange
  return '#f43f5e'; // Rose
}

// ── Camera Controller ────────────────────────────────────────────────────────

function CameraController({ focusedPlanet }: { focusedPlanet: THREE.Vector3 | null }) {
  const { camera, controls } = useThree();
  const vec = new THREE.Vector3();

  useFrame((state, delta) => {
    if (focusedPlanet) {
      // Move camera towards the focused planet, slightly offset
      vec.copy(focusedPlanet).add(new THREE.Vector3(0, 0, 3));
      camera.position.lerp(vec, delta * 3);
      if (controls && (controls as any).target) {
        (controls as any).target.lerp(focusedPlanet, delta * 3);
      }
    } else {
      // Default view
      vec.set(0, 2, 7);
      camera.position.lerp(vec, delta * 2);
      if (controls && (controls as any).target) {
        (controls as any).target.lerp(new THREE.Vector3(0, 0, 0), delta * 2);
      }
    }
  });

  return null;
}

// ── The Sun (Impact Score) ───────────────────────────────────────────────────

function Sun({ score }: { score: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const color = scoreToColor(score);
  
  // Base scale on score
  const scale = 1.0 + (score / 100) * 0.4;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group scale={scale}>
      {/* Outer Glow / Corona */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Sun Core */}
      <Sphere args={[1.2, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          distort={0.4}
          speed={3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Score Text inside Sun */}
      <Text
        position={[0, 0, 1.3]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
      >
        {score}
      </Text>
    </group>
  );
}

// ── Orbiting Planet (Sub-Score) ──────────────────────────────────────────────

function Planet({
  label,
  score,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  orbitTilt,
  onFocus,
}: {
  label: string;
  score: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  orbitTilt: number;
  onFocus: (pos: THREE.Vector3 | null) => void;
}) {
  const ref = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const color = scoreToColor(score);
  
  // Size based on score
  const size = 0.15 + (score / 100) * 0.2;

  useFrame((state) => {
    if (ref.current) {
      const angle = state.clock.elapsedTime * orbitSpeed + orbitOffset;
      ref.current.position.x = Math.cos(angle) * orbitRadius;
      ref.current.position.y = Math.sin(angle * orbitTilt) * 0.8;
      ref.current.position.z = Math.sin(angle) * orbitRadius;
      
      // Rotate the planet itself
      ref.current.rotation.y += 0.05;
    }
  });

  return (
    <group ref={ref}>
      <mesh
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onFocus(ref.current.position.clone());
        }}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Label and Score (Always visible if hovered, else faded) */}
      <Html center distanceFactor={12}>
        <div
          style={{
            background: hovered ? 'rgba(5,5,8,0.95)' : 'rgba(5,5,8,0.6)',
            border: `1px solid ${color}${hovered ? 'aa' : '40'}`,
            borderRadius: '8px',
            padding: '4px 8px',
            whiteSpace: 'nowrap',
            color: 'white',
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0.6,
            transition: 'all 0.2s',
            boxShadow: hovered ? `0 0 15px ${color}50` : 'none',
          }}
        >
          <span style={{ color }}>{label}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '4px' }}>{score}</span>
        </div>
      </Html>
    </group>
  );
}

// ── Orbital Rings ────────────────────────────────────────────────────────────

function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * tilt) * 0.8, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius, tilt]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: '#ffffff',
      opacity: 0.1,
      transparent: true,
    }))} />
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────

function Scene({ data }: { data: AnalysisResult['impactScore'] }) {
  const [focusedPlanet, setFocusedPlanet] = useState<THREE.Vector3 | null>(null);

  // Speed and radius map based on scores
  const subScores = useMemo(() => [
    { label: 'Hook', score: data.subScores.hook, orbitRadius: 2.8, orbitSpeed: 0.8, orbitOffset: 0, orbitTilt: 0.8 },
    { label: 'Clarity', score: data.subScores.clarity, orbitRadius: 3.4, orbitSpeed: 0.5, orbitOffset: 1.2, orbitTilt: -0.6 },
    { label: 'Engage', score: data.subScores.engagement, orbitRadius: 4.0, orbitSpeed: 0.4, orbitOffset: 2.4, orbitTilt: 0.3 },
    { label: 'CTA', score: data.subScores.cta, orbitRadius: 4.6, orbitSpeed: 0.3, orbitOffset: 3.6, orbitTilt: -0.4 },
    { label: 'Tone', score: data.subScores.tone, orbitRadius: 5.2, orbitSpeed: 0.25, orbitOffset: 4.8, orbitTilt: 0.7 },
  ], [data]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffffff" distance={10} />
      
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.2} color="#8b5cf6" />

      {/* Click background to reset focus */}
      <mesh onClick={() => setFocusedPlanet(null)} visible={false}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide} />
      </mesh>

      <Sun score={data.score} />

      {subScores.map((s) => (
        <group key={s.label}>
          <OrbitRing radius={s.orbitRadius} tilt={s.orbitTilt} />
          <Planet {...s} onFocus={setFocusedPlanet} />
        </group>
      ))}

      <CameraController focusedPlanet={focusedPlanet} />
      
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        maxDistance={12}
        minDistance={3}
        autoRotate={!focusedPlanet}
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ScoreOrb({ data }: ScoreOrbProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card p-6 space-y-4 col-span-full relative overflow-hidden"
    >
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <Box className="w-4 h-4" style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <h3 className="font-semibold text-white">Solar System Analysis</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Click planets to zoom in. Click background to reset.
          </p>
        </div>
      </div>

      <div
        className="w-full rounded-xl overflow-hidden cursor-move"
        style={{ height: '500px', background: '#030305', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene data={data} />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}

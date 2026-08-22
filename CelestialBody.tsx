'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface CelestialPlanetConfig {
  id: string;
  name: string;
  category: string;
  score?: number;
  scoreLabel?: string;
  color: string;
  emissiveColor: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitTilt: number;
  orbitOffset: number;
  hasRings?: boolean;
  ringsColor?: string;
  moonsCount?: number;
  description?: string;
}

interface CelestialBodyProps {
  config: CelestialPlanetConfig;
  isSelected: boolean;
  onSelect: (id: string, worldPosition: THREE.Vector3) => void;
}

export default function CelestialBody({ config, isSelected, onSelect }: CelestialBodyProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Generate orbit ring geometry
  const orbitPoints = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * config.orbitRadius,
          Math.sin(angle * config.orbitTilt) * 0.9,
          Math.sin(angle) * config.orbitRadius
        )
      );
    }
    return pts;
  }, [config.orbitRadius, config.orbitTilt]);

  const orbitGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(orbitPoints), [orbitPoints]);

  // Orbit & self-rotation frame update
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const angle = time * config.orbitSpeed + config.orbitOffset;
      const x = Math.cos(angle) * config.orbitRadius;
      const y = Math.sin(angle * config.orbitTilt) * 0.9;
      const z = Math.sin(angle) * config.orbitRadius;

      groupRef.current.position.set(x, y, z);

      if (meshRef.current) {
        meshRef.current.rotation.y += 0.015;
      }
      if (atmosphereRef.current) {
        atmosphereRef.current.rotation.y -= 0.008;
      }
      if (ringRef.current) {
        ringRef.current.rotation.z += 0.005;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      onSelect(config.id, worldPos);
    }
  };

  return (
    <>
      {/* Visual Orbital Track */}
      <primitive
        object={
          new THREE.Line(
            orbitGeometry,
            new THREE.LineBasicMaterial({
              color: isSelected ? config.color : hovered ? '#ffffff' : config.color,
              opacity: isSelected ? 0.45 : hovered ? 0.3 : 0.12,
              transparent: true,
            })
          )
        }
      />

      {/* Orbiting Planet Group */}
      <group ref={groupRef}>
        {/* Atmosphere Halo */}
        <mesh ref={atmosphereRef} scale={hovered || isSelected ? 1.45 : 1.25}>
          <sphereGeometry args={[config.size, 32, 32]} />
          <meshBasicMaterial
            color={config.emissiveColor}
            transparent
            opacity={isSelected ? 0.35 : hovered ? 0.25 : 0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Planet Core Sphere */}
        <mesh
          ref={meshRef}
          scale={hovered ? 1.2 : isSelected ? 1.15 : 1}
          onClick={handleClick}
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
          <sphereGeometry args={[config.size, 48, 48]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissiveColor}
            emissiveIntensity={isSelected ? 1.2 : hovered ? 0.8 : 0.35}
            roughness={0.35}
            metalness={0.7}
          />
        </mesh>

        {/* Optional Rings (e.g. Saturn / Hashtags) */}
        {config.hasRings && (
          <mesh ref={ringRef} rotation={[-Math.PI / 3, 0.2, 0]}>
            <ringGeometry args={[config.size * 1.5, config.size * 2.5, 64]} />
            <meshBasicMaterial
              color={config.ringsColor || config.color}
              transparent
              opacity={isSelected ? 0.8 : 0.45}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Optional Mini-Moons (e.g. Jupiter / Platforms) */}
        {!!config.moonsCount && (
          <group>
            {Array.from({ length: config.moonsCount }).map((_, idx) => {
              const count = config.moonsCount ?? 1;
              const moonDist = config.size * (1.8 + idx * 0.6);
              const moonAngle = (idx * Math.PI * 2) / count;
              return (
                <mesh key={idx} position={[Math.cos(moonAngle) * moonDist, Math.sin(moonAngle) * 0.2, Math.sin(moonAngle) * moonDist]}>
                  <sphereGeometry args={[config.size * 0.18, 16, 16]} />
                  <meshStandardMaterial color="#94a3b8" emissive="#38bdf8" emissiveIntensity={0.5} />
                </mesh>
              );
            })}
          </group>
        )}

        {/* 3D Holographic Label Badge */}
        <Html center distanceFactor={14} position={[0, config.size + 0.5, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className="transition-all duration-300"
            style={{
              background: isSelected
                ? 'rgba(15, 15, 28, 0.95)'
                : hovered
                ? 'rgba(10, 10, 20, 0.85)'
                : 'rgba(5, 5, 10, 0.65)',
              border: `1px solid ${isSelected ? config.color : hovered ? 'rgba(255,255,255,0.4)' : `${config.color}35`}`,
              boxShadow: isSelected
                ? `0 0 25px ${config.color}60, inset 0 0 15px ${config.color}20`
                : hovered
                ? `0 0 15px ${config.color}40`
                : 'none',
              backdropFilter: 'blur(12px)',
              padding: '5px 10px',
              borderRadius: '20px',
              color: '#ffffff',
              fontSize: '11px',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              whiteSpace: 'nowrap',
              transform: isSelected ? 'scale(1.1)' : 'scale(1)',
              opacity: isSelected || hovered ? 1 : 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: config.color,
                boxShadow: `0 0 8px ${config.color}`,
              }}
            />
            <span style={{ fontWeight: 600, letterSpacing: '0.02em' }}>{config.name}</span>
            {config.score !== undefined && (
              <span
                style={{
                  background: `${config.color}25`,
                  color: config.color,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '10px',
                }}
              >
                {config.scoreLabel || config.score}
              </span>
            )}
          </div>
        </Html>
      </group>
    </>
  );
}

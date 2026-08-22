'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, Sparkles } from '@react-three/drei';

interface WarpStarsProps {
  isWarping: boolean;
}

export default function WarpStars({ isWarping }: WarpStarsProps) {
  const warpMeshRef = useRef<THREE.Points>(null!);
  const count = 1200;

  // Generate warp lines along Z axis
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100; // Z
      spd[i] = 1.5 + Math.random() * 3.5;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (warpMeshRef.current && isWarping) {
      const positionAttr = warpMeshRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = positionAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        array[i * 3 + 2] += speeds[i] * 35 * delta;
        if (array[i * 3 + 2] > 30) {
          array[i * 3 + 2] = -70;
        }
      }
      positionAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Ambient background stars */}
      <Stars radius={120} depth={80} count={4000} factor={4.5} saturation={1} fade speed={isWarping ? 4 : 0.8} />
      
      {/* Cosmic Nebula Sparkles */}
      <Sparkles count={150} scale={35} size={3} speed={isWarping ? 3 : 0.5} opacity={0.35} color="#8b5cf6" />
      <Sparkles count={100} scale={25} size={2.5} speed={isWarping ? 2.5 : 0.4} opacity={0.25} color="#06b6d4" />
      <Sparkles count={60} scale={40} size={4} speed={isWarping ? 4 : 0.6} opacity={0.2} color="#ec4899" />

      {/* Warp hyperspace particle streak system */}
      {isWarping && (
        <points ref={warpMeshRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.25}
            color="#a78bfa"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
}

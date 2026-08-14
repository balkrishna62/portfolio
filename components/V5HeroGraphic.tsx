"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function LiquidOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;

      // Mouse reaction: distorts more when mouse moves further from center
      const mouseDistance = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2);
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, 0.3 + mouseDistance * 0.4, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#1e293b"
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

export default function V5HeroGraphic() {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, right: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ pointerEvents: "none" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#06b6d4" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#8b5cf6" />
        <Environment preset="city" />
        <LiquidOrb />
      </Canvas>
    </div>
  );
}

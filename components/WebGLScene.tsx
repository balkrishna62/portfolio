"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function GlassShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle constant rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Mouse parallax mapping
      const pointerX = (state.pointer.x * Math.PI) / 4;
      const pointerY = (state.pointer.y * Math.PI) / 4;
      
      meshRef.current.rotation.x += (pointerY - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (pointerX - meshRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
        <meshPhysicalMaterial 
          color="#000000"
          metalness={0.9}
          roughness={0.05}
          transmission={0.95} /* Glass effect */
          thickness={1.5}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          attenuationColor="#ffffff"
          attenuationDistance={2}
        />
      </mesh>
    </Float>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#8b5cf6" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#06b6d4" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />
    </>
  );
}

export default function WebGLScene() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        {/* Adds realistic reflections to the physical material */}
        <Environment preset="city" />
        
        <Lighting />
        
        <GlassShape />
        
        {/* Floating dust particles */}
        <Sparkles 
          count={150} 
          scale={10} 
          size={2} 
          speed={0.2} 
          opacity={0.3}
          color="#a78bfa" 
        />
        
        {/* Floor shadow */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
}

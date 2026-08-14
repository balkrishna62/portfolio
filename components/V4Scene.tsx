"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, Icosahedron } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useRef, useState, useEffect } from "react";

// Store scroll progress in a shared state
let globalScrollProgress = 0;

if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    globalScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  });
}

function DigitalCore() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!coreRef.current) return;
    
    const r1 = globalScrollProgress;
    
    coreRef.current.rotation.x = state.clock.elapsedTime * 0.1 + r1 * Math.PI * 2;
    coreRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    
    const scale = 1 + r1 * 5; 
    coreRef.current.scale.set(scale, scale, scale);
    
    coreRef.current.position.z = r1 * 10;
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
        <Icosahedron ref={coreRef} args={[2, 2]} position={[0, 0, -5]}>
          <meshStandardMaterial 
            color="#06b6d4" 
            wireframe 
            emissive="#06b6d4" 
            emissiveIntensity={2} 
            transparent
            opacity={0.3}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

function CameraController() {
  useFrame((state) => {
    const r1 = globalScrollProgress;
    // Smoothly interpolate camera position based on scroll
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5 - (r1 * 15), 0.1);
    
    // Mouse look-around
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.05;
    state.camera.position.y += (state.pointer.y * 0.5 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, -10);
  });
  return null;
}

export default function V4Scene() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#020204", zIndex: 0, pointerEvents: "none" }}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 60 }} gl={{ powerPreference: "high-performance", antialias: false }}>
        <color attach="background" args={['#020204']} />
        <ambientLight intensity={0.2} />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.5} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        <Sparkles count={500} scale={20} size={1.5} speed={0.4} opacity={0.6} color="#8b5cf6" position={[0,0,-5]} />
        <Sparkles count={500} scale={20} size={1} speed={0.2} opacity={0.3} color="#06b6d4" position={[0,0,-10]} />

        <CameraController />
        <DigitalCore />
      </Canvas>
    </div>
  );
}

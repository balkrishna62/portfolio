"use client";

import "./v3.css";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import Chatbot from "../../components/Chatbot";

// Dynamically import the WebGL scene to strictly run on the client
// This prevents Next.js from attempting to render 'window' or Three.js on the server
const WebGLScene = dynamic(() => import("../../components/WebGLScene"), { 
  ssr: false,
  loading: () => <div style={{ position: "fixed", inset: 0, background: "#050505", zIndex: 0 }} />
});

export default function V3Home() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => { if (Array.isArray(d)) setProjects(d); }).catch(() => {});
  }, []);

  return (
    <main className="v3-layout">
      {/* 3D WebGL Background */}
      <WebGLScene />

      {/* Spatial UI Layer */}
      <nav className="v3-nav">
        <a href="#top" className="v3-logo">Prerit.</a>
        <div className="v3-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="v3-section">
        <div style={{ maxWidth: 800 }}>
          <h1 className="v3-hero-title">Crafting digital<br/>experiences.</h1>
          <p className="v3-hero-subtitle">
            I am a full-stack developer blending minimalist design with cutting-edge web technologies to build the future of the internet.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#work" className="v3-button">
              Explore Work <ArrowUpRight size={16} />
            </a>
            <a href="#contact" className="v3-button outline">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="v3-section">
        <h2 className="v3-section-title">Selected Projects</h2>
        
        <div style={{ display: "grid", gap: 40 }}>
          {projects.slice(0, 3).map((p, i) => (
            <div key={p._id || i} className="v3-glass-card" style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <h3 style={{ fontSize: 24, fontWeight: 500, margin: "0 0 12px" }}>{p.title}</h3>
                <p style={{ color: "var(--v3-text-muted)", fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>{p.description}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {p.tags?.map((t: string) => (
                    <span key={t} style={{ fontSize: 12, padding: "4px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 100, color: "var(--v3-text-muted)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              
              {p.image && (
                <div style={{ flex: 1, minWidth: 300 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} style={{ width: "100%", borderRadius: 12, border: "1px solid var(--v3-border)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="v3-section" style={{ minHeight: "80vh" }}>
        <div className="v3-glass-card" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "80px 40px" }}>
          <h2 style={{ fontSize: 32, fontWeight: 500, margin: "0 0 16px" }}>Ready to build?</h2>
          <p style={{ color: "var(--v3-text-muted)", marginBottom: 40 }}>Let's create something extraordinary together.</p>
          <a href="mailto:balpokharel62@gmail.com" className="v3-button" style={{ fontSize: 16, padding: "16px 32px" }}>
            Start a Conversation
          </a>
        </div>
      </section>

      <Chatbot />
    </main>
  );
}

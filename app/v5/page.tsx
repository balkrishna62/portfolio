"use client";

import "./v5.css";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import CustomCursor from "../../components/CustomCursor";
import Chatbot from "../../components/Chatbot";

// Dynamically import the V5 Hero Graphic to strictly run on the client
const V5HeroGraphic = dynamic(() => import("../../components/V5HeroGraphic"), { ssr: false });

export default function V5Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const techStack = ["React", "Next.js", "Node.js", "MongoDB", "Figma", "TypeScript", "Tailwind CSS", "GraphQL"];

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setProjects(d); })
      .catch(() => {});
  }, []);

  return (
    <main className="v5-layout">
      <CustomCursor />
      
      <nav className="v5-nav">
        <a href="#top" className="v5-logo">Prerit.</a>
        <div className="v5-links">
          <a href="#work">Work</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="top" className="v5-section" style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
        {/* The creative touch: a single, isolated 3D graphic on the right */}
        <V5HeroGraphic />
        
        <div style={{ position: "relative", zIndex: 10 }}>
          <h1 className="v5-hero-title">Simple.<br />Elegant.<br /><span style={{ color: "var(--v5-accent)" }}>Creative.</span></h1>
          <p className="v5-hero-subtitle">
            I am a full-stack developer & UI designer crafting premium digital experiences with pixel-perfect precision.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#work" className="v5-button">View Work <ArrowUpRight size={18}/></a>
            <a href="#contact" className="v5-button outline">Get in Touch</a>
          </div>
        </div>
      </section>

      {/* --- CLEAN TECH MARQUEE --- */}
      <section id="stack" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="v5-marquee">
          <div className="v5-marquee-content">
            {techStack.map(tech => <span key={tech} className="v5-marquee-item">{tech}</span>)}
          </div>
          {/* Duplicate for infinite loop illusion */}
          <div className="v5-marquee-content" aria-hidden="true">
            {techStack.map(tech => <span key={`dup-${tech}`} className="v5-marquee-item">{tech}</span>)}
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="work" className="v5-section">
        <h2 className="v5-section-title">Selected Projects</h2>
        
        <div className="v5-card-grid">
          {projects.slice(0, 3).map((p, i) => (
            <div key={p._id || i} className="v5-card">
              <div className="v5-card-content">
                <h3 style={{ fontSize: 32, margin: "0 0 16px", fontWeight: 700 }}>{p.title}</h3>
                <p style={{ color: "var(--v5-text-muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>{p.description}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {p.tags?.map((t: string) => (
                    <span key={t} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 100, fontSize: 13 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {p.image && (
                <div className="v5-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="v5-section" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 800, margin: "0 0 24px" }}>Let's build something.</h2>
          <p style={{ color: "var(--v5-text-muted)", fontSize: 20, marginBottom: 40 }}>Based in Nepal. Working globally.</p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <a href="mailto:balpokharel62@gmail.com" className="v5-button" style={{ padding: "18px 40px" }}>Establish Connection <ArrowUpRight size={18}/></a>
          </div>
        </div>
      </section>

      <Chatbot />
    </main>
  );
}

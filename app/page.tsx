"use client";

import "./v1/v4.css";
import dynamic from "next/dynamic";
import Chatbot from "../components/Chatbot";
import { ArrowUpRight, Home, Grid, Code, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const V4Scene = dynamic(() => import("../components/V4Scene"), { 
  ssr: false,
  loading: () => <div style={{ position: "fixed", inset: 0, background: "#020204", zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#06b6d4", fontFamily: "monospace" }}>INITIALIZING DIGITAL CORE...</div>
});

export default function V4Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState({
    heroImage: "/og-image.png",
    heroTitle: "Bal Krishna\\nPokharel.",
    heroSubtitle: "Full-Stack Developer & Designer crafting digital perfection in Kathmandu, Nepal.",
    aboutTitle: "One brain. Two disciplines.",
    aboutText: "I am a developer & designer based in Kathmandu, Nepal. I work at the intersection of technology and visual design.\\n\\nI care about the details: button spacing, animation rhythm, API structure, and the feeling a brand leaves behind.",
    contactTitle: "Let's Build.",
    contactSubtitle: "Ready to create something extraordinary together?"
  });

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      setSubmitStatus("error");
    }
    setIsSubmitting(false);
  };

  // Filter logic
  const webProjects = projects.filter(p => !p.type?.toLowerCase().includes("graphic") && !p.type?.toLowerCase().includes("design"));
  const graphicProjects = projects.filter(p => p.type?.toLowerCase().includes("graphic") || p.type?.toLowerCase().includes("design"));

  // Skills
  const skills = [
    "React", "Next.js 15", "TypeScript", "Node.js", "MongoDB", 
    "PostgreSQL", "WebGL", "Framer Motion", "UI/UX Design", "Graphic Design", "Tailwind CSS"
  ];

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => { 
        if (Array.isArray(d) && d.length > 0) {
          setProjects(d); 
        } else {
          // Fallback data if DB is empty or connection fails (due to ISP block)
          setProjects([
            { title: "E-Commerce Platform", description: "A high-performance Next.js 15 shopping experience.", type: "Web", tags: ["Next.js", "React", "MongoDB"] },
            { title: "SaaS Dashboard", description: "Real-time analytics portal with dynamic charts.", type: "Web", tags: ["TypeScript", "Tailwind", "PostgreSQL"] },
            { title: "TechCorp Rebranding", description: "Complete brand identity and marketing assets.", type: "Graphic", tags: ["Figma", "Illustrator", "Brand"] },
            { title: "Product Packaging", description: "3D rendered packaging design for a modern beverage.", type: "Graphic", tags: ["Photoshop", "Blender", "Design"] },
          ]);
        }
      })
      .catch(() => {
        // Fallback on network error
        setProjects([
          { title: "E-Commerce Platform", description: "A high-performance Next.js 15 shopping experience.", type: "Web", tags: ["Next.js", "React", "MongoDB"] },
          { title: "SaaS Dashboard", description: "Real-time analytics portal with dynamic charts.", type: "Web", tags: ["TypeScript", "Tailwind", "PostgreSQL"] },
          { title: "TechCorp Rebranding", description: "Complete brand identity and marketing assets.", type: "Graphic", tags: ["Figma", "Illustrator", "Brand"] },
          { title: "Product Packaging", description: "3D rendered packaging design for a modern beverage.", type: "Graphic", tags: ["Photoshop", "Blender", "Design"] },
        ]);
      });
      
    fetch("/api/settings").then(r => r.json()).then(d => { if (d && !d.error) setSiteSettings(prev => ({ ...prev, ...d })); }).catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll();
  
  // Downward Parallax: As user scrolls down (Y increases), the image moves down (+Y mapping)
  const imageY = useTransform(scrollYProgress, [0, 0.4], [-50, 150]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1.1]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <main style={{ backgroundColor: "#020204" }}>
      {/* Sidebar Navigation */}
      <nav style={{
        position: 'fixed', left: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 100,
        display: 'flex', flexDirection: 'column', gap: '24px',
        background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', padding: '24px 12px', borderRadius: '100px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <a href="#home" title="Home" className="nav-btn"><Home size={20} /></a>
        <a href="#projects" title="Projects" className="nav-btn"><Grid size={20} /></a>
        <a href="#skills" title="Skills" className="nav-btn"><Code size={20} /></a>
        <a href="#contact" title="Contact" className="nav-btn"><Mail size={20} /></a>
      </nav>

      <style jsx>{`
        .nav-btn { color: #8b949e; padding: 12px; border-radius: 50%; transition: all 0.3s; display: flex; }
        .nav-btn:hover { color: #fff; background: rgba(255,255,255,0.1); transform: scale(1.1); }
      `}</style>

      <V4Scene />

      <div style={{ position: "relative", zIndex: 10, width: "100%", overflowX: "hidden" }}>
        
        {/* 1. Hero Section */}
        <motion.div id="home" className="v4-section" style={{ height: '100vh', opacity: heroOpacity }}>
          <h1 className="v4-title">
            {siteSettings.heroTitle.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}
          </h1>
          <p className="v4-subtitle">{siteSettings.heroSubtitle}</p>
          <p className="v4-scroll-hint">SCROLL TO INITIATE <span>↓</span></p>
        </motion.div>

        {/* 1.5. Profile Image Section (Glides down with you) */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '60px', width: '100%', maxWidth: '1000px' }}>
            
            <motion.div style={{ 
              y: imageY, 
              opacity: imageOpacity, 
              scale: imageScale,
              width: 'min(90vw, 400px)',
              height: '500px',
              flexShrink: 0
            }}>
              <div className="v4-creative-frame">
                <div className="v4-image-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={siteSettings.heroImage || "/og-image.png"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </motion.div>

            <motion.div style={{ flex: '1 1 300px', opacity: imageOpacity, y: imageY }}>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, margin: '0 0 24px', lineHeight: 1.1 }}>
                {siteSettings.aboutTitle.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}
              </h2>
              <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                {siteSettings.aboutText.split('\\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: 16 }}>{line}</p>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* 2. Web Projects Section */}
        <div id="projects" style={{ position: 'relative', top: '-100px', visibility: 'hidden' }} />
        {webProjects.length > 0 && (
          <div className="v4-section" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            <h2 className="v4-heading">Web Development</h2>
            <div className="v4-grid">
              {webProjects.slice(0, 4).map((p, i) => (
                <div key={i} className="v4-card">
                  <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 20px' }}>{p.description}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {p.tags?.map((t: string) => (
                      <span key={t} style={{ fontSize: 12, padding: "4px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 100, color: "#8b949e" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Graphic Projects Section */}
        {graphicProjects.length > 0 && (
          <div className="v4-section" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            <h2 className="v4-heading">Graphic Design</h2>
            <div className="v4-grid">
              {graphicProjects.slice(0, 4).map((p, i) => (
                <div key={i} className="v4-card" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 20px' }}>{p.description}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {p.tags?.map((t: string) => (
                      <span key={t} style={{ fontSize: 12, padding: "4px 12px", background: "rgba(139, 92, 246, 0.1)", borderRadius: 100, color: "#c4b5fd" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Skills Section */}
        <div id="skills" className="v4-section" style={{ minHeight: '80vh' }}>
          <h2 className="v4-heading">Core Capabilities</h2>
          <div className="v4-skills-grid">
            {skills.map(skill => (
              <div key={skill} className="v4-skill-pill">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Contact Section */}
        <div id="contact" className="v4-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '10vh' }}>
          <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="v4-heading" style={{ fontSize: 'clamp(40px, 6vw, 80px)', textShadow: '0 0 40px #06b6d4', margin: '0 0 16px' }}>{siteSettings.contactTitle}</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 20, marginBottom: 40 }}>{siteSettings.contactSubtitle}</p>
            
            <form onSubmit={handleFormSubmit} className="v4-form-container">
              <input 
                type="text" 
                placeholder="YOUR NAME" 
                className="v4-input" 
                required 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="v4-input" 
                required 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea 
                placeholder="YOUR MESSAGE" 
                className="v4-input" 
                style={{ height: '120px', resize: 'none' }} 
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
              <button type="submit" className="v4-submit" disabled={isSubmitting}>
                {isSubmitting ? "TRANSMITTING..." : submitStatus === "success" ? "MESSAGE SENT" : "ESTABLISH CONNECTION"}
              </button>
              {submitStatus === "error" && (
                <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>Network interference detected. Please try again.</p>
              )}
            </form>
          </div>
        </div>
        
      </div>

      <Chatbot />
    </main>
  );
}

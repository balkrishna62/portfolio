"use client";

import "./v2.css";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import Chatbot from "../../components/Chatbot";

// --- TILT CARD COMPONENT (3D Glass Slab) ---
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12; // Increased rotation for more dramatic depth
    const rotateY = ((x - centerX) / centerX) * 12;
    
    cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    cardRef.current.style.setProperty('--card-x', `${x}px`);
    cardRef.current.style.setProperty('--card-y', `${y}px`);
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`tilt-card ${className || ""}`}>
      <div className="tilt-inner">
        {children}
      </div>
    </div>
  );
};

// --- DOM PHYSICS SANDBOX COMPONENT ---
const PhysicsStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const coinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const techStack = ["React", "Next.js 15", "Node.js", "MongoDB", "Figma", "UI/UX", "Tailwind", "TypeScript", "GraphQL", "AWS"];

  useEffect(() => {
    let engine: any, render: any, runner: any;
    
    const initPhysics = async () => {
      if (!containerRef.current) return;
      const Matter = (await import('matter-js')).default;
      const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      engine = Engine.create();
      engine.gravity.y = 0.8; // Stronger gravity for chunky coins

      // Invisible render (we only use it for mouse constraints and bounds)
      render = Render.create({
        element: containerRef.current,
        engine: engine,
        options: { width, height, background: 'transparent', wireframes: false }
      });
      // Hide the canvas, we use DOM
      render.canvas.style.display = "none";

      const wallOptions = { isStatic: true, restitution: 0.8 };
      World.add(engine.world, [
        Bodies.rectangle(width/2, height + 25, width, 50, wallOptions), // Ground
        Bodies.rectangle(width/2, -1000, width, 50, wallOptions), // Ceiling
        Bodies.rectangle(-25, height/2, 50, height * 2, wallOptions), // Left
        Bodies.rectangle(width + 25, height/2, 50, height * 2, wallOptions) // Right
      ]);

      // Create physical bodies for the coins
      const coins = techStack.map((_, i) => {
        const x = Math.random() * (width - 200) + 100;
        const y = (Math.random() * -800) - 200; // Drop from higher up
        return Bodies.rectangle(x, y, 140, 60, {
          restitution: 0.6,
          friction: 0.1,
          chamfer: { radius: 30 } // Rounded physical body
        });
      });
      World.add(engine.world, coins);

      // Mouse control via the invisible canvas
      const mouse = Mouse.create(containerRef.current);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
      });
      World.add(engine.world, mouseConstraint);

      // Synchronize DOM elements with physics bodies
      Matter.Events.on(engine, 'afterUpdate', () => {
        coins.forEach((body, i) => {
          const domElement = coinRefs.current[i];
          if (domElement) {
            domElement.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
          }
        });
      });

      Runner.run(Runner.create(), engine);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !engine) initPhysics();
    });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (engine) {
        const Matter = require('matter-js');
        Matter.Engine.clear(engine);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: 700, position: "relative", overflow: "hidden", cursor: "grab" }} title="Grab and throw!">
      {techStack.map((tech, i) => (
        <div key={tech} ref={el => { coinRefs.current[i] = el; }} className="physics-coin">
          {tech}
        </div>
      ))}
    </div>
  );
};

export default function V2Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  
  useEffect(() => {
    const handleGlobalMouse = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleGlobalMouse);
    return () => window.removeEventListener('mousemove', handleGlobalMouse);
  }, []);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => { if (Array.isArray(d)) setProjects(d); }).catch(() => {});
  }, []);

  return (
    <main className="v2-dark">
      {/* --- NAVBAR --- */}
      <nav className="dark-nav">
        <a href="#top" className="logo">PRERIT.</a>
        <div className="links">
          <a href="#work">Work</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* --- STICKY HERO (The Morphing Grid) --- */}
      <section id="top" className="hero-sticky">
        <div className="perspective-grid" />
        <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <h1 className="huge-title" style={{ marginLeft: "-2vw" }}>
            <span className="outline">Digital</span><br/>
            Realities
          </h1>
          <p style={{ fontSize: 24, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 600, marginTop: 40, fontWeight: 500 }}>
            I am a full-stack developer & UI/UX designer. I build <span style={{ color: "var(--accent)" }}>immersive web experiences</span> that bend the rules of the DOM.
          </p>
          <div style={{ display: "flex", gap: 20, marginTop: 60 }}>
            <a href="#work" className="btn-3d accent">Initialize Sequence <ArrowUpRight size={18}/></a>
          </div>
        </div>
      </section>

      {/* --- CONTENT CURTAIN --- */}
      <div className="content-curtain">
        
        {/* --- PROJECTS SECTION --- */}
        <section id="work" style={{ padding: "160px 8vw", background: "linear-gradient(to bottom, #0b0c10, #121318)" }}>
          <h2 className="huge-title" style={{ fontSize: "clamp(40px, 8vw, 100px)", marginBottom: 100, textAlign: "right", marginRight: "-2vw" }}>
            <span className="outline">The</span> <span className="gradient">Work</span>
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 100, maxWidth: 1200, margin: "0 auto" }}>
            {projects.slice(0, 3).map((p, i) => (
              <TiltCard key={p._id || i}>
                <div style={{ display: "flex", gap: 60, flexWrap: "wrap", transform: "translateZ(40px)", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 350 }}>
                    <h3 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-2px", margin: "0 0 20px" }}>{p.title}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>{p.description}</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {p.tags?.map((t: string) => (
                        <span key={t} style={{ padding: "8px 16px", background: "rgba(0,0,0,0.4)", borderRadius: 100, fontSize: 13, fontWeight: 700, border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textTransform: "uppercase", letterSpacing: "1px" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {p.image && (
                    <div style={{ flex: 1.2, minWidth: 350 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} style={{ width: "100%", borderRadius: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2)", transform: "translateZ(60px)" }} />
                    </div>
                  )}
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* --- CORE STACK (PHYSICS SANDBOX) --- */}
        <section id="stack" style={{ padding: "160px 0 0", background: "#0b0c10", position: "relative" }}>
          <div style={{ padding: "0 8vw", marginBottom: -100, position: "relative", zIndex: 10, pointerEvents: "none" }}>
            <h2 className="huge-title" style={{ fontSize: "clamp(40px, 8vw, 100px)", lineHeight: 0.9 }}>
              <span className="outline">Tech</span><br/><span className="gradient">Physics</span>
            </h2>
          </div>
          <PhysicsStack />
        </section>

        {/* --- CONTACT TERMINAL --- */}
        <section id="contact" style={{ padding: "160px 8vw 120px", background: "linear-gradient(to top, #0b0c10, #121318)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 80 }}>
            <div>
              <h2 className="huge-title" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.9, marginBottom: 40 }}>
                <span className="outline">Initiate</span><br/><span className="gradient">Protocol</span>
              </h2>
              <div style={{ display: "flex", gap: 20 }}>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-3d" style={{ padding: 20 }}><Github size={24} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-3d" style={{ padding: 20 }}><Linkedin size={24} /></a>
                <a href="mailto:balpokharel62@gmail.com" className="btn-3d" style={{ padding: 20 }}><Mail size={24} /></a>
              </div>
            </div>
            
            <div style={{ background: "#121318", padding: 50, borderRadius: 32, border: "1px solid #1f2025", boxShadow: "0 60px 120px rgba(0,0,0,0.9)" }}>
              <form onSubmit={e => { e.preventDefault(); setFormState("sent"); }}>
                <div style={{ display: "grid", gap: 32, marginBottom: 40 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "#64748b", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>// IDENTITY_INPUT</label>
                    <input type="text" className="term-input" placeholder="Enter your designation" required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "#64748b", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>// COMMS_CHANNEL</label>
                    <input type="email" className="term-input" placeholder="Enter routing email" required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "#64748b", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>// PAYLOAD</label>
                    <textarea className="term-input" rows={4} placeholder="Transmit data..." required style={{ resize: "vertical" }} />
                  </div>
                </div>
                
                {formState === "sent" ? (
                  <div style={{ padding: "24px", background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", borderRadius: 16, border: "1px solid rgba(6,182,212,0.3)", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 16 }}>
                    &gt; TRANSMISSION SUCCESSFUL :: STANDBY
                  </div>
                ) : (
                  <button type="submit" className="btn-3d accent" style={{ width: "100%", justifyContent: "center", fontSize: 18, padding: "24px" }}>
                    EXECUTE_SEND <ArrowUpRight size={20} />
                  </button>
                )}
              </form>
            </div>
          </div>
        </section>

      </div>
      
      <Chatbot />
    </main>
  );
}
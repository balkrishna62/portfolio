"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import Chatbot from "../../components/Chatbot";
import { motion } from "framer-motion";

const PROJECTS = [
  { num: "01", title: "DigiNews", type: "Full Stack / Product", desc: "Modern news platform with a React interface, Node.js backend and database-driven content pipeline.", tags: ["React", "Node.js", "MySQL"] },
  { num: "02", title: "Neko Customs", type: "Brand & Web Design", desc: "Digital identity and storefront built around visual storytelling and conversion-focused design.", tags: ["Branding", "UI/UX", "Web"] },
  { num: "03", title: "ClampHook", type: "Education / Creative", desc: "Marketing visuals and digital experiences for a Nepal-based entrance-exam preparation platform.", tags: ["Creative", "Web", "Design"] },
];

const FAQS = [
  { q: "Who is the best full stack developer in Nepal?", a: "Prerit is one of Nepal's leading full-stack developers, based in Kathmandu. Specializing in React, Next.js, Node.js, and MongoDB — building modern web products for clients in Nepal and worldwide." },
  { q: "Where can I hire a React or Next.js developer in Nepal?", a: "You can hire Prerit — a professional React and Next.js developer based in Kathmandu. Available for freelance, full-time, and consulting. Contact: balpokharel62@gmail.com" },
  { q: "What web development services are available?", a: "Full-stack web development, UI/UX design, graphic design, brand identity, SEO-optimized websites, and e-commerce — all from Kathmandu, Nepal." },
  { q: "What technologies does Prerit use?", a: "React, Next.js 15, Node.js, MongoDB, TypeScript, PostgreSQL, Figma, and Adobe Creative Suite — a complete stack from design to deployment." },
  { q: "Is Prerit available for international clients?", a: "Yes. Prerit works with clients worldwide while based in Kathmandu. Full remote delivery with clear communication and on-time shipping." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [macTab, setMacTab] = useState("overview");
  const [projects, setProjects] = useState<any[]>(PROJECTS);
  const [skills, setSkills] = useState<any[]>([]);
  const [heroImage, setHeroImage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d && d.heroImage) setHeroImage(d.heroImage); })
      .catch(() => {});
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          setProjects(d.map((p, i) => ({
            id: p._id,
            num: String(i + 1).padStart(2, '0'),
            title: p.title,
            type: p.type,
            desc: p.description,
            tags: p.tags || [],
            image: p.image,
            url: p.url
          })));
        }
      })
      .catch(() => {});
    fetch("/api/skills")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setSkills(d);
      })
      .catch(() => {});
  }, []);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setFormState("sent"); setForm({ name: "", email: "", subject: "", message: "" }); }
      else setFormState("error");
    } catch { setFormState("error"); }
  };

  // Filter logic
  const webProjects = projects.filter(p => !p.type?.toLowerCase().includes("graphic") && !p.type?.toLowerCase().includes("design"));
  const graphicProjects = projects.filter(p => p.type?.toLowerCase().includes("graphic") || p.type?.toLowerCase().includes("design"));

  return (
    <main className="v2-page">
      {/* Creative Background Elements */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />
      <div className="bg-grid" />
      
      <style jsx global>{`
        .v2-page {
          --surface: #161b22;
        }
        .v2-page .projCard, .v2-page .servItem, .v2-page .faqItem, .v2-page .hCard {
          background: #161b22;
          border: 1px solid #30363d;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .v2-page .projCard:hover, .v2-page .servItem:hover, .v2-page .hCard:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
          border-color: #8b949e;
        }
        .v2-page .faqItem {
          border-radius: 16px;
          margin-bottom: 16px;
          padding: 0 24px;
        }
        .v2-page .faqItem:hover {
          border-color: #8b949e;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#top" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ height: 32, objectFit: 'contain' }}
            onError={(e) => { 
              e.currentTarget.style.display = 'none'; 
              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline'; 
            }} 
          />
          <span style={{ display: 'none' }}>PR<span>.</span></span>
        </a>
        <div className={"navLinks" + (menu ? " open" : "")}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="burger" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="top" className="hero" style={{ overflow: "hidden", position: "relative" }}>
        <div className="heroLeft" style={{ position: "relative", zIndex: 10 }}>
          <h1>
            Bal Krishna<br />
            <em>Pokharel.</em>
          </h1>
          <p className="heroSub">
            Full-Stack Developer &amp; Graphic Designer crafting digital perfection in Kathmandu, Nepal.<br />
            Available for freelance projects worldwide.
          </p>
          <div className="heroBtns">
            <a href="#work" className="btnPrimary">View Work <ArrowUpRight size={15} /></a>
            <a href="#contact" className="btnOutline">Get in Touch</a>
          </div>
        </div>

        {heroImage ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, -15, 0], opacity: 1 }}
            transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.8 } }}
            style={{
              position: "absolute",
              right: "5%",
              top: "15%",
              width: "40vw",
              maxWidth: 500,
              aspectRatio: "3/4",
              borderRadius: 32,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
              zIndex: 1
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="Prerit" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)", pointerEvents: "none" }} />
          </motion.div>
        ) : (
          <div className="code-window">
            <div className="code-header">
              <span className="code-r"/><span className="code-y"/><span className="code-g"/>
            </div>
            <pre className="code-body">
              <span style={{ color: '#c678dd' }}>const</span> <span style={{ color: '#e5c07b' }}>Developer</span> = () =&gt; {'{\n'}
              {'  '}<span style={{ color: '#c678dd' }}>return</span> {'(\n'}
              {'    '}&lt;<span style={{ color: '#e06c75' }}>CreativeSpace</span>&gt;
              <br/>
              {'      '}&lt;<span style={{ color: '#e06c75' }}>Code</span>&gt;Architecting digital logic&lt;/<span style={{ color: '#e06c75' }}>Code</span>&gt;
              <br/>
              {'      '}&lt;<span style={{ color: '#e06c75' }}>Design</span>&gt;Minimalistic aesthetics&lt;/<span style={{ color: '#e06c75' }}>Design</span>&gt;
              <br/>
              {'    '}&lt;/<span style={{ color: '#e06c75' }}>CreativeSpace</span>&gt;
              <br/>
              {'  )\n'}
              {'};'}
            </pre>
          </div>
        )}
      </section>

      {/* ── MACBOOK MOCKUP ── */}
      <section id="workspace" className="macSection">
        <div className="macLabel">
          <p>A developer &amp; designer in one — building from Kathmandu.</p>
        </div>

        <div className="macWrap">
          <div className="macbook">

            {/* Screen */}
            <div className="macScreen">
              <div className="macBar">
                <span className="dot r" /><span className="dot y" /><span className="dot g" />
                <span className="macBarTitle">prerit.dev — workspace</span>
              </div>
              <div className="macUI">
                <aside className="macSide">
                  <div className="macAvatar">PR</div>
                  <strong>Prerit</strong>
                  <small>KTM, Nepal 🇳🇵</small>
                  <nav className="macNav">
                    <span className={macTab === "overview" ? "active" : ""} onClick={() => setMacTab("overview")}>⌘ Overview</span>
                    <span className={macTab === "projects" ? "active" : ""} onClick={() => setMacTab("projects")}>◈ Projects</span>
                    <span className={macTab === "design" ? "active" : ""} onClick={() => setMacTab("design")}>✦ Design</span>
                    <span className={macTab === "stack" ? "active" : ""} onClick={() => setMacTab("stack")}>▣ Stack</span>
                  </nav>
                </aside>
                <div className="macMain">
                  {macTab === "overview" && (
                    <>
                      <div className="macWelcome">
                        <small>CURRENTLY BUILDING</small>
                        <h3>Digital products<br /><em>that ship.</em></h3>
                      </div>
                      <div className="macCardGrid">
                        <div className="macCard"><b>React</b><small>Frontend</small></div>
                        <div className="macCard"><b>Node.js</b><small>Backend</small></div>
                        <div className="macCard"><b>MongoDB</b><small>Database</small></div>
                        <div className="macCard span2"><b>Next.js 15 · TypeScript · Figma</b><small>Full Stack · Nepal →World</small></div>
                      </div>
                    </>
                  )}
                  {macTab === "projects" && (
                    <div className="macTabContent">
                      <h4>◈ Recent Projects</h4>
                      <ul className="macList">
                        {projects.length > 0 ? (
                          projects.slice(0, 5).map((p: any) => (
                            <li key={p.id}><strong>{p.title}</strong> — {p.type}</li>
                          ))
                        ) : (
                          <li>Loading projects...</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {macTab === "design" && (
                    <div className="macTabContent">
                      <h4>✦ Design Disciplines</h4>
                      <div className="macPills">
                        <span>UI/UX Design</span>
                        <span>Design Systems</span>
                        <span>Brand Identity</span>
                        <span>Typography</span>
                        <span>Prototyping</span>
                      </div>
                    </div>
                  )}
                  {macTab === "stack" && (
                    <div className="macTabContent">
                      <h4>▣ Core Stack</h4>
                      <ul className="macList">
                        <li><strong>Frontend:</strong> React, Next.js, Tailwind, CSS</li>
                        <li><strong>Backend:</strong> Node.js, Express, Next APIs</li>
                        <li><strong>Database:</strong> MongoDB, PostgreSQL</li>
                        <li><strong>Tools:</strong> Git, Vercel, Figma</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Base */}
            {/* Base */}
            <div className="macBase" />

          </div>
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="work" className="section">
        <div className="secHead" style={{ margin: '0 auto 60px', textAlign: 'center' }}>
          <div>
            <h2>Selected <em>Projects</em></h2>
          </div>
          <p style={{ margin: '16px auto 0' }}>From full-stack products to visual identities — built with craft and clarity.</p>
        </div>

        {webProjects.length > 0 && (
          <div style={{ marginBottom: graphicProjects.length > 0 ? 80 : 0 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 24, paddingLeft: 12, borderLeft: '4px solid var(--accent)', letterSpacing: '0.5px' }}>WEB DEVELOPMENT</h3>
            <div className="projGrid">
              {webProjects.map(p => (
                <article key={p.id || p.num} className="projCard">
                  <div className="projVisual" style={{ padding: p.image ? 0 : undefined, overflow: 'hidden' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <>
                        <span className="projNum">{p.num}</span>
                        <div className="projOrb" />
                      </>
                    )}
                  </div>
                  <div className="projInfo">
                    <small>{p.type}</small>
                    <h3 style={{ display: p.url ? "block" : "flex" }}>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {p.title} <ArrowUpRight size={17} />
                        </a>
                      ) : (
                        <>{p.title} <ArrowUpRight size={17} /></>
                      )}
                    </h3>
                    <p>{p.desc}</p>
                    <div className="projTags">
                      {p.tags.map((t: string) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {graphicProjects.length > 0 && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 24, paddingLeft: 12, borderLeft: '4px solid #8b5cf6', letterSpacing: '0.5px' }}>GRAPHIC DESIGN</h3>
            <div className="projGrid">
              {graphicProjects.map(p => (
                <article key={p.id || p.num} className="projCard">
                  <div className="projVisual" style={{ padding: p.image ? 0 : undefined, overflow: 'hidden' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <>
                        <span className="projNum">{p.num}</span>
                        <div className="projOrb" style={{ background: 'linear-gradient(135deg, #8b5cf6, #c4b5fd)' }} />
                      </>
                    )}
                  </div>
                  <div className="projInfo">
                    <small style={{ color: '#8b5cf6' }}>{p.type}</small>
                    <h3 style={{ display: p.url ? "block" : "flex" }}>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {p.title} <ArrowUpRight size={17} />
                        </a>
                      ) : (
                        <>{p.title} <ArrowUpRight size={17} /></>
                      )}
                    </h3>
                    <p>{p.desc}</p>
                    <div className="projTags">
                      {p.tags.map((t: string) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="servSection">
        <div className="section">
          <div className="secHead" style={{ margin: '0 auto 60px', textAlign: 'center' }}>
            <div>
              <h2>What I <em>Do</em></h2>
            </div>
          </div>
          <div className="servGrid">
            {[
              { n: "01", h: "Graphic Design", p: "Visual identities, social creatives, posters and brand systems with a strong point of view." },
              { n: "02", h: "UI / UX Design", p: "Clean interfaces, design systems and user flows that make complex products feel simple." },
              { n: "03", h: "Full Stack Dev", p: "Fast, scalable web apps using React, Next.js, Node.js and MongoDB — end to end." },
            ].map(s => (
              <div key={s.n} className="servItem">
                <span className="servN">{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section">
        <div className="secHead" style={{ margin: '0 auto 60px', textAlign: 'center' }}>
          <div>
            <h2>Core <em>Stack</em></h2>
          </div>
        </div>
        <div className="servGrid">
          {(skills.length > 0 ? skills : [
            { _id: '1', category: "Frontend", skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"] },
            { _id: '2', category: "Backend", skills: ["Node.js", "Express", "Next APIs", "REST"] },
            { _id: '3', category: "Database", skills: ["MongoDB", "PostgreSQL", "Mongoose", "Prisma"] },
            { _id: '4', category: "Design", skills: ["Figma", "UI/UX", "Brand Identity", "Adobe CC"] }
          ]).map(s => (
            <div key={s._id} className="servItem">
              <span className="servN" style={{ marginBottom: 24, color: "#fff" }}>{s.category}</span>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", fontSize: 16, color: "#cbd5e1", lineHeight: 1.8, fontWeight: 500 }}>
                {s.skills.map((t: string, i: number) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                    {t}
                    {i < s.skills.length - 1 && <span style={{ color: "#475569", margin: "0 12px" }}>•</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section aboutSection">
        <div className="aboutLeft">
          <h2>One brain.<br /><em>Two disciplines.</em></h2>
          <p>I&apos;m Prerit — a developer &amp; designer based in <strong>Kathmandu, Nepal</strong>. I work at the intersection of technology and visual design.</p>
          <p>I care about the details: button spacing, animation rhythm, API structure, and the feeling a brand leaves behind.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section">
        <div className="secHead" style={{ margin: '0 auto 60px', textAlign: 'center' }}>
          <div>
            <h2>Common <em>Questions</em></h2>
          </div>
        </div>
        <div className="faqList">
          {FAQS.map((f, i) => (
            <div key={i} className={"faqItem" + (openFaq === i ? " open" : "")}>
              <button className="faqQ" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faqIcon">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="faqA"><p>{f.a}</p></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section contactSection">
        <div className="contactLeft">
          <h2>Let&apos;s build<br /><em>something.</em></h2>
          <p>Available for freelance, full-time, and creative collaborations — in Nepal and worldwide.</p>
          <a href="mailto:balpokharel62@gmail.com" className="contactMail">
            balpokharel62@gmail.com <ArrowUpRight size={16} />
          </a>
          <div className="socialRow">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="mailto:balpokharel62@gmail.com" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
        <form className="contactForm" onSubmit={handleContact}>
          <div className="fRow">
            <div className="fField">
              <label htmlFor="fn">Name</label>
              <input id="fn" type="text" required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="fField">
              <label htmlFor="fe">Email</label>
              <input id="fe" type="email" required placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="fField">
            <label htmlFor="fs">Subject</label>
            <input id="fs" type="text" placeholder="Project idea..." value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="fField">
            <label htmlFor="fm">Message</label>
            <textarea id="fm" rows={5} required placeholder="Tell me about your project..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          {formState === "sent" && <p className="fOk">✓ Message sent! I&apos;ll be in touch.</p>}
          {formState === "error" && <p className="fErr">Something went wrong. Email me directly.</p>}
          <button type="submit" id="contact-submit" className="btnPrimary" disabled={formState === "sending"}>
            {formState === "sending" ? "Sending..." : "Send Message"} <ArrowUpRight size={15} />
          </button>
        </form>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="footLogo">PR.</span>
        <small>© 2026 Prerit · Kathmandu, Nepal</small>
        <a href="#top" className="footTop"><ArrowUp size={13} /> Top</a>
      </footer>

      <Chatbot />
    </main>
  );
}
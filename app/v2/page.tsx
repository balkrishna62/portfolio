"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowUp, Github, Linkedin, Mail } from "lucide-react";

const PROJECTS = [
  { num: "01", title: "DigiNews", type: "Full Stack / Product", desc: "Modern news platform with a React interface, Node.js backend and database-driven content pipeline.", tags: ["React", "Node.js", "MySQL"] },
  { num: "02", title: "Neko Customs", type: "Brand & Web Design", desc: "Digital identity and storefront built around visual storytelling and conversion-focused design.", tags: ["Branding", "UI/UX", "Web"] },
  { num: "03", title: "ClampHook", type: "Education / Creative", desc: "Marketing visuals and digital experiences for a Nepal-based entrance-exam preparation platform.", tags: ["Creative", "Web", "Design"] },
];

const FAQS = [
  { q: "Who is the best full stack developer in Nepal?", a: "Prerit is one of Nepal's leading full-stack developers, based in Kathmandu. Specializing in React, Next.js, Node.js, and MongoDB — building modern web products for clients in Nepal and worldwide." },
  { q: "Where can I hire a React or Next.js developer in Nepal?", a: "You can hire Prerit — a professional React and Next.js developer based in Kathmandu. Available for freelance, full-time, and consulting. Contact: hello@prerit.dev" },
  { q: "What web development services are available?", a: "Full-stack web development, UI/UX design, graphic design, brand identity, SEO-optimized websites, and e-commerce — all from Kathmandu, Nepal." },
  { q: "What technologies does Prerit use?", a: "React, Next.js 15, Node.js, MongoDB, TypeScript, PostgreSQL, Figma, and Adobe Creative Suite — a complete stack from design to deployment." },
  { q: "Is Prerit available for international clients?", a: "Yes. Prerit works with clients worldwide while based in Kathmandu. Full remote delivery with clear communication and on-time shipping." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [macTab, setMacTab] = useState("overview");
  const [projects, setProjects] = useState<any[]>(PROJECTS);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
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
            image: p.image
          })));
        }
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

  return (
    <main className="v2-page">
      <style jsx global>{`
        .v2-page {
          --surface: #ffffff;
        }
        .v2-page .projCard, .v2-page .servItem, .v2-page .faqItem, .v2-page .hCard {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .v2-page .projCard:hover, .v2-page .servItem:hover, .v2-page .hCard:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.04);
          border-color: #cbd5e1;
        }
        .v2-page .faqItem {
          border-radius: 16px;
          margin-bottom: 16px;
          padding: 0 24px;
        }
        .v2-page .faqItem:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#top" className="logo">PR<span>.</span></a>
        <div className={"navLinks" + (menu ? " open" : "")}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="/blog">Blog</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="burger" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="top" className="hero">
        <div className="heroLeft">
          <h1>
            Full Stack<br />
            Developer &amp;<br />
            <em>Designer.</em>
          </h1>
          <p className="heroSub">
            I build fast, beautiful web products — from code to brand.<br />
            Available for freelance projects worldwide.
          </p>
          <div className="heroBtns">
            <a href="#work" className="btnPrimary">View Work <ArrowUpRight size={15} /></a>
            <a href="#contact" className="btnOutline">Get in Touch</a>
          </div>
        </div>
        <div className="heroCards" aria-hidden>
          <div className="hCard">
            <span className="hDot green" />
            <code>npm run build</code>
            <small>✓ Compiled in 3.2s</small>
          </div>
          <div className="hCard">
            <span className="hDot blue" />
            <code>React · Next.js 15</code>
            <small>Full Stack</small>
          </div>
          <div className="hCard accent">
            <span className="hDot lime" />
            <code>hello@prerit.dev</code>
            <small>Available Now</small>
          </div>
        </div>
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
                        <li><strong>DigiNews</strong> — Modern news platform (React/Node)</li>
                        <li><strong>Neko Customs</strong> — Web Identity & Storefront</li>
                        <li><strong>ClampHook</strong> — Educational portal</li>
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
        <div className="secHead">
          <div>
            <h2>Selected<br /><em>Projects</em></h2>
          </div>
          <p>From full-stack products to visual identities — built with craft and clarity.</p>
        </div>
        <div className="projGrid">
          {projects.map(p => (
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
                <h3>{p.title} <ArrowUpRight size={17} /></h3>
                <p>{p.desc}</p>
                <div className="projTags">
                  {p.tags.map((t: string) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="servSection">
        <div className="section">
          <div className="secHead">
            <div>
              <h2>What I<br /><em>Do</em></h2>
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

      <section id="about" className="section aboutSection">
        <div className="aboutLeft">
          <h2>One brain.<br /><em>Two disciplines.</em></h2>
          <p>I&apos;m Prerit — a developer &amp; designer based in <strong>Kathmandu, Nepal</strong>. I work at the intersection of technology and visual design.</p>
          <p>I care about the details: button spacing, animation rhythm, API structure, and the feeling a brand leaves behind.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section">
        <div className="secHead">
          <div>
            <h2>Common<br /><em>Questions</em></h2>
          </div>
          <p>Quick answers — targeting Google's featured snippets.</p>
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
          <a href="mailto:hello@prerit.dev" className="contactMail">
            hello@prerit.dev <ArrowUpRight size={16} />
          </a>
          <div className="socialRow">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="mailto:hello@prerit.dev" aria-label="Email"><Mail size={18} /></a>
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

    </main>
  );
}
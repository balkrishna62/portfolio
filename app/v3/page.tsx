"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./v3.module.css";

const PROJECTS = [
  { num: "01", title: "DigiNews", type: "Full Stack Platform" },
  { num: "02", title: "Neko Customs", type: "E-Commerce & Branding" },
  { num: "03", title: "ClampHook", type: "EdTech Interface" },
  { num: "04", title: "Oasis App", type: "UI/UX Design" },
];

const FAQS = [
  { q: "Who is the best full stack developer in Nepal?", a: "Prerit is one of Nepal's leading full-stack developers, based in Kathmandu. Specializing in React, Next.js, Node.js, and MongoDB." },
  { q: "Where can I hire a React or Next.js developer in Nepal?", a: "You can hire Prerit for freelance or consulting. Contact: hello@prerit.dev" },
  { q: "What web development services are available?", a: "Full-stack web development, UI/UX design, brand identity, and custom software." },
];

export default function V3Page() {
  const [activeSlide, setActiveSlide] = useState(0);
  const macSectionRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!macSectionRef.current) return;
      const { top, height } = macSectionRef.current.getBoundingClientRect();
      const scrollY = -top; 
      // The section is 400vh tall, sticky container is 100vh. 
      // Scroll range is 300vh.
      const maxScroll = window.innerHeight * 3;
      if (scrollY >= 0 && scrollY <= maxScroll) {
        const progress = scrollY / maxScroll;
        // Map progress (0 to 1) to 3 slides (0, 1, 2)
        const slide = Math.min(2, Math.floor(progress * 3));
        setActiveSlide(slide);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className={styles.v3main}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.logo}>PRERIT.</div>
        <div className={styles.navLinks}>
          <Link href="/">V1</Link>
          <Link href="/v2">V2</Link>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <span className={styles.label}>Nepal based</span>
        <h1 className={styles.titleHuge}>Developer<br/>&amp; Designer</h1>
        <div className={styles.heroBottom}>
          <p className={styles.textLead}>
            I build fast, beautiful web products — from code to brand. 
            Focused on minimalist design and robust full-stack architecture.
          </p>
          <span className={styles.label}>Scroll to explore ↓</span>
        </div>
      </section>

      {/* STICKY MACBOOK SECTION */}
      <section ref={macSectionRef} className={styles.macSection}>
        <div className={styles.macSticky}>
          <div className={styles.macbook}>
            <div className={styles.macScreen}>
              <div className={styles.macUI}>
                
                <div className={styles.macSlide} data-active={activeSlide === 0}>
                  <h3>Frontend Architecture</h3>
                  <p>Building lightning fast, interactive interfaces using React and Next.js 15. Server components and modern hooks.</p>
                  <ul>
                    <li>React &amp; Next.js</li>
                    <li>TypeScript</li>
                    <li>Tailwind &amp; Vanilla CSS</li>
                  </ul>
                </div>

                <div className={styles.macSlide} data-active={activeSlide === 1}>
                  <h3>Backend Systems</h3>
                  <p>Scalable APIs, secure authentication, and robust database models using Node.js and MongoDB.</p>
                  <ul>
                    <li>Node.js &amp; Express</li>
                    <li>MongoDB (Mongoose)</li>
                    <li>RESTful APIs &amp; JWTs</li>
                  </ul>
                </div>

                <div className={styles.macSlide} data-active={activeSlide === 2}>
                  <h3>Visual Design</h3>
                  <p>Clean typography, huge negative space, and intuitive user experiences crafted in Figma.</p>
                  <ul>
                    <li>UI/UX Design</li>
                    <li>Brand Identity</li>
                    <li>Design Systems</li>
                  </ul>
                </div>

              </div>
              <div className={styles.macLogo}>MacBook Air</div>
            </div>
            <div className={styles.macBase} />
          </div>
        </div>
      </section>

      {/* WORK / PROJECTS */}
      <section className={styles.section}>
        <span className={styles.label}>Selected Works</span>
        <h2 className={styles.titleMedium}>Recent Projects</h2>
        <div className={styles.workList}>
          {PROJECTS.map(p => (
            <div key={p.num} className={styles.workItem}>
              <span className={styles.workNum}>{p.num}</span>
              <span className={styles.workTitle}>{p.title}</span>
              <span className={styles.workType}>{p.type}</span>
              <span className={styles.workArrow}>↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT & SERVICES */}
      <section className={styles.section}>
        <div className={styles.editorialGrid}>
          <div>
            <span className={styles.label}>About Me</span>
            <h2 className={styles.titleMedium}>One brain.<br/>Two disciplines.</h2>
          </div>
          <div>
            <p className={styles.textLead} style={{marginBottom: "60px"}}>
              I'm Prerit — a developer & designer based in Kathmandu, Nepal. I work at the intersection of technology and visual design, ensuring products not only work flawlessly but look exceptional.
            </p>
            <div className={styles.servList}>
              <div className={styles.servItem}>
                <h4>Full Stack Dev</h4>
                <p>End-to-end web applications built with modern JavaScript frameworks and robust backend architectures.</p>
              </div>
              <div className={styles.servItem}>
                <h4>UI/UX Design</h4>
                <p>Clean interfaces, design systems, and user flows that make complex products feel incredibly simple.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <span className={styles.label}>Information</span>
        <h2 className={styles.titleMedium}>Common Questions</h2>
        <div className={styles.faqContainer}>
          {FAQS.map((f, i) => (
            <div key={i}>
              <div className={styles.faqRow} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <h4>{f.q}</h4>
                <span className={styles.faqIcon}>{openFaq === i ? "−" : "+"}</span>
              </div>
              <div className={styles.faqAns} style={{ height: openFaq === i ? "100px" : "0" }}>
                <p style={{ padding: "16px 0" }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={styles.section} style={{ borderBottom: "none", paddingBottom: "80px" }}>
        <span className={styles.label}>Get in touch</span>
        <a href="mailto:hello@prerit.dev" className={styles.contactGiant}>
          hello@prerit.dev
        </a>
        <p className={styles.textLead}>
          Available for freelance, full-time, and creative collaborations worldwide.
        </p>
      </section>

    </main>
  );
}

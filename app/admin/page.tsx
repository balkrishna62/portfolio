"use client";
import { useEffect, useState } from "react";

interface Stats { projects: number; posts: number; messages: number; unread: number; }

const CARD_STYLE = (color: string) => ({
  background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12,
  padding: "28px 24px", borderTop: `3px solid ${color}`
});

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, posts: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then(r => r.json()),
      fetch("/api/blog").then(r => r.json()),
      fetch("/api/contact").then(r => r.json()),
    ]).then(([projects, posts, messages]) => {
      setStats({
        projects: Array.isArray(projects) ? projects.length : 0,
        posts: Array.isArray(posts) ? posts.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        unread: Array.isArray(messages) ? messages.filter((m: {read:boolean}) => !m.read).length : 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stat = (label: string, value: number | string, sub: string, color: string) => (
    <div style={CARD_STYLE(color)}>
      <p style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono', monospace", letterSpacing: 1, margin: "0 0 12px" }}>{label}</p>
      <p style={{ fontSize: 40, fontWeight: 800, color: "#1e293b", margin: "0 0 4px", letterSpacing: -2 }}>{loading ? "—" : value}</p>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{sub}</p>
    </div>
  );

  return (
    <div style={{ padding: "40px 48px", color: "#1e293b" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, margin: "0 0 8px" }}>Dashboard</h1>
        <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>Welcome back, Prerit. Here's what's happening.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
        {stat("PROJECTS", stats.projects, "portfolio items", "#2563eb")}
        {stat("BLOG POSTS", stats.posts, "published articles", "#55d8ff")}
        {stat("MESSAGES", stats.messages, "total received", "#f59e0b")}
        {stat("UNREAD", stats.unread, "need attention", stats.unread > 0 ? "#ff5555" : "#94a3b8")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 20px", color: "#2563eb" }}>Quick Actions</h3>
          {[
            { label: "+ Add New Project", href: "/admin/projects" },
            { label: "+ Write Blog Post", href: "/admin/blog" },
            { label: "✉ View Messages", href: "/admin/messages" },
            { label: "← View Portfolio", href: "/" },
          ].map(a => (
            <a key={a.href} href={a.href} style={{
              display: "block", padding: "10px 14px", background: "#ffffff",
              border: "1px solid #cbd5e1", borderRadius: 8, color: "#334155",
              textDecoration: "none", fontSize: 13, marginBottom: 10, transition: "border-color .15s"
            }}>{a.label}</a>
          ))}
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 20px", color: "#2563eb" }}>SEO Status</h3>
          {[
            ["Sitemap", "/sitemap.xml", "#28c840"],
            ["Robots.txt", "/robots.txt", "#28c840"],
            ["Structured Data", "JSON-LD Active", "#28c840"],
            ["Nepal GEO Target", "Active", "#28c840"],
            ["AEO / FAQ Schema", "Active", "#28c840"],
          ].map(([label, value, color]) => (
            <div key={String(label)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 12, color: "#777" }}>{String(label)}</span>
              <span style={{ fontSize: 11, color: String(color), fontFamily: "'DM Mono', monospace" }}>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

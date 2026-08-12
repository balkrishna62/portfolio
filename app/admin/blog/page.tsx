"use client";
import { useEffect, useState } from "react";

interface Post { _id: string; title: string; slug: string; excerpt: string; content: string; category: string; tags: string[]; published: boolean; publishedAt?: string; seoTitle?: string; seoDescription?: string; }

const INPUT = { width: "100%", padding: "10px 14px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 8, color: "#1e293b", fontSize: 13, outline: "none", boxSizing: "border-box" as const };
const emptyForm = { title: "", slug: "", excerpt: "", content: "", category: "Web Development", tags: "", published: false, seoTitle: "", seoDescription: "" };

function slugify(str: string) { return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/blog").then(r => r.json()).then(d => setPosts(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg("");
    const body = { ...form, slug: form.slug || slugify(form.title), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    const url = editing ? `/api/blog/${editing}` : "/api/blog";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setMsg(editing ? "Updated!" : "Created!"); setForm(emptyForm); setEditing(null); setShowForm(false); load(); }
    else setMsg("Error saving.");
    setLoading(false);
  };

  const del = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" }); load();
  };

  const edit = (p: Post) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category, tags: p.tags.join(", "), published: p.published, seoTitle: p.seoTitle || "", seoDescription: p.seoDescription || "" });
    setEditing(p.slug); setShowForm(true);
  };

  return (
    <div style={{ padding: "40px 48px", color: "#1e293b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, margin: "0 0 6px" }}>Blog Posts</h1>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>{posts.length} articles</p>
        </div>
        <button id="add-post-btn" onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} style={{ padding: "11px 22px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ New Post</button>
      </div>

      {showForm && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28, marginBottom: 32 }}>
          <h3 style={{ margin: "0 0 24px" }}>{editing ? "Edit" : "New"} Post</h3>
          {msg && <p style={{ color: msg.includes("Error") ? "#ff6b6b" : "#2563eb", fontSize: 13, marginBottom: 16 }}>{msg}</p>}
          <form onSubmit={save}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>TITLE *</label><input style={INPUT} value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} required /></div>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>SLUG</label><input style={INPUT} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>EXCERPT *</label><textarea style={{ ...INPUT, minHeight: 60, resize: "vertical" }} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required /></div>
            <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>CONTENT (Markdown) *</label><textarea style={{ ...INPUT, minHeight: 240, resize: "vertical", fontFamily: "'DM Mono',monospace", fontSize: 12 }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>CATEGORY</label><input style={INPUT} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>TAGS (comma separated)</label><input style={INPUT} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>SEO TITLE</label><input style={INPUT} value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} placeholder="Defaults to title" /></div>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>SEO DESCRIPTION</label><input style={INPUT} value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} placeholder="Max 160 chars" /></div>
            </div>
            <div style={{ display: "flex", gap: 24, marginBottom: 20, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569", cursor: "pointer" }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Publish immediately
              </label>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={loading} style={{ padding: "10px 24px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{loading ? "Saving..." : "Save Post"}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: 8, color: "#64748b", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {posts.length === 0 && <p style={{ color: "#94a3b8" }}>No posts yet. Write your first article!</p>}
        {posts.map(p => (
          <div key={p._id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{p.title}</span>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, fontFamily: "'DM Mono',monospace", background: p.published ? "#dbeafe" : "#fef3c7", color: p.published ? "#2563eb" : "#f59e0b" }}>{p.published ? "PUBLISHED" : "DRAFT"}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>/blog/{p.slug}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`/blog/${p.slug}`} target="_blank" style={{ padding: "8px 16px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: 6, color: "#64748b", fontSize: 12, textDecoration: "none" }}>View</a>
              <button onClick={() => edit(p)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: 6, color: "#334155", fontSize: 12, cursor: "pointer" }}>Edit</button>
              <button onClick={() => del(p.slug)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #4a1818", borderRadius: 6, color: "#ff6b6b", fontSize: 12, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

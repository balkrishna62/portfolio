"use client";
import { useEffect, useState } from "react";

interface Project {
  _id: string; title: string; type: string; description: string;
  tags: string[]; url?: string; featured: boolean; order: number;
}

const INPUT = {
  width: "100%", padding: "10px 14px", background: "#ffffff",
  border: "1px solid #cbd5e1", borderRadius: 8, color: "#1e293b",
  fontSize: 13, outline: "none", boxSizing: "border-box" as const
};

const emptyForm = { title: "", type: "", description: "", tags: "", url: "", image: "", featured: false, order: 0 };

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/projects").then(r => r.json()).then(data => setProjects(Array.isArray(data) ? data : []));
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg("");
    const body = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    const url = editing ? `/api/projects/${editing}` : "/api/projects";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setMsg(editing ? "Updated!" : "Created!"); setForm(emptyForm); setEditing(null); setShowForm(false); load(); }
    else setMsg("Error saving.");
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  };

  const edit = (p: Project & { image?: string }) => {
    setForm({ title: p.title, type: p.type, description: p.description, tags: p.tags.join(", "), url: p.url || "", image: p.image || "", featured: p.featured, order: p.order });
    setEditing(p._id); setShowForm(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setForm({ ...form, image: ev.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "40px 48px", color: "#1e293b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, margin: "0 0 6px" }}>Projects</h1>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>{projects.length} projects in portfolio</p>
        </div>
        <button id="add-project-btn" onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} style={{
          padding: "11px 22px", background: "#2563eb", color: "#ffffff",
          border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer"
        }}>+ Add Project</button>
      </div>

      {showForm && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28, marginBottom: 32 }}>
          <h3 style={{ margin: "0 0 24px", fontSize: 16 }}>{editing ? "Edit" : "New"} Project</h3>
          {msg && <p style={{ color: msg.includes("Error") ? "#ff6b6b" : "#2563eb", marginBottom: 16, fontSize: 13 }}>{msg}</p>}
          <form onSubmit={save}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>TITLE *</label><input style={INPUT} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>TYPE *</label><input style={INPUT} value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="Full Stack / Product" required/></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>DESCRIPTION *</label><textarea style={{...INPUT,minHeight:80,resize:"vertical"}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>TAGS (comma separated)</label><input style={INPUT} value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="React, Node.js, MongoDB"/></div>
              <div><label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>URL</label><input style={INPUT} value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..."/></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>THUMBNAIL IMAGE</label>
              <input type="file" accept="image/*" onChange={handleImage} style={{...INPUT, padding: "8px"}} />
              {form.image && <img src={form.image} alt="Thumbnail preview" style={{ marginTop: 10, maxHeight: 100, borderRadius: 8, border: "1px solid #cbd5e1" }} />}
            </div>
            <div style={{ display: "flex", gap: 24, marginBottom: 20, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569", cursor: "pointer" }}>
                <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Mono',monospace" }}>ORDER</label>
                <input type="number" style={{...INPUT,width:80}} value={form.order} onChange={e=>setForm({...form,order:+e.target.value})}/>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={loading} style={{ padding: "10px 24px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{loading ? "Saving..." : "Save"}</button>
              <button type="button" onClick={()=>setShowForm(false)} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: 8, color: "#64748b", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {projects.length === 0 && <p style={{ color: "#94a3b8", fontSize: 14 }}>No projects yet. Add your first one!</p>}
        {projects.map(p => (
          <div key={p._id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</span>
                {p.featured && <span style={{ fontSize: 10, background: "#1a2208", color: "#2563eb", padding: "3px 8px", borderRadius: 4, fontFamily: "'DM Mono',monospace" }}>FEATURED</span>}
              </div>
              <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 8px", fontFamily: "'DM Mono',monospace" }}>{p.type}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tags.map(t => <span key={t} style={{ fontSize: 10, border: "1px solid #cbd5e1", padding: "3px 8px", borderRadius: 4, color: "#777" }}>{t}</span>)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={()=>edit(p)} style={{ padding: "8px 18px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: 6, color: "#334155", fontSize: 12, cursor: "pointer" }}>Edit</button>
              <button onClick={()=>del(p._id)} style={{ padding: "8px 18px", background: "transparent", border: "1px solid #4a1818", borderRadius: 6, color: "#ff6b6b", fontSize: 12, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

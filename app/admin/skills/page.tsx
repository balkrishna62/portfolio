"use client";
import { useEffect, useState } from "react";

interface SkillCategory {
  _id: string;
  category: string;
  skills: string[];
  order: number;
}

const INPUT = {
  width: "100%", padding: "10px 14px", background: "#ffffff",
  border: "1px solid #cbd5e1", borderRadius: 8, color: "#1e293b",
  fontSize: 13, outline: "none", boxSizing: "border-box" as const
};

const emptyForm = { category: "", skills: "", order: 0 };

export default function AdminSkills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/skills")
      .then(r => r.json())
      .then(d => { setCategories(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.category || !form.skills) return alert("Category and skills required");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/skills/${editing}` : "/api/skills";
    const body = {
      ...form,
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean)
    };
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setForm(emptyForm); setEditing(null); setShowForm(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    load();
  };

  const edit = (c: SkillCategory) => {
    setForm({ category: c.category, skills: c.skills.join(", "), order: c.order });
    setEditing(c._id); setShowForm(true);
  };

  return (
    <div style={{ padding: "40px 48px", color: "#1e293b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", letterSpacing: -1 }}>Skills</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Manage skill categories and tags.</p>
        </div>
        <button 
          onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          {showForm ? "Cancel" : "+ New Category"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 24px" }}>{editing ? "Edit Category" : "New Category"}</h2>
          <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>CATEGORY NAME</label>
                <input style={INPUT} value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Frontend, Backend..."/>
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>ORDER</label>
                <input type="number" style={INPUT} value={form.order} onChange={e=>setForm({...form,order:parseInt(e.target.value)||0})}/>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>SKILLS (comma separated)</label>
              <textarea style={{...INPUT, height: 80, resize: "vertical"}} value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} placeholder="React, Next.js, Tailwind CSS..."/>
            </div>
          </div>
          <button onClick={save} style={{ background: "#1e293b", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Category</button>
        </div>
      )}

      {loading ? <p style={{ fontSize: 13, color: "#64748b" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {categories.map(c => (
            <div key={c._id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{c.category}</h3>
                  <span style={{ fontSize: 10, background: "#f1f5f9", padding: "2px 8px", borderRadius: 20, color: "#64748b", fontFamily: "'DM Mono',monospace" }}>Order: {c.order}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {c.skills.map((s, i) => (
                    <span key={i} style={{ fontSize: 12, color: "#475569", background: "#f4f7fb", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: 4 }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={()=>edit(c)} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer" }}>Edit</button>
                <button onClick={()=>del(c._id)} style={{ background: "#fff1f2", border: "1px solid #fecdd3", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#e11d48", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
          {categories.length === 0 && <p style={{ fontSize: 13, color: "#64748b" }}>No skill categories added yet.</p>}
        </div>
      )}
    </div>
  );
}

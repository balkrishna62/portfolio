"use client";
import { useEffect, useState } from "react";

interface Message { _id: string; name: string; email: string; subject?: string; message: string; read: boolean; createdAt: string; }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/contact").then(r => r.json()).then(data => {
      setMessages(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (selected?._id === id) setSelected(null);
    load();
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div style={{ padding: "40px 48px", color: "#1e293b" }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, margin: "0 0 6px" }}>Messages</h1>
        <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>{messages.length} total · <span style={{ color: unread > 0 ? "#ff6b6b" : "#94a3b8" }}>{unread} unread</span></p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 24 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {loading && <p style={{ color: "#94a3b8" }}>Loading...</p>}
          {!loading && messages.length === 0 && <p style={{ color: "#94a3b8" }}>No messages yet.</p>}
          {messages.map(m => (
            <div key={m._id}
              onClick={() => { setSelected(m); if (!m.read) markRead(m._id); }}
              style={{
                background: selected?._id === m._id ? "#ffffff" : "#ffffff",
                border: `1px solid ${!m.read ? "#2a3a10" : "#e2e8f0"}`,
                borderLeft: `3px solid ${!m.read ? "#2563eb" : "#cbd5e1"}`,
                borderRadius: 10, padding: "16px 20px", cursor: "pointer"
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: !m.read ? "#1e293b" : "#475569" }}>{m.name}</span>
                <span style={{ fontSize: 11, color: "#444", fontFamily: "'DM Mono',monospace" }}>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b" }}>{m.email}</p>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</p>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>{selected.name}</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <p style={{ margin: "0 0 6px", fontSize: 13 }}><span style={{ color: "#94a3b8" }}>Email:</span> <a href={`mailto:${selected.email}`} style={{ color: "#2563eb" }}>{selected.email}</a></p>
            {selected.subject && <p style={{ margin: "0 0 20px", fontSize: 13 }}><span style={{ color: "#94a3b8" }}>Subject:</span> {selected.subject}</p>}
            <div style={{ background: "#ffffff", borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#334155", whiteSpace: "pre-wrap" }}>{selected.message}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`mailto:${selected.email}`} style={{ padding: "9px 20px", background: "#2563eb", color: "#ffffff", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Reply</a>
              <button onClick={() => del(selected._id)} style={{ padding: "9px 20px", background: "transparent", border: "1px solid #4a1818", borderRadius: 8, color: "#ff6b6b", fontSize: 13, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

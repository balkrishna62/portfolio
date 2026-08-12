"use client";
import { useEffect, useState, useRef } from "react";

interface Session {
  _id: string;
  visitorId: string;
  name: string;
  email: string;
  status: "active" | "closed";
  updatedAt: string;
}

interface Message {
  _id: string;
  sender: "user" | "admin";
  text: string;
  createdAt: string;
}

export default function AdminChatbot() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userTyping, setUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSessions = async () => {
    const res = await fetch("/api/admin/chat");
    if (res.ok) {
      const data = await res.json();
      setSessions(data);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    const res = await fetch(`/api/admin/chat/${sessionId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
      setUserTyping(data.userTyping);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeSession) return;
    fetchMessages(activeSession._id);
    const interval = setInterval(() => fetchMessages(activeSession._id), 3000);
    return () => clearInterval(interval);
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, userTyping]);

  const handleTyping = () => {
    if (!activeSession) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    // Broadcast typing
    fetch("/api/admin/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dbSessionId: activeSession._id })
    });

    typingTimeoutRef.current = setTimeout(() => {}, 3000); // debounce
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSession) return;

    const val = input.trim();
    setInput("");
    
    // Optimistic UI
    setMessages(prev => [...prev, { _id: Date.now().toString(), sender: "admin", text: val, createdAt: new Date().toISOString() }]);

    await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dbSessionId: activeSession._id, text: val })
    });
    fetchMessages(activeSession._id);
  };

  const activeSessions = sessions.filter(s => s.status === "active");
  const closedSessions = sessions.filter(s => s.status === "closed");

  return (
    <div style={{ display: "flex", height: "calc(100vh - 40px)", overflow: "hidden", color: "#1e293b" }}>
      {/* Sidebar / Sessions List */}
      <div style={{ width: 320, background: "#f8fafc", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Live Chat</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Real-time visitor messages.</p>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, paddingLeft: 8 }}>Active</h3>
          {activeSessions.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", paddingLeft: 8 }}>No active chats.</p>}
          {activeSessions.map(s => (
            <div 
              key={s._id} 
              onClick={() => setActiveSession(s)}
              style={{
                padding: "12px 16px", borderRadius: 8, cursor: "pointer", marginBottom: 8,
                background: activeSession?._id === s._id ? "#e0e7ff" : "transparent",
                color: activeSession?._id === s._id ? "#3730a3" : "#475569",
                fontWeight: activeSession?._id === s._id ? 600 : 500,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{s.name}</span>
                <span style={{ fontSize: 10, color: activeSession?._id === s._id ? "#4f46e5" : "#94a3b8" }}>
                  {new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ fontSize: 11, color: activeSession?._id === s._id ? "#4338ca" : "#94a3b8", marginTop: 4 }}>
                {s.email || "No email provided"}
              </div>
            </div>
          ))}

          <h3 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginTop: 32, marginBottom: 12, paddingLeft: 8 }}>Chatlog</h3>
          {closedSessions.map(s => (
            <div 
              key={s._id} 
              onClick={() => setActiveSession(s)}
              style={{
                padding: "12px 16px", borderRadius: 8, cursor: "pointer", marginBottom: 8,
                background: activeSession?._id === s._id ? "#f1f5f9" : "transparent",
                color: "#64748b", fontSize: 14
              }}
            >
              {s.name} <span style={{ fontSize: 11, color: "#94a3b8" }}>({new Date(s.updatedAt).toLocaleDateString()})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#ffffff" }}>
        {activeSession ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{activeSession.name}</h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{activeSession.email || "Anonymous Visitor"}</p>
              </div>
              <button 
                onClick={async () => {
                  const newStatus = activeSession.status === "active" ? "closed" : "active";
                  await fetch("/api/admin/chat", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dbSessionId: activeSession._id, status: newStatus }) });
                  setActiveSession({ ...activeSession, status: newStatus });
                  fetchSessions();
                }}
                style={{
                  background: activeSession.status === "active" ? "#fee2e2" : "#dcfce7",
                  color: activeSession.status === "active" ? "#dc2626" : "#16a34a",
                  border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}
              >
                {activeSession.status === "active" ? "Close Chat" : "Reopen Chat"}
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No messages yet.</p>}
              {messages.map(m => (
                <div key={m._id} style={{ display: "flex", flexDirection: "column", alignItems: m.sender === "admin" ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, marginLeft: 4, marginRight: 4 }}>
                    {m.sender === "admin" ? "You" : activeSession.name}
                  </span>
                  <div style={{
                    maxWidth: "70%", padding: "12px 16px", fontSize: 14, lineHeight: 1.5,
                    background: m.sender === "admin" ? "#2563eb" : "#f1f5f9",
                    color: m.sender === "admin" ? "#ffffff" : "#1e293b",
                    borderRadius: 12,
                    borderBottomRightRadius: m.sender === "admin" ? 4 : 12,
                    borderBottomLeftRadius: m.sender === "user" ? 4 : 12,
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {userTyping && (
                <div style={{ alignSelf: "flex-start", padding: "8px 16px", background: "#f8fafc", borderRadius: 12, fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
                  Visitor is typing...
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: 20, borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", gap: 12 }}>
              <input 
                type="text" 
                value={input} 
                onChange={e => { setInput(e.target.value); handleTyping(); }} 
                placeholder="Type your reply..." 
                style={{ flex: 1, padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, outline: "none" }}
              />
              <button type="submit" style={{ background: "#1e293b", color: "#fff", border: "none", padding: "0 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <p style={{ fontSize: 15, fontWeight: 500 }}>Select a chat from the sidebar to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}

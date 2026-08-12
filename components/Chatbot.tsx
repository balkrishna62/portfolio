"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  _id?: string;
  role: "bot" | "user" | "admin";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [isLive, setIsLive] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi there! I am the Live Chat assistant. What can I help you with today?" }
  ]);
  
  const [leadStage, setLeadStage] = useState<"idle" | "name" | "email" | "connecting">("idle");
  const [leadData, setLeadData] = useState({ name: "", email: "", pendingMessage: "" });
  
  const [inputText, setInputText] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generate or retrieve persistent visitor ID
    let vid = localStorage.getItem("visitorId");
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("visitorId", vid);
    }
    setVisitorId(vid);

    // Initial check if session already exists
    fetch(`/api/chat?sessionId=${vid}`)
      .then(r => r.json())
      .then(d => {
        if (d.messages && d.messages.length > 0) {
          setIsLive(true);
          const history = d.messages.map((m: any) => ({
            _id: m._id,
            role: m.sender, // 'user' or 'admin'
            content: m.text
          }));
          setMessages(history);
        }
      });
  }, []);

  // Polling for live messages
  useEffect(() => {
    if (!isLive || !isOpen) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/chat?sessionId=${visitorId}`);
      if (res.ok) {
        const d = await res.json();
        if (d.messages) {
          setMessages(d.messages.map((m: any) => ({
            _id: m._id,
            role: m.sender,
            content: m.text
          })));
        }
        setAdminTyping(d.adminTyping);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive, isOpen, visitorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, adminTyping, isOpen]);

  const handleTyping = () => {
    if (!isLive) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    // Broadcast typing
    fetch("/api/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: visitorId })
    });
    typingTimeoutRef.current = setTimeout(() => {}, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const val = inputText.trim();
    setInputText("");
    
    // If live chat is active, send directly to API
    if (isLive) {
      setMessages(prev => [...prev, { role: "user", content: val }]);
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: visitorId, text: val })
      });
      return;
    }

    // Lead capture flow before starting live chat
    const newMessages = [...messages, { role: "user", content: val } as Message];
    const data = { ...leadData };

    if (leadStage === "idle") {
      data.pendingMessage = val;
      setLeadStage("name");
      newMessages.push({ role: "bot", content: "Thanks! Before I connect you to the admin, what is your name?" });
    } else if (leadStage === "name") {
      data.name = val;
      setLeadStage("email");
      newMessages.push({ role: "bot", content: `Nice to meet you, ${val}! And your email address?` });
    } else if (leadStage === "email") {
      data.email = val;
      setLeadStage("connecting");
      newMessages.push({ role: "bot", content: "Connecting you to the live chat..." });
      
      // Start session
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId: visitorId, 
          text: data.pendingMessage, 
          name: data.name, 
          email: data.email 
        })
      });
      
      setIsLive(true);
      newMessages.push({ role: "bot", content: "You are now connected! The admin will reply shortly." });
    }
    
    setLeadData(data);
    setMessages(newMessages);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, fontFamily: "Manrope, sans-serif" }}>
      {isOpen && (
        <div style={{
          width: 340, height: 480, background: "#ffffff", borderRadius: 16,
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0",
          display: "flex", flexDirection: "column", marginBottom: 16, overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ background: "#f4f7fb", padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, background: isLive ? "#10b981" : "#f59e0b", borderRadius: "50%" }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#1e293b" }}>
                {isLive ? "Live Chat" : "Support Bot"}
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#64748b", cursor: "pointer", lineHeight: 1 }}>&times;</button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, background: "#fff" }}>
            {messages.map((m, i) => (
              <div key={m._id || i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <span style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, marginLeft: 4, marginRight: 4 }}>
                  {m.role === "admin" ? "Admin" : m.role === "bot" ? "System" : "You"}
                </span>
                <div style={{
                  maxWidth: "85%", padding: "10px 14px", fontSize: 13, lineHeight: 1.5,
                  background: m.role === "user" ? "#2563eb" : (m.role === "admin" ? "#10b981" : "#f1f5f9"),
                  color: m.role === "user" || m.role === "admin" ? "#fff" : "#1e293b",
                  borderRadius: 12, 
                  borderBottomRightRadius: m.role === "user" ? 2 : 12, 
                  borderBottomLeftRadius: (m.role === "bot" || m.role === "admin") ? 2 : 12
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {adminTyping && (
              <div style={{ alignSelf: "flex-start", padding: "8px 14px", background: "#f8fafc", borderRadius: 12, fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
                Admin is typing...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} style={{ borderTop: "1px solid #e2e8f0", padding: 12, display: "flex", gap: 8, background: "#f8fafc" }}>
            <input
              type={leadStage === "email" ? "email" : "text"}
              value={inputText}
              onChange={e => { setInputText(e.target.value); handleTyping(); }}
              placeholder={isLive ? "Type your message..." : "Type here..."}
              style={{ flex: 1, padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, outline: "none" }}
            />
            <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Send</button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          width: 56, height: 56, borderRadius: "50%", background: "#2563eb", color: "#fff", border: "none",
          boxShadow: "0 8px 24px rgba(37,99,235,0.4)", display: "flex", justifyContent: "center", alignItems: "center",
          fontSize: 24, cursor: "pointer", transition: "transform 0.2s", transform: isOpen ? "scale(0.9)" : "scale(1)",
          marginLeft: "auto"
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}

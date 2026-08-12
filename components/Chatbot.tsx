"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  _id?: string;
  role: "bot" | "user" | "admin";
  content: string;
}

const PREDEFINED_QA = [
  {
    q: "Who is Balkrishna Pokharel?",
    a: "Balkrishna is a highly skilled Full Stack Developer and Designer passionate about building fast, beautiful, and scalable web applications."
  },
  {
    q: "What services do you offer?",
    a: "I offer full-stack web development, UI/UX design, custom database architectures, and seamless server deployments!"
  },
  {
    q: "Where are you based?",
    a: "I am based in Nepal, but I am available for freelance projects worldwide!"
  }
];

const LIVE_CHAT_TRIGGER = "Is there Balkrishna available in the chat?";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [isLive, setIsLive] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi there! I am Balkrishna's virtual assistant. How can I help you today?" }
  ]);
  
  const [leadStage, setLeadStage] = useState<"idle" | "name" | "email" | "connecting">("idle");
  const [leadData, setLeadData] = useState({ name: "", email: "", pendingMessage: "" });
  
  const [inputText, setInputText] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let vid = localStorage.getItem("visitorId");
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("visitorId", vid);
    }
    setVisitorId(vid);

    fetch(`/api/chat?sessionId=${vid}`)
      .then(r => r.json())
      .then(d => {
        if (d.messages && d.messages.length > 0) {
          setIsLive(true);
          const history = d.messages.map((m: any) => ({
            _id: m._id,
            role: m.sender,
            content: m.text
          }));
          setMessages(history);
        }
      });
  }, []);

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
    
    fetch("/api/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: visitorId })
    });
    typingTimeoutRef.current = setTimeout(() => {}, 3000);
  };

  const processPredefinedQA = async (q: string, a: string) => {
    // Add user question to UI
    setMessages(prev => [...prev, { role: "user", content: q }]);
    
    // Add bot answer to UI immediately
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", content: a }]);
    }, 500);

    // If live, sync the automated Q&A to the database so admin sees it
    if (isLive) {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: visitorId, text: q, sender: "user" })
      });
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: visitorId, text: a, sender: "bot" })
      });
    }
  };

  const handleLiveTrigger = () => {
    setMessages(prev => [...prev, { role: "user", content: LIVE_CHAT_TRIGGER }]);
    setTimeout(() => {
      setLeadStage("name");
      setLeadData(prev => ({ ...prev, pendingMessage: LIVE_CHAT_TRIGGER }));
      setMessages(prev => [...prev, { role: "bot", content: "I can connect you to him! Before I do, what is your name?" }]);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const val = inputText.trim();
    setInputText("");
    
    if (isLive) {
      setMessages(prev => [...prev, { role: "user", content: val }]);
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: visitorId, text: val })
      });
      return;
    }

    const newMessages = [...messages, { role: "user", content: val } as Message];
    const data = { ...leadData };

    if (leadStage === "idle") {
      // General chatting while idle (fallback to default bot reply)
      setMessages(newMessages);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", content: "I'm just a simple automated bot! You can select one of the options below, or ask to speak to Balkrishna directly." }]);
      }, 500);
      return;
    } 
    else if (leadStage === "name") {
      data.name = val;
      setLeadStage("email");
      newMessages.push({ role: "bot", content: `Nice to meet you, ${val}! And your email address?` });
    } 
    else if (leadStage === "email") {
      data.email = val;
      setLeadStage("connecting");
      newMessages.push({ role: "bot", content: "Connecting you to the live chat..." });
      
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId: visitorId, 
          text: data.pendingMessage || val, 
          name: data.name, 
          email: data.email 
        })
      });
      
      setIsLive(true);
      newMessages.push({ role: "bot", content: "You are now connected! Balkrishna will reply shortly." });
    }
    
    setLeadData(data);
    setMessages(newMessages);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, fontFamily: "Manrope, sans-serif" }}>
      {isOpen && (
        <div style={{
          width: 350, height: 500, background: "#ffffff", borderRadius: 16,
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
                  {m.role === "admin" ? "Balkrishna" : m.role === "bot" ? "System" : "You"}
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
                Balkrishna is typing...
              </div>
            )}
            
            {/* Floating Options inside the chat */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {PREDEFINED_QA.map((qa, i) => (
                <button 
                  key={i} 
                  onClick={() => processPredefinedQA(qa.q, qa.a)}
                  style={{ padding: "8px 14px", fontSize: 12, fontWeight: 500, color: "#2563eb", background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 20, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.08)", transition: "all 0.2s" }}
                >
                  {qa.q}
                </button>
              ))}
              {!isLive && leadStage === "idle" && (
                <button 
                  onClick={handleLiveTrigger}
                  style={{ padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "#ffffff", background: "#10b981", border: "none", borderRadius: 20, cursor: "pointer", boxShadow: "0 4px 12px rgba(16,185,129,0.2)", transition: "all 0.2s" }}
                >
                  {LIVE_CHAT_TRIGGER}
                </button>
              )}
            </div>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: "12px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
              <input
                type={leadStage === "email" ? "email" : "text"}
                value={inputText}
                onChange={e => { setInputText(e.target.value); handleTyping(); }}
                placeholder={isLive ? "Type your message..." : "Type here..."}
                style={{ flex: 1, padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, outline: "none" }}
              />
              <button type="submit" style={{ background: "#1e293b", color: "#fff", border: "none", padding: "0 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Send</button>
            </form>
          </div>
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

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
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Manrope', sans-serif" }}>
      {isOpen && (
        <div style={{
          width: 380, height: 550, background: "rgba(13, 17, 23, 0.7)", borderRadius: 20,
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", marginBottom: 20, overflow: "hidden",
          transformOrigin: "bottom right", animation: "chatPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}>
          <style>{`
            @keyframes chatPop { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
            .chat-scroll::-webkit-scrollbar { width: 6px; }
            .chat-scroll::-webkit-scrollbar-track { background: transparent; }
            .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            .chat-btn { transition: all 0.2s; }
            .chat-btn:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
          `}</style>
          
          {/* Header */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 10, height: 10, background: isLive ? "#10b981" : "#a855f7", borderRadius: "50%", boxShadow: isLive ? "0 0 10px #10b981" : "0 0 10px #a855f7" }} />
                {isLive && <div style={{ position: "absolute", width: 10, height: 10, background: "#10b981", borderRadius: "50%", animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }} />}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#f8fafc", letterSpacing: "0.5px" }}>
                {isLive ? "Live Chat" : "Digital Assistant"}
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", fontSize: 24, color: "#94a3b8", cursor: "pointer", lineHeight: 1, padding: 0 }}>&times;</button>
          </div>

          {/* Chat Area */}
          <div className="chat-scroll" style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
            {messages.map((m, i) => (
              <div key={m._id || i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <span style={{ fontSize: 10, color: "#64748b", marginBottom: 6, marginLeft: 6, marginRight: 6, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                  {m.role === "admin" ? "Balkrishna" : m.role === "bot" ? "System" : "You"}
                </span>
                <div style={{
                  maxWidth: "85%", padding: "12px 16px", fontSize: 13, lineHeight: 1.6,
                  background: m.role === "user" ? "linear-gradient(135deg, #2563eb, #8b5cf6)" : (m.role === "admin" ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)"),
                  color: m.role === "user" || m.role === "admin" ? "#fff" : "#e2e8f0",
                  borderRadius: 16, 
                  borderBottomRightRadius: m.role === "user" ? 4 : 16, 
                  borderBottomLeftRadius: (m.role === "bot" || m.role === "admin") ? 4 : 16,
                  border: m.role === "bot" ? "1px solid rgba(255,255,255,0.1)" : "none",
                  boxShadow: m.role === "user" ? "0 10px 20px rgba(37,99,235,0.2)" : "none"
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {adminTyping && (
              <div style={{ alignSelf: "flex-start", padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
                Balkrishna is typing <span style={{ animation: "pulse 1.5s infinite" }}>...</span>
              </div>
            )}
            
            {/* Floating Options inside the chat */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {PREDEFINED_QA.filter(qa => !messages.some(m => m.role === 'user' && m.content === qa.q)).map((qa, i) => (
                <button 
                  key={i} 
                  onClick={() => processPredefinedQA(qa.q, qa.a)}
                  className="chat-btn"
                  style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#cbd5e1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, cursor: "pointer", transition: "all 0.2s" }}
                >
                  {qa.q}
                </button>
              ))}
              {!isLive && leadStage === "idle" && (
                <button 
                  onClick={handleLiveTrigger}
                  className="chat-btn"
                  style={{ padding: "10px 16px", fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.5)", borderRadius: 100, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(16,185,129,0.1)" }}
                >
                  {LIVE_CHAT_TRIGGER}
                </button>
              )}
            </div>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: "16px", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
              <input
                type={leadStage === "email" ? "email" : "text"}
                value={inputText}
                onChange={e => { setInputText(e.target.value); handleTyping(); }}
                placeholder={isLive ? "Type your message..." : "Type here..."}
                style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 12, fontSize: 13, outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button type="submit" style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", border: "none", padding: "0 20px", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(168,85,247,0.3)", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                SEND
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)", display: "flex", justifyContent: "center", alignItems: "center",
          fontSize: 24, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", transform: isOpen ? "scale(0.8) rotate(90deg)" : "scale(1) rotate(0deg)",
          marginLeft: "auto"
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}

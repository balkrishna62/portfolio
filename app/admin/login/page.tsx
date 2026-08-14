"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f4f7fb", fontFamily: "Manrope, sans-serif"
    }}>
      <div style={{
        width: "100%", maxWidth: 400, padding: "48px 40px",
        background: "#ffffff", border: "1px solid #e2e8f0",
        borderRadius: 16, boxShadow: "0 40px 80px rgba(0,0,0,0.6)"
      }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: "#1e293b", marginBottom: 8 }}>
            PR<span style={{ color: "#2563eb" }}>.</span> Admin
          </div>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>EMAIL</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 16px", background: "#ffffff",
                border: "1px solid #cbd5e1", borderRadius: 8, color: "#1e293b",
                fontSize: 14, outline: "none", boxSizing: "border-box"
              }}
              placeholder=""
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>PASSWORD</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 16px", background: "#ffffff",
                border: "1px solid #cbd5e1", borderRadius: 8, color: "#1e293b",
                fontSize: 14, outline: "none", boxSizing: "border-box"
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: "#2a1010", border: "1px solid #4a1818", borderRadius: 8, color: "#ff6b6b", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px", background: loading ? "#94a3b8" : "#2563eb",
              color: "#ffffff", border: "none", borderRadius: 8, fontWeight: 700,
              fontSize: 14, cursor: loading ? "not-allowed" : "pointer", transition: "background .2s"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#444" }}>
          <a href="/" style={{ color: "#64748b", textDecoration: "none" }}>← Back to portfolio</a>
        </p>
      </div>
    </div>
  );
}

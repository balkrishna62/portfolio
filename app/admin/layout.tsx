"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "⬛" },
  { label: "Projects", href: "/admin/projects", icon: "◈" },
  { label: "Blog Posts", href: "/admin/blog", icon: "✦" },
  { label: "Skills", href: "/admin/skills", icon: "❖" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "Live Chat", href: "/admin/chatbot", icon: "💬" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") { setChecking(false); return; }
    fetch("/api/auth/verify")
      .then(r => r.json())
      .then(data => {
        if (!data.valid) router.push("/admin/login");
        else { setAdminName(data.payload?.name || "Admin"); setChecking(false); }
      })
      .catch(() => router.push("/admin/login"));
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f7fb", color: "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
      Verifying...
    </div>
  );

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7fb", fontFamily: "Manrope, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#ffffff", borderRight: "1px solid #e2e8f0",
        display: "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0
      }}>
        <div style={{ padding: "0 24px", marginBottom: 36 }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -1, color: "#1e293b", textDecoration: "none" }}>
            PR<span style={{ color: "#2563eb" }}>.</span>
          </a>
          <p style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono', monospace", letterSpacing: 1, margin: "6px 0 0" }}>ADMIN PANEL</p>
        </div>

        <nav style={{ flex: 1 }}>
          {NAV.map(item => (
            <a key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 24px",
              color: pathname === item.href ? "#2563eb" : "#64748b",
              background: pathname === item.href ? "#ffffff" : "transparent",
              borderLeft: pathname === item.href ? "2px solid #2563eb" : "2px solid transparent",
              textDecoration: "none", fontSize: 13, fontWeight: 500,
              transition: "all .15s"
            }}>
              <span style={{ fontSize: 11 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: "0 24px" }}>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 20 }}>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px", fontFamily: "'DM Mono', monospace" }}>{adminName}</p>
            <button onClick={logout} id="admin-logout-btn" style={{
              width: "100%", padding: "9px", background: "transparent", border: "1px solid #cbd5e1",
              borderRadius: 6, color: "#64748b", fontSize: 12, cursor: "pointer"
            }}>Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}

"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "favicon" && !file.name.endsWith(".ico") && !file.type.includes("icon") && !file.type.includes("image")) {
      alert("Please upload an .ico or valid image file for the favicon.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      if (typeof base64 !== "string") return;

      setLoading(true);
      setMessage(`Uploading ${type}...`);
      try {
        const res = await fetch("/api/settings/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, base64 })
        });
        if (res.ok) {
          setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully! Refresh to see changes.`);
        } else {
          setMessage(`Failed to update ${type}.`);
        }
      } catch (err) {
        setMessage(`Error uploading ${type}.`);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "40px 48px", color: "#1e293b" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", letterSpacing: -1 }}>Site Settings</h1>
      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 36px" }}>Manage your website branding and global configuration.</p>

      {message && (
        <div style={{ padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: 8, marginBottom: 24, fontSize: 13, fontWeight: 500 }}>
          {message}
        </div>
      )}

      <div style={{ display: "grid", gap: 24, maxWidth: 600 }}>
        {/* Favicon Upload */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>Favicon</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>Upload a square image (preferably .ico or .png, 32x32) to display in the browser tab.</p>
          <input 
            type="file" 
            accept=".ico,image/png,image/x-icon" 
            onChange={(e) => handleUpload(e, "favicon")} 
            disabled={loading}
            style={{ fontSize: 13 }}
          />
        </div>

        {/* Logo Upload */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>Website Logo</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>Upload a custom logo to display in the navigation bar instead of the default text logo.</p>
          <input 
            type="file" 
            accept="image/png,image/jpeg,image/svg+xml" 
            onChange={(e) => handleUpload(e, "logo")} 
            disabled={loading}
            style={{ fontSize: 13 }}
          />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

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

  const [formData, setFormData] = useState({
    heroImage: "",
    heroTitle: "Bal Krishna\\nPokharel.",
    heroSubtitle: "Full-Stack Developer & Designer crafting digital perfection in Kathmandu, Nepal.",
    aboutTitle: "One brain. Two disciplines.",
    aboutText: "I am a developer & designer based in Kathmandu, Nepal. I work at the intersection of technology and visual design.\\n\\nI care about the details: button spacing, animation rhythm, API structure, and the feeling a brand leaves behind.",
    contactTitle: "Let's Build.",
    contactSubtitle: "Ready to create something extraordinary together?"
  });

  // Load existing settings
  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d && !d.error) setFormData(prev => ({ ...prev, ...d }));
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("Saving site details...");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) setMessage("Site details updated! Refresh the homepage.");
      else setMessage("Failed to update site details.");
    } catch {
      setMessage("Error saving site details.");
    }
    setLoading(false);
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
        
        {/* Global Settings & Text Content */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Site Text Content</h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Customize the main text blocks on your homepage.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={loading}
              style={{ padding: "10px 20px", background: "#0f172a", color: "white", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
            >
              Save All Details
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hero Section */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Hero Title (Use \n for line breaks)</label>
              <textarea 
                value={formData.heroTitle}
                onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, minHeight: 60 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Hero Subtitle</label>
              <input 
                type="text"
                value={formData.heroSubtitle}
                onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />

            {/* About Section */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>About Title (Next to Image)</label>
              <input 
                type="text"
                value={formData.aboutTitle}
                onChange={e => setFormData({ ...formData, aboutTitle: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>About Text (Use \n\n for paragraphs)</label>
              <textarea 
                value={formData.aboutText}
                onChange={e => setFormData({ ...formData, aboutText: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, minHeight: 100 }}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />

            {/* Contact Section */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Contact Title</label>
              <input 
                type="text"
                value={formData.contactTitle}
                onChange={e => setFormData({ ...formData, contactTitle: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Contact Subtitle</label>
              <input 
                type="text"
                value={formData.contactSubtitle}
                onChange={e => setFormData({ ...formData, contactSubtitle: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />

            {/* Hero Image URL */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>Floating Profile Image</h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px" }}>Upload from your device or paste a URL to display next to the About text.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <input 
                  type="url" 
                  placeholder="https://example.com/photo.jpg"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  disabled={loading}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, minWidth: 200 }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Upload file:</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) setFormData({ ...formData, heroImage: ev.target.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  disabled={loading}
                  style={{ fontSize: 13 }}
                />
              </div>
              {formData.heroImage && (
                <div style={{ marginTop: 16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.heroImage} alt="Preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                </div>
              )}
            </div>
          </div>
        </div>

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

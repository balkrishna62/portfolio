import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Blog — Prerit | Web Development & Design Insights from Nepal",
  description: "Articles about web development, React, Next.js, UI/UX design and the tech scene in Nepal by Prerit.",
  keywords: ["web development blog Nepal", "React tutorial Nepal", "Next.js blog", "developer blog Kathmandu", "UI design tips", "Prerit blog"],
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog — Prerit", description: "Tech insights from Nepal's top developer.", url: "/blog" }
};

async function getPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${baseUrl}/api/blog`, { next: { revalidate: 60 }, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

interface Post { _id: string; title: string; slug: string; excerpt: string; category: string; tags: string[]; publishedAt?: string; readingTime?: number; }

export default async function BlogPage() {
  const posts: Post[] = await getPosts();

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="nav">
        <Link href="/" className="logo">PRERIT.</Link>
        <div className="navLinks">
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
          <Link href="/blog" style={{ color: "var(--accent)" }}>Blog</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "130px 6vw 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 70 }}>
          <span className="tag" style={{ margin: 0 }}>01 / BLOG</span>
          <h1 style={{ fontSize: "clamp(42px, 7vw, 80px)", lineHeight: 0.9, letterSpacing: -2, margin: "20px 0 22px", fontWeight: 800 }}>
            Thoughts on <em style={{ fontStyle: "normal", color: "var(--accent)" }}>code</em><br/>& craft.
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.8, maxWidth: 560 }}>
            Articles about full-stack development, UI/UX design, and building on the web — written by Nepal's leading developer.
          </p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>Articles coming soon. Check back!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 28 }}>
            {posts.map((post) => (
              <article key={post._id} style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, background: "rgba(0,0,0,0.05)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 20, color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>{post.category}</span>
                  {post.readingTime && <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>{post.readingTime} min read</span>}
                </div>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 12, color: "var(--text)" }}>
                    {post.title}
                  </h2>
                </Link>
                <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Read Article →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

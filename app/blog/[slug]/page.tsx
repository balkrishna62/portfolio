import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title: `${title} | Prerit Blog`,
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title, description, type: "article", publishedTime: post.publishedAt, tags: post.tags },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": { "@type": "Person", "name": "Prerit", "url": "https://prerit.dev" },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "publisher": { "@type": "Person", "name": "Prerit" },
    "keywords": post.tags?.join(", "),
    "inLanguage": "en",
    "about": { "@type": "Thing", "name": post.category },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ minHeight: "100vh" }}>
        <nav className="nav">
          <Link href="/" className="logo">PRERIT.</Link>
          <div className="navLinks">
            <Link href="/blog" style={{ color: "var(--accent)", fontWeight: 600 }}>← All Posts</Link>
          </div>
        </nav>

        <article style={{ maxWidth: 720, margin: "0 auto", padding: "120px 6vw 100px" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 11, background: "rgba(0,0,0,0.05)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 20, color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>{post.category}</span>
              {post.readingTime && <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>{post.readingTime} min read</span>}
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 54px)", lineHeight: 1.1, letterSpacing: -1, fontWeight: 800, margin: "0 0 24px", color: "var(--text)" }}>
              {post.title}
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {post.excerpt}
            </p>
          </div>

          <div style={{ height: 1, background: "var(--border)", margin: "40px 0" }} />

          <div 
            style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text)" }}
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(/\n/g, '<br/>')
            }} 
          />

          <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {post.tags?.map((t: string) => (
                <span key={t} style={{ fontSize: 12, padding: "6px 12px", background: "rgba(0,0,0,0.03)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-muted)" }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

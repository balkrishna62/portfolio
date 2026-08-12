import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://prerit.dev';

async function getBlogPosts() {
  try {
    const res = await fetch(`${BASE}/api/blog`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p: { published: boolean }) => p.published)
    .map((post: { slug: string; updatedAt: string }) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...blogRoutes];
}

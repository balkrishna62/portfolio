import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://prerit.dev';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

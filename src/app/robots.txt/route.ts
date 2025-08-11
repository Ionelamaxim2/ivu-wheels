export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas (if any)
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow important pages
Allow: /
Allow: /products
Allow: /products/*
Allow: /cart
Allow: /login
Allow: /register
Allow: /privacy
Allow: /terms`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

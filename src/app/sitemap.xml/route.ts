import { wheels } from "../../data/wheels";

export async function GET() {
  const baseUrl = "http://localhost:3001";

  const staticPages = [
    "",
    "/products",
    "/cart",
    "/login",
    "/register",
    "/user",
    "/privacy",
    "/terms",
    "/coming-soon",
  ];

  // Dynamic product pages
  const productPages = wheels.map((wheel) => `/products/${wheel.id}`);

  const allPages = [...staticPages, ...productPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      const url = `${baseUrl}${page}`;
      const priority =
        page === "" ? "1.0" : page.includes("/products/") ? "0.8" : "0.7";
      const changefreq =
        page === ""
          ? "daily"
          : page.includes("/products")
          ? "weekly"
          : "monthly";

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

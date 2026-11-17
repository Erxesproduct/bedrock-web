import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Old Zochil URLs keep working: /products/<categoryId|null>/<productId> → /p/<slug>, /products/<categoryId> → /shop?c=<id>.
const catalog = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")) as { products: { id: number; slug: string }[] };
const productRedirects = catalog.products.map((p) => ({ source: `/products/:category/${p.id}`, destination: `/p/${p.slug}`, permanent: true }));
// Zochil category ids (shop 32084)
const ZOCHIL_CATEGORIES: Record<string, string> = { "277787": "ipad", "277634": "mac", "277784": "watch", "277785": "airpods", "277786": "accessories" };
const categoryRedirects = Object.entries(ZOCHIL_CATEGORIES).map(([id, c]) => ({ source: `/products/${id}`, destination: `/shop?c=${c}`, permanent: true }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos are pre-sized WebP (640 px thumbs, 1400 px large), so they are served as-is.
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      ...productRedirects,
      ...categoryRedirects,
      { source: "/products/:category(\\d+|null)", destination: "/shop", permanent: false },
      { source: "/category/:path*", destination: "/shop", permanent: false },
      { source: "/saled-products", destination: "/shop", permanent: true },
      { source: "/brands/:path*", destination: "/shop", permanent: false },
      { source: "/posts/:path*", destination: "/", permanent: false },
      { source: "/shopping-cart", destination: "/cart", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: true },
      { source: "/about", destination: "/info#about", permanent: true },
      { source: "/faq", destination: "/info#faq", permanent: true },
      { source: "/terms", destination: "/info#delivery", permanent: true },
      { source: "/contact", destination: "/info#contact", permanent: true },
      { source: "/accounts/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/images/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};

export default nextConfig;

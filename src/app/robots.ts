import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  const base = brand.url.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

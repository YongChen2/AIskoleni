import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { posts } from "@/content/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.url.replace(/\/$/, "");
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/skoleni", priority: 0.9 },
    { path: "/kontakt", priority: 0.9 },
    { path: "/bezpecnost", priority: 0.8 },
    { path: "/nastroje", priority: 0.8 },
    { path: "/kviz", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/o-nas", priority: 0.6 },
    { path: "/ochrana-osobnich-udaju", priority: 0.2 },
    { path: "/cookies", priority: 0.2 },
  ];
  return [
    ...pages.map((p) => ({ url: `${base}${p.path}`, priority: p.priority })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}

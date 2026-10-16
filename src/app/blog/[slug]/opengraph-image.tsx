import { getPost, posts } from "@/content/blog/posts";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Článek";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOg({ title: post?.title ?? "Blog", label: post?.tag ?? "Blog" });
}

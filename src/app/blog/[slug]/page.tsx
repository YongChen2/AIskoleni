import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/config/brand";
import { CtaBlock } from "@/components/cta-block";
import { ArrowLeft } from "@/components/icons";
import { Badge } from "@/components/ui";
import { formatDate, getPost, posts } from "@/content/blog/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.date, title: post.title, description: post.description },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <>
      <article className="relative isolate overflow-hidden pb-20 pt-12 md:pb-28 md:pt-20">
        <div aria-hidden className="glow -z-10 -top-56 right-[-10%] h-[34rem] w-[46rem]" />
        <div className="shell">
          <div className="mx-auto max-w-[44rem]">
            <Link href="/blog" className="btn btn-ghost -ml-3 min-h-11">
              <ArrowLeft size={16} />
              Všechny články
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge>{post.tag}</Badge>
              <span className="label">
                <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min čtení · Autor [DOPLNIT]
              </span>
            </div>
            <h1 className="mt-6 text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.04em]">{post.title}</h1>
            <p className="lead mt-6">{post.description}</p>
            <div className="divider my-12" />
            <div className="article text-[17px] leading-[1.75] text-muted md:text-[18px]">
              <Body />
            </div>
          </div>
        </div>
      </article>
      <CtaBlock />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          inLanguage: "cs",
          mainEntityOfPage: `${brand.url.replace(/\/$/, "")}/blog/${post.slug}`,
          publisher: { "@type": "Organization", name: brand.name },
        }}
      />
    </>
  );
}

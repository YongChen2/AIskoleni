import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/config/brand";
import { CtaBlock } from "@/components/cta-block";
import { SectionHead } from "@/components/ui";
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
      <article className="px-4 pb-16 pt-10 md:px-8 md:pb-28 md:pt-16">
        <SectionHead code={`LOG / ${post.tag}`} label="Článek" meta={<Link href="/blog" className="hover:text-fg">{"<<<"} Všechny články</Link>} />
        <div className="mt-10 grid gap-8 md:mt-16 lg:grid-cols-12">
          <h1 className="macro-md lg:col-span-10 lg:col-start-1">{post.title}</h1>
          <dl className="micro grid grid-cols-[auto_1fr] content-start gap-x-6 gap-y-1 self-start lg:sticky lg:top-28 lg:col-span-3">
            <dt className="text-muted">Datum</dt>
            <dd>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </dd>
            <dt className="text-muted">Čtení</dt>
            <dd>{post.readingMinutes} min</dd>
            <dt className="text-muted">Autor</dt>
            <dd>[DOPLNIT]</dd>
          </dl>
          <div className="prose-body text-[16px] md:text-[17px] lg:col-span-7 lg:col-start-5">
            <p className="mb-10 text-lg text-muted">{post.description}</p>
            <Body />
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

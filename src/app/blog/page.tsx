import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { formatDate, posts } from "@/content/blog/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Praktické články o AI ve firmě: konkrétní úlohy, bezpečnost dat a výběr nástrojů. Bez hypu.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        code="SEC.50"
        label="Blog"
        title={
          <>
            Záznamy <span className="text-accent">z praxe</span>
          </>
        }
        lead="Co funguje, co ne a na co si dát pozor. Píšeme z toho, co vidíme na školeních."
        meta={[
          ["Články", String(posts.length).padStart(2, "0")],
          ["Jazyk", "Čeština"],
        ]}
      />
      <Section className="pt-0! md:pt-0!">
        <ol className="border-t border-line">
          {sorted.map((p, i) => (
            <li key={p.slug} className="border-b border-line">
              <Link href={`/blog/${p.slug}`} className="group grid gap-4 py-8 hover:bg-bg-2 md:grid-cols-12 md:px-4 md:py-10">
                <span className="micro text-muted md:col-span-2">
                  LOG.{String(sorted.length - i).padStart(3, "0")}
                  <br />
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </span>
                <span className="md:col-span-7">
                  <span className="macro-sm block group-hover:text-accent">{p.title}</span>
                  <span className="prose-body mt-4 block text-muted">{p.description}</span>
                </span>
                <span className="micro flex justify-between md:col-span-3 md:flex-col md:items-end">
                  <span className="text-accent">[ {p.tag} ]</span>
                  <span className="text-muted">{p.readingMinutes} MIN {">>>"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

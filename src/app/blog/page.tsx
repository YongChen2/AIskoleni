import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Badge, PageHero, Section } from "@/components/ui";
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
        label="Blog"
        title={
          <>
            Poznámky <span className="hl">z praxe</span>
          </>
        }
        lead="Co funguje, co ne a na co si dát pozor. Píšeme z toho, co vidíme na školeních."
      />
      <Section className="pt-0! lg:pt-0!">
        <ol className="grid gap-4" data-reveal-group>
          {sorted.map((p) => (
            <li key={p.slug} data-reveal>
              <Link href={`/blog/${p.slug}`} className="card group grid gap-5 p-6 md:grid-cols-12 md:items-start md:p-8">
                <div className="flex items-center gap-3 md:col-span-3 md:flex-col md:items-start">
                  <Badge>{p.tag}</Badge>
                  <span className="label">
                    <time dateTime={p.date}>{formatDate(p.date)}</time> · {p.readingMinutes} min čtení
                  </span>
                </div>
                <div className="md:col-span-8">
                  <h2 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-fg">{p.title}</h2>
                  <p className="body mt-3 text-[15px]">{p.description}</p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="hidden justify-self-end text-subtle transition-[transform,color] duration-300 ease-[var(--ease)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg md:col-span-1 md:block"
                />
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

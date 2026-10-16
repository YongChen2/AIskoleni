import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/** Styly článků – čitelný sans text, střídmé nadpisy, prompty jako karty. */
const components: MDXComponents = {
  h2: ({ children }) => <h2 className="mb-5 mt-14 text-[clamp(1.4rem,2.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.03em] text-fg">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-10 text-[19px] font-semibold tracking-[-0.02em] text-fg">{children}</h3>,
  p: ({ children }) => <p className="mb-6">{children}</p>,
  ul: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6 marker:text-subtle">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 list-decimal space-y-3 pl-6 marker:font-medium marker:text-accent-hover">{children}</ol>,
  li: ({ children }) => <li className="pl-1.5">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="card mb-8 p-5 text-[15.5px] leading-relaxed text-fg/90 [&>p]:mb-0">
      <span className="eyebrow mb-3 flex">Prompt</span>
      {children}
    </blockquote>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-fg underline decoration-accent/60 underline-offset-4 transition-colors hover:decoration-accent">
        {children}
      </Link>
    ) : (
      <a href={href} className="text-fg underline decoration-accent/60 underline-offset-4 transition-colors hover:decoration-accent" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  code: ({ children }) => <code className="mono rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-[0.86em] text-fg">{children}</code>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

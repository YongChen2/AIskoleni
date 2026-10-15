import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/** Styly článků – mono text pro čitelnost, makro nadpisy, ASCII značky. */
const components: MDXComponents = {
  h2: ({ children }) => <h2 className="macro-sm mb-6 mt-16 border-t border-line pt-6">{children}</h2>,
  h3: ({ children }) => <h3 className="micro mb-4 mt-10 text-sm">{children}</h3>,
  p: ({ children }) => <p className="mb-6">{children}</p>,
  ul: ({ children }) => <ul className="mb-6 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 list-[decimal-leading-zero] space-y-3 pl-8 marker:text-accent">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-fg">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mb-6 border-l-2 border-accent bg-bg-2 px-5 py-4 text-[15px] text-muted [&>p]:mb-0">
      <span className="micro-xs mb-2 block text-accent">[ PROMPT ]</span>
      {children}
    </blockquote>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-accent underline underline-offset-4 hover:bg-accent hover:text-bg">
        {children}
      </Link>
    ) : (
      <a href={href} className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  code: ({ children }) => <code className="bg-bg-2 px-1 text-[0.9em]">{children}</code>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

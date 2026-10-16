import { brand } from "@/config/brand";
import { cx } from "./ui";

/** Značka: zaoblený čtverec s akcentním přechodem a třemi propojenými uzly + název. */
export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden focusable="false" className="shrink-0">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF6B57" />
            <stop offset="1" stopColor="#E5262B" />
          </linearGradient>
        </defs>
        <rect width="26" height="26" rx="7.5" fill="url(#logo-g)" />
        <rect x="0.5" y="0.5" width="25" height="25" rx="7" fill="none" stroke="rgba(255,255,255,0.25)" />
        <path d="M8 17.5 13 8.5l5 9M8 17.5h10" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" opacity="0.9" />
        <circle cx="13" cy="8.5" r="2" fill="#fff" />
        <circle cx="8" cy="17.5" r="2" fill="#fff" />
        <circle cx="18" cy="17.5" r="2" fill="#fff" />
      </svg>
      {compact ? null : <span className="text-[16px] font-semibold tracking-[-0.02em] text-fg">{brand.name}</span>}
    </span>
  );
}

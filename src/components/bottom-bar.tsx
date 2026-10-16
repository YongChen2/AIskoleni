"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { haptic } from "@/lib/haptics";
import { setMenuOpen, useMenuOpen } from "@/lib/menu-store";
import { cx } from "./ui";

const items = [
  { href: "/skoleni", label: "Školení", code: "01" },
  { href: "/bezpecnost", label: "Data", code: "02" },
  { href: "/kviz", label: "Kvíz", code: "03" },
  { href: "/kontakt", label: "Kontakt", code: "04" },
];

/**
 * Spodní navigační lišta pro mobil (na dosah palce). Skrývá se při scrollu dolů, ukáže při scrollu nahoru.
 * Bez rAF smyčky – jen přepnutí atributu ve scroll handleru, pohyb řeší CSS transform.
 */
export function BottomBar() {
  const pathname = usePathname();
  const open = useMenuOpen();
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < 8) return;
      const hide = dy > 0 && y > 120;
      if (hide !== hidden) {
        hidden = hide;
        bar.current?.toggleAttribute("data-hidden", hide);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // CTA haptika (globálně pro hlavní tlačítka)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.(".btn-accent")) haptic(15);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <nav ref={bar} aria-label="Rychlá navigace" className="bottom-bar fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-bg lg:hidden" data-open={open || undefined}>
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <li key={it.href} className="border-r border-line">
              <Link
                href={it.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cx("flex min-h-14 flex-col items-center justify-center gap-0.5 px-1", active ? "text-accent" : "text-fg")}
              >
                <span className="micro-xs text-muted">{it.code}</span>
                <span className="micro-xs">{it.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              haptic(10);
              setMenuOpen(!open);
            }}
            className={cx("micro-xs flex min-h-14 w-full items-center justify-center", open ? "bg-fg text-bg" : "text-fg")}
          >
            {open ? "[ × ]" : "[ MENU ]"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

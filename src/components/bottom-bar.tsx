"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { haptic } from "@/lib/haptics";
import { setMenuOpen, useMenuOpen } from "@/lib/menu-store";
import { Close, Gauge, Layers, Mail, Menu, Shield } from "./icons";
import { cx } from "./ui";

const items = [
  { href: "/skoleni", label: "Školení", Icon: Layers },
  { href: "/bezpecnost", label: "Data", Icon: Shield },
  { href: "/kviz", label: "Kvíz", Icon: Gauge },
  { href: "/kontakt", label: "Kontakt", Icon: Mail },
];

/**
 * Plovoucí tab bar pro mobil (na dosah palce). Skrývá se při scrollu dolů, ukáže při scrollu nahoru.
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
      if ((e.target as Element).closest?.(".btn-primary")) haptic(15);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <nav
      ref={bar}
      aria-label="Rychlá navigace"
      className="tab-bar fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[60] rounded-[20px] border border-line lg:hidden"
      data-open={open || undefined}
    >
      <ul className="grid grid-cols-5 p-1">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-[16px] text-[11px] font-medium transition-colors duration-200",
                  active ? "bg-tint/[0.06] text-fg" : "text-muted"
                )}
              >
                <Icon size={20} className={active ? "text-accent" : undefined} />
                {label}
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
            className={cx(
              "flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-[16px] text-[11px] font-medium transition-colors duration-200",
              open ? "bg-tint/[0.08] text-fg" : "text-muted"
            )}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
            {open ? "Zavřít" : "Menu"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

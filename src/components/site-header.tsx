"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { setMenuOpen, useMenuOpen } from "@/lib/menu-store";
import { brand, nav } from "@/config/brand";
import { ArrowRight } from "./icons";
import { Logo } from "./logo";
import { SoundToggle } from "./sound-toggle";
import { ButtonLink, cx } from "./ui";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

export function SiteHeader() {
  const pathname = usePathname();
  const open = useMenuOpen();
  const ref = useRef<HTMLElement>(null);

  // Zavřít menu po navigaci
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Průhledná hlavička; blur a okraj až po odscrollování (jen přepnutí atributu, bez re-renderu)
  useEffect(() => {
    let scrolled = false;
    const onScroll = () => {
      const s = window.scrollY > 8;
      if (s !== scrolled) {
        scrolled = s;
        ref.current?.toggleAttribute("data-scrolled", s);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header ref={ref} data-menu={open || undefined} className="site-header sticky top-0 z-50">
        <div className="shell grid h-[var(--header-h)] grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="flex items-center justify-self-start rounded-lg" aria-label={`${brand.name} – úvod`}>
            <Logo />
          </Link>

          <nav aria-label="Hlavní navigace" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "inline-flex h-9 items-center rounded-[9px] px-3 text-[14px] font-medium transition-colors duration-200",
                        active ? "bg-white/[0.06] text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-2">
            <span className="hidden lg:contents">
              <SoundToggle />
            </span>
            <ButtonLink href="/kontakt" variant="primary" size="sm" arrow={false}>
              <span className="sm:hidden">Kontakt</span>
              <span className="hidden sm:inline">Domluvit školení</span>
            </ButtonLink>
          </div>
        </div>
      </header>

      {/* mimo <header>: backdrop-filter hlavičky by z ní udělal containing block pro position:fixed */}
      {open ? (
        <div
          id="mobile-menu"
          className="mobile-menu fixed inset-x-0 bottom-0 top-[var(--header-h)] z-50 overflow-y-auto bg-bg/90 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobilní navigace" className="shell flex flex-col pb-32 pt-6">
            {[{ href: "/", label: "Úvod" }, ...nav, { href: "/kontakt", label: "Kontakt" }].map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  style={{ "--i": i } as React.CSSProperties}
                  className={cx(
                    "flex min-h-14 items-center justify-between border-b border-line text-[26px] font-semibold tracking-[-0.03em]",
                    active ? "text-fg" : "text-muted",
                  )}
                >
                  {item.label}
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : <ArrowRight size={18} className="text-subtle" />}
                </Link>
              );
            })}
            <div className="mt-6 flex items-center justify-between">
              <SoundToggle withLabel className="-ml-2 px-2" />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

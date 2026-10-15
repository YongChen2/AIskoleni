"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav } from "@/config/brand";
import { cx } from "./ui";
import { HudMini } from "./hud";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Zavřít menu po navigaci
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="micro-xs hidden border-b border-line text-muted md:flex">
        <span className="border-r border-line px-8 py-1.5">
          UNIT / {brand.code}-01
        </span>
        <span className="border-r border-line px-4 py-1.5">{brand.revision}</span>
        <span className="border-r border-line px-4 py-1.5">{brand.contact.coords}</span>
        <span className="ml-auto px-8 py-1.5">
          STATUS: <span className="text-fg">PŘIJÍMÁME POPTÁVKY</span>
        </span>
      </div>
      <div className="relative flex h-14 items-stretch md:h-16">
        <Link
          href="/"
          className="flex items-center border-r border-line px-4 font-display text-lg uppercase tracking-tight md:px-8 md:text-xl"
          aria-label={`${brand.name} – úvod`}
        >
          {brand.name}
          <span className="text-accent">{brand.mark}</span>
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden flex-1 items-stretch lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "micro flex items-center border-r border-line px-4 hover:bg-fg hover:text-bg xl:px-5",
                  active && "text-accent"
                )}
              >
                {active ? "> " : ""}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <HudMini />

        <div className="ml-auto flex items-stretch">
          <Link
            href="/kontakt"
            className="micro hidden items-center bg-accent px-6 text-bg hover:bg-fg sm:flex md:px-8"
          >
            [ Domluvit školení ]
          </Link>
          <button
            type="button"
            className="micro flex items-center border-l border-line px-4 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              setOpenedAt(pathname);
              setOpen((v) => !v);
            }}
          >
            {open ? "[ ZAVŘÍT ]" : "[ MENU ]"}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto bg-bg lg:hidden">
          <nav aria-label="Mobilní navigace" className="flex flex-col">
            {[{ href: "/", label: "Úvod" }, ...nav, { href: "/kontakt", label: "Kontakt" }].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cx(
                  "flex items-baseline gap-4 border-b border-line px-4 py-5",
                  pathname === item.href && "text-accent"
                )}
              >
                <span className="micro-xs text-muted">{String(i).padStart(2, "0")}</span>
                <span className="font-display text-4xl uppercase tracking-tight">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4">
            <Link href="/kontakt" className="btn btn-accent w-full" onClick={() => setOpen(false)}>
              [ Domluvit školení ]
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

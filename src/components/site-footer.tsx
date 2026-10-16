import Link from "next/link";
import { brand, nav } from "@/config/brand";
import { Logo } from "./logo";

const legal = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/ochrana-osobnich-udaju", label: "Ochrana osobních údajů" },
  { href: "/cookies", label: "Cookies" },
];

const linkCls = "inline-flex min-h-11 items-center text-[15px] text-muted transition-colors duration-200 hover:text-fg lg:min-h-0 lg:py-1.5";

export function SiteFooter() {
  return (
    <footer data-theme="dark" data-band="" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="glow -bottom-72 left-1/2 h-[32rem] w-[60rem] -translate-x-1/2 opacity-70" />
      <div className="shell relative grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo />
          <p className="body mt-5 max-w-sm text-[15px]">{brand.claim}. Praktická školení podle rolí, na vašich úlohách a s jasnými pravidly pro data.</p>
          <div className="mt-6 space-y-1 text-[15px]">
            <p>
              <a href={`mailto:${brand.contact.email}`} className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
                {brand.contact.email}
              </a>
            </p>
            <p className="text-muted">{brand.contact.phone}</p>
          </div>
        </div>

        <nav aria-label="Mapa webu" className="md:col-span-4">
          <p className="text-[13px] font-medium text-fg">Web</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6">
            <li>
              <Link href="/" className={linkCls}>
                Úvod
              </Link>
            </li>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={linkCls}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="text-[13px] font-medium text-fg">Informace</p>
          <ul className="mt-3">
            {legal.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={linkCls}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell relative">
        <div className="flex flex-col gap-2 border-t border-line py-6 text-[13px] text-subtle md:flex-row md:items-center md:justify-between">
          <span>
            © {brand.name} · {brand.contact.company} · {brand.contact.ico}
          </span>
          <span>{brand.contact.address}</span>
        </div>
      </div>
    </footer>
  );
}

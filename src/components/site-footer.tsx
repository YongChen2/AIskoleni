import Link from "next/link";
import { brand, nav } from "@/config/brand";
import { Barcode } from "./ui";

const legal = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/ochrana-osobnich-udaju", label: "Ochrana osobních údajů" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-accent">
      <div className="hairgrid grid-cols-1 border-x-0 md:grid-cols-12">
        <div className="p-4 md:col-span-5 md:p-8">
          <p className="micro text-muted">[ Spojení ]</p>
          <p className="mt-4 text-lg">
            <a href={`mailto:${brand.contact.email}`} className="underline decoration-line underline-offset-4 hover:text-accent">
              {brand.contact.email}
            </a>
          </p>
          <p className="mt-1">{brand.contact.phone}</p>
          <div className="micro-xs mt-6 text-muted">
            <p>{brand.contact.company}</p>
            <p>{brand.contact.ico}</p>
            <p>{brand.contact.address}</p>
          </div>
        </div>
        <nav aria-label="Mapa webu" className="p-4 md:col-span-4 md:p-8">
          <p className="micro text-muted">[ Mapa webu ]</p>
          <ul className="micro mt-4 grid grid-cols-2">
            <li>
              <Link href="/" className="inline-block py-1.5 hover:text-accent">&gt; Úvod</Link>
            </li>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-block py-1.5 hover:text-accent">&gt; {n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col justify-between gap-6 p-4 md:col-span-3 md:p-8">
          <ul className="micro">
            {legal.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-block py-1.5 hover:text-accent">{"/// "}{n.label}</Link>
              </li>
            ))}
          </ul>
          <Barcode />
        </div>
      </div>
      <div className="overflow-hidden border-t border-line px-4 pt-6 md:px-8">
        <p aria-hidden className="macro whitespace-nowrap leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--line)]">
          {brand.name}
          {brand.mark}
        </p>
      </div>
      <div className="micro-xs flex flex-wrap justify-between gap-2 border-t border-line px-4 py-3 text-muted md:px-8">
        <span>© {brand.name} — Všechna práva vyhrazena</span>
        <span>{brand.revision} / BUILD CZ</span>
      </div>
    </footer>
  );
}

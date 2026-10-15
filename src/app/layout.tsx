import type { Metadata, Viewport } from "next";
import { brand, brandCssVars } from "@/config/brand";
import { fontVariables } from "@/config/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { JsonLd } from "@/components/json-ld";
import { BootSequence, bootScript } from "@/components/boot-sequence";
import { Cursor } from "@/components/cursor";
import { HudPanel } from "@/components/hud";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — firemní školení AI podle rolí`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  alternates: { canonical: "/" },
  applicationName: brand.name,
  openGraph: {
    type: "website",
    locale: brand.locale,
    siteName: brand.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: brand.colors.bg,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={fontVariables} style={brandCssVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <BootSequence />
        <a href="#obsah" className="micro sr-only z-[200] bg-accent px-4 py-3 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Přeskočit na obsah
        </a>
        <SiteHeader />
        <main id="obsah">{children}</main>
        <SiteFooter />
        <MotionProvider />
        <HudPanel />
        <Cursor />
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}

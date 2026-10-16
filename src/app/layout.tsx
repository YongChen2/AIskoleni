import type { Metadata, Viewport } from "next";
import { brand, brandCssVars } from "@/config/brand";
import { fontVariables } from "@/config/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { JsonLd } from "@/components/json-ld";
import { ScrollProgress } from "@/components/scroll-progress";
import { BottomBar } from "@/components/bottom-bar";
import { SoundClicks } from "@/components/sound-toggle";
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
      <body>
        <a href="#obsah" className="sr-only z-[200] rounded-lg bg-accent px-4 py-3 text-[15px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Přeskočit na obsah
        </a>
        <SiteHeader />
        <main id="obsah">{children}</main>
        <SiteFooter />
        <ScrollProgress />
        <MotionProvider />
        <BottomBar />
        <SoundClicks />
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}

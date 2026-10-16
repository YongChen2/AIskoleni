import { getImageProps } from "next/image";

/** Předgenerované šířky v public/images (scripts/images.mjs) */
const WIDTHS = [384, 512, 768];

const srcSet = (src: string, ext: string) => WIDTHS.map((w) => `${src}-${w}.${ext} ${w}w`).join(", ");

/**
 * Titulní obrázek článku: <picture> s AVIF a WebP fallbackem, lazy, výřez 16:9.
 * Tmavý překryv (gradient + ztmavení) drží kontrast okolního textu a sjednocuje obrázek s tmavým povrchem.
 */
export function PostCover({ src, alt = "", sizes, className }: { src: string; alt?: string; sizes: string; className?: string }) {
  // Soubory jsou už optimalizované (scripts/images.mjs) → unoptimized a srcset přesně podle předgenerovaných šířek
  const { props } = getImageProps({ src: `${src}-768.webp`, alt, width: 768, height: 432, sizes, unoptimized: true, loading: "lazy", decoding: "async" });

  return (
    <div className={`relative isolate aspect-video overflow-hidden rounded-[12px] border border-line bg-surface-2 ${className ?? ""}`}>
      <picture>
        <source type="image/avif" srcSet={srcSet(src, "avif")} sizes={sizes} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt je v props */}
        <img {...props} srcSet={srcSet(src, "webp")} sizes={sizes} className="h-full w-full object-cover" />
      </picture>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,9,11,0.7),rgba(8,9,11,0.15)_55%,rgba(8,9,11,0.25))]" />
    </div>
  );
}

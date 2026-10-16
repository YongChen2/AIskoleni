"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// vlastní cx: ui.tsx tuto komponentu importuje (PageHero), import zpět by byl kruhový
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

type Mode = "video" | "poster";
type Conn = { saveData?: boolean; effectiveType?: string };

/** Video se nespustí při reduced motion, Save-Data nebo pomalé síti – pak jen poster. */
function pickMode(): Mode {
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (prefersReducedMotion() || c?.saveData || /(^|-)2g$|^3g$/.test(c?.effectiveType ?? "")) return "poster";
  return "video";
}

/** Až po načtení stránky a v idle → video ani poster nesoupeří s LCP (nadpis). */
function afterIdle(fn: () => void) {
  let id = 0;
  const idle = () => {
    id = window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 2500 }) : window.setTimeout(fn, 1200);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => {
    window.removeEventListener("load", idle);
    if (window.cancelIdleCallback) window.cancelIdleCallback(id);
    window.clearTimeout(id);
  };
}

const overlays = {
  // úvod: text vlevo dole (mobil) / vlevo (desktop)
  hero: "bg-[linear-gradient(to_top,var(--vb-tint)_10%,color-mix(in_srgb,var(--vb-tint)_78%,transparent)_48%,transparent_78%)] lg:bg-[linear-gradient(to_right,var(--vb-tint)_18%,color-mix(in_srgb,var(--vb-tint)_55%,transparent)_48%,transparent_80%),linear-gradient(to_top,var(--vb-tint),transparent_35%)]",
  // hlavička podstránky: text vlevo nahoře přes celou šířku
  page: "bg-[linear-gradient(to_right,var(--vb-tint)_10%,color-mix(in_srgb,var(--vb-tint)_60%,transparent)_55%,transparent),linear-gradient(to_top,var(--vb-tint),transparent_45%)]",
  // CTA karta: text uprostřed
  card: "bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,color-mix(in_srgb,var(--vb-tint)_80%,transparent),transparent)]",
} as const;

/**
 * Smyčkové video na pozadí (public/video, viz scripts/video.sh).
 * - SSR vykreslí jen překryv; video se spustí až v idle po načtení stránky.
 * - <video> není v DOM, snímky se kreslí do <canvas>. Canvas není kandidát LCP → LCP zůstává nadpis
 *   (viditelný <video> i jeho poster Chrome jako LCP započítá, i když se objeví později).
 * - Přehrává se (play) jen ve viewportu, mimo něj pause – místo atributu autoplay, aby se video mimo obrazovku nestahovalo.
 * - Mobil (< 768 px) dostane výřez na výšku `-m`. Reduced motion / Save-Data / 2g–3g = jen poster.
 */
export function VideoBackground({
  src,
  overlay = "page",
  opacity = 0.42,
  className,
}: {
  src: "hero" | "ambient";
  overlay?: keyof typeof overlays;
  opacity?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d", { alpha: false });
    if (!el || !cv || !ctx) return;
    let video: HTMLVideoElement | null = null;
    let io: IntersectionObserver | null = null;
    let raf = 0;
    let last = -1;
    let dead = false;

    const draw = (img: CanvasImageSource, w: number, h: number) => {
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      ctx.drawImage(img, 0, 0, w, h);
    };

    // Kreslí jen nový snímek (smyčka běží, jen když video hraje)
    const loop = () => {
      if (!video) return;
      if (video.currentTime !== last && video.readyState >= 2) {
        last = video.currentTime;
        draw(video, video.videoWidth, video.videoHeight);
      }
      raf = requestAnimationFrame(loop);
    };

    const cancel = afterIdle(() => {
      const file = window.matchMedia("(max-width: 767.98px)").matches ? `${src}-m` : src;
      const poster = new Image();
      poster.decoding = "async";
      poster.onload = () => {
        if (dead || last >= 0) return;
        draw(poster, poster.naturalWidth, poster.naturalHeight);
        setReady(true);
      };
      poster.src = `/video/${file}.webp`;
      if (pickMode() === "poster") return;

      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "none";
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      const canWebm = v.canPlayType('video/webm; codecs="vp9"') !== "";
      v.src = `/video/${file}.${canWebm ? "webm" : "mp4"}`;
      v.addEventListener("playing", () => {
        setReady(true);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      });
      v.addEventListener("pause", () => cancelAnimationFrame(raf));
      video = v;

      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) v.play().catch(() => {}); // např. úsporný režim iOS → zůstane poster
        else v.pause();
      });
      io.observe(el);
    });

    return () => {
      dead = true;
      cancel();
      io?.disconnect();
      cancelAnimationFrame(raf);
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [src]);

  return (
    <div ref={root} aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden [--vb-tint:var(--bg)]", className)}>
      <canvas
        ref={canvas}
        width={16}
        height={9}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: ready ? opacity : 0 }}
      />
      {/* vinětace + gradient z barvy pozadí → text drží kontrast AA */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--vb-tint)_100%)]" />
      <div className={cx("absolute inset-0", overlays[overlay])} />
    </div>
  );
}

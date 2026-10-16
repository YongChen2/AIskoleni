"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "@/components/icons";
import { useCases, type UseCase } from "@/content/use-cases";
import { loadEngine, prefersReducedMotion } from "@/lib/motion";

/** Drobná linková ilustrace (stroke 1.5, akcent jen na jednom prvku) */
function Illo({ kind }: { kind: UseCase["illo"] }) {
  const a = "var(--accent)";
  const shapes: Record<UseCase["illo"], React.ReactNode> = {
    doc: (
      <>
        <rect x="14" y="6" width="36" height="44" rx="5" />
        <path d="M22 18h20M22 26h20M22 34h12" />
        <circle cx="46" cy="44" r="8" fill="var(--surface)" stroke={a} />
        <path d="m42.5 44 2.5 2.5 4.5-5" stroke={a} />
      </>
    ),
    mail: (
      <>
        <rect x="8" y="14" width="48" height="30" rx="5" />
        <path d="m10 17 22 15 22-15" />
        <path d="M44 8h12v12" stroke={a} />
        <path d="m56 8-10 10" stroke={a} />
      </>
    ),
    table: (
      <>
        <rect x="8" y="10" width="48" height="36" rx="5" />
        <path d="M8 22h48M8 34h48M26 10v36M42 10v36" />
        <rect x="27" y="23" width="14" height="10" rx="1.5" fill={a} stroke="none" opacity=".85" />
      </>
    ),
    chart: (
      <>
        <path d="M8 48h48" />
        <path d="M16 42V30M28 42V20M40 42V26" />
        <path d="M52 42V12" stroke={a} strokeWidth="3" />
      </>
    ),
    stack: (
      <>
        <rect x="18" y="6" width="32" height="22" rx="4" />
        <rect x="12" y="14" width="32" height="22" rx="4" fill="var(--surface)" />
        <rect x="6" y="22" width="32" height="22" rx="4" fill="var(--surface)" stroke={a} />
        <path d="M12 30h14M12 36h20" />
      </>
    ),
    person: (
      <>
        <circle cx="26" cy="20" r="9" />
        <path d="M10 48c1.5-9 8-14 16-14s14.5 5 16 14" />
        <path d="M44 16h12M44 24h12M44 32h8" stroke={a} />
      </>
    ),
    chat: (
      <>
        <path d="M8 12h30a5 5 0 0 1 5 5v13a5 5 0 0 1-5 5H20l-8 7v-7H8a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5Z" />
        <path d="M30 26h22a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-2v6l-7-6H30a5 5 0 0 1-5-5v-1" stroke={a} />
      </>
    ),
    compare: (
      <>
        <rect x="6" y="14" width="14" height="30" rx="3" />
        <rect x="25" y="8" width="14" height="36" rx="3" stroke={a} />
        <rect x="44" y="18" width="14" height="26" rx="3" />
        <path d="m28 26 3 3 5-6" stroke={a} />
      </>
    ),
    trend: (
      <>
        <path d="M8 48h48" />
        <path d="m10 40 12-10 9 6 15-18" />
        <path d="M38 18h8v8" />
        <path d="m10 40 12-4 9 2 15-6" stroke={a} strokeDasharray="3 3" />
      </>
    ),
    book: (
      <>
        <path d="M32 14c-6-4-14-5-22-4v34c8-1 16 0 22 4 6-4 14-5 22-4V10c-8-1-16 0-22 4Z" />
        <path d="M32 14v34" />
        <path d="M38 22h10M38 30h10" stroke={a} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 64 56" width="64" height="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {shapes[kind]}
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Horizontální galerie use-casů.
 * Desktop (≥ 1024 px, bez reduced motion): sekce se pinne a karty jedou do strany podle scrollu (ScrollTrigger scrub),
 * progress pod nimi. Mobil a bez JS: nativní vodorovný swipe se scroll-snap a ukazatelem „03 / 10“.
 */
export function UseCaseGallery() {
  const pinned = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  // ukazatel karty (swipe i pin)
  const setIndex = (i: number) => {
    if (counter.current) counter.current.textContent = pad(i + 1);
  };

  useEffect(() => {
    const vp = viewport.current!;
    const tr = track.current!;
    const onScroll = () => {
      const p = vp.scrollLeft / Math.max(1, vp.scrollWidth - vp.clientWidth);
      setIndex(Math.round(p * (useCases.length - 1)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    vp.addEventListener("scroll", onScroll, { passive: true });

    const mq = window.matchMedia("(min-width: 1024px)");
    let cleanup: (() => void) | undefined;
    let dead = false;

    const setup = async () => {
      cleanup?.();
      cleanup = undefined;
      if (!mq.matches || prefersReducedMotion()) return;
      const { gsap, ScrollTrigger } = await loadEngine();
      if (dead || !mq.matches) return;
      vp.dataset.pinned = "";
      vp.scrollLeft = 0;
      const distance = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
      const tween = gsap.to(tr, { x: () => -distance(), ease: "none" });
      const st = ScrollTrigger.create({
        trigger: pinned.current,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: pinned.current,
        scrub: 0.6,
        animation: tween,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          setIndex(Math.round(self.progress * (useCases.length - 1)));
        },
        onRefresh: () => window.dispatchEvent(new Event("theme:refresh")),
      });
      cleanup = () => {
        st.kill(true);
        tween.kill();
        gsap.set(tr, { clearProps: "transform" });
        delete vp.dataset.pinned;
      };
    };
    void setup();
    mq.addEventListener("change", setup);
    return () => {
      dead = true;
      vp.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", setup);
      cleanup?.();
    };
  }, []);

  return (
    <section data-theme="light" data-band="" aria-labelledby="usecases-title" className="relative overflow-hidden">
      {/* pinne se vnitřní blok → spacer ScrollTriggeru je uvnitř pásu a výška pásu sedí */}
      <div ref={pinned} className="flex flex-col justify-center py-20 lg:h-[100svh] lg:py-0">
        <div className="shell flex flex-wrap items-end justify-between gap-6">
          <div data-reveal-block className="max-w-2xl">
            <h2 id="usecases-title" className="display-2">
              Co AI zvládne <span className="hl">za vás</span>
            </h2>
            <p className="lead mt-5">Deset úloh, které na školeních převádíme z hodin na minuty. Každá role má svoje.</p>
          </div>
          <p className="mono text-[13px] text-subtle" aria-hidden>
            <span ref={counter} className="text-fg">
              01
            </span>{" "}
            / {pad(useCases.length)}
          </p>
        </div>

        <div
          ref={viewport}
          className="swipe mt-10 overflow-x-auto data-[pinned]:overflow-visible lg:mt-14"
          tabIndex={0}
          role="region"
          aria-label="Galerie úloh – posouvejte vodorovně"
        >
          <ol ref={track} className="flex w-max gap-4 px-5 md:px-8 lg:px-[max(2rem,calc((100vw-1200px)/2+2rem))]">
            {useCases.map((u, i) => (
              <li
                key={u.task}
                className="card flex w-[min(80vw,22rem)] shrink-0 snap-start flex-col p-6 lg:w-[24rem] lg:p-7"
                aria-label={`${i + 1} z ${useCases.length}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="badge">{u.role}</span>
                  <span className="text-muted">
                    <Illo kind={u.illo} />
                  </span>
                </div>
                <h3 className="title mt-4">{u.task}</h3>
                <p className="mt-3 flex items-center gap-2 text-[15px] font-medium">
                  <span className="text-subtle line-through decoration-1">{u.before}</span>
                  <ArrowRight size={14} className="text-subtle" />
                  <span className="text-accent-hover">{u.after}</span>
                </p>
                <samp className="inset mt-auto block p-3.5 font-mono text-[12.5px] leading-relaxed text-muted">{u.sample}</samp>
              </li>
            ))}
          </ol>
        </div>

        <div className="shell mt-8 flex items-center gap-6">
          <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-tint/[0.08]" aria-hidden>
            <span ref={bar} className="absolute inset-0 origin-left rounded-full bg-accent" style={{ transform: "scaleX(0)" }} />
          </span>
          <p className="label shrink-0">Orientační odhady pro typický případ, ne záruka.</p>
        </div>
      </div>
    </section>
  );
}

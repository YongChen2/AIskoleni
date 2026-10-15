"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const DemoTerminal = dynamic(() => import("./demo-terminal"), {
  ssr: false,
  loading: () => <TerminalSkeleton />,
});

function TerminalSkeleton() {
  return (
    <div data-blink className="micro flex min-h-[32rem] items-center justify-center border border-line text-muted">
      [ INICIALIZACE TERMINÁLU<span className="cursor-block ml-2" aria-hidden /> ]
    </div>
  );
}

/** Terminál se načte až ve chvíli, kdy se k němu návštěvník doscrolluje. */
export function DemoLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{show ? <DemoTerminal /> : <TerminalSkeleton />}</div>;
}

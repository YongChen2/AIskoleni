"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { DemoFrame } from "./demo-frame";

const DemoShowcase = dynamic(() => import("./demo-showcase"), {
  ssr: false,
  loading: () => <DemoSkeleton />,
});

function DemoSkeleton() {
  return (
    <DemoFrame>
      <div className="flex min-h-[34rem] items-center justify-center text-[14px] text-subtle">Načítám ukázku…</div>
    </DemoFrame>
  );
}

/** Demo se načte až ve chvíli, kdy se k němu návštěvník doscrolluje. */
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

  return <div ref={ref}>{show ? <DemoShowcase /> : <DemoSkeleton />}</div>;
}

import { cx } from "@/components/ui";

/** Rám „okna aplikace“ pro AI demo – sdílí ho načtené demo i jeho skeleton (stejný vzhled, žádný skok). */
export function DemoFrame({ children, right, className }: { children: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("card-glow overflow-hidden", className)}>
      <div className="flex items-center gap-4 border-b border-line bg-white/[0.015] px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </span>
        <span className="flex-1 truncate text-center text-[13px] font-medium text-muted">AI asistent · ukázka</span>
        <span className="flex items-center gap-3">
          <span className="badge badge-success badge-dot hidden sm:inline-flex">Online</span>
          {right}
        </span>
      </div>
      {children}
    </div>
  );
}

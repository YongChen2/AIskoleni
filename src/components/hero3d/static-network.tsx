import { ACCENT_COUNT } from "./look";
import { createNetwork } from "./network";

/** Statická projekce sítě – renderuje se na serveru. Fallback do načtení 3D, pro reduced-motion a bez WebGL. */
export function StaticNetwork({ className }: { className?: string }) {
  const net = createNetwork(150, 7);
  const accent = net.accent.slice(0, ACCENT_COUNT).filter((i) => i < net.nodes.length);
  const project = ([x, y, z]: [number, number, number]) => [Math.round(600 + x * 90 + z * 20), Math.round(300 + y * 90 - z * 10)];
  const lines = net.edges
    .map(([a, b]) => {
      const [x1, y1] = project(net.nodes[a]);
      const [x2, y2] = project(net.nodes[b]);
      return `M${x1} ${y1}L${x2} ${y2}`;
    })
    .join("");
  const dots = net.nodes
    .map((n, i) => {
      if (accent.includes(i)) return "";
      const [x, y] = project(n);
      return `M${x - 1.2} ${y}a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0 -2.4 0`;
    })
    .join("");
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={className ?? "h-full w-full"} aria-hidden>
      <defs>
        <radialGradient id="sn-halo">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={lines} stroke="var(--fg)" strokeOpacity="0.07" strokeWidth="1" fill="none" />
      <path d={dots} fill="var(--fg)" fillOpacity="0.45" />
      {accent.map((i) => {
        const [x, y] = project(net.nodes[i]);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="16" fill="url(#sn-halo)" />
            <circle cx={x} cy={y} r="2.5" fill="var(--accent-hover)" />
          </g>
        );
      })}
    </svg>
  );
}

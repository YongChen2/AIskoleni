import { createNetwork } from "./network";

/** Statická projekce sítě – renderuje se na serveru. Fallback pro mobil, reduced-motion a bez WebGL. */
export function StaticNetwork() {
  const net = createNetwork(150, 7);
  const project = ([x, y, z]: [number, number, number]) => [
    Math.round(600 + x * 90 + z * 20),
    Math.round(300 + y * 90 - z * 10),
  ];
  const lines = net.edges
    .map(([a, b]) => {
      const [x1, y1] = project(net.nodes[a]);
      const [x2, y2] = project(net.nodes[b]);
      return `M${x1} ${y1}L${x2} ${y2}`;
    })
    .join("");
  const dots = net.nodes
    .map((n, i) => (net.accent.includes(i) ? "" : `M${project(n)[0] - 1} ${project(n)[1] - 1}h2v2h-2z`))
    .join("");
  const accents = net.accent
    .map((i) => {
      const [x, y] = project(net.nodes[i]);
      return `M${x - 3} ${y - 3}h6v6h-6z`;
    })
    .join("");
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <path d={lines} stroke="var(--line)" strokeWidth="1" fill="none" />
      <path d={dots} fill="var(--fg)" />
      <path d={accents} fill="var(--accent)" />
    </svg>
  );
}

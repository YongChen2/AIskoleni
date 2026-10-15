/** Deterministická „neuronová“ síť – sdílí ji 3D scéna i statický fallback. */

export type Network = {
  nodes: [number, number, number][];
  edges: [number, number][];
  accent: number[];
};

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function createNetwork(count = 520, seed = 7): Network {
  const r = rng(seed);
  const nodes: [number, number, number][] = [];

  // Shluky („laloky“) rozprostřené v zploštělém elipsoidu
  const clusters = Array.from({ length: 7 }, () => [
    (r() - 0.5) * 6,
    (r() - 0.5) * 3,
    (r() - 0.5) * 3,
  ]);

  for (let i = 0; i < count; i++) {
    const c = clusters[i % clusters.length];
    const spread = 1.1 + r() * 0.9;
    // Gaussovské rozložení kolem shluku
    const g = () => (r() + r() + r() - 1.5) * spread;
    nodes.push([c[0] + g() * 1.3, c[1] + g() * 0.8, c[2] + g()]);
  }

  // Každý uzel propojit se 2–3 nejbližšími sousedy
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const d = nodes
      .map((n, j) => [j, (n[0] - nodes[i][0]) ** 2 + (n[1] - nodes[i][1]) ** 2 + (n[2] - nodes[i][2]) ** 2])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1]);
    const k = 2 + (i % 2);
    for (let m = 0; m < k; m++) {
      const j = d[m][0];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  }

  const accent = Array.from({ length: 14 }, (_, i) => Math.floor((i * 97 + 13) % count));
  return { nodes, edges, accent };
}

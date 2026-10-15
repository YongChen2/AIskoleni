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

  // Každý uzel propojit se 2–3 nejbližšími sousedy (bez řazení – jen top-k)
  const edges: [number, number][] = [];
  const seen = new Set<number>();
  for (let i = 0; i < nodes.length; i++) {
    const k = 2 + (i % 2);
    const best: [number, number][] = [];
    const [xi, yi, zi] = nodes[i];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const d = (nodes[j][0] - xi) ** 2 + (nodes[j][1] - yi) ** 2 + (nodes[j][2] - zi) ** 2;
      if (best.length < k || d < best[best.length - 1][1]) {
        best.push([j, d]);
        best.sort((a, b) => a[1] - b[1]);
        if (best.length > k) best.pop();
      }
    }
    for (const [j] of best) {
      const key = i < j ? i * 100000 + j : j * 100000 + i;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  }

  const accent = Array.from({ length: 14 }, (_, i) => Math.floor((i * 97 + 13) % count));
  return { nodes, edges, accent };
}

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

/**
 * Cílový tvar morphu: žárovka („nápad“) ze stejného počtu bodů – procedurálně, deterministicky.
 * Baňka (koule bez spodní čepičky) → hrdlo → patice se závitem → kontakt; uvnitř nožičky a vlákno.
 * Akcentní uzly sítě (záře) skončí na vláknu, takže žárovka „svítí“. Vrací [x,y,z] pro každý uzel.
 */
export function createBulb(net: Network, scale = 1): [number, number, number][] {
  const r = rng(91);
  const n = net.nodes.length;
  const out: [number, number, number][] = new Array(n);
  const accent = new Set(net.accent.slice(0, 8));
  const S = scale;
  const C = 0.75; // střed baňky (y)
  const R = 1.55;

  // vlákno: vodorovná spirála mezi nožičkami nahoře uvnitř baňky
  const filament = (t: number): [number, number, number] => {
    const x = -0.5 + t;
    const a = t * Math.PI * 10;
    return [x * S, (0.55 + Math.sin(a) * 0.09) * S, Math.cos(a) * 0.09 * S];
  };

  // baňka jako drátěný model: 10 poledníků + 5 rovnoběžek → čitelný obrys i při rotaci
  const glass = (): [number, number, number] => {
    if (r() < 0.62) {
      const th = (Math.floor(r() * 10) / 10) * Math.PI * 2;
      const u = -0.72 + r() * 1.72;
      const sn = Math.sqrt(Math.max(0, 1 - u * u));
      return [R * sn * Math.cos(th) * S, (C + R * u) * S, R * sn * Math.sin(th) * S];
    }
    const u = [-0.45, -0.05, 0.35, 0.7, 0.92][Math.floor(r() * 5)];
    const sn = Math.sqrt(1 - u * u);
    const th = r() * Math.PI * 2;
    return [R * sn * Math.cos(th) * S, (C + R * u) * S, R * sn * Math.sin(th) * S];
  };
  const neckTop = C - R * 0.72; // y, kde baňka přechází do hrdla
  const neckR = R * Math.sqrt(1 - 0.72 * 0.72);
  const neck = (): [number, number, number] => {
    const t = Math.floor(r() * 4) / 3;
    const y = neckTop - t * 0.55;
    const rad = neckR + (0.62 - neckR) * t;
    const th = r() * Math.PI * 2;
    return [rad * Math.cos(th) * S, y * S, rad * Math.sin(th) * S];
  };
  const baseTop = neckTop - 0.55;
  const thread = (): [number, number, number] => {
    const t = r();
    const y = baseTop - t * 0.85;
    const th = t * Math.PI * 2 * 4.5 + (r() - 0.5) * 0.5; // šroubovice = závit
    const rad = 0.62 + Math.sin(t * Math.PI * 9) * 0.04;
    return [rad * Math.cos(th) * S, y * S, rad * Math.sin(th) * S];
  };
  const tip = (): [number, number, number] => {
    const t = r();
    const rad = 0.42 * (1 - t);
    const th = r() * Math.PI * 2;
    return [rad * Math.cos(th) * S, (baseTop - 0.85 - t * 0.22) * S, rad * Math.sin(th) * S];
  };
  const post = (): [number, number, number] => {
    const side = r() < 0.5 ? -0.5 : 0.5;
    const t = r();
    return [side * S, (neckTop - 0.1 + t * (0.55 - neckTop + 0.1)) * S, 0];
  };

  let a = 0;
  for (let i = 0; i < n; i++) {
    if (accent.has(i)) {
      out[i] = filament((a++ + 0.5) / 8);
      continue;
    }
    const k = r();
    out[i] = k < 0.66 ? glass() : k < 0.75 ? neck() : k < 0.9 ? thread() : k < 0.94 ? tip() : k < 0.98 ? post() : filament(r());
  }
  return out;
}

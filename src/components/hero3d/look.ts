/**
 * Společný vzhled 3D sítě pro desktop (R3F) i mobil (čisté WebGL):
 * bílé body s nízkou opacitou, velmi jemné hrany, pár akcentních uzlů se září,
 * hloubka přes opacitu podle vzdálenosti (fog). Aditivní blending.
 */

import { brand } from "@/config/brand";

/** Kolik akcentních uzlů zvýraznit (ze sítě jich je víc – klidnější je méně) */
export const ACCENT_COUNT = 8;

/** Klidný pohyb: pomalá rotace, malá odezva na myš / náklon, mírné rozprostření při scrollu */
export const MOTION = {
  spin: 0.035,
  tiltX: 0.18,
  tiltZ: 0.06,
  shift: 0.25,
  spread: 3,
};

export const LAYERS = {
  edge: { color: brand.colors.fg, opacity: 0.075, size: 1, soft: 0 },
  node: { color: brand.colors.fg, opacity: 0.55, size: 2.6, soft: 0 },
  halo: { color: brand.colors.accent, opacity: 0.32, size: 30, soft: 1 },
  accent: { color: brand.colors.accentHover, opacity: 1, size: 5, soft: 0 },
  pulse: { color: brand.colors.accent, opacity: 0.9, size: 9, soft: 1 },
} as const;

/** Mlha: blízko (depth ≤ near) plná opacita, daleko (≥ far) jen `min`. */
export const FOG = { near: 4.5, far: 11, min: 0.12 };

/** GLSL: výpočet fade podle hloubky – vkládá se do vertex shaderu (potřebuje `mv` ve view space). */
export const FOG_GLSL = /* glsl */ `
  float depth = -mv.z;
  vFade = mix(1.0, ${FOG.min.toFixed(2)}, clamp((depth - ${FOG.near.toFixed(1)}) / ${(FOG.far - FOG.near).toFixed(1)}, 0.0, 1.0));
  gl_PointSize = uSize * clamp(7.5 / depth, 0.6, 1.6);
`;

export const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSoft;
  uniform float uPoint;
  varying float vFade;
  void main() {
    float a = uOpacity * vFade;
    if (uPoint > 0.5) {
      float d = length(gl_PointCoord - 0.5) * 2.0;
      if (d > 1.0) discard;
      // ostrý kulatý bod, nebo měkká záře (halo)
      a *= mix(smoothstep(1.0, 0.55, d), pow(1.0 - d, 2.2), uSoft);
    }
    gl_FragColor = vec4(uColor * a, a);
  }
`;

export const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];

/** Deterministický náhodný faktor uzlu pro rozprostření */
export const seed = (i: number) => 0.4 + ((i * 2654435761) % 1000) / 650;

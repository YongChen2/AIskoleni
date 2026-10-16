"use client";

import { useEffect, useRef } from "react";
import { onTick } from "@/lib/motion";
import { ACCENT_COUNT, FOG_GLSL, FRAG, LAYERS, LIFT, MOTION, phase, rgb, seed } from "./look";
import { createBulb, createNetwork } from "./network";
import { initSensor, stopSensor, tilt } from "./sensor";

/**
 * Odlehčená mobilní verze 3D sítě – čisté WebGL (pár KB místo three.js + R3F),
 * aby načtení nezatížilo hlavní vlákno. Stejná data, stejný vzhled (look.ts), stejné vstupy (náklon / samovolné plutí / scroll).
 */

const COUNT = 220;
const PULSES = 8;
const FOV = (50 * Math.PI) / 180;
const CAM_Z = 8;

const VERT = `
attribute vec3 aPos;
attribute float aSeed;
attribute vec3 aTarget;
uniform mat4 uMV;
uniform mat4 uP;
uniform float uSpread;
uniform float uMorph;
uniform float uSize;
varying float vFade;
void main() {
  vec3 b = mix(aPos, aTarget, uMorph);
  vec3 p = b + normalize(b + vec3(0.0001)) * uSpread * aSeed;
  vec4 mv = uMV * vec4(p, 1.0);
  ${FOG_GLSL}
  gl_Position = uP * mv;
}`;

type M4 = Float32Array;

function mul(a: M4, b: M4): M4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}

function perspective(aspect: number): M4 {
  const f = 1 / Math.tan(FOV / 2);
  const n = 0.1;
  const fa = 100;
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, (2 * fa * n) / (n - fa), 0]);
}

/** model = T(x,0,-camZ) · Rx · Ry · Rz (pořadí jako Euler XYZ v three.js) */
function model(rx: number, ry: number, rz: number, tx: number, ty = 0): M4 {
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(rx), Math.sin(rx), Math.cos(ry), Math.sin(ry), Math.cos(rz), Math.sin(rz)];
  const Rx = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
  const Ry = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]);
  const Rz = new Float32Array([cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const T = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, -CAM_Z, 1]);
  return mul(T, mul(Rx, mul(Ry, Rz)));
}

type Layer = (typeof LAYERS)[keyof typeof LAYERS];

export default function NeuralLite({ onReady }: { onReady?: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const gl = c?.getContext("webgl", { antialias: false, alpha: true, powerPreference: "low-power" });
    if (!c || !gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    // FRAG vrací předem vynásobenou barvu → aditivní míchání, bez hloubkového testu
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    const aPos = gl.getAttribLocation(prog, "aPos");
    const aSeed = gl.getAttribLocation(prog, "aSeed");
    const aTarget = gl.getAttribLocation(prog, "aTarget");
    const uMorph = gl.getUniformLocation(prog, "uMorph");
    const uMV = gl.getUniformLocation(prog, "uMV");
    const uP = gl.getUniformLocation(prog, "uP");
    const uSpread = gl.getUniformLocation(prog, "uSpread");
    const uSize = gl.getUniformLocation(prog, "uSize");
    const uColor = gl.getUniformLocation(prog, "uColor");
    const uOpacity = gl.getUniformLocation(prog, "uOpacity");
    const uSoft = gl.getUniformLocation(prog, "uSoft");
    const uPoint = gl.getUniformLocation(prog, "uPoint");

    const net = createNetwork(COUNT);
    const buffer = (data: number[], dynamic = false) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
      return b;
    };
    const layer = (pos: number[], seeds: number[], dynamic = false, target = pos) => ({
      pos: buffer(pos, dynamic),
      seed: buffer(seeds),
      target: buffer(target),
      n: seeds.length,
    });
    const bulb = createBulb(net, 0.85);
    const edges = layer(
      net.edges.flatMap(([a, b]) => [...net.nodes[a], ...net.nodes[b]]),
      net.edges.flatMap(([a, b]) => [seed(a), seed(b)]),
      false,
      net.edges.flatMap(([a, b]) => [...bulb[a], ...bulb[b]])
    );
    const nodes = layer(net.nodes.flat(), net.nodes.map((_, i) => seed(i)), false, bulb.flat());
    const accentIdx = net.accent.slice(0, ACCENT_COUNT);
    const accents = layer(accentIdx.flatMap((i) => net.nodes[i]), accentIdx.map(seed), false, accentIdx.flatMap((i) => bulb[i]));
    const pulseData = new Float32Array(PULSES * 3);
    const pulses = layer(Array.from(pulseData), new Array(PULSES).fill(0), true);
    const pulseState = Array.from({ length: PULSES }, (_, i) => ({ edge: (i * 53) % net.edges.length, t: i / PULSES, speed: 0.35 + ((i * 7) % 5) * 0.08 }));

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);

    let proj = perspective(1);
    // průběh morphu se počítá z výšky celého hera (plátno na mobilu zabírá jen jeho horní část)
    let heroH = window.innerHeight;
    const resize = () => {
      heroH = c.closest("section")?.offsetHeight || window.innerHeight;
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      gl.viewport(0, 0, c.width, c.height);
      proj = perspective(w / Math.max(1, h));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const draw = (l: typeof edges, mode: number, look: Layer, alpha = 1, size = 1) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, l.pos);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, l.seed);
      gl.enableVertexAttribArray(aSeed);
      gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, l.target);
      gl.enableVertexAttribArray(aTarget);
      gl.vertexAttribPointer(aTarget, 3, gl.FLOAT, false, 0, 0);
      gl.uniform3fv(uColor, rgb(look.color));
      gl.uniform1f(uOpacity, Math.min(1, look.opacity * alpha));
      gl.uniform1f(uSoft, look.soft);
      gl.uniform1f(uPoint, mode === gl.POINTS ? 1 : 0);
      gl.uniform1f(uSize, look.size * dpr * size);
      gl.drawArrays(mode, 0, l.n);
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    initSensor();

    const s = { rx: 0, ry: 0, rz: 0, tx: 0, x: 0, y: 0 };
    let last = 0;
    let frames = 0;
    const off = onTick((time) => {
      if (!visible) return;
      const dt = Math.min(0.05, last ? (time - last) / 1000 : 0.016);
      last = time;
      const t = time / 1000;
      const src = tilt.active ? tilt : { x: Math.sin(t * 0.3) * 0.5, y: Math.cos(t * 0.23) * 0.35 };
      s.x += (src.x - s.x) * 0.08;
      s.y += (src.y - s.y) * 0.08;
      const k = Math.min(1, dt * 2);
      s.ry += dt * MOTION.spin;
      s.rx += (s.y * MOTION.tiltX - s.rx) * k;
      s.rz += (-s.x * MOTION.tiltZ - s.rz) * k;
      s.tx += (s.x * MOTION.shift - s.tx) * Math.min(1, dt * 1.5);
      const sc = Math.max(0, window.scrollY / Math.max(1, heroH));
      const ph = phase(sc);
      // px scrollu → světové jednotky v rovině z = 0 (výška plátna = 2·CAM_Z·tan(FOV/2))
      const lift = (window.scrollY / Math.max(1, c.clientHeight)) * 2 * CAM_Z * Math.tan(FOV / 2) * LIFT;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(uP, false, proj);
      gl.uniformMatrix4fv(uMV, false, model(s.rx, s.ry, s.rz, s.tx, -lift));
      gl.uniform1f(uSpread, ph.spread);
      gl.uniform1f(uMorph, ph.morph);
      draw(edges, gl.LINES, LAYERS.edge, ph.edgeAlpha);
      draw(nodes, gl.POINTS, LAYERS.node, ph.alpha * ph.nodeBoost, ph.nodeSize);
      draw(accents, gl.POINTS, LAYERS.halo, ph.alpha);
      draw(accents, gl.POINTS, LAYERS.accent, ph.alpha);

      if (ph.pulses) {
        pulseState.forEach((p, i) => {
          p.t += dt * p.speed;
          if (p.t >= 1) {
            const end = net.edges[p.edge][1];
            const next = net.edges.findIndex(([a], idx) => a === end && idx !== p.edge);
            p.edge = next >= 0 ? next : (p.edge * 31 + 17) % net.edges.length;
            p.t = 0;
          }
          const [a, b] = net.edges[p.edge];
          for (let d = 0; d < 3; d++) pulseData[i * 3 + d] = net.nodes[a][d] + (net.nodes[b][d] - net.nodes[a][d]) * p.t;
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, pulses.pos);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, pulseData);
        gl.uniform1f(uSpread, 0);
        gl.uniform1f(uMorph, 0);
        draw(pulses, gl.POINTS, LAYERS.pulse);
      }
      if (++frames === 2) onReady?.();
    });

    return () => {
      off();
      io.disconnect();
      ro.disconnect();
      stopSensor();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [onReady]);

  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />;
}

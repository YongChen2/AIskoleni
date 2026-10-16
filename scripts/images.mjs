// Titulní obrázky článků: assets/images/<název>.png → public/images/<název>-<šířka>.avif|.webp (výřez 16:9).
//   node scripts/images.mjs blog-5-uloh-obchod [top]
// `top` = horní okraj výřezu v px zdroje (výchozí: na střed). Šířky nad rozlišením zdroje se zvětšují (lanczos).
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";

const [name, topArg] = process.argv.slice(2);
if (!name) throw new Error("Použití: node scripts/images.mjs <název> [top]");
const WIDTHS = [384, 512, 768];
const src = `assets/images/${name}.png`;
mkdirSync("public/images", { recursive: true });

const { width, height } = await sharp(src).metadata();
const h = Math.round((width * 9) / 16);
const top = topArg ? Math.min(+topArg, height - h) : Math.round((height - h) / 2);
const crop = sharp(src).extract({ left: 0, top, width, height: h });

for (const w of WIDTHS) {
  const base = crop.clone().resize(w, Math.round((w * 9) / 16), { kernel: "lanczos3" });
  for (const [ext, enc] of [
    ["avif", (s) => s.avif({ quality: 52, effort: 6 })],
    ["webp", (s) => s.webp({ quality: 72, effort: 6 })],
  ]) {
    const out = `public/images/${name}-${w}.${ext}`;
    await enc(base.clone()).toFile(out);
    console.log(out.padEnd(44), `${(statSync(out).size / 1024).toFixed(1)} KB`);
  }
}

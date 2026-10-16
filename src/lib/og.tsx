import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/config/brand";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/GeistMono-Medium.ttf")),
]);

/** Sdílená OG šablona – tmavá karta s jemnou akcentní září (viz DESIGN.md). */
export async function renderOg({ title, label }: { title: string; label: string }) {
  const [semi, regular, mono] = await fonts;
  const c = brand.colors;
  const len = title.length;
  const size = len > 40 ? 64 : len > 24 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: c.bg,
          backgroundImage: `radial-gradient(circle at 85% 0%, rgba(255,59,59,0.22), rgba(255,59,59,0) 55%)`,
          color: c.fg,
          fontFamily: "Geist",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: c.accent }} />
          <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>{brand.name}</span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "flex-end",
            fontSize: size,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: -size * 0.04,
            maxWidth: 980,
            paddingBottom: 40,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${c.borderSolid}`,
            paddingTop: 28,
            fontSize: 24,
            color: c.muted,
          }}
        >
          <span
            style={{
              display: "flex",
              fontFamily: "Mono",
              fontSize: 18,
              letterSpacing: 2,
              textTransform: "uppercase",
              border: `1px solid ${c.borderSolid}`,
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            {label}
          </span>
          <span style={{ fontWeight: 400 }}>{new URL(brand.url).host}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: semi, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}

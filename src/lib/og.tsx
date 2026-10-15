import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/config/brand";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/ArchivoBlack-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Medium.ttf")),
]);

/** Sdílená OG šablona v duchu Tactical Telemetry. */
export async function renderOg({ title, code, label }: { title: string; code: string; label: string }) {
  const [display, mono] = await fonts;
  const c = brand.colors;
  const len = title.length;
  const size = len > 40 ? 76 : len > 24 ? 96 : 124;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: c.bg,
          color: c.fg,
          fontFamily: "Mono",
          padding: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 2,
            color: c.muted,
            borderBottom: `1px solid ${c.line}`,
            paddingBottom: 16,
          }}
        >
          <div style={{ display: "flex" }}>
            <span style={{ color: c.accent }}>{code}</span>
            <span style={{ marginLeft: 12 }}>{`/// [ ${label.toUpperCase()} ]`}</span>
          </div>
          <span>UNIT / {brand.code}-01 · {brand.revision}</span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "flex-end",
            fontFamily: "Display",
            fontSize: size,
            lineHeight: 0.9,
            letterSpacing: -3,
            textTransform: "uppercase",
            paddingBottom: 36,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", height: 8, background: c.accent }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 20,
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          <span style={{ fontFamily: "Display", fontSize: 32, letterSpacing: -1 }}>
            {brand.name.toUpperCase()}
            <span style={{ color: c.accent }}>{brand.mark}</span>
          </span>
          <div style={{ display: "flex", gap: 3, height: 36 }}>
            {Array.from({ length: 34 }, (_, i) => (
              <div key={i} style={{ width: [2, 1, 3, 1, 2, 4][i % 6], height: 36, background: c.fg }} />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Display", data: display, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}

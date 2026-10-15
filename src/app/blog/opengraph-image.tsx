import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Blog o AI ve firmě";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Záznamy z praxe", code: "SEC.50", label: "Blog" });
}

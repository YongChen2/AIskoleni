import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "O nás";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Učíme práci, ne nástroje", code: "SEC.60", label: "O nás" });
}

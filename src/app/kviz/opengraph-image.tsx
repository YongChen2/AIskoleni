import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Test AI připravenosti firmy";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Jak je vaše firma připravená na AI?", code: "SEC.40", label: "Diagnostika" });
}

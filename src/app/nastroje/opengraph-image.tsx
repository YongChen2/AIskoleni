import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Srovnání AI nástrojů pro firmy";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "ChatGPT · Claude · Copilot · Gemini", label: "Srovnání nástrojů" });
}

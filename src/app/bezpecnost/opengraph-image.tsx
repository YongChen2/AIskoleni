import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Bezpečná práce s daty v AI";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Co do AI nepatří", code: "SEC.20", label: "Bezpečnost dat" });
}

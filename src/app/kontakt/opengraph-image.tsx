import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Kontakt";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Domluvit školení", label: "Kontakt" });
}

import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Firemní školení AI podle rolí";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Licence máte. Výsledky zatím ne.", label: "Firemní školení AI" });
}

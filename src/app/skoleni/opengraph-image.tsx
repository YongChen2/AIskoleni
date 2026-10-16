import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Formáty školení AI";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Tři kroky od zvědavosti k rutině", label: "Formáty školení" });
}

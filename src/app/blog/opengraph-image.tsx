import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Blog o AI ve firmě";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ title: "Poznámky z praxe", label: "Blog" });
}

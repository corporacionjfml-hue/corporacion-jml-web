import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

/** Outfit (same family as the site) for next/og; it reads TTF, OTF and WOFF but not WOFF2. */
export async function loadOgFonts() {
  const [medium, extraBold] = await Promise.all([
    readFile(path.join(root, "src/lib/og/outfit-500.woff")),
    readFile(path.join(root, "src/lib/og/outfit-800.woff")),
  ]);
  return [
    { name: "Outfit", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Outfit", data: extraBold, weight: 800 as const, style: "normal" as const },
  ];
}

/** Inlines a file from `public/` (or `src/app/`) as a data URI so next/og needs no network. */
export async function dataUri(relativePath: string, mime: string) {
  const file = await readFile(path.join(root, relativePath));
  return `data:${mime};base64,${file.toString("base64")}`;
}

/** The catalog stores `.webp` paths; next/og renders PNG, so swap the extension. */
export function pngPhoto(webpPath: string) {
  return `public${webpPath.replace(/\.webp$/, ".png")}`;
}

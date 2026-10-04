import type { MetadataRoute } from "next";
import { cables } from "@/data/cables";
import { absoluteUrl, cablePath } from "@/lib/seo/seo";

// Required for `output: 'export'`: the file is generated at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...cables.map((cable) => ({
      url: absoluteUrl(cablePath(cable)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

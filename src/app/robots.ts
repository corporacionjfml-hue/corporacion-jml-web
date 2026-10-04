import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // An empty `disallow` allows everything.
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

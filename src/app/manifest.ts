import type { MetadataRoute } from "next";
import { company } from "@/data/company";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${company.name} — Catálogo de cables eléctricos`,
    short_name: "J & F SAC",
    description: `${company.slogan}. Catálogo de cables eléctricos y cotización por WhatsApp.`,
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F1",
    theme_color: "#1B3A5C",
    lang: "es",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

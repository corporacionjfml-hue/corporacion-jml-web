import { ImageResponse } from "next/og";
import { cables, getCableBySlug } from "@/data/cables";
import { company } from "@/data/company";

// Required for `output: 'export'`: one static image per cable, rendered at build time.
export const dynamic = "force-static";
export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return cables.map((cable) => ({ slug: cable.slug }));
}

export default async function CableOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cable = getCableBySlug(slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "#1B3A5C",
          color: "#ffffff",
          borderBottom: "24px solid #8DC63F",
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: 5, color: "#8DC63F", display: "flex" }}>
          CATÁLOGO DE CABLES ELÉCTRICOS
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 24, display: "flex" }}>
          {cable?.name ?? company.name}
        </div>
        <div style={{ fontSize: 36, marginTop: 20, color: "#D5DEE7", display: "flex" }}>
          {cable?.fullName ?? company.slogan}
        </div>
        <div style={{ fontSize: 34, marginTop: 56, color: "#8DC63F", display: "flex" }}>
          {company.name} — {company.slogan}
        </div>
      </div>
    ),
    { ...size },
  );
}

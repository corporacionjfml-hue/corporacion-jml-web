import { ImageResponse } from "next/og";
import { cables, getCableBySlug } from "@/data/cables";
import { company } from "@/data/company";
import { dataUri, loadOgFonts, pngPhoto } from "@/lib/og/assets";

// Required for `output: 'export'`: one static image per cable, rendered at build time.
export const dynamic = "force-static";
export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#1B3A5C";
const LIME = "#8DC63F";
const INK = "#14263A";

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
  const title = cable?.name ?? company.name;
  const subtitle = (cable?.fullName ?? company.slogan).replace(/^Cable\s+\S+\s+—\s+/, "");
  const nameSize = title.length > 18 ? 58 : title.length > 14 ? 70 : title.length > 9 ? 96 : 120;

  const [fonts, logo, photo] = await Promise.all([
    loadOgFonts(),
    dataUri("src/app/icon.svg", "image/svg+xml"),
    cable?.image ? dataUri(pngPhoto(cable.image), "image/png") : Promise.resolve(null),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#F4F6F1",
          fontFamily: "Outfit",
          color: INK,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 650,
            top: 56,
            width: 580,
            height: 580,
            borderRadius: 290,
            background: LIME,
            display: "flex",
          }}
        />
        {photo && (
          <div
            style={{
              position: "absolute",
              left: 765,
              top: 135,
              width: 340,
              height: 340,
              borderRadius: 40,
              background: "#FFFFFF",
              boxShadow: "0 28px 60px rgba(20,38,58,0.28)",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={photo} width={340} height={340} style={{ objectFit: "cover" }} />
          </div>
        )}
        {cable && (
          <div
            style={{
              position: "absolute",
              left: 780,
              top: 40,
              padding: "10px 22px",
              borderRadius: 40,
              background: NAVY,
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 800,
              display: "flex",
            }}
          >
            {`Marca ${cable.brand} · Ficha técnica`}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 72,
            top: 0,
            bottom: 0,
            width: 610,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 44 }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={logo} width={64} height={60} />
            <div
              style={{
                marginLeft: 18,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 1,
                color: NAVY,
                display: "flex",
              }}
            >
              {company.name}
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                maxWidth: 560,
                background: LIME,
                padding: "0 18px 8px 14px",
                fontSize: nameSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -2,
                color: NAVY,
              }}
            >
              {title}
            </div>
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 540,
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.25,
              color: "#2D2D2D",
              display: "flex",
            }}
          >
            {subtitle.length > 90 ? `${subtitle.slice(0, 87)}…` : subtitle}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 44 }}>
            <div
              style={{
                padding: "14px 28px",
                borderRadius: 14,
                background: NAVY,
                color: "#FFFFFF",
                fontSize: 30,
                fontWeight: 800,
                display: "flex",
              }}
            >
              nexajf.com
            </div>
            <div
              style={{
                marginLeft: 26,
                fontSize: 32,
                fontWeight: 500,
                color: "#2D2D2D",
                display: "flex",
              }}
            >
              {company.slogan}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

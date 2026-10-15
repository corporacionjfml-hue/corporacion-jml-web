import { ImageResponse } from "next/og";
import { cables } from "@/data/cables";
import { company } from "@/data/company";
import { dataUri, loadOgFonts } from "@/lib/og/assets";

// Required for `output: 'export'`: rendered once at build time.
export const dynamic = "force-static";
export const alt = "CORPORACION J & F SAC — Siempre Hay Opción";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#1B3A5C";
const LIME = "#8DC63F";
const INK = "#14263A";

export default async function OpenGraphImage() {
  const [fonts, logo, hero, chip] = await Promise.all([
    loadOgFonts(),
    dataUri("src/app/icon.svg", "image/svg+xml"),
    dataUri("public/images/cables/caai.png", "image/png"),
    dataUri("public/images/cables/aaac.png", "image/png"),
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
        {/* Lime blob + photo cluster */}
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
        <div
          style={{
            position: "absolute",
            left: 755,
            top: 124,
            width: 360,
            height: 360,
            borderRadius: 40,
            background: "#FFFFFF",
            boxShadow: "0 28px 60px rgba(20,38,58,0.28)",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={hero} width={360} height={360} style={{ objectFit: "cover" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 680,
            top: 398,
            width: 160,
            height: 160,
            borderRadius: 80,
            background: "#FFFFFF",
            border: `7px solid ${NAVY}`,
            boxShadow: "0 18px 40px rgba(20,38,58,0.3)",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={chip} width={146} height={146} style={{ objectFit: "cover" }} />
        </div>
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
          {`${cables.length} cables con ficha técnica`}
        </div>

        {/* Copy column */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 0,
            bottom: 0,
            width: 640,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
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
          <div
            style={{
              fontSize: 70,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -2,
              color: NAVY,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>Cables eléctricos</div>
            <div style={{ display: "flex" }}>de alta calidad</div>
            <div style={{ display: "flex", marginTop: 6 }}>
              <div style={{ display: "flex", background: LIME, padding: "0 16px 6px 12px" }}>
                para cada proyecto
              </div>
            </div>
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

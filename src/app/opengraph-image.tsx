import { ImageResponse } from "next/og";
import { company } from "@/data/company";
import { dataUri, loadOgFonts } from "@/lib/og/assets";

// Required for `output: 'export'`: rendered once at build time.
export const dynamic = "force-static";
export const alt = "NEXA J & F — Siempre Hay Opción";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#1B3A5C";
const LIME = "#8DC63F";

export default async function OpenGraphImage() {
  const [fonts, logo] = await Promise.all([
    loadOgFonts(),
    dataUri("src/app/icon.svg", "image/svg+xml"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F6F1",
          fontFamily: "Outfit",
          borderBottom: `22px solid ${LIME}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logo} width={236} height={222} />
        <div
          style={{
            marginTop: 38,
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -1,
            color: NAVY,
            display: "flex",
          }}
        >
          NEXA J &amp; F
        </div>
        <div style={{ display: "flex", marginTop: 26 }}>
          <div
            style={{
              display: "flex",
              background: LIME,
              padding: "2px 30px 8px",
              fontSize: 54,
              fontWeight: 800,
              color: NAVY,
            }}
          >
            {company.slogan}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

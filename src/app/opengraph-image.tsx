import { ImageResponse } from "next/og";

// Required for `output: 'export'`: rendered once at build time.
export const dynamic = "force-static";
export const alt = "CORPORACION J & F SAC — Siempre Hay Opción";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ fontSize: 40, letterSpacing: 6, color: "#8DC63F", display: "flex" }}>
          CATÁLOGO DE CABLES ELÉCTRICOS
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 24, display: "flex" }}>
          CORPORACION J &amp; F SAC
        </div>
        <div style={{ fontSize: 52, marginTop: 20, color: "#D5DEE7", display: "flex" }}>
          Siempre Hay Opción
        </div>
      </div>
    ),
    { ...size },
  );
}

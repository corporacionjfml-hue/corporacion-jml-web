import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import { company } from "@/data/company";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { UtilBar } from "@/components/layout/UtilBar";
import { WhatsAppBubble } from "@/components/layout/WhatsAppBubble";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${company.name} | Catálogo de cables eléctricos`,
  description: `Catálogo de cables eléctricos de ${company.name}. ${company.slogan}: elige el cable correcto y cotiza por WhatsApp.`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B3A5C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#contenido"
          className="skip-link fixed left-3 top-3 z-[70] rounded-md bg-navy px-4 py-3 font-semibold text-white"
        >
          Saltar al contenido
        </a>
        <UtilBar />
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}

import Script from "next/script";
import { gaId } from "@/data/company";

/** Loads GA4 only when NEXT_PUBLIC_GA_ID is set. Renders nothing otherwise. */
export function GoogleAnalytics() {
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});`}
      </Script>
    </>
  );
}

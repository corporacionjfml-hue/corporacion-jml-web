import { company } from "@/data/company";

/*
 * PROVISIONAL LOGO: this inline SVG is adapted from the mockup colors and
 * shapes. The real PNG/SVG is still pending from the client (only LOGO.pdf
 * was delivered). Replace the <svg> below when the asset arrives.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="185 128 340 320"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M190 213A79.5 79.5 0 0 1 349 213L318.1 213A48.6 48.6 0 0 0 220.9 213Z"
        fill="#0A3957"
      />
      <polygon
        points="388,156 300,329 301,332 366,365 369,364 403,296 364,275 418,170"
        fill="#0A3957"
      />
      <polygon points="285,356 268,386 367,443 384,413" fill="#A0C525" />
      <circle cx="479" cy="215" r="41" fill="#A0C525" />
    </svg>
  );
}

/** Brand mark + name + slogan. Sizes follow the design breakpoints (<420, default, >=480). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="block h-[38px] w-10 shrink-0 max-[419px]:h-8 max-[419px]:w-[34px] logo:h-[45px] logo:w-12" />
      <span className="flex flex-col gap-[3px] leading-none">
        <span className="whitespace-nowrap text-[15px] font-medium tracking-[0.8px] text-[#1d1d1b] max-[419px]:text-[13px] max-[419px]:tracking-[0.4px] logo:text-[18px] logo:tracking-[1.2px]">
          {company.name}
        </span>
        <span className="whitespace-nowrap text-[8.5px] tracking-[1.6px] text-ink-slogan max-[419px]:hidden logo:text-[10px] logo:tracking-[2.2px]">
          {company.slogan.toUpperCase()}
        </span>
      </span>
    </span>
  );
}

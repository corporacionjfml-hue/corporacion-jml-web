import type { SVGProps } from "react";

/** Path data per icon, drawn on a 24x24 grid with a 2px round stroke. */
const icons = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  whatsapp: (
    <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5L3 21zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2L9 8.5z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  /* Category icons */
  aerial: (
    <>
      <path d="M12 3v18M5 7h14M7 11h10M5 7l7 4 7-4" />
      <circle cx="5" cy="7" r="1" />
      <circle cx="19" cy="7" r="1" />
    </>
  ),
  tower: <path d="M7 22 12 2l5 20M9 14h6M10.2 9h3.6M3 6h18M5 6l7 5 7-5" />,
  underground: (
    <>
      <path d="M2 7h20M3 7l2-3M8 7l2-3M13 7l2-3M18 7l2-3" />
      <circle cx="7" cy="15" r="3" />
      <circle cx="17" cy="15" r="3" />
      <circle cx="12" cy="19" r="2" />
    </>
  ),
  plug: <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4" />,
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  /* Feature icons */
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  fire: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  wave: (
    <>
      <path d="M2 10c2.5-4 5-4 7.5 0s5 4 7.5 0 3.5-3 5-2" />
      <path d="M2 16c2.5-4 5-4 7.5 0s5 4 7.5 0 3.5-3 5-2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  drop: <path d="M12 2.7s-6 6.3-6 11a6 6 0 0 0 12 0c0-4.7-6-11-6-11z" />,
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z" />,
  thermometer: <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />,
  /* Assistant and steps */
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2" />
    </>
  ),
  industry: <path d="M2 21h20M4 21V11l5 3v-3l5 3V5h4v16" />,
  vehicle: (
    <>
      <path d="M5 17h14M3 17v-4l2-5h14l2 5v4" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  ground: <path d="M12 3v9M4 12h16M7 16h10M10 20h4" />,
  boxes: <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3zM3 7.5l9 4.5 9-4.5M12 12v9" />,
  bag: <path d="M5 8h14l-1 12H6L5 8zM9 8a3 3 0 0 1 6 0" />,
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  at: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </>
  ),
  tiktok: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
  pin: (
    <>
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  sheet: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3" />
    </>
  ),
} as const;

export type IconName = keyof typeof icons;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

/** Decorative inline SVG icon. Add new entries to `icons` as sections need them. */
export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {icons[name]}
    </svg>
  );
}

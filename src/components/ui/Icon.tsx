import type { SVGProps } from "react";

/** Path data per icon, drawn on a 24x24 grid with a 2px round stroke. */
const icons = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  whatsapp: (
    <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5L3 21zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2L9 8.5z" />
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

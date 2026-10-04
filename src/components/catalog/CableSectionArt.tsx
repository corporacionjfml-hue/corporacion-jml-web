/** Seven-strand conductor cross-section: navy sheath, white insulation ring, gray strands. */
const STRANDS: [number, number][] = [
  [46, 46],
  [54, 46],
  [50, 52.9],
  [42, 52.9],
  [38, 46],
  [42, 39.1],
  [50, 39.1],
];

export function CableSectionArt({
  fill,
  size = 92,
}: {
  fill: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 92 92"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="46" cy="46" r="42" fill="#1B3A5C" />
      <circle
        cx="46"
        cy="46"
        r="31"
        fill="#FFFFFF"
        stroke={fill}
        strokeWidth="4"
      />
      {STRANDS.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="3.9"
          fill="#C4CDD6"
          stroke="#7B8B9B"
          strokeWidth=".8"
        />
      ))}
    </svg>
  );
}

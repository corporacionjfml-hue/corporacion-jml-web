/** Three decorative cable cross-sections (navy sheath, white insulation, wire strands). */
const DISCS = [
  { cx: 280, cy: 200 },
  { cx: 192, cy: 352 },
  { cx: 368, cy: 352 },
] as const;

/** Strand centers: one central wire, a ring of 6 and a ring of 12. */
function strandPoints(cx: number, cy: number) {
  const points = [{ x: cx, y: cy }];
  const rings = [
    { radius: 19.2, count: 6 },
    { radius: 38.4, count: 12 },
  ];
  for (const { radius, count } of rings) {
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      points.push({
        x: Number((cx + radius * Math.cos(angle)).toFixed(1)),
        y: Number((cy + radius * Math.sin(angle)).toFixed(1)),
      });
    }
  }
  return points;
}

export function CableDiscs({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 560 560" aria-hidden="true" focusable="false">
      {DISCS.map(({ cx, cy }) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="96" fill="#1B3A5C" />
          <circle cx={cx} cy={cy} r="76.8" fill="#FFFFFF" stroke="#8DC63F" strokeWidth="4" />
          <circle cx={cx} cy={cy} r="59.5" fill="#E9EEF2" />
          {strandPoints(cx, cy).map((point) => (
            <circle
              key={`${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r="10"
              fill="#C4CDD6"
              stroke="#7B8B9B"
              strokeWidth="1"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

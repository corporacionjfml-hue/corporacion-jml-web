"use client";

import type { CSSProperties } from "react";
import { useCableSheet } from "@/components/catalog/CableSheetProvider";
import { Icon } from "@/components/ui/Icon";
import { cables } from "@/data/cables";

const na2xy = cables.find((cable) => cable.slug === "na2xy");

/*
 * Layer values and cotas below are copied from the approved mockup (NA2XY 3-1x120 mm²).
 * TODO(cliente): validate them against the NA2XY data table in src/data/cables.ts.
 */
const LAYERS = [
  { title: "Conductor", detail: "Aluminio trenzado compactado · 19/2.88 mm" },
  { title: "Aislamiento", detail: "Polietileno reticulado XLPE · 1.2 mm" },
  { title: "Cinta de encuadernación", detail: "Poliéster" },
  { title: "Cubierta exterior", detail: "PVC · 1.0 mm" },
] as const;

const GRID_BG: CSSProperties = {
  backgroundColor: "#1B3A5C",
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
  backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
};

const STROKE = "rgba(255,255,255,.55)";
/** Diagonal hatch of the polyester tape (x of each line start, 14px apart). */
const TAPE_LINES = Array.from({ length: 20 }, (_, i) => 412 + i * 14);
/** Curved strands of the stranded conductor. */
const STRANDS = Array.from({ length: 17 }, (_, i) => 790 + i * 16);
/** Numbered call-outs: x position of the badge and y where the leader line ends. */
const CALLOUTS = [
  { n: 1, x: 935, to: 152 },
  { n: 2, x: 750, to: 130 },
  { n: 3, x: 620, to: 116 },
  { n: 4, x: 320, to: 106 },
] as const;

function CableDrawing() {
  return (
    <svg
      viewBox="0 0 1100 380"
      width="100%"
      role="img"
      aria-labelledby="anatomy-title anatomy-desc"
      className="block"
    >
      <title id="anatomy-title">
        Anatomía del cable NA2XY: conductor de aluminio, aislamiento XLPE, cinta de poliéster y
        cubierta de PVC
      </title>
      <desc id="anatomy-desc">
        Dibujo longitudinal del cable con las capas numeradas del 1 al 4: conductor de aluminio
        trenzado, aislamiento XLPE, cinta de poliéster y cubierta de PVC. Cotas: diámetro con
        cubierta 17.4 mm y diámetro del conductor 13.0 mm.
      </desc>
      <defs>
        <clipPath id="anatomy-tape">
          <rect x="560" y="116" width="120" height="148" />
        </clipPath>
        <clipPath id="anatomy-cond">
          <rect x="820" y="152" width="230" height="76" rx="6" />
        </clipPath>
      </defs>
      <ellipse cx="80" cy="190" rx="26" ry="84" fill="#14304D" stroke={STROKE} strokeWidth="1.5" />
      <rect x="80" y="106" width="480" height="168" fill="#0F2236" stroke={STROKE} strokeWidth="1.5" />
      <path d="M80 106 H560 M80 274 H560" stroke={STROKE} strokeWidth="1.5" />
      <rect x="560" y="116" width="120" height="148" fill="#1B3A5C" stroke={STROKE} strokeWidth="1.5" />
      <g clipPath="url(#anatomy-tape)">
        {TAPE_LINES.map((x) => (
          <path key={x} d={`M${x} 264 L${x + 148} 116`} stroke="rgba(255,255,255,.28)" strokeWidth="1" />
        ))}
      </g>
      <rect
        x="680"
        y="130"
        width="140"
        height="120"
        rx="4"
        fill="rgba(141,198,63,.12)"
        stroke="#8DC63F"
        strokeWidth="2"
      />
      <rect
        x="820"
        y="152"
        width="230"
        height="76"
        rx="6"
        fill="rgba(255,255,255,.1)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      <g clipPath="url(#anatomy-cond)">
        {STRANDS.map((x) => (
          <path
            key={x}
            d={`M${x} 228 Q${x + 18} 190 ${x + 36} 152`}
            fill="none"
            stroke={STROKE}
            strokeWidth="1.2"
          />
        ))}
      </g>
      <g fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#FFFFFF">
        {CALLOUTS.map((callout) => (
          <g key={callout.n}>
            <circle cx={callout.x} cy="70" r="17" fill="#8DC63F" />
            <text x={callout.x} y="75" textAnchor="middle" fill="#14263A" fontWeight="600">
              {callout.n}
            </text>
            <path d={`M${callout.x} 87 V${callout.to}`} stroke="#8DC63F" strokeWidth="1.5" />
          </g>
        ))}
        <path d="M160 300 V330 M520 300 V330 M160 318 H520" stroke="rgba(255,255,255,.6)" strokeWidth="1" />
        <path d="M160 318 l10 -5 v10 z M520 318 l-10 -5 v10 z" fill="rgba(255,255,255,.8)" />
        <text x="340" y="346" textAnchor="middle" fill="#B9C7D4">
          Ø con cubierta 17.4 mm
        </text>
        <path d="M1070 152 H1090 M1070 228 H1090 M1082 152 V228" stroke="rgba(255,255,255,.6)" strokeWidth="1" />
        <text x="1060" y="266" textAnchor="end" fill="#B9C7D4">
          Ø cond. 13.0 mm
        </text>
      </g>
    </svg>
  );
}

export function AnatomySection() {
  const { open } = useCableSheet();

  return (
    <section
      id="anatomia"
      aria-label="Anatomía de un cable"
      className="relative scroll-mt-20 overflow-hidden py-[88px]"
      style={GRID_BG}
    >
      <div className="wrap flex flex-col gap-10">
        <div className="flex max-w-[780px] flex-col gap-3.5">
          <span className="kicker self-start text-lime">Anatomía · NA2XY 3-1x120 mm²</span>
          <h2 className="h2 text-white">Conoce lo que hay dentro de cada cable</h2>
          <p className="m-0 text-[18px] leading-[1.6] text-on-navy-3">
            Cada ficha detalla construcción, normas y datos por calibre. Así se ve un cable de
            distribución subterránea por dentro.
          </p>
        </div>

        <p className="mb-[-24px] mt-0 text-[13.5px] font-semibold text-on-navy-3 anatomy:hidden">
          Desliza el dibujo para verlo completo →
        </p>
        <div className="grid grid-cols-1 items-center gap-8 hero4:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0 rounded-xl border border-white/20 bg-[rgba(15,25,35,.25)]">
            <div
              role="region"
              aria-label="Dibujo del cable NA2XY, se desplaza horizontalmente"
              tabIndex={0}
              className="overflow-x-auto [scrollbar-width:thin]"
            >
              <div className="min-w-[660px] p-5">
                <CableDrawing />
              </div>
            </div>
          </div>

          <div>
            <ol className="m-0 flex list-none flex-col gap-1 p-0">
              {LAYERS.map((layer, index) => (
                <li
                  key={layer.title}
                  className="flex items-start gap-4 border-b border-white/14 py-3.5"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-full bg-lime font-mono font-semibold text-ink"
                  >
                    {index + 1}
                  </span>
                  <span className="flex flex-col gap-[3px]">
                    <span className="text-[18px] font-bold text-white">{layer.title}</span>
                    <span className="font-mono text-[13.5px] text-on-navy-3">{layer.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            {na2xy && (
              <div className="pt-4">
                <button type="button" className="btn btn-lime" onClick={() => open(na2xy.id)}>
                  Ver ficha {na2xy.name} <Icon name="arrow" size={16} strokeWidth={2.2} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

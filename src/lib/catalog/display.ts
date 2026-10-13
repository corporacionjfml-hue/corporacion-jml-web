import type { IconName } from "@/components/ui/Icon";
import type { Cable } from "@/data/types";

const GAUGE_FEATURE = /^rango de calibres:\s*/i;

/** Gauge range text when the data states one; undefined otherwise. */
export function getGaugeRange(cable: Cable): string | undefined {
  if (cable.gaugeRange) return cable.gaugeRange;
  const feature = cable.features.find((text) => GAUGE_FEATURE.test(text));
  return feature?.replace(GAUGE_FEATURE, "");
}

/** Value for the card's "Rango" row. */
export function getRangeLabel(cable: Cable): string {
  const range = getGaugeRange(cable);
  if (range) return range;
  return cable.variants.every((variant) => variant.tableStatus === "pending")
    ? "Calibres a pedido"
    : "Ver ficha";
}

/** Up to three short features for the card pills (long sentences stay in the sheet). */
export function getCardFeatures(cable: Cable): string[] {
  return cable.features
    .filter((text) => !GAUGE_FEATURE.test(text) && text.length <= 52)
    .slice(0, 3);
}

export function featureIcon(text: string): IconName {
  const t = text.toLowerCase();
  if (/halóg|halog/.test(t)) return "leaf";
  if (/incendi|llama|inflam|extingu|ignífug|retardan/.test(t)) return "fire";
  if (/humo/.test(t)) return "cloud";
  if (/flexib/.test(t)) return "wave";
  if (/intemperie|uv|solar|sol\b/.test(t)) return "sun";
  if (/agua|humedad|sumergi|hidr/.test(t)) return "drop";
  if (/temperatura|°c/.test(t)) return "thermometer";
  if (/resist|abrasi|mecánic|robust|blindaj|protec/.test(t)) return "shield";
  if (/corriente|tensión|eléctric|dieléctric|conduct/.test(t)) return "bolt";
  return "check";
}

export function applicationIcon(text: string): IconName {
  const t = text.toLowerCase();
  if (/aére|aereo|poste|distribución secundaria/.test(t)) return "aerial";
  if (/subterr|ducto|enterrad/.test(t)) return "underground";
  if (/soldadur|equipo|bomba|vehícul|automotr|industri/.test(t)) return "bolt";
  if (/interior|tablero|edific|vivienda|doméstic|residencial|comercial/.test(t))
    return "plug";
  if (/tierra|línea|transmisión/.test(t)) return "tower";
  return "check";
}

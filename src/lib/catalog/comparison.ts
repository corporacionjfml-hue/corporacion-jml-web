import type { Cable } from "@/data/types";
import { getRangeLabel } from "./display";

export const MISSING = "—";

export interface ComparisonRow {
  cable: Cable;
  voltage: string;
  operationTemp: string;
  shortCircuit: string;
  range: string;
  halogenFree: boolean;
  flexible: boolean;
  mainUse: string;
}

const HALOGEN_FREE = /libre de halógenos|libre de halogenos|\blszh\b|\blsoh\b/i;
const FLEXIBLE = /flexib/i;

/** Non-empty trimmed text or the "—" placeholder. Never invents data. */
function orMissing(value: string | undefined): string {
  const text = value?.trim();
  return text ? text : MISSING;
}

/** Derives the table cells from the catalog data; missing values show "—". */
export function toComparisonRow(cable: Cable): ComparisonRow {
  const searchable = [cable.name, cable.fullName, ...cable.features].join(" | ");
  return {
    cable,
    voltage: orMissing(cable.voltage),
    operationTemp: orMissing(cable.temperature?.operation),
    shortCircuit: orMissing(cable.temperature?.shortCircuit),
    range: orMissing(getRangeLabel(cable)),
    halogenFree: HALOGEN_FREE.test(searchable),
    flexible: cable.tags.priority.includes("flexibilidad") || FLEXIBLE.test(searchable),
    mainUse: orMissing(cable.applications.join("; ")),
  };
}

import type { QuantityUnit } from "@/data/types";

export interface QuantityRule {
  min: number;
  /** Largest accepted value (a multiple of `step`). */
  max: number;
  step: number;
  /** Quantity proposed when a cable is added without choosing one. */
  defaultValue: number;
  hint: string;
}

const RULES: Record<QuantityUnit, QuantityRule> = {
  rollos: {
    min: 1,
    max: 999,
    step: 1,
    defaultValue: 1,
    hint: "Cantidad en rollos (máximo 999)",
  },
  metros: {
    min: 100,
    // Largest multiple of 50 that is <= 99,999.
    max: 99950,
    step: 50,
    defaultValue: 100,
    hint: "Mínimo 100 metros, de 50 en 50 (máximo 99.950)",
  },
};

export function getQuantityRule(unit: QuantityUnit): QuantityRule {
  return RULES[unit];
}

export function defaultQuantity(unit: QuantityUnit): number {
  return RULES[unit].defaultValue;
}

/**
 * Forces a value into the valid set for the unit.
 * Rollos: integer 1..999. Metros: multiple of 50 in 100..99,950, rounded to the
 * nearest multiple (ties go up: 125 -> 150, 120 -> 100). Values above the
 * maximum are capped. Non-finite input falls back to the default.
 */
export function clampQuantity(value: number, unit: QuantityUnit): number {
  const { min, max, step, defaultValue } = RULES[unit];
  if (!Number.isFinite(value)) return defaultValue;
  const snapped = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, snapped));
}

export function isValidQuantity(value: unknown, unit: QuantityUnit): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    clampQuantity(value, unit) === value
  );
}

/** Next valid value after pressing "+" (direction 1) or "−" (direction -1). */
export function stepQuantity(value: number, unit: QuantityUnit, direction: 1 | -1): number {
  const { step } = RULES[unit];
  return clampQuantity(clampQuantity(value, unit) + direction * step, unit);
}

/** Parses free text typed by the user; returns NaN when it has no digits. */
export function parseQuantityInput(text: string): number {
  const digits = text.replace(/\D/g, "");
  return digits === "" ? Number.NaN : Number(digits);
}

import type { QuantityUnit } from "@/data/types";

export interface QuantityRule {
  min: number;
  step: number;
  /** Quantity proposed when a cable is added without choosing one. */
  defaultValue: number;
  hint: string;
}

const RULES: Record<QuantityUnit, QuantityRule> = {
  rollos: { min: 1, step: 1, defaultValue: 1, hint: "Cantidad en rollos" },
  metros: {
    min: 100,
    step: 50,
    defaultValue: 100,
    hint: "Mínimo 100 metros, de 50 en 50",
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
 * Rollos: integer >= 1. Metros: multiple of 50 >= 100, rounded to the nearest
 * multiple (ties go up: 125 -> 150, 120 -> 100). Non-finite input falls back
 * to the default.
 */
export function clampQuantity(value: number, unit: QuantityUnit): number {
  const { min, step, defaultValue } = RULES[unit];
  if (!Number.isFinite(value)) return defaultValue;
  const snapped = Math.round(value / step) * step;
  return Math.max(min, snapped);
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

import { cables } from "@/data/cables";
import type { Cable } from "@/data/types";

const byId = new Map<string, Cable>(cables.map((cable) => [cable.id, cable]));

export function findCable(cableId: string): Cable | undefined {
  return byId.get(cableId);
}

export type CategoryId =
  | "autosoportados"
  | "conductores-aluminio"
  | "distribucion-subterranea"
  | "baja-tension"
  | "especiales";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

/** Unit used by the "+ Cotizar" quantity selector. */
export type QuantityUnit = "rollos" | "metros";

/** Where the cable is installed (assistant question 2). */
export type InstallationTag =
  | "aerea"
  | "subterranea"
  | "interior"
  | "industrial"
  | "domestico"
  | "vehiculos"
  | "tierra"
  | "bombas"
  | "soldadura";

/** What matters most (assistant question 3). */
export type PriorityTag =
  | "seguridad-incendio"
  | "flexibilidad"
  | "intemperie"
  | "resistencia-mecanica"
  | "alta-corriente"
  | "uso-general";

export interface AssistantTags {
  installation: InstallationTag[];
  priority: PriorityTag[];
}

export interface Temperatures {
  operation?: string;
  emergency?: string;
  shortCircuit?: string;
}

/** Cells are aligned with `columns`; `null` renders as "—". */
export interface SpecTable {
  columns: string[];
  rows: (string | null)[][];
}

/** Either a table is available, or the detail page shows "Calibres a pedido". */
export type VariantTable =
  | { tableStatus: "available"; table: SpecTable }
  | { tableStatus: "pending" };

export type CableVariant = {
  id: string;
  /** Tab label. */
  label: string;
  description?: string;
  applications?: string[];
  notes?: string[];
} & VariantTable;

export interface Cable {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  categoryId: CategoryId;
  image?: string;
  description: string;
  standards: string[];
  certificates?: string[];
  manufacturer?: string;
  voltage?: string;
  temperature?: Temperatures;
  construction: string[];
  applications: string[];
  features: string[];
  /** Available gauge range stated by the catalog, when different from the table. */
  gaugeRange?: string;
  tags: AssistantTags;
  unit: QuantityUnit;
  /** Always at least one. Render tabs only when there is more than one. */
  variants: [CableVariant, ...CableVariant[]];
}

import { company, whatsappUrl } from "@/data/company";
import { findCable } from "./catalog";
import { formatQuantity } from "./message";
import type { BuyerType, QuoteItem } from "./types";

export interface CallbackValues {
  name: string;
  company: string;
  phone: string;
  email: string;
  details: string;
}

export type CallbackField = "name" | "phone" | "email";
export type CallbackErrors = Partial<Record<CallbackField, string>>;

export const EMPTY_CALLBACK: CallbackValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
  details: "",
};

/**
 * Returns the 9-digit Peruvian mobile number (starts with 9), tolerating
 * spaces, dashes, dots, parentheses and a +51 / 51 prefix. Null when invalid.
 */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("51")) digits = digits.slice(2);
  return /^9\d{8}$/.test(digits) ? digits : null;
}

/** "948271308" -> "948 271 308". */
export function formatPhone(digits: string): string {
  return digits.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCallback(values: CallbackValues): CallbackErrors {
  const errors: CallbackErrors = {};
  if (values.name.trim().length < 2) errors.name = "Escribe tu nombre.";
  if (values.phone.trim() === "") {
    errors.phone = "Escribe tu teléfono.";
  } else if (!normalizePhone(values.phone)) {
    errors.phone = "Usa un celular de 9 dígitos que empiece con 9. Ej.: 948 271 308.";
  }
  if (values.email.trim() !== "" && !EMAIL.test(values.email.trim())) {
    errors.email = "Revisa el correo. Ej.: tu@empresa.com.";
  }
  return errors;
}

/** One line per cable: "NA2XY: 100 metros". */
export function describeItems(items: QuoteItem[]): string[] {
  return items.map((item) => `${findCable(item.cableId)?.name ?? item.cableId}: ${formatQuantity(item)}`);
}

const BUYER_LABEL: Record<BuyerType, string> = {
  mayorista: "Mayorista",
  minorista: "Minorista",
};

/** WhatsApp text used as the fallback delivery channel of the contact form. */
export function buildCallbackMessage(
  values: CallbackValues,
  items: QuoteItem[],
  buyerType: BuyerType | null,
): string {
  const phone = normalizePhone(values.phone);
  const lines = [`Hola ${company.name}, quisiera que me llamen para cotizar.`, ""];
  lines.push(`Nombre: ${values.name.trim()}`);
  if (values.company.trim()) lines.push(`Empresa: ${values.company.trim()}`);
  lines.push(`Teléfono: ${phone ? formatPhone(phone) : values.phone.trim()}`);
  if (values.email.trim()) lines.push(`Correo: ${values.email.trim()}`);
  if (buyerType) lines.push(`Tipo de compra: ${BUYER_LABEL[buyerType]}`);
  if (items.length > 0) lines.push("Cables:", ...describeItems(items).map((line) => `- ${line}`));
  if (values.details.trim()) lines.push(`Detalle: ${values.details.trim()}`);
  return lines.join("\n");
}

export function buildCallbackUrl(
  values: CallbackValues,
  items: QuoteItem[],
  buyerType: BuyerType | null,
): string {
  return whatsappUrl(company.quotesWhatsApp, buildCallbackMessage(values, items, buyerType));
}

/** JSON body for the configurable form endpoint (Web3Forms / Formspree compatible). */
export function buildCallbackPayload(
  values: CallbackValues,
  items: QuoteItem[],
  buyerType: BuyerType | null,
  accessKey: string,
): Record<string, string> {
  const phone = normalizePhone(values.phone);
  const payload: Record<string, string> = {
    subject: `Solicitud de llamada — ${company.name}`,
    from_name: values.name.trim(),
    name: values.name.trim(),
    company: values.company.trim(),
    phone: phone ? formatPhone(phone) : values.phone.trim(),
    email: values.email.trim(),
    buyer_type: buyerType ? BUYER_LABEL[buyerType] : "",
    cables: describeItems(items).join("\n"),
    message: values.details.trim(),
  };
  if (accessKey) payload.access_key = accessKey;
  return payload;
}

export interface CompanyPhone {
  display: string;
  /** Digits with country code, for wa.me links. */
  whatsapp: string;
}

export const company = {
  name: "CORPORACION J & F SAC",
  slogan: "Siempre Hay Opción",
  ruc: "20614708002",
  address: "Av. Manuel del Valle 1523, Lima-Lurín",
  phones: [
    { display: "948 271 308", whatsapp: "51948271308" },
    { display: "923 441 594", whatsapp: "51923441594" },
  ] satisfies CompanyPhone[],
  email: "corporacionj@gmail.com",
  social: {
    handle: "@CorporacionJML",
    pendingConfirmation: true,
  },
  /** Quotes are always sent to this WhatsApp number. */
  quotesWhatsApp: "51948271308",
} as const;

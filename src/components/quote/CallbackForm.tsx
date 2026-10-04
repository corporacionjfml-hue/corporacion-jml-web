"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { company, whatsappUrl } from "@/data/company";
import {
  buildCallbackPayload,
  buildCallbackUrl,
  describeItems,
  EMPTY_CALLBACK,
  validateCallback,
  type CallbackErrors,
  type CallbackField,
  type CallbackValues,
} from "@/lib/quote/callback";
import { useQuote } from "./QuoteProvider";

type Status = "idle" | "sending" | "sent" | "whatsapp" | "failed";

const REQUEST_TIMEOUT_MS = 12000;
const FIELD_ORDER: CallbackField[] = ["name", "phone", "email"];

/** Posts JSON to the configured endpoint. Resolves true only on a confirmed success. */
async function postToEndpoint(endpoint: string, body: Record<string, string>): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const data: unknown = await response.json().catch(() => null);
    // Web3Forms answers { success }, Formspree { ok }: only an explicit false is a failure.
    const flags = (data ?? {}) as { success?: unknown; ok?: unknown };
    return flags.success !== false && flags.ok !== false;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Opens WhatsApp in a new tab. Only call it synchronously inside the submit
 * event (before any await); popup blockers may still refuse it, so the UI
 * always keeps a visible link too.
 */
function openWhatsApp(url: string) {
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    // The visible WhatsApp link is the fallback.
  }
}

export function CallbackForm() {
  const { items, buyerType } = useQuote();
  const uid = useId();
  const [values, setValues] = useState<CallbackValues>(EMPTY_CALLBACK);
  const [errors, setErrors] = useState<CallbackErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState(() => whatsappUrl(company.quotesWhatsApp));
  const honeypot = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const id = (field: string) => `${uid}-${field}`;
  const errorId = (field: CallbackField) => `${uid}-${field}-error`;
  const update = (field: keyof CallbackValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const focusResult = () => window.setTimeout(() => resultRef.current?.focus(), 0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const found = validateCallback(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(firstInvalid))}`)?.focus();
      return;
    }

    // Spam bots fill the hidden field: pretend success and send nothing.
    if (honeypot.current?.value) {
      setStatus("sent");
      focusResult();
      return;
    }

    const url = buildCallbackUrl(values, items, buyerType);
    setWaUrl(url);
    const { endpoint, accessKey } = company.form;

    if (!endpoint) {
      // Not configured yet: open WhatsApp inside the click so popup blockers allow it.
      openWhatsApp(url);
      setStatus("whatsapp");
      focusResult();
      return;
    }

    setStatus("sending");
    const delivered = await postToEndpoint(
      endpoint,
      buildCallbackPayload(values, items, buyerType, accessKey),
    );
    if (delivered) {
      setStatus("sent");
    } else {
      // No window.open after an await (popup blockers): the result view offers a tap target.
      setStatus("failed");
    }
    focusResult();
  }

  function reset() {
    setValues(EMPTY_CALLBACK);
    setErrors({});
    setWaUrl(whatsappUrl(company.quotesWhatsApp));
    setStatus("idle");
  }

  if (status === "sent" || status === "whatsapp" || status === "failed") {
    const copy = {
      sent: {
        title: "¡Solicitud recibida!",
        text: `Un asesor de ${company.name} se comunicará contigo. Si es urgente, escríbenos por WhatsApp.`,
      },
      whatsapp: {
        title: "Continúa en WhatsApp",
        text: `Abrimos WhatsApp con tus datos. Envía el mensaje para que un asesor de ${company.name} se comunique contigo. Si no se abrió, usa el botón.`,
      },
      failed: {
        title: "No pudimos enviar tu solicitud",
        text: "Hubo un problema de conexión. Envía tus datos por WhatsApp con el botón y un asesor te atenderá.",
      },
    }[status];
    return (
      <div className="flex flex-col items-start gap-3.5 px-1 py-3">
        <span
          aria-hidden="true"
          className={`inline-flex size-14 items-center justify-center rounded-xl ${
            status === "failed" ? "bg-[#FDE6DE] text-danger" : "bg-lime-soft text-lime-dark"
          }`}
        >
          <Icon name={status === "failed" ? "whatsapp" : "check"} size={26} strokeWidth={2.6} />
        </span>
        <div role="status">
          <h3
            ref={resultRef}
            tabIndex={-1}
            className="m-0 text-[26px] font-extrabold leading-tight text-ink outline-none"
          >
            {copy.title}
          </h3>
          <p className="mb-0 mt-3.5 leading-[1.6] text-mute">{copy.text}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lime">
            <Icon name="whatsapp" size={18} />
            Escribir por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          <button type="button" className="btn btn-line" onClick={reset}>
            Enviar otra
          </button>
        </div>
      </div>
    );
  }

  const fieldProps = (field: CallbackField) => ({
    "aria-invalid": errors[field] ? (true as const) : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });
  const errorText = (field: CallbackField) =>
    errors[field] ? (
      <p id={errorId(field)} className="m-0 mt-1.5 text-[13.5px] font-medium text-danger">
        {errors[field]}
      </p>
    ) : null;
  const errorCount = FIELD_ORDER.filter((field) => errors[field]).length;
  const busy = status === "sending";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-busy={busy}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-1 sm:col-span-2">
        <h3 className="m-0 text-[20px] font-extrabold text-ink">¿Prefieres que te llamemos?</h3>
        <p className="m-0 text-[14px] text-mute">Déjanos tus datos y un asesor te contacta.</p>
      </div>

      <div role="alert" className={errorCount ? "sm:col-span-2" : "sr-only"}>
        {errorCount > 0 && (
          <p className="m-0 rounded-md bg-[#FDE6DE] px-3.5 py-2.5 text-[14px] font-semibold text-danger">
            {errorCount === 1 ? "Revisa 1 campo marcado." : `Revisa ${errorCount} campos marcados.`}
          </p>
        )}
      </div>

      <div>
        <label className="lbl" htmlFor={id("name")}>
          Nombre <span aria-hidden="true">*</span>
          <span className="sr-only"> (obligatorio)</span>
        </label>
        <input
          id={id("name")}
          className="field"
          name="name"
          autoComplete="name"
          required
          placeholder="Tu nombre"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          {...fieldProps("name")}
        />
        {errorText("name")}
      </div>
      <div>
        <label className="lbl" htmlFor={id("company")}>
          Empresa
        </label>
        <input
          id={id("company")}
          className="field"
          name="company"
          autoComplete="organization"
          placeholder="Opcional"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>
      <div>
        <label className="lbl" htmlFor={id("phone")}>
          Teléfono <span aria-hidden="true">*</span>
          <span className="sr-only"> (obligatorio)</span>
        </label>
        <input
          id={id("phone")}
          className="field"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="9XX XXX XXX"
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          {...fieldProps("phone")}
        />
        {errorText("phone")}
      </div>
      <div>
        <label className="lbl" htmlFor={id("email")}>
          Correo
        </label>
        <input
          id={id("email")}
          className="field"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@empresa.com"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          {...fieldProps("email")}
        />
        {errorText("email")}
      </div>

      {items.length > 0 && (
        <div className="rounded-md bg-lime-soft px-3.5 py-3 text-[14px] text-lime-deep sm:col-span-2">
          <strong>Cables en tu lista:</strong> {describeItems(items).join(" · ")}
        </div>
      )}

      <div className="sm:col-span-2">
        <label className="lbl" htmlFor={id("details")}>
          Calibre, metraje y detalles
        </label>
        <textarea
          id={id("details")}
          className="field resize-y"
          name="details"
          rows={4}
          placeholder="Ej.: 200 m de N2XOH 1x16 mm² para obra en Amarilis"
          value={values.details}
          onChange={(e) => update("details", e.target.value)}
        />
      </div>

      {/* Honeypot: invisible to people and assistive tech, bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("hp")}>No completar este campo</label>
        <input
          id={id("hp")}
          ref={honeypot}
          name="hp_field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="btn btn-navy btn-lg w-full text-[17px] disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? "Enviando…" : "Solicitar cotización"}
          {!busy && <Icon name="arrow" size={16} strokeWidth={2.2} />}
        </button>
        <p className="sr-only" role="status">
          {busy ? "Enviando tu solicitud" : ""}
        </p>
      </div>
    </form>
  );
}

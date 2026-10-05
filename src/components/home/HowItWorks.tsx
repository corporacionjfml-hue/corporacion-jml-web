import { Icon, type IconName } from "@/components/ui/Icon";

const steps: { number: string; icon: IconName; title: string; text: string }[] = [
  {
    number: "01",
    icon: "building",
    title: "Cuéntanos tu instalación",
    text: "Responde tres preguntas en el asistente y te mostramos los cables que sirven para tu obra.",
  },
  {
    number: "02",
    icon: "sheet",
    title: "Revisa la ficha técnica",
    text: "Tensión, temperatura, normas y tablas de calibres de cada cable, en tu celular.",
  },
  {
    number: "03",
    icon: "bolt",
    title: "Recibe tu cotización",
    text: "Agrega los cables a tu lista y envíala por WhatsApp. Te respondemos con tu cotización y disponibilidad.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="como-funciona-titulo" className="pb-6 pt-[88px]">
      <div className="wrap flex flex-col gap-9">
        <div className="flex max-w-[780px] flex-col gap-3.5">
          <span className="kicker self-start">Cómo funciona</span>
          <h2 id="como-funciona-titulo" className="h2">
            De la duda a la cotización en 3 pasos
          </h2>
          <p className="m-0 text-[18px] leading-[1.6] text-mute">
            Te guiamos para que elijas bien y pidas tu cotización sin perder tiempo.
          </p>
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 band:grid-cols-3 band:gap-6">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col gap-3.5 rounded-tile border border-line bg-white p-[26px] transition-[translate,box-shadow] duration-300 hover:shadow-tile-hover motion-safe:hover:-translate-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="font-mono text-[52px] font-semibold leading-none text-lime"
                >
                  {step.number}
                </span>
                <span className="inline-flex size-[52px] items-center justify-center rounded-lg bg-navy text-lime">
                  <Icon name={step.icon} size={26} strokeWidth={1.8} />
                </span>
              </div>
              <h3 className="m-0 text-[22px] font-extrabold tracking-[-0.3px] text-ink">
                <span className="sr-only">Paso {step.number}: </span>
                {step.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.55] text-mute">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

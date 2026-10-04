import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { company } from "@/data/company";
import { QuoteDevButtons } from "./QuoteDevButtons";

/** Temporary home: proves tokens, fonts and primitives render. Replaced by T2+. */
export default function Home() {
  return (
    <div className="wrap flex flex-col items-start gap-6 py-14">
      <Logo />
      <span className="kicker">Catálogo técnico</span>
      <h1 className="h1">
        Cables eléctricos de alta calidad{" "}
        <span className="mark">para cada proyecto</span>
      </h1>
      <p className="max-w-xl text-lg leading-[1.6] text-mute">
        {company.slogan}.
      </p>
      <div className="flex flex-wrap gap-3">
        <a href="#catalogo" className="btn btn-navy btn-lg">
          Ver catálogo <Icon name="arrow" />
        </a>
        <a href="#cotizar" className="btn btn-lime btn-lg">
          <Icon name="whatsapp" /> Cotiza por WhatsApp
        </a>
        <a href="#asistente" className="btn btn-line btn-lg">
          Usar el asistente
        </a>
      </div>
      {/* TODO(T4): remove with QuoteDevButtons */}
      <QuoteDevButtons />
      <input
        className="field max-w-sm"
        placeholder="Campo de ejemplo"
        aria-label="Campo de ejemplo"
      />
    </div>
  );
}

import { Icon } from "@/components/ui/Icon";
import { cables } from "@/data/cables";

function Names({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`m-0 flex list-none items-center p-0${hidden ? "marquee-dup" : ""}`}
    >
      {cables.map((cable, index) => (
        <li key={cable.id} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="mx-7 inline-flex text-lime">
              <Icon name="bolt" size={22} />
            </span>
          )}
          <span className="whitespace-nowrap">{cable.name}</span>
        </li>
      ))}
      {/* Closing separator so the duplicated block joins seamlessly. */}
      <li aria-hidden="true" className="mx-7 inline-flex text-lime">
        <Icon name="bolt" size={22} />
      </li>
    </ul>
  );
}

/** Product-line names scrolling on a navy band; static and scrollable with reduced motion. */
export function Marquee() {
  return (
    <section
      aria-label="Líneas de producto"
      className="marquee-band overflow-hidden border-t-4 border-lime bg-navy"
    >
      <div className="marquee flex w-max items-center py-[22px] text-[clamp(22px,3vw,34px)] font-extrabold tracking-[-0.3px] text-white">
        <Names />
        <Names hidden />
      </div>
    </section>
  );
}

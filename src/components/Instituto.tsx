import Image from "next/image";

import { CONOCENOS, INSTITUTO, MISION, OFICIAL, VISION } from "@/data/itca";
import Reveal from "./Reveal";

/** Quienes somos: presentacion, mision, vision y direccion general. */
export default function Instituto() {
  return (
    <section id="instituto" className="scroll-mt-20 border-b border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20 lg:px-8">
        <div>
          <Reveal>
            <p className="meta text-accent">El Instituto</p>
            <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
              Quiénes somos
            </h2>
            <div className="mt-8 max-w-2xl space-y-5 text-[1.0625rem] leading-[1.7]">
              {CONOCENOS.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              ["Misión", MISION],
              ["Visión", VISION],
            ].map(([titulo, texto], i) => (
              <Reveal key={titulo} delay={i * 80}>
                <div className="h-full rounded-lg border border-line bg-surface p-7 sm:p-8">
                  <h3 className="title-display text-2xl">{titulo}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{texto}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <a
              href={`${OFICIAL}/decreto-de-creacion-del-itca/`}
              target="_blank"
              rel="noopener"
              className="meta mt-8 inline-flex min-h-11 items-center text-accent transition-opacity hover:opacity-70"
            >
              Decreto de creación del ITCA
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:pt-24">
          <figure className="overflow-hidden rounded-lg border border-line bg-surface lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] bg-bone">
              <Image
                src="/img/itca/director-general.webp"
                alt={`${INSTITUTO.director.nombre}, ${INSTITUTO.director.cargo.toLowerCase()} del ITCA, frente a un mural rojo.`}
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="p-6">
              <p className="meta text-muted">{INSTITUTO.director.cargo}</p>
              <p className="title-display mt-2 text-2xl">{INSTITUTO.director.nombre}</p>
              <p className="mt-1 text-sm text-muted">{INSTITUTO.nombre}</p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

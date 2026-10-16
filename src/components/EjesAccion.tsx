import Image from "next/image";
import Link from "next/link";

import { EJES, OFICIAL } from "@/data/itca";
import Reveal from "./Reveal";

/** Los cuatro ejes de accion: que hace cada direccion y con que programas. */
export default function EjesAccion() {
  return (
    <section id="ejes" className="scroll-mt-20 border-b border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="meta text-accent">Ejes de acción</p>
            <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
              Cuatro frentes de trabajo
            </h2>
          </div>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {EJES.map((eje, i) => (
            <Reveal as="li" key={eje.slug} delay={(i % 2) * 80}>
              <article className="grid h-full overflow-hidden rounded-lg border border-line bg-bone sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <div className="relative aspect-[4/3] border-b border-line sm:aspect-auto sm:border-r sm:border-b-0">
                  <Image
                    src={`/img/itca/ejes/${eje.slug}.webp`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 100vw"
                    className="object-cover [filter:saturate(0.85)]"
                  />
                </div>
                <div className="flex flex-col p-7">
                  <p className="meta text-muted">0{i + 1}</p>
                  <h3 className="title-display mt-3 text-2xl leading-tight">{eje.nombre}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{eje.descripcion}</p>
                  <ul className="mt-5 space-y-2 border-t border-line pt-5">
                    {eje.programas.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-snug">
                        <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-x-6 pt-6">
                    {eje.interno ? (
                      <Link
                        href={eje.interno.href}
                        className="meta inline-flex min-h-11 items-center text-accent transition-opacity hover:opacity-70"
                      >
                        {eje.interno.etiqueta}
                      </Link>
                    ) : null}
                    <a
                      href={`${OFICIAL}/${eje.slug}/`}
                      target="_blank"
                      rel="noopener"
                      className="meta inline-flex min-h-11 items-center text-muted transition-colors hover:text-charcoal"
                    >
                      Más información
                      <span className="sr-only"> sobre {eje.nombre} (se abre en otra pestaña)</span>
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

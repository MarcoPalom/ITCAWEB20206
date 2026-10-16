"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { COMUNICADOS, SALA_DE_PRENSA, TEMAS, type Comunicado, type Tema } from "@/data/itca";
import Reveal from "./Reveal";

const formatoFecha = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fecha = (c: Comunicado) => formatoFecha.format(new Date(`${c.fecha}T12:00:00`));

/**
 * Sala de prensa del Instituto. Cada nota abre el boletin completo en el
 * sitio oficial: aqui va la entrada, la foto y el dato de lugar y fecha, que
 * es lo que hace falta para decidir si se quiere leer.
 *
 * Sin filtro, la nota mas reciente va destacada a todo lo ancho y el resto en
 * rejilla; con filtro todas van iguales, porque la primera de un tema no es
 * necesariamente la mas importante.
 */
export default function Comunicados() {
  const [tema, setTema] = useState<Tema | null>(null);

  const visibles = useMemo(
    () => (tema ? COMUNICADOS.filter((c) => c.tema === tema) : COMUNICADOS),
    [tema],
  );
  const [destacado, ...resto] = visibles;
  const conDestacado = tema === null;
  const enRejilla = conDestacado ? resto : visibles;

  return (
    <section id="comunicados" className="scroll-mt-20 border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="meta text-accent">Comunicados</p>
              <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
                Lo que está pasando
              </h2>
            </div>

            <div role="group" aria-label="Filtrar comunicados por tema" className="flex flex-wrap gap-2">
              {[null, ...TEMAS].map((t) => {
                const activo = tema === t;
                return (
                  <button
                    key={t ?? "todos"}
                    onClick={() => setTema(t)}
                    aria-pressed={activo}
                    className={`meta min-h-11 rounded-full px-4 transition-colors ${
                      activo
                        ? "bg-charcoal text-white"
                        : "border border-line bg-surface text-muted hover:border-charcoal hover:text-charcoal"
                    }`}
                  >
                    {t ?? "Todos"}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <p aria-live="polite" className="meta mt-8 text-muted">
          {visibles.length} {visibles.length === 1 ? "comunicado" : "comunicados"}
          {tema ? ` de ${tema.toLowerCase()}` : ""}
        </p>

        {conDestacado && destacado ? (
          <Reveal className="mt-6">
            <a
              href={destacado.url}
              target="_blank"
              rel="noopener"
              className="group grid overflow-hidden rounded-lg border border-line bg-surface transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
            >
              <div className="relative aspect-[3/2] border-b border-line bg-bone lg:aspect-auto lg:min-h-[26rem] lg:border-r lg:border-b-0">
                <Image
                  src={`/img/itca/notas/${destacado.clave}.webp`}
                  alt={destacado.foto.alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-7 sm:p-10">
                <p className="meta text-accent">{destacado.tema}</p>
                <h3 className="title-display mt-4 text-[clamp(1.6rem,3vw,2.25rem)] font-light leading-tight transition-colors group-hover:text-accent">
                  {destacado.titulo}
                </h3>
                <p className="mt-5 flex-1 leading-relaxed text-muted">{destacado.entrada}</p>
                <div className="meta mt-8 flex items-center justify-between border-t border-line pt-4 text-muted">
                  <time dateTime={destacado.fecha}>{fecha(destacado)}</time>
                  <span>{destacado.sede}</span>
                </div>
                <span className="sr-only">(abre el boletín en el sitio oficial, en otra pestaña)</span>
              </div>
            </a>
          </Reveal>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enRejilla.map((c, i) => (
            <Reveal key={c.clave} delay={(i % 3) * 80}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener"
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <div className="relative aspect-[3/2] border-b border-line bg-bone">
                  <Image
                    src={`/img/itca/notas/${c.clave}.webp`}
                    alt={c.foto.alt}
                    fill
                    sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="meta text-accent">{c.tema}</p>
                  <h3 className="title-display mt-3 text-xl font-light leading-snug transition-colors group-hover:text-accent">
                    {c.titulo}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.entrada}</p>
                  <div className="meta mt-6 flex items-center justify-between border-t border-line pt-4 text-muted">
                    <time dateTime={c.fecha}>{fecha(c)}</time>
                    <span>{c.sede}</span>
                  </div>
                  <span className="sr-only">(abre el boletín en el sitio oficial, en otra pestaña)</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={SALA_DE_PRENSA}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center rounded-md border border-line bg-surface px-6 text-sm text-charcoal transition-colors hover:border-charcoal active:scale-[0.98]"
          >
            Todos los boletines en la sala de prensa
          </a>
        </div>
      </div>
    </section>
  );
}

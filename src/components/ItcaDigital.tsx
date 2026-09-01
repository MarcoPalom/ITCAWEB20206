"use client";

import { useRef } from "react";
import Reveal from "./Reveal";

const ITEMS = [
  {
    titulo: "Podcast",
    formato: "Audio y video",
    desc: "Conversaciones con creadores y gestores culturales del Estado. Episodios nuevos cada quincena en YouTube y Spotify.",
  },
  {
    titulo: "Revista digital",
    formato: "Publicacion",
    desc: "Ensayo, cronica y critica sobre la vida cultural tamaulipeca. Descarga en PDF o consulta en linea.",
  },
  {
    titulo: "Repositorio cultural",
    formato: "Archivo",
    desc: "Fotografia y video de Por los Municipios, Solana, el Encuentro de Cine y Dia de Muertos.",
  },
  {
    titulo: "Charlas ITCA",
    formato: "Video",
    desc: "Platicas y mesas de trabajo grabadas en las sedes del Instituto, disponibles en abierto.",
  },
];

export default function ItcaDigital() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const desplazar = (dir: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: dir * scroller.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="itca-digital" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="meta text-accent">ITCA Digital</p>
              <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
                Lo que publicamos
              </h2>
            </div>

            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => desplazar(-1)}
                aria-label="Ver anteriores"
                className="flex h-11 w-11 items-center justify-center rounded border border-line bg-surface text-charcoal transition-colors hover:border-charcoal"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
              <button
                onClick={() => desplazar(1)}
                aria-label="Ver siguientes"
                className="flex h-11 w-11 items-center justify-center rounded border border-line bg-surface text-charcoal transition-colors hover:border-charcoal"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scrollerRef}
          /* overflow-y explicito: con overflow-x:auto el eje vertical pasa de
             visible a auto y el contenedor secuestra la rueda del raton. */
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.titulo}
              delay={i * 80}
              className="w-[19rem] shrink-0 snap-start sm:w-[22rem]"
            >
              <article className="flex h-full flex-col rounded-lg border border-line bg-surface transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex h-44 items-center justify-center border-b border-line bg-bone">
                  <span className="meta text-muted">Imagen pendiente</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="meta text-muted">{item.formato}</p>
                  <h3 className="title-display mt-3 text-2xl font-light">
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                  <a
                    href="#"
                    className="meta mt-6 inline-block text-accent transition-opacity hover:opacity-70"
                  >
                    Ver mas
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

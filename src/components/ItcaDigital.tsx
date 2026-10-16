"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { OFICIAL, SALA_DE_PRENSA } from "@/data/itca";
import Reveal from "./Reveal";

type Plataforma = {
  titulo: string;
  formato: string;
  desc: string;
  href: string;
  externo?: boolean;
  /** Fotografia, o portadas en abanico para la biblioteca. */
  imagen?: { src: string; alt: string };
  portadas?: string[];
};

const PLATAFORMAS: Plataforma[] = [
  {
    titulo: "Festival del Seno Mexicano",
    formato: "Festival",
    desc: "El programa de la edición 2026 por compañía y por municipio: 43 municipios, más de 1,200 artistas y entrada libre.",
    href: "/festival",
    imagen: {
      src: "/img/itca/notas/ica-035-2026.webp",
      alt: "Bailarines de ballet folclórico con faldas rojas en movimiento.",
    },
  },
  {
    titulo: "Biblioteca Virtual",
    formato: "Publicaciones",
    desc: "Los libros del Fondo Editorial Tamaulipas, completos, para leer en línea o descargar.",
    href: "/bibliotecavirtual",
    portadas: ["quinta-esencia", "akbal", "las-mujeres-zurdas-bailan-suelto"],
  },
  {
    titulo: "Sala de prensa",
    formato: "Comunicados",
    desc: "Boletines oficiales del Instituto sobre festivales, encuentros, convocatorias y actividades en los recintos.",
    href: SALA_DE_PRENSA,
    externo: true,
    imagen: {
      src: "/img/itca/notas/ica-034-2026.webp",
      alt: "Elenco saludando al público al final de una función de teatro.",
    },
  },
  {
    titulo: "Agenda cultural",
    formato: "Cartelera",
    desc: "Funciones, exposiciones y talleres de los recintos del Instituto en todo el Estado.",
    href: `${OFICIAL}/agendacultural/`,
    externo: true,
    imagen: {
      src: "/img/itca/unidades/centro-cultural-tamaulipas.webp",
      alt: "Fachada del Centro Cultural Tamaulipas.",
    },
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
          {PLATAFORMAS.map((p, i) => {
            const contenido = (
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow duration-200 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="relative h-44 overflow-hidden border-b border-line bg-bone">
                  {p.imagen ? (
                    <Image
                      src={p.imagen.src}
                      alt={p.imagen.alt}
                      fill
                      sizes="(min-width: 640px) 22rem, 19rem"
                      className="object-cover [filter:saturate(0.85)]"
                    />
                  ) : null}
                  {p.portadas ? (
                    <div aria-hidden="true" className="flex h-full items-end justify-center gap-3 px-6 pt-6">
                      {p.portadas.map((slug, k) => (
                        <Image
                          key={slug}
                          src={`/biblioteca/portadas/${slug}.webp`}
                          alt=""
                          width={120}
                          height={180}
                          sizes="96px"
                          className="h-auto w-24 rounded-[2px] border border-line"
                          style={{ transform: `translateY(${[18, 6, 22][k]}px)` }}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="meta text-muted">{p.formato}</p>
                  <h3 className="title-display mt-3 text-2xl font-light">{p.titulo}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.desc}</p>
                  <span className="meta mt-6 inline-block text-accent transition-opacity group-hover:opacity-70">
                    {p.externo ? "Ir al sitio oficial" : "Entrar"}
                    {p.externo ? <span className="sr-only"> (se abre en otra pestaña)</span> : null}
                  </span>
                </div>
              </article>
            );
            return (
              <Reveal
                key={p.titulo}
                delay={i * 80}
                className="w-[19rem] shrink-0 snap-start sm:w-[22rem]"
              >
                {p.externo ? (
                  <a href={p.href} target="_blank" rel="noopener" className="group block h-full rounded-lg">
                    {contenido}
                  </a>
                ) : (
                  <Link href={p.href} className="group block h-full rounded-lg">
                    {contenido}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

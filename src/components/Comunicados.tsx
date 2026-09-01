"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";

const EJES = [
  "Cultura comunitaria",
  "Desarrollo cultural",
  "Infancias y juventudes",
  "Patrimonio",
  "Fomento literario",
] as const;

type Eje = (typeof EJES)[number];

type Comunicado = {
  titulo: string;
  entrada: string;
  eje: Eje;
  fecha: string;
  sede: string;
};

const COMUNICADOS: Comunicado[] = [
  {
    titulo: "Talleres de cesteria en la Huasteca tamaulipeca",
    entrada:
      "Ocho comunidades de Ocampo y Antiguo Morelos participan en un ciclo de formacion con maestras artesanas de la region.",
    eje: "Cultura comunitaria",
    fecha: "2026-08-04",
    sede: "Ocampo",
  },
  {
    titulo: "Convocatoria abierta para residencias artisticas 2027",
    entrada:
      "El Instituto destina doce plazas de residencia para creadores en artes visuales, escenicas y sonoras.",
    eje: "Desarrollo cultural",
    fecha: "2026-07-29",
    sede: "Ciudad Victoria",
  },
  {
    titulo: "Restauracion del retablo de la parroquia de Tula",
    entrada:
      "Concluye la primera etapa de intervencion sobre la pieza del siglo XVIII, con acompanamiento tecnico del INAH.",
    eje: "Patrimonio",
    fecha: "2026-07-21",
    sede: "Tula",
  },
  {
    titulo: "Encuentro estatal de salas de lectura",
    entrada:
      "Mediadores de los cuarenta y tres municipios comparten metodologias de fomento lector en comunidades rurales.",
    eje: "Fomento literario",
    fecha: "2026-07-15",
    sede: "Tampico",
  },
  {
    titulo: "Orquestas juveniles cierran su temporada de verano",
    entrada:
      "Mas de trescientos alumnos de los nucleos de Reynosa, Matamoros y Altamira presentan su concierto de fin de ciclo.",
    eje: "Infancias y juventudes",
    fecha: "2026-07-08",
    sede: "Reynosa",
  },
  {
    titulo: "Memoria oral de los pueblos pesqueros de la Costa",
    entrada:
      "Se publica el primer volumen de testimonios recogidos en La Pesca y Barra del Tordo durante 2025.",
    eje: "Patrimonio",
    fecha: "2026-06-30",
    sede: "Soto la Marina",
  },
];

const formatoFecha = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function Comunicados() {
  const [ejeActivo, setEjeActivo] = useState<Eje | null>(null);

  const visibles = useMemo(
    () =>
      ejeActivo ? COMUNICADOS.filter((c) => c.eje === ejeActivo) : COMUNICADOS,
    [ejeActivo],
  );

  return (
    <section id="comunicados" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="meta text-accent">Comunicados</p>
              <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
                Lo que esta pasando
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filtrar comunicados por eje de accion"
              className="flex flex-wrap gap-2"
            >
              <button
                onClick={() => setEjeActivo(null)}
                aria-pressed={ejeActivo === null}
                className={`meta rounded-full px-4 py-2 transition-colors ${
                  ejeActivo === null
                    ? "bg-charcoal text-white"
                    : "border border-line bg-surface text-muted hover:border-charcoal hover:text-charcoal"
                }`}
              >
                Todos
              </button>
              {EJES.map((eje) => (
                <button
                  key={eje}
                  onClick={() => setEjeActivo(eje)}
                  aria-pressed={ejeActivo === eje}
                  className={`meta rounded-full px-4 py-2 transition-colors ${
                    ejeActivo === eje
                      ? "bg-charcoal text-white"
                      : "border border-line bg-surface text-muted hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  {eje}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <p aria-live="polite" className="meta mt-8 text-muted">
          {visibles.length}{" "}
          {visibles.length === 1 ? "comunicado" : "comunicados"}
          {ejeActivo ? ` en ${ejeActivo}` : ""}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((c, i) => (
            <Reveal key={c.titulo} delay={i * 80}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-surface transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex h-40 items-center justify-center border-b border-line bg-bone">
                  <span className="meta text-muted">Imagen pendiente</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="meta text-accent">{c.eje}</p>
                  <h3 className="title-display mt-3 text-xl font-light leading-snug">
                    {c.titulo}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {c.entrada}
                  </p>
                  <div className="meta mt-6 flex items-center justify-between border-t border-line pt-4 text-muted">
                    <time dateTime={c.fecha}>
                      {formatoFecha.format(new Date(`${c.fecha}T12:00:00`))}
                    </time>
                    <span>{c.sede}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

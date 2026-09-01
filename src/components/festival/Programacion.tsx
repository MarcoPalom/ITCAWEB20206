import Reveal from "@/components/Reveal";
import { PROGRAMA, nombreSede } from "@/data/festival";
import { estiloTono } from "@/data/paleta";

/**
 * Programacion completa de las cinco jornadas.
 *
 * Se imprime entera en el HTML, sin filtros de cliente: una programacion es
 * justo el contenido que la gente busca, comparte e imprime, y no puede
 * depender de que corra JavaScript. La navegacion superior son anclas.
 */
export default function Programacion() {
  return (
    <section id="programacion" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="meta text-accent">Programacion</p>
              <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
                Cinco jornadas
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Programacion preliminar. El cartel definitivo, con nombres de
              agrupaciones y delegaciones invitadas, se publica en marzo de
              2026.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <nav aria-label="Ir a una jornada" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {PROGRAMA.map((dia, i) => (
                <li key={dia.id}>
                  <a
                    href={`#${dia.id}`}
                    style={estiloTono(i)}
                    className="ficha-color flex h-11 items-center rounded px-4 font-mono text-xs uppercase tracking-[0.12em] transition-opacity hover:opacity-80"
                  >
                    {dia.etiqueta}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <div className="mt-16 space-y-20">
          {PROGRAMA.map((dia, i) => (
            <section key={dia.id} id={dia.id} aria-labelledby={`${dia.id}-titulo`}>
              <div
                style={estiloTono(i)}
                className="borde-color sticky top-0 z-10 flex flex-col gap-1 border-b-2 bg-bone pb-3 pt-4 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <h3 id={`${dia.id}-titulo`} className="title-display text-2xl font-light">
                  {dia.diaSemana} {dia.fecha}
                </h3>
                <p className="meta text-muted">{dia.eje}</p>
              </div>

              <ol>
                {dia.actividades.map((act) => (
                  <li
                    key={`${dia.id}-${act.hora}-${act.titulo}`}
                    className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-2 border-b border-line py-6 lg:grid-cols-[6rem_1fr_18rem] lg:gap-x-8"
                  >
                    <p className="font-mono text-sm tabular-nums text-charcoal">
                      {act.hora}
                    </p>

                    <div>
                      <p className="text-base leading-snug text-charcoal">
                        {act.titulo}
                      </p>
                      <p className="meta mt-2 text-accent">{act.disciplina}</p>
                    </div>

                    <p className="col-start-2 font-mono text-xs leading-relaxed text-muted lg:col-start-3 lg:text-right">
                      {nombreSede(act.sede)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

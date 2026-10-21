import Link from "next/link";

import { CONVOCATORIAS, ENLACES_CONVOCATORIAS, OFICIAL } from "@/data/itca";
import Reveal from "./Reveal";

/** Convocatorias vigentes, con enlace directo a sus bases. */
export default function Convocatorias() {
  return (
    <section id="convocatorias" className="scroll-mt-20 border-b border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-8">
        <Reveal>
          <p className="meta text-accent">Convocatorias</p>
          <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
            Abiertas ahora
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Estímulos, formación y registros para artistas, gestores y
            portadores de cultura en Tamaulipas. Cada convocatoria enlaza a sus
            bases completas.
          </p>
          <Link
            href="/beneficiarios"
            className="mt-8 inline-flex min-h-12 items-center rounded-md border border-line bg-surface px-6 text-sm text-charcoal transition-colors hover:border-charcoal active:scale-[0.98]"
          >
            Padrón de beneficiarios
          </Link>
          <ul className="mt-6 flex flex-wrap gap-x-6">
            {[...ENLACES_CONVOCATORIAS, { etiqueta: "Todas las vigentes", href: `${OFICIAL}/convocatorias/` }].map(
              (e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener"
                    className="meta inline-flex min-h-11 items-center text-muted transition-colors hover:text-charcoal"
                  >
                    {e.etiqueta}
                    <span className="sr-only"> (se abre en otra pestaña)</span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </Reveal>

        <ul className="border-t border-line">
          {CONVOCATORIAS.map((c, i) => (
            <Reveal as="li" key={c.href} delay={i * 80} className="border-b border-line">
              <a
                href={c.href}
                target="_blank"
                rel="noopener"
                className="group flex flex-col gap-3 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10"
              >
                <div>
                  <h3 className="title-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-light leading-snug transition-colors group-hover:text-accent">
                    {c.titulo}
                  </h3>
                  <p className="meta mt-3 text-muted">{c.detalle}</p>
                </div>
                <span className="meta inline-flex shrink-0 items-center gap-2 text-accent">
                  Bases ({c.formato})
                  <span aria-hidden="true">&rarr;</span>
                  <span className="sr-only">(se abre en otra pestaña)</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

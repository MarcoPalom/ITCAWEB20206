import {
  ENLACES_INSTITUCIONALES,
  ENLACES_TRANSPARENCIA,
  INSTITUTO,
} from "@/data/itca";
import Reveal from "./Reveal";

const Columna = ({
  titulo,
  enlaces,
}: {
  titulo: string;
  enlaces: { etiqueta: string; href: string }[];
}) => (
  <div>
    <p className="meta text-muted">{titulo}</p>
    <ul className="mt-5 space-y-1">
      {enlaces.map((e) => (
        <li key={e.href}>
          <a
            href={e.href}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-9 items-center text-sm text-charcoal transition-colors hover:text-accent"
          >
            {e.etiqueta}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer id="contacto" className="mt-auto scroll-mt-20 bg-bone">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 border-b border-line pb-14 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <p className="title-display text-2xl">{INSTITUTO.siglas}</p>
              <p className="mt-4 max-w-xs leading-relaxed text-muted">{INSTITUTO.nombre}</p>
              <address className="mt-6 not-italic text-sm leading-relaxed text-muted">
                {INSTITUTO.direccion.map((linea) => (
                  <span key={linea} className="block">
                    {linea}
                  </span>
                ))}
                <a
                  href={INSTITUTO.telefonoHref}
                  className="mt-3 inline-flex min-h-9 items-center text-charcoal transition-colors hover:text-accent"
                >
                  {INSTITUTO.telefono}
                </a>
              </address>
              <a
                href={INSTITUTO.contacto}
                target="_blank"
                rel="noopener"
                className="meta mt-4 inline-flex min-h-11 items-center text-accent transition-opacity hover:opacity-70"
              >
                Escríbenos
                <span className="sr-only"> (formulario en el sitio oficial, se abre en otra pestaña)</span>
              </a>
            </div>

            <Columna titulo="Institucional" enlaces={ENLACES_INSTITUCIONALES} />
            <Columna titulo="Transparencia" enlaces={ENLACES_TRANSPARENCIA} />
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6">
            {INSTITUTO.redes.map((red) => (
              <li key={red.nombre}>
                <a
                  href={red.href}
                  target="_blank"
                  rel="noopener"
                  className="meta inline-flex min-h-11 items-center text-muted transition-colors hover:text-charcoal"
                >
                  {red.nombre}
                </a>
              </li>
            ))}
          </ul>
          <p className="meta text-muted">
            &copy; {new Date().getFullYear()} Gobierno del Estado de Tamaulipas
          </p>
        </div>
      </div>
    </footer>
  );
}

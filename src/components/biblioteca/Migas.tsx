import Link from "next/link";

/** Ruta de migas: el ultimo tramo es la pagina actual y no es enlace. */
export default function Migas({
  tramos,
}: {
  tramos: { etiqueta: string; href?: string }[];
}) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="meta flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
        {tramos.map((t, i) => (
          <li key={t.etiqueta} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {t.href ? (
              <Link
                href={t.href}
                className="inline-flex min-h-11 items-center transition-colors hover:text-charcoal"
              >
                {t.etiqueta}
              </Link>
            ) : (
              <span aria-current="page" className="text-charcoal">
                {t.etiqueta}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

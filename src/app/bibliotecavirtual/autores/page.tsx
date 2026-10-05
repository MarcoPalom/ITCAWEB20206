import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Migas from "@/components/biblioteca/Migas";
import Reveal from "@/components/Reveal";
import {
  AUTORES,
  AUTORES_ORDENADOS,
  apellidosDe,
  librosDeAutor,
  normalizar,
  rutaFoto,
} from "@/data/biblioteca";
import { SITIO } from "@/data/sitio";

const TITULO = "Autores | Biblioteca Virtual | ITCA";
const DESCRIPCION = `Índice de las ${AUTORES.length} autoras y autores del Fondo Editorial Tamaulipas, con su semblanza y sus libros de descarga libre.`;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: `${SITIO}/bibliotecavirtual/autores` },
  openGraph: {
    siteName: "ITCA",
    locale: "es_MX",
    title: TITULO,
    description: DESCRIPCION,
    url: `${SITIO}/bibliotecavirtual/autores`,
    type: "website",
    images: [`${SITIO}/opengraph-image.png`],
  },
};

export default function AutoresPage() {
  /* Agrupados por la inicial del apellido, como el indice onomastico de un
     catalogo impreso. La barra de letras solo lleva las que tienen a alguien:
     una letra sin destino es un enlace roto. */
  const grupos = new Map<string, typeof AUTORES>();
  for (const a of AUTORES_ORDENADOS) {
    const letra = normalizar(apellidosDe(a)).charAt(0).toUpperCase();
    grupos.set(letra, [...(grupos.get(letra) ?? []), a]);
  }

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
          <Migas
            tramos={[
              { etiqueta: "Biblioteca Virtual", href: "/bibliotecavirtual" },
              { etiqueta: "Autores" },
            ]}
          />
          <Reveal className="mt-10 max-w-2xl">
            <p className="meta text-accent">Índice de autores</p>
            <h1 className="title-display mt-4 text-[clamp(2.75rem,6vw,4.5rem)] font-light">
              Quienes escriben
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {AUTORES.length} autoras y autores, ordenados por apellido. Cada
              ficha reúne su semblanza y los libros suyos que hay en la
              biblioteca.
            </p>
          </Reveal>

          <nav aria-label="Ir a la letra" className="mt-10">
            <ul className="flex flex-wrap gap-1">
              {[...grupos.keys()].map((letra) => (
                <li key={letra}>
                  <a
                    href={`#letra-${letra}`}
                    className="flex h-11 w-11 items-center justify-center rounded border border-line bg-surface font-mono text-sm text-charcoal transition-colors hover:border-charcoal"
                  >
                    {letra}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {[...grupos.entries()].map(([letra, autores]) => (
          <section
            key={letra}
            id={`letra-${letra}`}
            aria-labelledby={`titulo-letra-${letra}`}
            className="grid scroll-mt-8 gap-6 border-b border-line py-12 sm:grid-cols-[6rem_minmax(0,1fr)]"
          >
            <h2
              id={`titulo-letra-${letra}`}
              className="title-display text-5xl font-light text-muted"
            >
              {letra}
            </h2>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {autores.map((a) => {
                const libros = librosDeAutor(a.slug);
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/bibliotecavirtual/autores/${a.slug}`}
                      className="group flex items-center gap-4 rounded-lg border border-line bg-surface p-3 pr-5 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    >
                      <Image
                        src={rutaFoto(a)}
                        alt=""
                        width={160}
                        height={160}
                        sizes="80px"
                        className="h-20 w-20 shrink-0 rounded-md object-cover"
                        style={{ objectPosition: a.encuadre ?? "50% 30%" }}
                      />
                      <span className="min-w-0">
                        <span className="title-display block text-xl leading-tight transition-colors group-hover:text-accent">
                          {a.nombre}
                        </span>
                        <span className="mt-1 block truncate text-sm text-muted">
                          {libros.map((l) => l.titulo).join(" · ")}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

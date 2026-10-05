import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Migas from "@/components/biblioteca/Migas";
import TarjetaLibro from "@/components/biblioteca/TarjetaLibro";
import Reveal from "@/components/Reveal";
import {
  COLECCIONES,
  coleccionPorSlug,
  librosDeColeccion,
  resumenDe,
} from "@/data/biblioteca";
import { SITIO } from "@/data/sitio";

export function generateStaticParams() {
  return COLECCIONES.map((c) => ({ coleccion: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ coleccion: string }>;
}): Promise<Metadata> {
  const { coleccion } = await params;
  const c = coleccionPorSlug(coleccion);
  if (!c) return {};
  const titulo = `Colección ${c.nombre} | Biblioteca Virtual | ITCA`;
  const url = `${SITIO}/bibliotecavirtual/coleccion/${c.slug}`;
  return {
    title: titulo,
    description: c.descripcion,
    alternates: { canonical: url },
    openGraph: {
      siteName: "ITCA",
      locale: "es_MX",
      title: titulo,
      description: c.descripcion,
      url,
      type: "website",
      images: [`${SITIO}/biblioteca/portadas/${librosDeColeccion(c.slug)[0].slug}.webp`],
    },
  };
}

export default async function ColeccionPage({
  params,
}: {
  params: Promise<{ coleccion: string }>;
}) {
  const { coleccion } = await params;
  const c = coleccionPorSlug(coleccion);
  if (!c) notFound();

  const libros = librosDeColeccion(c.slug);
  /* Dentro de la coleccion, por genero: Acroama mezcla poesia y teatro, y
     Altas Llamas novela, cuento y ensayo, y quien llega suele venir buscando
     uno de los dos. Con un solo genero no hay nada que separar. */
  const grupos = c.generos
    .map((g) => ({ genero: g, libros: libros.filter((l) => l.genero === g) }))
    .filter((g) => g.libros.length > 0);
  const otras = COLECCIONES.filter((o) => o.slug !== c.slug);

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <Migas
            tramos={[
              { etiqueta: "Biblioteca Virtual", href: "/bibliotecavirtual" },
              { etiqueta: "Colecciones", href: "/bibliotecavirtual#catalogo" },
              { etiqueta: c.nombre },
            ]}
          />
          <Reveal className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
            <div>
              <p className="meta text-accent">Colección</p>
              <h1 className="title-display mt-4 text-[clamp(2.75rem,6vw,4.5rem)] font-light">
                {c.nombre}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                {c.descripcion}
              </p>
            </div>
            <div className="lg:justify-self-end lg:text-right">
              {c.nombreViene ? (
                <p className="max-w-sm text-sm leading-relaxed text-muted lg:ml-auto">
                  {c.nombreViene}
                </p>
              ) : null}
              <p className="meta mt-4 text-charcoal">
                {libros.length} {libros.length === 1 ? "título" : "títulos"} ·{" "}
                {c.generos.join(" · ")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {grupos.map((g) => (
          <section
            key={g.genero}
            aria-labelledby={`genero-${g.genero}`}
            className="border-b border-line py-16 last:border-b-0 sm:py-20"
          >
            {grupos.length > 1 ? (
              <h2
                id={`genero-${g.genero}`}
                className="title-display mb-10 flex items-baseline gap-4 text-3xl"
              >
                {g.genero}
                <span className="meta text-muted">{g.libros.length}</span>
              </h2>
            ) : (
              <h2 id={`genero-${g.genero}`} className="sr-only">
                {g.genero}
              </h2>
            )}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
              {g.libros.map((l, i) => (
                <Reveal as="li" key={l.slug} delay={(i % 5) * 80}>
                  <TarjetaLibro libro={resumenDe(l)} prioridad={i < 5} />
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section aria-labelledby="otras-colecciones" className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="otras-colecciones" className="meta text-muted">
            Otras colecciones
          </h2>
          <ul className="mt-6 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {otras.map((o) => (
              <li key={o.slug} className="border-b border-line">
                <Link
                  href={`/bibliotecavirtual/coleccion/${o.slug}`}
                  className="group flex min-h-20 flex-col justify-center py-5 pr-6"
                >
                  <span className="title-display text-2xl transition-colors group-hover:text-accent">
                    {o.nombre}
                  </span>
                  <span className="meta mt-1 text-muted">
                    {librosDeColeccion(o.slug).length} títulos
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

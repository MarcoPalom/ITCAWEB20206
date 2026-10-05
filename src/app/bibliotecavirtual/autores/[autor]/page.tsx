import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import Migas from "@/components/biblioteca/Migas";
import TarjetaLibro from "@/components/biblioteca/TarjetaLibro";
import {
  AUTORES,
  autorPorSlug,
  librosDeAutor,
  resumenDe,
  rutaFoto,
} from "@/data/biblioteca";
import { SITIO } from "@/data/sitio";

export function generateStaticParams() {
  return AUTORES.map((a) => ({ autor: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ autor: string }>;
}): Promise<Metadata> {
  const { autor } = await params;
  const a = autorPorSlug(autor);
  if (!a) return {};
  const titulo = `${a.nombre} | Autores | Biblioteca Virtual | ITCA`;
  const descripcion = a.semblanza.slice(0, 200).replace(/\s+\S*$/, "") + "…";
  const url = `${SITIO}/bibliotecavirtual/autores/${a.slug}`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      siteName: "ITCA",
      locale: "es_MX",
      title: a.nombre,
      description: descripcion,
      url,
      type: "profile",
      images: [`${SITIO}${rutaFoto(a)}`],
    },
  };
}

export default async function AutorPage({
  params,
}: {
  params: Promise<{ autor: string }>;
}) {
  const { autor } = await params;
  const a = autorPorSlug(autor);
  if (!a) notFound();

  const libros = librosDeAutor(a.slug);
  const propios = libros.filter((l) => l.autores.length <= 3);
  const antologias = libros.filter((l) => l.autores.length > 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.nombre,
    description: a.semblanza,
    image: `${SITIO}${rutaFoto(a)}`,
    url: `${SITIO}/bibliotecavirtual/autores/${a.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Migas
          tramos={[
            { etiqueta: "Biblioteca Virtual", href: "/bibliotecavirtual" },
            { etiqueta: "Autores", href: "/bibliotecavirtual/autores" },
            { etiqueta: a.nombre },
          ]}
        />
      </div>

      <article className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-8">
        <figure className="lg:sticky lg:top-8 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-bone">
            <Image
              src={rutaFoto(a)}
              alt={`Fotografía de ${a.nombre}`}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              style={{ objectPosition: a.encuadre ?? "50% 30%" }}
            />
          </div>
          {a.creditoFoto ? (
            <figcaption className="meta mt-3 text-muted">
              Fotografía: {a.creditoFoto}
            </figcaption>
          ) : null}
        </figure>

        <div>
          <p className="meta text-accent">{a.origen}</p>
          <h1 className="title-display mt-4 text-[clamp(2.5rem,5.5vw,4.25rem)] font-light">
            {a.nombre}
          </h1>

          <section aria-labelledby="semblanza" className="mt-12">
            <h2 id="semblanza" className="meta text-muted">
              Semblanza
            </h2>
            <p className="mt-5 max-w-3xl text-[1.0625rem] leading-[1.75]">
              {a.semblanza}
            </p>
          </section>

          <dl className="mt-12 grid max-w-md grid-cols-2 border-y border-line">
            <div className="py-5">
              <dt className="meta text-muted">En la biblioteca</dt>
              <dd className="title-display mt-1 text-3xl">
                {libros.length} {libros.length === 1 ? "libro" : "libros"}
              </dd>
            </div>
            <div className="border-l border-line py-5 pl-5">
              <dt className="meta text-muted">Colecciones</dt>
              <dd className="title-display mt-1 text-3xl">
                {new Set(libros.map((l) => l.coleccion)).size}
              </dd>
            </div>
          </dl>
        </div>
      </article>

      <section aria-labelledby="obra" className="border-t border-line bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {propios.length > 0 ? (
            <>
              <h2 id="obra" className="title-display text-3xl">
                Su obra en la biblioteca
              </h2>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                {propios.map((l, i) => (
                  <li key={l.slug}>
                    <TarjetaLibro libro={resumenDe(l)} mostrarColeccion prioridad={i < 2} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {antologias.length > 0 ? (
            <div className={propios.length > 0 ? "mt-16 border-t border-line pt-12" : ""}>
              <h2
                id={propios.length > 0 ? undefined : "obra"}
                className={propios.length > 0 ? "meta text-muted" : "title-display text-3xl"}
              >
                Incluida en
              </h2>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                {antologias.map((l) => (
                  <li key={l.slug}>
                    <TarjetaLibro libro={resumenDe(l)} mostrarColeccion />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

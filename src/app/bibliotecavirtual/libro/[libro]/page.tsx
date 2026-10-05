import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Cita from "@/components/biblioteca/Cita";
import Migas from "@/components/biblioteca/Migas";
import TarjetaLibro from "@/components/biblioteca/TarjetaLibro";
import {
  LIBROS,
  apellidosDe,
  autoresDe,
  coleccionPorSlug,
  firmaDe,
  libroPorSlug,
  librosDeAutor,
  librosDeColeccion,
  pesoLegible,
  resumenDe,
  rutaFoto,
  rutaPdf,
  rutaPortada,
  type Autor,
  type Libro,
} from "@/data/biblioteca";
import { SITIO } from "@/data/sitio";

const EDITORIAL = "Instituto Tamaulipeco para la Cultura y las Artes";

export function generateStaticParams() {
  return LIBROS.map((l) => ({ libro: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ libro: string }>;
}): Promise<Metadata> {
  const { libro } = await params;
  const l = libroPorSlug(libro);
  if (!l) return {};
  const titulo =
    l.autores.length > 3
      ? `${l.titulo} | Biblioteca Virtual | ITCA`
      : `${l.titulo}, de ${firmaDe(l)} | Biblioteca Virtual | ITCA`;
  const descripcion = l.sinopsis[0].slice(0, 200).replace(/\s+\S*$/, "") + "…";
  const url = `${SITIO}/bibliotecavirtual/libro/${l.slug}`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      siteName: "ITCA",
      locale: "es_MX",
      title: l.titulo,
      description: descripcion,
      url,
      type: "book",
      images: [`${SITIO}${rutaPortada(l)}`],
    },
  };
}

/** "Rodríguez Leija, C." a partir del nombre y sus apellidos. */
const autorApa = (a: Autor) => {
  const apellidos = apellidosDe(a);
  const nombres = a.nombre.replace(apellidos, "").trim().replace(/\s+de$/, "");
  const iniciales = nombres
    .split(/\s+/)
    .map((n) => `${n.replace(/\.$/, "").charAt(0)}.`)
    .join(" ");
  return `${apellidos}, ${iniciales}`;
};

/** Referencia APA 7 del libro en su edicion digital. */
const referencia = (l: Libro) => {
  const titulo = l.subtitulo ? `${l.titulo}: ${l.subtitulo}` : l.titulo;
  const url = `${SITIO}/bibliotecavirtual/libro/${l.slug}`;
  if (l.autores.length > 3) return `${titulo}. (${l.anio}). ${EDITORIAL}. ${url}`;
  const autores = autoresDe(l).map(autorApa).join(", ");
  const rol = l.rol === "Coordinación" ? " (Coord.)." : "";
  return `${autores}${rol} (${l.anio}). ${titulo}. ${EDITORIAL}. ${url}`;
};

export default async function LibroPage({
  params,
}: {
  params: Promise<{ libro: string }>;
}) {
  const { libro } = await params;
  const l = libroPorSlug(libro);
  if (!l) notFound();

  const coleccion = coleccionPorSlug(l.coleccion)!;
  const autores = autoresDe(l);
  const antologia = autores.length > 3;
  const relacionados = librosDeColeccion(l.coleccion)
    .filter((o) => o.slug !== l.slug)
    .slice(0, 5);
  const nombreArchivo = `${l.titulo} - ${antologia ? "ITCA" : firmaDe(l)}.pdf`;

  /* Datos estructurados de schema.org: los buscadores y los catalogos de
     bibliotecas reconocen asi el libro, su ISBN y su autoria. */
  const ld = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: l.titulo,
    ...(l.subtitulo ? { alternativeHeadline: l.subtitulo } : {}),
    author: autores.map((a) => ({
      "@type": "Person",
      name: a.nombre,
      url: `${SITIO}/bibliotecavirtual/autores/${a.slug}`,
    })),
    isbn: l.isbn,
    numberOfPages: l.paginas,
    bookFormat: "https://schema.org/EBook",
    inLanguage: "es",
    genre: l.genero,
    datePublished: String(l.anio),
    publisher: { "@type": "Organization", name: EDITORIAL },
    isPartOf: { "@type": "BookSeries", name: `Colección ${coleccion.nombre}` },
    image: `${SITIO}${rutaPortada(l)}`,
    url: `${SITIO}/bibliotecavirtual/libro/${l.slug}`,
    isAccessibleForFree: true,
    description: l.sinopsis[0],
  };

  const ficha: [string, React.ReactNode][] = [
    [
      antologia ? "Autoras" : l.rol ?? (autores.length > 1 ? "Autores" : "Autoría"),
      antologia ? `${autores.length} escritoras tamaulipecas` : (
        autores.map((a, i) => (
          <span key={a.slug}>
            {i > 0 ? ", " : ""}
            <Link
              href={`/bibliotecavirtual/autores/${a.slug}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {a.nombre}
            </Link>
          </span>
        ))
      ),
    ],
    ...(l.creditos ? ([["Créditos", l.creditos]] as [string, string][]) : []),
    [
      "Colección",
      <Link
        key="c"
        href={`/bibliotecavirtual/coleccion/${coleccion.slug}`}
        className="text-accent underline-offset-4 hover:underline"
      >
        {coleccion.nombre}
      </Link>,
    ],
    ["Género", l.genero],
    ["Edición", `Primera edición, ${l.anio}`],
    ["Editorial", EDITORIAL],
    ["Páginas", l.paginas],
    ["ISBN", <span key="i" className="font-mono text-sm">{l.isbn}</span>],
    ["Formato", `PDF, ${pesoLegible(l.peso)}`],
  ];

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
            {
              etiqueta: coleccion.nombre,
              href: `/bibliotecavirtual/coleccion/${coleccion.slug}`,
            },
            { etiqueta: l.titulo },
          ]}
        />
      </div>

      <article className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 pt-10 pb-24 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20 lg:px-8">
        {/* --- Portada y acciones ------------------------------------------ */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="mx-auto max-w-[17rem] lg:mx-0 lg:max-w-[22rem]">
            <Image
              src={rutaPortada(l)}
              alt={`Portada de ${l.titulo}`}
              width={720}
              height={l.altoPortada}
              sizes="(min-width: 1024px) 22rem, 17rem"
              priority
              className="h-auto w-full rounded-[3px] border border-line"
            />
          </div>

        </div>

        {/* --- Ficha -------------------------------------------------------- */}
        <div>
          <p className="meta text-accent">
            Colección {coleccion.nombre} · {l.genero}
          </p>
          <h1 className="title-display mt-4 text-[clamp(2.25rem,5vw,4rem)] font-light">
            {l.titulo}
          </h1>
          {l.subtitulo ? (
            <p className="title-display mt-3 text-[clamp(1.25rem,2.5vw,1.75rem)] font-light italic text-muted">
              {l.subtitulo}
            </p>
          ) : null}
          <p className="mt-6 text-lg">
            {antologia ? (
              <span className="text-muted">Antología de doce escritoras tamaulipecas</span>
            ) : (
              autores.map((a, i) => (
                <span key={a.slug}>
                  {i > 0 ? ", " : ""}
                  <Link
                    href={`/bibliotecavirtual/autores/${a.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {a.nombre}
                  </Link>
                </span>
              ))
            )}
            {l.rol === "Coordinación" ? (
              <span className="text-muted"> (coordinación)</span>
            ) : null}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={`/bibliotecavirtual/libro/${l.slug}/leer`}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-charcoal px-6 text-sm text-white transition-opacity hover:opacity-85 active:scale-[0.98]"
            >
              <svg aria-hidden="true" viewBox="0 0 256 256" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M232 48h-64a40 40 0 0 0-32 16 40 40 0 0 0-32-16H40a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h64a24 24 0 0 1 24 24 8 8 0 0 0 16 0 24 24 0 0 1 24-24h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm-128 144H40V64h64a24 24 0 0 1 24 24v112a39.81 39.81 0 0 0-24-8Zm128 0h-64a39.81 39.81 0 0 0-24 8V88a24 24 0 0 1 24-24h64Z"
                />
              </svg>
              Leer en línea
            </Link>
            <a
              href={rutaPdf(l)}
              download={nombreArchivo}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-line bg-surface px-6 text-sm text-charcoal transition-colors hover:border-charcoal active:scale-[0.98]"
            >
              <svg aria-hidden="true" viewBox="0 0 256 256" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M224 144v64a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0Zm-101.66 5.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 124.69V32a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z"
                />
              </svg>
              Descargar PDF
              <span className="meta text-muted">{pesoLegible(l.peso)}</span>
            </a>
            <p className="text-xs leading-relaxed text-muted sm:ml-2">
              Gratuito, para lectura personal.
            </p>
          </div>

          <section aria-labelledby="sinopsis" className="mt-14">
            <h2 id="sinopsis" className="meta text-muted">
              Sinopsis
            </h2>
            <div className="mt-5 max-w-3xl space-y-5 text-[1.0625rem] leading-[1.7]">
              {l.sinopsis.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="ficha" className="mt-16">
            <h2 id="ficha" className="meta text-muted">
              Ficha bibliográfica
            </h2>
            <dl className="mt-5 border-t border-line">
              {ficha.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border-b border-line py-3.5 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]"
                >
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* --- Autoria ------------------------------------------------------ */}
          {antologia ? (
            <section aria-labelledby="autoras" className="mt-16">
              <h2 id="autoras" className="meta text-muted">
                Autoras incluidas
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {autores.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/bibliotecavirtual/autores/${a.slug}`}
                      className="group flex items-center gap-3 rounded-lg border border-line bg-surface p-2.5 pr-3 transition-colors hover:border-charcoal"
                    >
                      <Image
                        src={rutaFoto(a)}
                        alt=""
                        width={96}
                        height={96}
                        sizes="48px"
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                        style={{ objectPosition: a.encuadre ?? "50% 30%" }}
                      />
                      <span className="text-sm leading-snug group-hover:text-accent">
                        {a.nombre}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            autores.map((a) => {
              const otros = librosDeAutor(a.slug).filter((o) => o.slug !== l.slug);
              return (
                <section
                  key={a.slug}
                  aria-labelledby={`semblanza-${a.slug}`}
                  className="mt-16 overflow-hidden rounded-lg border border-line bg-surface"
                >
                  <div className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                    <div className="relative aspect-[4/3] border-b border-line bg-bone sm:aspect-auto sm:border-r sm:border-b-0">
                      <Image
                        src={rutaFoto(a)}
                        alt={`Fotografía de ${a.nombre}`}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: a.encuadre ?? "50% 30%" }}
                      />
                    </div>
                    <div className="p-6 sm:p-8">
                      <p className="meta text-muted">Semblanza</p>
                      <h2
                        id={`semblanza-${a.slug}`}
                        className="title-display mt-3 text-3xl"
                      >
                        {a.nombre}
                      </h2>
                      <p className="meta mt-2 text-accent">{a.origen}</p>
                      <p className="mt-5 line-clamp-[9] text-sm leading-relaxed text-muted">
                        {a.semblanza}
                      </p>
                      <Link
                        href={`/bibliotecavirtual/autores/${a.slug}`}
                        className="meta mt-5 inline-flex min-h-11 items-center text-accent transition-opacity hover:opacity-70"
                      >
                        {otros.length > 0
                          ? `Semblanza completa y ${otros.length} ${otros.length === 1 ? "libro más" : "libros más"}`
                          : "Semblanza completa"}
                      </Link>
                    </div>
                  </div>
                </section>
              );
            })
          )}

          <section aria-labelledby="citar" className="mt-16">
            <h2 id="citar" className="meta text-muted">
              Cómo citar
            </h2>
            <div className="mt-5">
              <Cita texto={referencia(l)} />
            </div>
          </section>
        </div>
      </article>

      {relacionados.length > 0 ? (
        <section aria-labelledby="relacionados" className="border-t border-line bg-surface py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h2 id="relacionados" className="title-display text-3xl">
                Más de la colección {coleccion.nombre}
              </h2>
              <Link
                href={`/bibliotecavirtual/coleccion/${coleccion.slug}`}
                className="meta inline-flex min-h-11 items-center text-accent transition-opacity hover:opacity-70"
              >
                Ver la colección
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
              {relacionados.map((o) => (
                <li key={o.slug}>
                  <TarjetaLibro libro={resumenDe(o)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Catalogo from "@/components/biblioteca/Catalogo";
import EstanteAnimado from "@/components/biblioteca/EstanteAnimado";
import Reveal from "@/components/Reveal";
import {
  AUTORES,
  AUTORES_ORDENADOS,
  COLECCIONES,
  GENEROS,
  LIBROS,
  entradaCatalogo,
  librosDeColeccion,
  rutaFoto,
  rutaPortada,
} from "@/data/biblioteca";
import { SITIO } from "@/data/sitio";

const TITULO = "Biblioteca Virtual | ITCA";
const DESCRIPCION = `Consulta y descarga libre de los ${LIBROS.length} libros del Fondo Editorial Tamaulipas: poesía, dramaturgia, novela, cuento, ensayo y cultura popular de autoras y autores tamaulipecos.`;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: `${SITIO}/bibliotecavirtual` },
  openGraph: {
    siteName: "ITCA",
    locale: "es_MX",
    title: TITULO,
    description: DESCRIPCION,
    url: `${SITIO}/bibliotecavirtual`,
    type: "website",
    images: [`${SITIO}/opengraph-image.png`],
  },
};

/* Portadas del estante de la cabecera: una por coleccion y alguna mas, en un
   orden que alterna colores para que no se junten dos oscuras. */
const ESTANTE = [
  "quinta-esencia",
  "akbal",
  "las-mujeres-zurdas-bailan-suelto",
  "tampico-2077",
  "tamaulipas-lee-a-sus-escritoras-de-hoy",
  "comiendo-en-tamaulipas",
];

export default function BibliotecaPage() {
  const estante = ESTANTE.map((s) => LIBROS.find((l) => l.slug === s)!);
  const rostros = AUTORES_ORDENADOS.slice(0, 14);

  return (
    <>
      {/* --- Cabecera ---------------------------------------------------- */}
      {/* En pantalla grande la cabecera mide justo lo visible bajo la barra
          del sitio (5rem, el pt-20 del layout) y su propio borde inferior: se
          ve entera en cualquier monitor y el estante se estira o encoge para
          llenarla. svh y no vh para que en tabletas la barra del navegador no
          la recorte. */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:h-[calc(100svh-5rem-1px)] lg:min-h-[22rem] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-10 lg:px-8 lg:py-10">
          <Reveal>
            <p className="meta text-accent">ITCA Digital · Fondo Editorial Tamaulipas</p>
            <h1 className="title-display mt-5 text-[clamp(2.75rem,min(6vw,9svh),4.5rem)] font-light">
              Biblioteca Virtual
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Los libros que publica el Instituto, completos y de descarga
              libre. Poesía, dramaturgia, narrativa, ensayo y cultura popular
              escritos desde Tamaulipas, organizados en las mismas colecciones
              en que se imprimen.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="inline-flex min-h-12 items-center rounded-md bg-charcoal px-6 text-sm text-white transition-opacity hover:opacity-85 active:scale-[0.98]"
              >
                Explorar el catálogo
              </a>
              <Link
                href="/bibliotecavirtual/autores"
                className="inline-flex min-h-12 items-center rounded-md border border-line bg-surface px-6 text-sm text-charcoal transition-colors hover:border-charcoal active:scale-[0.98]"
              >
                Índice de autores
              </Link>
            </div>
          </Reveal>

          {/* Estante: seis portadas en tres columnas que se mueven en
              sentidos opuestos. Es decorativo -los mismos libros estan en el
              catalogo, con su enlace-; ver EstanteAnimado. */}
          <Reveal delay={120} className="hidden min-h-0 lg:block lg:self-stretch">
            <EstanteAnimado
              portadas={estante.map(({ slug, altoPortada }) => ({ slug, altoPortada }))}
            />
          </Reveal>
        </div>
      </section>

      {/* --- Colecciones ------------------------------------------------- */}
      <section aria-labelledby="titulo-colecciones" className="border-b border-line py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="meta text-accent">Colecciones</p>
            <h2
              id="titulo-colecciones"
              className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light"
            >
              Cinco colecciones, un fondo
            </h2>
          </Reveal>

          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {COLECCIONES.map((c, i) => {
              const libros = librosDeColeccion(c.slug);
              const ancha = i < 2;
              return (
                <Reveal
                  as="li"
                  key={c.slug}
                  delay={i * 80}
                  className={ancha ? "lg:col-span-3" : "lg:col-span-2"}
                >
                  <Link
                    href={`/bibliotecavirtual/coleccion/${c.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-line bg-surface p-7 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-9"
                  >
                    <div aria-hidden="true" className="flex h-40 items-end overflow-hidden">
                      {libros.slice(0, ancha ? 6 : 4).map((l, k) => (
                        <Image
                          key={l.slug}
                          src={rutaPortada(l)}
                          alt=""
                          width={720}
                          height={l.altoPortada}
                          sizes="110px"
                          className="-ml-8 h-auto w-26 rounded-xs border border-line first:ml-0 transition-transform duration-200 group-hover:-translate-y-1"
                          style={{ zIndex: 10 - k, transitionDelay: `${k * 30}ms` }}
                        />
                      ))}
                    </div>
                    <p className="meta mt-8 text-muted">
                      {c.generos.join(" · ")} · {libros.length}{" "}
                      {libros.length === 1 ? "título" : "títulos"}
                    </p>
                    <h3 className="title-display mt-3 text-3xl transition-colors group-hover:text-accent">
                      {c.nombre}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {c.nombreViene ?? c.descripcion}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* --- Catalogo ---------------------------------------------------- */}
      <section
        id="catalogo"
        aria-labelledby="titulo-catalogo"
        className="scroll-mt-8 border-b border-line py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="meta text-accent">Catálogo</p>
            <h2
              id="titulo-catalogo"
              className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light"
            >
              Todos los libros
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Cada ficha incluye la sinopsis, la semblanza de quien lo escribió
              y el libro completo en PDF para leer en línea o descargar.
            </p>
          </div>

          <Catalogo
            libros={LIBROS.map(entradaCatalogo)}
            colecciones={COLECCIONES.map(({ slug, nombre, descripcion }) => ({
              slug,
              nombre,
              descripcion,
            }))}
            generos={GENEROS}
          />
        </div>
      </section>

      {/* --- Autores ----------------------------------------------------- */}
      <section aria-labelledby="titulo-autores" className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <p className="meta text-accent">Autores</p>
                <h2
                  id="titulo-autores"
                  className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light"
                >
                  Quienes escriben
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  {AUTORES.length} autoras y autores, de la Creadora Emérita a
                  quien publica aquí su primer libro.
                </p>
              </div>
              <Link
                href="/bibliotecavirtual/autores"
                className="meta inline-flex min-h-11 shrink-0 items-center text-accent transition-opacity hover:opacity-70"
              >
                Ver el índice completo
              </Link>
            </div>
          </Reveal>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            {rostros.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={(i % 7) * 60}>
                <Link
                  href={`/bibliotecavirtual/autores/${a.slug}`}
                  className="group flex flex-col items-start"
                >
                  <span className="block aspect-square w-full overflow-hidden rounded-lg border border-line bg-bone">
                    <Image
                      src={rutaFoto(a)}
                      alt=""
                      width={320}
                      height={320}
                      sizes="(min-width: 1024px) 150px, (min-width: 640px) 22vw, 45vw"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      style={{ objectPosition: a.encuadre ?? "50% 30%" }}
                    />
                  </span>
                  <span className="mt-3 text-sm leading-snug text-charcoal transition-colors group-hover:text-accent">
                    {a.nombre}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <p className="mt-20 max-w-2xl border-t border-line pt-8 text-sm leading-relaxed text-muted">
            Los libros se ofrecen para lectura personal sin costo. Los derechos
            pertenecen a sus autores y al Instituto Tamaulipeco para la Cultura
            y las Artes; su reproducción con otros fines requiere autorización
            por escrito.
          </p>
        </div>
      </section>
    </>
  );
}

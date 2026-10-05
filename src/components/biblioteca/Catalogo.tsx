"use client";

import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState } from "react";

import TarjetaLibro, { type LibroResumen } from "./TarjetaLibro";

export type LibroCatalogo = LibroResumen & {
  /** Titulo, autores, ISBN, genero y coleccion, ya sin acentos. */
  indice: string;
};

type ColeccionCatalogo = { slug: string; nombre: string; descripcion: string };

const sinAcentos = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Catalogo con busqueda y facetas, el patron de cualquier biblioteca digital:
 * un campo libre que cruza titulo, autor e ISBN, y dos filtros cerrados
 * -coleccion y genero- que se combinan entre si.
 *
 * Sin filtros, el catalogo se presenta agrupado por coleccion, que es como el
 * fondo esta organizado. En cuanto se busca o se filtra pasa a lista plana con
 * el recuento de resultados, porque ahi lo que importa es lo que coincide y no
 * de donde viene.
 *
 * Todo se filtra en el navegador: son 26 libros y el indice entero pesa menos
 * que una portada. Ir al servidor por cada tecla seria mas lento y mas fragil.
 */
export default function Catalogo({
  libros,
  colecciones,
  generos,
}: {
  libros: LibroCatalogo[];
  colecciones: ColeccionCatalogo[];
  generos: string[];
}) {
  const [consulta, setConsulta] = useState("");
  const [coleccion, setColeccion] = useState("");
  const [genero, setGenero] = useState("");
  const consultaDiferida = useDeferredValue(consulta);
  const idBusqueda = useId();
  const idGenero = useId();

  const filtrando = consultaDiferida.trim() !== "" || coleccion !== "" || genero !== "";

  const resultados = useMemo(() => {
    const terminos = sinAcentos(consultaDiferida).split(/\s+/).filter(Boolean);
    return libros.filter(
      (l) =>
        (!coleccion || l.coleccion === coleccion) &&
        (!genero || l.genero === genero) &&
        terminos.every((t) => l.indice.includes(t)),
    );
  }, [libros, consultaDiferida, coleccion, genero]);

  const limpiar = () => {
    setConsulta("");
    setColeccion("");
    setGenero("");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 sm:p-6 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor={idBusqueda} className="meta text-muted">
            Buscar en el catálogo
          </label>
          <div className="relative mt-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 256 256"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            >
              <path
                fill="currentColor"
                d="M232.49 215.51 185 168a92.12 92.12 0 1 0-17 17l47.53 47.54a12 12 0 0 0 17-17ZM44 112a68 68 0 1 1 68 68 68.07 68.07 0 0 1-68-68Z"
              />
            </svg>
            <input
              id={idBusqueda}
              type="search"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Título, autor o ISBN"
              autoComplete="off"
              className="h-12 w-full rounded-md border border-line bg-bone pl-10 pr-4 text-base text-charcoal placeholder:text-muted focus-visible:border-charcoal"
            />
          </div>
        </div>

        <div className="lg:w-56">
          <label htmlFor={idGenero} className="meta text-muted">
            Género
          </label>
          <select
            id={idGenero}
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="mt-2 h-12 w-full rounded-md border border-line bg-bone px-3 text-base text-charcoal focus-visible:border-charcoal"
          >
            <option value="">Todos los géneros</option>
            {generos.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="sr-only">Filtrar por colección</legend>
        <div className="flex flex-wrap gap-2">
          {[{ slug: "", nombre: "Todas las colecciones" }, ...colecciones].map((c) => {
            const activa = coleccion === c.slug;
            return (
              <button
                key={c.slug || "todas"}
                type="button"
                aria-pressed={activa}
                onClick={() => setColeccion(c.slug)}
                className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
                  activa
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-line bg-surface text-charcoal hover:border-charcoal"
                }`}
              >
                {c.nombre}
              </button>
            );
          })}
        </div>
      </fieldset>

      <p aria-live="polite" className="meta mt-8 text-muted">
        {filtrando
          ? `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"}`
          : `${libros.length} títulos`}
      </p>

      {resultados.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-line px-6 py-16 text-center">
          <p className="title-display text-2xl">Sin coincidencias</p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Prueba con el apellido del autor, una palabra del título o los
            últimos dígitos del ISBN.
          </p>
          <button
            type="button"
            onClick={limpiar}
            className="meta mt-6 inline-flex min-h-11 items-center rounded border border-line bg-surface px-5 text-charcoal transition-colors hover:border-charcoal active:scale-[0.98]"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : filtrando ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {resultados.map((l) => (
            <li key={l.slug}>
              <TarjetaLibro libro={l} mostrarColeccion />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-2">
          {colecciones.map((c) => {
            const deEsta = libros.filter((l) => l.coleccion === c.slug);
            return (
              <section
                key={c.slug}
                aria-labelledby={`cat-${c.slug}`}
                className="border-t border-line pt-10 pb-16 first:border-t-0"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div className="max-w-2xl">
                    <h3 id={`cat-${c.slug}`} className="title-display text-3xl">
                      {c.nombre}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {c.descripcion}
                    </p>
                  </div>
                  <Link
                    href={`/bibliotecavirtual/coleccion/${c.slug}`}
                    className="meta inline-flex min-h-11 shrink-0 items-center text-accent transition-opacity hover:opacity-70"
                  >
                    Ver colección ({deEsta.length})
                  </Link>
                </div>
                <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                  {deEsta.map((l) => (
                    <li key={l.slug}>
                      <TarjetaLibro libro={l} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

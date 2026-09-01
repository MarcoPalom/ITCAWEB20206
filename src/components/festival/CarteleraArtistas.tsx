"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { imagenesDe, type Artista } from "@/data/artistas";

/**
 * Cartelera de artistas: fotografia a sangre a la izquierda y columna de
 * fichas a la derecha, como en la referencia.
 *
 * La ficha que cruza la franja central del viewport es la activa: se realza y
 * el fondo pasa a su fotografia. La deteccion la hace un IntersectionObserver
 * con la raiz recortada al 12% central de la pantalla, de modo que solo una
 * ficha puede estar dentro a la vez. Se eligio esto y no un calculo por scroll
 * porque el navegador ya lo resuelve fuera del hilo principal: no hay listener
 * de scroll ni medicion en cada fotograma.
 *
 * El mismo componente sirve para las cuatro secciones; lo unico que cambia es
 * la lista que recibe.
 */
export default function CarteleraArtistas({ artistas }: { artistas: Artista[] }) {
  const [activo, setActivo] = useState(0);
  const fichas = useRef<(HTMLElement | null)[]>([]);

  const guardar = useCallback((el: HTMLElement | null, i: number) => {
    fichas.current[i] = el;
  }, []);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const i = Number((entrada.target as HTMLElement).dataset.indice);
          if (!Number.isNaN(i)) setActivo(i);
        }
      },
      /* Franja central: arriba y abajo se descuenta el 44%, asi que la raiz
         efectiva es una banda del 12% en mitad de la pantalla. */
      { rootMargin: "-44% 0px -44% 0px", threshold: 0 },
    );

    for (const el of fichas.current) if (el) observador.observe(el);
    return () => observador.disconnect();
  }, [artistas]);

  return (
    <div className="cartelera relative">
      {/* Fondo. Solo se montan la activa y sus vecinas, de modo que no se
          descarga el catalogo entero: el resto entra al acercarse. */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#1a1616]">
        {artistas.map((a, i) => {
          if (Math.abs(i - activo) > 1) return null;
          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={a.id}
              src={imagenesDe(a.id).fondo}
              alt=""
              width={1500}
              height={950}
              decoding="async"
              fetchPriority={i === activo ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
              style={{ opacity: i === activo ? 1 : 0 }}
            />
          );
        })}
        <div className="cartelera-velo absolute inset-0" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* En pantalla ancha esta media pantalla se deja libre para que respire
            la fotografia; en movil no existe y las fichas ocupan el ancho. */}
        <div className="hidden lg:col-span-6 lg:block" />

        <ol className="lg:col-span-6">
          {artistas.map((a, i) => {
            const activa = i === activo;
            const imgs = imagenesDe(a.id).cards;

            return (
              <li
                key={a.id}
                data-indice={i}
                ref={(el) => guardar(el, i)}
                /* El primer relleno solo tiene que librar la cabecera fija; antes
                   habia que salvar ademas la portadilla, que ya no esta. */
                className="ficha py-[8svh] first:pt-[16svh] last:pb-[34svh]"
                data-activa={activa ? "si" : "no"}
                style={{ "--tinte": a.tinte } as React.CSSProperties}
              >
                <article className="ficha-cuerpo">
                  <header className="flex items-baseline justify-between gap-6">
                    <h3 className="text-[0.95rem] text-[#f0eeee]">{a.nombre}</h3>
                    <p className="text-[0.95rem] text-[#b3adad]">{a.disciplina}</p>
                  </header>

                  <div className="ficha-marco mt-3">
                    <span className="ficha-pastilla">{a.etiqueta}</span>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {imgs.map((src, n) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          key={src}
                          src={src}
                          alt={`${a.nombre}, fotografia ${n + 1}`}
                          width={560}
                          height={600}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full rounded-md object-cover"
                        />
                      ))}
                    </div>

                    <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-[#2a2929] pt-4 text-[0.8rem]">
                      {[
                        ["Fecha", a.fecha],
                        ["Hora", a.hora],
                        ["Sede", a.sede],
                      ].map(([rotulo, valor]) => (
                        <div key={rotulo}>
                          <dt className="text-[#8b8686]">{rotulo}</dt>
                          <dd className="mt-1 text-[#e6e4e4]">{valor}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-4 text-[0.85rem] leading-relaxed text-[#a9a4a4]">
                      {a.descripcion}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

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
 * De las 144 companias del programa, quince tienen fotografia entregada. Las
 * demas van con marcador de posicion; el fondo se queda entonces en la ultima
 * fotografia disponible, que es lo que evita que la pantalla parpadee en negro
 * al recorrer una seccion donde casi nadie tiene material.
 *
 * El mismo componente sirve para las tres secciones; lo unico que cambia es la
 * lista que recibe.
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

  /* Fondo: la fotografia de la ficha activa si la tiene y, si no, la ultima que
     hubo. Se busca hacia atras y luego hacia delante, de modo que una seccion
     entera sin material sigue abriendo sobre una imagen y no sobre el vacio. */
  const conFondo = fondoVigente(artistas, activo);

  return (
    <div className="cartelera relative">
      {/* Solo se montan la activa y sus vecinas, de modo que no se descarga el
          catalogo entero: el resto entra al acercarse. */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#1a1616]">
        {artistas.map((a, i) => {
          if (!a.foto || Math.abs(i - conFondo) > 1) return null;
          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={a.id}
              src={imagenesDe(a.foto).fondo}
              alt=""
              width={1500}
              height={950}
              decoding="async"
              fetchPriority={i === conFondo ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
              style={{ opacity: i === conFondo ? 1 : 0 }}
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
            const [primera, ...resto] = a.presentaciones;

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
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="ficha-pastilla">{a.etiqueta}</span>
                      {a.procedencia ? (
                        <span className="font-mono text-[0.7rem] tracking-[0.05em] text-[#8b8686] uppercase">
                          {a.procedencia}
                        </span>
                      ) : null}
                    </div>

                    {a.titulo ? (
                      <p className="mt-3 text-[0.95rem] text-[#e6e4e4]">{a.titulo}</p>
                    ) : null}

                    {a.foto ? (
                      /* Dos fotografias en paralelo en pantalla ancha; en movil
                         la clase ficha-fotos las apila y les da el turno cada
                         dos segundos, desde globals.css. Si la compania tiene
                         clip, entra como tercer turno.

                         El clip solo se monta en la ficha activa, y no en las
                         109: asi hay un unico video vivo en toda la pagina, que
                         es lo que permite reproducirlo en bucle sin que el
                         movil se ahogue. */
                      <div
                        className="ficha-fotos mt-4 grid grid-cols-2 gap-2"
                        data-turnos={a.clip && activa ? 3 : 2}
                      >
                        {imagenesDe(a.foto).cards.map((src, n) => (
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

                        {a.clip && activa ? (
                          <video
                            src={imagenesDe(a.foto).clip}
                            width={560}
                            height={600}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            aria-hidden="true"
                            className="hidden"
                          />
                        ) : null}
                      </div>
                    ) : (
                      /* Marcador de posicion, no la foto de otra compania: la
                         ficha afirma que la fotografia es de quien la firma.
                         Borde de 1px y rotulo en monoespaciada diciendo que ira
                         ahi, como pide el sistema de diseno.

                         Es una banda baja y no el hueco entero de las dos
                         fotografias: sin material son 86 de las 109 fichas de
                         Tamaulipecos, y a tamano completo la seccion se leeria
                         como rota en vez de como pendiente de entrega. */
                      <div className="mt-4">
                        <div className="flex h-28 items-center justify-center rounded-md border border-[#2a2929]">
                          <p className="font-mono text-[0.7rem] tracking-[0.05em] text-[#6f6a6a] uppercase">
                            Fotografia pendiente de entrega
                          </p>
                        </div>
                      </div>
                    )}

                    {primera ? (
                      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-[#2a2929] pt-4 text-[0.8rem]">
                        {[
                          ["Fecha", primera.fecha],
                          ["Hora", primera.hora],
                          ["Sede", primera.sede],
                        ].map(([rotulo, valor]) => (
                          <div key={rotulo}>
                            <dt className="text-[#8b8686]">{rotulo}</dt>
                            <dd className="mt-1 text-[#e6e4e4]">{valor}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {/* Casi la mitad de las companias repiten en varios
                        municipios: el resto de su gira se lista aqui, que es
                        justamente lo que hace util esta pagina. */}
                    {resto.length > 0 ? (
                      <ul className="mt-3 space-y-1 text-[0.78rem] text-[#a9a4a4]">
                        {resto.map((p, n) => (
                          <li key={n} className="flex gap-3">
                            <span className="font-mono tracking-[0.05em] text-[#8b8686]">
                              {p.fecha}
                            </span>
                            <span>{p.municipio}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

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

/** Indice de la fotografia que debe verse de fondo con la ficha i activa. */
function fondoVigente(artistas: Artista[], i: number): number {
  for (let n = i; n >= 0; n--) if (artistas[n]?.foto) return n;
  for (let n = i + 1; n < artistas.length; n++) if (artistas[n]?.foto) return n;
  return i;
}

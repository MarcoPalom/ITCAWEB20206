"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Artista } from "@/data/artistas";
import { imagenesDe } from "@/data/imagenes";
import { enlaceMapa } from "@/data/mapas";
import IslaCartelera, { Controles } from "./IslaCartelera";
import MandosPlegables from "./MandosPlegables";

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
 * De las 144 companias del programa, 81 tienen fotografia entregada y 60 tienen
 * ademas un clip de dos segundos. Las demas van con marcador de posicion; el
 * fondo se queda entonces en la ultima fotografia disponible, que es lo que
 * evita que la pantalla parpadee en negro al recorrer una seccion donde casi
 * nadie tiene material.
 *
 * En movil la ficha no ensena las dos fotografias a la vez sino de una en una,
 * y el paso de una a otra imita un paneo de camara: el encuadre acompana al
 * sujeto, se desenfoca con la velocidad y vuelve a enfocar al frenar. Eso vive
 * entero en globals.css; aqui solo se montan las tres capas que necesita y se
 * dice cuantas piezas hay en el turno.
 *
 * El mismo componente sirve para las tres secciones; lo unico que cambia es la
 * lista que recibe.
 */
export default function CarteleraArtistas({ artistas }: { artistas: Artista[] }) {
  const [activo, setActivo] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<string | null>(null);
  const fichas = useRef<(HTMLElement | null)[]>([]);

  /* Las disciplinas salen del propio cartel y no de una lista escrita a mano:
     si el volcado trae una nueva, el filtro aparece solo. */
  const disciplinas = useMemo(
    () => [...new Set(artistas.map((a) => a.etiqueta))].sort(),
    [artistas],
  );

  /* La busqueda mira nombre, obra y municipios, que es por donde la gente
     pregunta: "los de teatro", "el de Tampico", "la obra tal". */
  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return artistas.filter((a) => {
      if (filtro && a.etiqueta !== filtro) return false;
      if (!texto) return true;
      const donde = [
        a.nombre,
        a.titulo,
        a.procedencia,
        ...a.presentaciones.map((p) => p.municipio),
      ]
        .join(" ")
        .toLowerCase();
      return donde.includes(texto);
    });
  }, [artistas, busqueda, filtro]);

  /* Al cambiar la busqueda o el filtro la lista es otra, asi que el indice
     anterior ya no apunta a nadie y hay que volver al principio.

     Se hace en el manejador y no en un efecto: un efecto que llama a setState
     provoca un segundo pintado en cascada -y el linter lo marca, con razon-.
     Aqui el cambio de lista y el reinicio del indice son la misma accion del
     usuario, asi que ocurren juntos en el mismo pintado. */
  const cambiarBusqueda = useCallback((valor: string) => {
    setBusqueda(valor);
    setActivo(0);
  }, []);

  const cambiarFiltro = useCallback((disciplina: string | null) => {
    setFiltro(disciplina);
    setActivo(0);
  }, []);

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
  }, [visibles]);

  /* Fondo: la fotografia de la ficha activa si la tiene y, si no, la ultima que
     hubo. Se busca hacia atras y luego hacia delante, de modo que una seccion
     entera sin material sigue abriendo sobre una imagen y no sobre el vacio. */
  const conFondo = fondoVigente(visibles, activo);

  return (
    <div className="cartelera relative">
      {/* Solo se montan la activa y sus vecinas, de modo que no se descarga el
          catalogo entero: el resto entra al acercarse. */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#1a1616]">
        {visibles.map((a, i) => {
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
        {/* La isla vive en la columna izquierda y se queda quieta mientras la
            lista pasa. En movil no existe: alli la ficha ya lleva su propia
            informacion y su carro de fechas, y un panel fijo se comeria media
            pantalla del telefono. */}
        <div className="hidden lg:col-span-5 lg:block">
          {/* El relleno inferior reserva la banda de la isla de navegacion,
              que va fija abajo y centrada en el viewport: 5svh de separacion
              mas sus 58px de alto mas holgura. Estrechar la isla no bastaba,
              porque la de navegacion se centra en la pantalla y no en la reja,
              asi que por ancho se siguen cruzando. Separadas en vertical no
              pueden empalmarse, mida lo que mida cualquiera de las dos. */}
          <div className="sticky top-0 flex h-svh items-center pt-[6svh] pb-[calc(5svh+6rem)]">
            <IslaCartelera
              artista={visibles[activo]}
              busqueda={busqueda}
              alBuscar={cambiarBusqueda}
              disciplinas={disciplinas}
              filtro={filtro}
              alFiltrar={cambiarFiltro}
              totalVisible={visibles.length}
              total={artistas.length}
            >
              {visibles[activo] ? (
                <Presentaciones artista={visibles[activo]} />
              ) : null}
            </IslaCartelera>
          </div>
        </div>

        {/* Movil: los mismos mandos, plegados. Cerrados ocupan una sola
            linea, que es lo que pedia no estorbar: la cartelera se recorre
            leyendo fichas, no filtrando, asi que el buscador esta a un toque
            pero no delante. */}
        <div className="sticky top-2 z-30 mb-4 lg:hidden">
          <MandosPlegables
            rotulo="Buscar y filtrar"
            cuenta={
              visibles.length === artistas.length
                ? `${artistas.length}`
                : `${visibles.length} de ${artistas.length}`
            }
          >
            <Controles
              busqueda={busqueda}
              alBuscar={cambiarBusqueda}
              disciplinas={disciplinas}
              filtro={filtro}
              alFiltrar={cambiarFiltro}
              totalVisible={visibles.length}
              total={artistas.length}
              id="movil"
            />
          </MandosPlegables>
        </div>

        <ol className="lg:col-span-7">
          {visibles.map((a, i) => {
            const activa = i === activo;

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
                  <div className="ficha-marco">
                    {/* Disciplina y procedencia, que es lo que situa a la
                        compania antes de nombrarla. La disciplina va solo en la
                        pastilla: antes se repetia arriba en texto, y en las 144
                        fichas decia exactamente lo mismo -ninguna tiene mas de
                        una disciplina-. */}
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="ficha-pastilla">{a.etiqueta}</span>
                      {a.procedencia ? (
                        <span className="flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.05em] text-[#8b8686] uppercase">
                          {/* La bandera acompana al rotulo, no lo sustituye: el
                              pais sigue escrito al lado, asi que el icono va
                              como decorativo y los lectores de pantalla no lo
                              nombran dos veces. */}
                          {a.banderas.map((codigo) => (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              key={codigo}
                              src={`/img/banderas/${codigo}.svg`}
                              alt=""
                              width={16}
                              height={16}
                              loading="lazy"
                              decoding="async"
                              aria-hidden="true"
                              className="h-4 w-4 flex-none"
                            />
                          ))}
                          {a.procedencia}
                        </span>
                      ) : null}
                    </div>

                    {/* El nombre manda. Estaba fuera del marco y al tamano del
                        texto corrido, compitiendo con la disciplina en la misma
                        linea; ahora entra en la ficha y abre, en la serif de
                        titulares y con cuerpo propio. */}
                    <h3 className="title-display mt-3 text-[clamp(1.3rem,2vw,1.65rem)] font-medium text-[#f5f3f3]">
                      {a.nombre}
                    </h3>

                    {a.titulo && a.titulo !== a.nombre ? (
                      <p className="mt-1.5 text-[0.9rem] leading-snug text-[#a9a4a4]">
                        {a.titulo}
                      </p>
                    ) : null}

                    {a.foto ? (
                      /* Tres capas, y cada una hace una sola cosa: ficha-fotos
                         es el encuadre que recorta, ficha-lente enfoca y
                         ficha-tira mueve. En pantalla ancha las dos de fuera se
                         vuelven transparentes -display: contents- y la reja de
                         dos columnas queda como estaba; el margen vive en el
                         envoltorio de fuera, que si sigue siendo una caja.

                         El clip solo se monta en la ficha activa, y no en las
                         109: asi hay un unico video vivo en toda la pagina, que
                         es lo que permite reproducirlo en bucle sin que el
                         movil se ahogue. */
                      <div className="mt-4">
                        {/* Movil: el turno de siempre, intacto. Va envuelto en
                            lg:hidden y no compartido con el mosaico porque el
                            turno se reparte con :nth-child, y un hermano de mas
                            -aunque estuviera oculto- correria los retardos y
                            descuadraria el paneo. */}
                        <div
                          className="ficha-fotos lg:hidden"
                          data-turnos={a.clip && activa ? 3 : 2}
                        >
                          <div className="ficha-lente">
                            <div className="ficha-tira grid grid-cols-2 gap-2">
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
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Escritorio: una linea de nodos por la que viaja la
                            camara. No es un carrusel: el encuadre no salta de
                            tarjeta en tarjeta, se desplaza por una fila
                            continua y siempre deja una pieza centrada, con la
                            siguiente asomando. Como mucho se ven dos a la vez.

                            El numero de nodos lo dice el atributo, y el CSS
                            elige el recorrido: sin video son tres paradas y con
                            video, cuatro. */}
                        <div
                          className="ficha-linea hidden lg:block"
                          data-nodos={a.clip && activa ? 4 : 3}
                        >
                          <div className="ficha-linea-lente">
                            <div className="ficha-linea-tira">
                              {/* La fila va dos veces. Es lo que hace que el
                                  recorrido se sienta sin fin: al llegar al
                                  final, la camara esta encuadrando la copia de
                                  la primera pieza, asi que volver al principio
                                  no cambia nada de lo que se ve y la costura no
                                  existe. Con una sola fila habria que retroceder
                                  a la vista, y eso delata el bucle.

                                  La forma la marca data-forma y no la posicion:
                                  asi la copia de una pieza tiene exactamente la
                                  misma forma que la original, que es de lo que
                                  depende que el salto sea invisible. */}
                              {[0, 1].map((vuelta) =>
                                piezasDe(a, Boolean(a.clip && activa)).map((pieza, n) => (
                                  <Nodo
                                    key={`${vuelta}-${n}`}
                                    pieza={pieza}
                                    /* El video no toma la forma que le tocaria
                                       por posicion: tiene la suya, con su misma
                                       proporcion, para que no salga recortado. */
                                    forma={pieza.tipo === "video" ? "video" : n}
                                    nombre={a.nombre}
                                    copia={vuelta === 1}
                                  />
                                )),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Marcador de posicion, no la foto de otra compania: la
                         ficha afirma que la fotografia es de quien la firma.
                         Borde de 1px y rotulo en monoespaciada diciendo que ira
                         ahi, como pide el sistema de diseno.

                         Es una banda baja y no el hueco entero de las dos
                         fotografias: sin material son 58 de las 109 fichas de
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

                    {/* En escritorio la programacion vive en la isla, que es
                        donde el visitante la tiene siempre a mano. Repetirla
                        aqui seria el mismo carro dos veces en pantalla. */}
                    <div className="lg:hidden">
                      <Presentaciones artista={a} />
                    </div>

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

/**
 * Las presentaciones de una compania, de una en una.
 *
 * Antes esto eran dos piezas distintas -la primera fecha con todo su detalle y
 * el resto de la gira en una lista con solo dia y municipio-, de modo que de la
 * primera se sabia todo y de las demas casi nada. Ahora todas traen lo mismo:
 * municipio, fecha, hora y sede.
 *
 * Van en un carro horizontal con anclaje, y con botones. Los botones no son un
 * anadido: el publico de este sitio es mayor, y el swipe a secas es un gesto
 * invisible -no se anuncia, no perdona el error y no existe con raton ni con
 * teclado-. La flecha si se ve y se toca. El deslizamiento sigue estando para
 * quien lo use, pero no es la unica puerta.
 *
 * Por lo mismo el indicador dice "1 de 3" y no unos puntos: un punto relleno
 * entre puntos vacios hay que descifrarlo, y una cifra no.
 */
function Presentaciones({ artista }: { artista: Artista }) {
  const [indice, setIndice] = useState(0);
  const carro = useRef<HTMLOListElement | null>(null);
  const total = artista.presentaciones.length;

  /* El indice sale de la posicion real del carro y no de un contador aparte:
     asi la barra, el gesto y el toque en la flecha comparten una sola fuente de
     verdad y no pueden desincronizarse. */
  const alDesplazar = useCallback(() => {
    const el = carro.current;
    if (!el || el.clientWidth === 0) return;
    setIndice(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  const ir = useCallback(
    (paso: number) => {
      const el = carro.current;
      if (!el) return;
      const destino = Math.min(Math.max(indice + paso, 0), total - 1);
      const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({
        left: destino * el.clientWidth,
        behavior: suave ? "smooth" : "auto",
      });
    },
    [indice, total],
  );

  if (total === 0) return null;

  return (
    <section className="mt-4 border-t border-[#2a2929] pt-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-mono text-[0.7rem] tracking-[0.05em] text-[#8b8686] uppercase">
          {total === 1 ? "Presentacion" : "Presentaciones"}
        </h4>

        {total > 1 ? (
          <div className="flex items-center gap-1">
            <Flecha hacia="anterior" alPulsar={() => ir(-1)} inerte={indice === 0} />
            {/* La cifra, no unos puntos: un punto relleno entre puntos vacios
                hay que descifrarlo, y una cifra no. */}
            <p
              aria-live="polite"
              className="min-w-[4.5rem] text-center font-mono text-[0.75rem] text-[#e6e4e4]"
            >
              {indice + 1} de {total}
            </p>
            <Flecha
              hacia="siguiente"
              alPulsar={() => ir(1)}
              inerte={indice === total - 1}
            />
          </div>
        ) : null}
      </div>

      <ol ref={carro} onScroll={alDesplazar} className="ficha-fechas mt-3">
        {artista.presentaciones.map((p, n) => (
          <li key={n} className="ficha-fecha">
            <p className="text-[0.85rem] text-[#e6e4e4]">{p.municipio}</p>
            <dl className="mt-2 grid grid-cols-2 gap-3 text-[0.8rem]">
              <div>
                <dt className="text-[#8b8686]">Fecha</dt>
                <dd className="mt-0.5 font-mono tracking-[0.05em] text-[#e6e4e4]">
                  {p.fecha}
                </dd>
              </div>
              <div>
                <dt className="text-[#8b8686]">Hora</dt>
                <dd className="mt-0.5 font-mono tracking-[0.05em] text-[#e6e4e4]">
                  {p.hora}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#8b8686]">Sede</dt>
                <dd className="mt-0.5 text-[#e6e4e4]">
                  {p.sede}
                  <IrAlMapa sede={p.sede} municipio={p.municipio} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Flecha de las presentaciones.
 *
 * Mide 44px, que es el area de toque minima; el trazo va dibujado a mano en vez
 * de traer una libreria de iconos entera para dos flechas.
 *
 * En el extremo se deshabilita en vez de desaparecer: un control que se esfuma
 * deja al usuario preguntandose si lo ha roto, y uno que sigue ahi apagado dice
 * que no hay nada mas por ese lado.
 */
function Flecha({
  hacia,
  alPulsar,
  inerte,
}: {
  hacia: "anterior" | "siguiente";
  alPulsar: () => void;
  inerte: boolean;
}) {
  return (
    <button
      type="button"
      onClick={alPulsar}
      disabled={inerte}
      aria-label={
        hacia === "anterior" ? "Presentacion anterior" : "Presentacion siguiente"
      }
      className="flex h-11 w-11 flex-none items-center justify-center rounded-md border border-[#2a2929] text-[#e6e4e4] transition-colors enabled:hover:border-[var(--tinte)] disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tinte)]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={hacia === "anterior" ? "M10 3 L5 8 L10 13" : "M6 3 L11 8 L6 13"} />
      </svg>
    </button>
  );
}

/**
 * Icono para abrir la sede en Google Maps, al lado del nombre.
 *
 * Va detras del texto y no envolviendolo, y esa es toda la diferencia con el
 * intento anterior, que hubo que retirar: alli el enlace era un contenedor flex
 * alrededor del nombre de la sede, y un flex se dimensiona a su contenido sin
 * partir la linea. Con nombres como "Del Kiosko de la Plaza Principal Miguel
 * Hidalgo al Museo del Ferrocarril" el enlace se estiraba, reventaba la ficha y
 * desbordaba la pagina entera. Aqui el enlace solo contiene un icono de tamano
 * fijo, asi que no puede estirar nada; y va en linea, de modo que fluye con el
 * texto y se va a la linea siguiente si no cabe.
 *
 * Solo aparece cuando hay recinto: de las 363 presentaciones del cartel, 108 lo
 * traen sin confirmar, y un enlace que busca "Por confirmar" no lleva a ninguna
 * parte.
 *
 * Como el icono es lo unico que hay dentro, el nombre accesible lo pone
 * aria-label y nombra la sede concreta: un lector de pantalla que recorra los
 * enlaces de la pagina oiria "enlace, enlace, enlace" si dijera solo "mapa".
 *
 * El glifo es la flecha diagonal de "ir a", dibujada a mano sobre una caja de
 * 16 y simetrica respecto a su centro (8,8), de modo que queda opticamente
 * centrada dentro del area de toque sin corregirla a ojo.
 */
function IrAlMapa({ sede, municipio }: { sede: string; municipio: string }) {
  const enlace = enlaceMapa(sede, municipio);
  if (!enlace) return null;

  return (
    <a
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver ${sede} en Google Maps, se abre en una ventana nueva`}
      /* El area de toque es de 32px con el icono a 15: los margenes negativos
         se comen el crecimiento para que la fila no cambie de alto. */
      className="-my-2 ml-1 inline-flex h-8 w-8 items-center justify-center rounded align-middle text-[#8b8686] transition-colors hover:bg-[#232222] hover:text-[var(--tinte)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--tinte)]"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="block"
      >
        <path d="M4.75 11.25 11.25 4.75" />
        <path d="M6.4 4.75H11.25V9.6" />
      </svg>
    </a>
  );
}

/** Las piezas de una compania, en el orden en que la camara las recorre. */
type Pieza = { tipo: "imagen" | "video"; src: string; rotulo: string };

function piezasDe(a: Artista, conClip: boolean): Pieza[] {
  if (!a.foto) return [];
  const rutas = imagenesDe(a.foto);
  const piezas: Pieza[] = [
    { tipo: "imagen", src: rutas.fondo, rotulo: "fotografia principal" },
    { tipo: "imagen", src: rutas.cards[0], rotulo: "fotografia 1" },
    { tipo: "imagen", src: rutas.cards[1], rotulo: "fotografia 2" },
  ];
  /* El clip se intercala en tercer lugar y no al final: asi el movimiento cae
     en mitad del recorrido y no cierra la fila, donde competiria con el salto
     del bucle. */
  if (conClip) piezas.splice(2, 0, { tipo: "video", src: rutas.clip, rotulo: "" });
  return piezas;
}

/**
 * Una pieza de la fila.
 *
 * La copia no se anuncia a los lectores de pantalla: es la misma imagen otra
 * vez, puesta solo para que el bucle no tenga costura, y nombrarla dos veces
 * seria ruido.
 */
function Nodo({
  pieza,
  forma,
  nombre,
  copia,
}: {
  pieza: Pieza;
  forma: number | string;
  nombre: string;
  copia: boolean;
}) {
  if (pieza.tipo === "video") {
    return (
      <video
        className="ficha-nodo"
        data-forma={forma}
        src={pieza.src}
        width={560}
        height={600}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className="ficha-nodo"
      data-forma={forma}
      src={pieza.src}
      alt={copia ? "" : `${nombre}, ${pieza.rotulo}`}
      aria-hidden={copia ? true : undefined}
      width={560}
      height={600}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Indice de la fotografia que debe verse de fondo con la ficha i activa. */
function fondoVigente(artistas: Artista[], i: number): number {
  for (let n = i; n >= 0; n--) if (artistas[n]?.foto) return n;
  for (let n = i + 1; n < artistas.length; n++) if (artistas[n]?.foto) return n;
  return i;
}

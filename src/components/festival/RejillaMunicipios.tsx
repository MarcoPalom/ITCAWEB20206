"use client";

import { useId, useMemo, useState } from "react";

import MarcoImagen from "@/components/MarcoImagen";

import EnlaceBarrido from "./EnlaceBarrido";

/**
 * El bento de municipios con sus mandos: buscar por nombre y reordenar.
 *
 * Es cliente porque los mandos cambian lo que se ve sin recargar, pero no
 * recibe la programacion entera: la pagina le pasa una ficha de cuatro campos
 * por municipio -nombre, numero, cuantos espectaculos y el credito de la
 * foto-. El volcado completo, con sus cuatrocientos y pico eventos y sus
 * notas, se queda en el servidor; mandarlo aqui seria bajar cientos de kB al
 * telefono para pintar 43 rectangulos.
 */
export type FichaMunicipio = {
  id: string;
  nombre: string;
  /** Numero de la lista oficial del comite (1 a 43). */
  numero: number;
  totalEspectaculos: number;
  /** Autoria de la foto de Commons, o null donde no se encontro ninguna. */
  foto: { autor: string; licencia: string } | null;
};

type Orden = "oficial" | "alfabetico" | "cantidad";

const ORDENES: { valor: Orden; rotulo: string }[] = [
  { valor: "oficial", rotulo: "Oficial" },
  { valor: "alfabetico", rotulo: "A–Z" },
  { valor: "cantidad", rotulo: "Más espectáculos" },
];

/**
 * Tamano de la ficha segun cuantos espectaculos trae ese municipio -no segun
 * si tiene sede confirmada-: a mas programacion, mas espacio en la rejilla.
 * Solo se varia el ancho (col-span), nunca el alto: todas las fichas ocupan
 * una sola fila, igual que el bento de Sedes.tsx, y por eso no deja huecos
 * -un row-span distinto por ficha si los deja, porque el alto de cada fila lo
 * fija el contenido y dos filas de alto distinto no encajan entre si-.
 *
 * Se mide sobre el total absoluto y no sobre lo que quede tras filtrar: el
 * tamano dice cuanta programacion tiene ese municipio en el festival, y esa
 * cifra no cambia porque alguien escriba en el buscador. Si se recalculara
 * sobre lo visible, el mismo municipio creceria y menguaria segun el filtro
 * puesto, que es justo lo que un bento no debe hacer.
 */
function tamano(totalEspectaculos: number) {
  if (totalEspectaculos >= 19) {
    return {
      col: "col-span-2 sm:col-span-3",
      proporcion: "21 / 9",
      titulo: "text-2xl sm:text-3xl",
    };
  }
  if (totalEspectaculos >= 10) {
    return { col: "col-span-2", proporcion: "16 / 9", titulo: "text-lg sm:text-xl" };
  }
  return { col: "", proporcion: "1 / 1", titulo: "text-sm sm:text-base" };
}

/* Mismo criterio que el buscador de la cartelera: se comparan las dos cadenas
   sin acentos, para que "gonzalez" encuentre "González" y al reves. Quien
   teclea en un movil rara vez pone el acento, y sin esto el municipio
   sencillamente no aparece. */
function plegar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function RejillaMunicipios({ fichas }: { fichas: FichaMunicipio[] }) {
  const [busqueda, cambiarBusqueda] = useState("");
  const [orden, cambiarOrden] = useState<Orden>("oficial");
  const id = useId();

  /* El texto sobre el que busca cada ficha, plegado una sola vez. Incluye el
     numero oficial -con y sin cero delante- porque es lo que se ve impreso en
     la ficha, y quien lo tenga a mano esperara poder teclearlo. */
  const textos = useMemo(() => {
    const mapa = new Map<FichaMunicipio, string>();
    for (const f of fichas) {
      mapa.set(
        f,
        plegar(`${f.nombre} ${f.numero} ${String(f.numero).padStart(2, "0")}`),
      );
    }
    return mapa;
  }, [fichas]);

  const visibles = useMemo(() => {
    /* Se parte en palabras para que "nuevo laredo" encuentre igual que
       "laredo nuevo", y para que un espacio de mas no deje de encontrar
       nada. */
    const terminos = plegar(busqueda).split(/\s+/).filter(Boolean);

    const filtradas =
      terminos.length === 0
        ? fichas
        : fichas.filter((f) => {
            const donde = textos.get(f) ?? "";
            return terminos.every((termino) => donde.includes(termino));
          });

    /* Copia antes de ordenar: sort muta, y fichas es la prop. */
    const ordenadas = [...filtradas];
    if (orden === "alfabetico") {
      /* localeCompare con "es" y no una comparacion de cadenas a secas: sin
         el, "Álvaro" se va detras de "Zaragoza" porque la A con tilde cae
         fuera del alfabeto latino basico. */
      ordenadas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    } else if (orden === "cantidad") {
      /* A igualdad de espectaculos manda el numero oficial, que es un orden
         estable: sin desempate, dos municipios con los mismos cinco actos
         podrian intercambiarse de sitio entre un render y otro. */
      ordenadas.sort(
        (a, b) => b.totalEspectaculos - a.totalEspectaculos || a.numero - b.numero,
      );
    } else {
      ordenadas.sort((a, b) => a.numero - b.numero);
    }
    return ordenadas;
  }, [busqueda, fichas, orden, textos]);

  const hayBusqueda = busqueda !== "";
  const hayOrden = orden !== "oficial";

  return (
    <>
      {/* Los mandos se quedan pegados arriba. Con 43 fichas el bento se pasa
          de largo de la pantalla enseguida, y unos mandos que se van con el
          scroll obligan a volver arriba cada vez que se quiere cambiar de
          orden. La cabecera del marco es absolute y no fixed, asi que tambien
          se va con el scroll y no hay con quien chocar en top-0. */}
      <div className="mandos-municipios">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div className="min-w-[15rem] flex-1">
            <label
              htmlFor={`${id}-buscar`}
              className="font-mono text-[0.65rem] tracking-[0.05em] text-muted uppercase"
            >
              Buscar municipio
            </label>
            <div className="mando-campo-caja mt-1.5">
              <input
                id={`${id}-buscar`}
                type="search"
                value={busqueda}
                onChange={(e) => cambiarBusqueda(e.target.value)}
                placeholder="Nombre o número"
                className="mando-campo"
              />
              {/* El aspa solo existe cuando hay algo escrito: sobre un campo
                  vacio no hace nada y ensucia el control. */}
              {hayBusqueda ? (
                <button
                  type="button"
                  onClick={() => cambiarBusqueda("")}
                  aria-label="Borrar lo buscado"
                  className="mando-borrar"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="block"
                  >
                    <path d="M4.5 4.5 11.5 11.5" />
                    <path d="M11.5 4.5 4.5 11.5" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.05em] text-muted uppercase">
              Ordenar por
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {ORDENES.map((o) => (
                <Pastilla
                  key={o.valor}
                  activo={orden === o.valor}
                  alPulsar={() => cambiarOrden(o.valor)}
                >
                  {o.rotulo}
                </Pastilla>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-3 font-mono text-[0.65rem] tracking-[0.05em] text-muted">
          <p aria-live="polite">
            {visibles.length === fichas.length
              ? `${fichas.length} municipios`
              : `${visibles.length} de ${fichas.length} municipios`}
          </p>
          {/* Devuelve el bento a como estaba de un toque. Aparece solo cuando
              hay algo que deshacer, y deshace las dos cosas a la vez: es el
              estado combinado -buscando y reordenado- del que cuesta salir a
              mano. */}
          {hayBusqueda || hayOrden ? (
            <button
              type="button"
              onClick={() => {
                cambiarBusqueda("");
                cambiarOrden("oficial");
              }}
              className="mando-limpiar shrink-0"
            >
              Limpiar todo
            </button>
          ) : null}
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="mando-vacio">
          <p className="title-display text-xl font-light">Sin coincidencias</p>
          <p className="mt-2 max-w-prose text-sm text-muted">
            {`Ningún municipio se llama “${busqueda.trim()}”.`}
          </p>
          <button
            type="button"
            onClick={() => cambiarBusqueda("")}
            className="mando-limpiar mt-3 text-sm"
          >
            Ver los {fichas.length} municipios
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibles.map((m) => {
            const { col, proporcion, titulo } = tamano(m.totalEspectaculos);

            return (
              <EnlaceBarrido
                key={m.id}
                href={`/festival/municipios/${m.id}`}
                className={`group flex [content-visibility:auto] [contain-intrinsic-size:auto_380px] ${col}`}
              >
                <div className="flex w-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  {m.foto ? (
                    <div className="overflow-hidden" style={{ aspectRatio: proporcion }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/img/municipios/${m.id}.jpg`}
                        alt={`Fotografía de ${m.nombre}. ${m.foto.autor ? `Autor: ${m.foto.autor}.` : ""} ${m.foto.licencia}, via Wikimedia Commons.`}
                        width={1200}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <MarcoImagen
                      descripcion={`Fotografía de ${m.nombre}`}
                      proporcion={proporcion}
                      className="rounded-none border-0"
                    />
                  )}
                  <div className="flex flex-1 flex-col justify-center p-3">
                    <p className="font-mono text-xs text-muted">
                      {String(m.numero).padStart(2, "0")}
                    </p>
                    <h2 className={`title-display mt-1 font-light ${titulo}`}>
                      {m.nombre}
                    </h2>
                    <p className="mt-1 font-mono text-[0.65rem] text-muted">
                      {m.totalEspectaculos}{" "}
                      {m.totalEspectaculos === 1 ? "espectaculo" : "espectaculos"}
                    </p>
                  </div>
                </div>
              </EnlaceBarrido>
            );
          })}
        </div>
      )}
    </>
  );
}

/**
 * Pastilla de mando, la misma para ordenar y para filtrar.
 *
 * Es un boton y no un enlace porque no navega: cambia lo que se ve. Lleva
 * aria-pressed para que un lector de pantalla anuncie cual esta puesta, que es
 * algo que el relleno por si solo no comunica.
 */
function Pastilla({
  activo,
  alPulsar,
  children,
}: {
  activo: boolean;
  alPulsar: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={alPulsar}
      aria-pressed={activo}
      className="mando-pastilla"
      data-activo={activo ? "si" : "no"}
    >
      {children}
    </button>
  );
}

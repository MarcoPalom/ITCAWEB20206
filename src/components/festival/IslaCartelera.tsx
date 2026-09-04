"use client";

import type { Artista } from "@/data/artistas";

/**
 * Isla de la cartelera: el panel fijo de la izquierda en pantalla ancha.
 *
 * Reune en un solo sitio las cuatro cosas que el visitante necesita a mano
 * mientras recorre el cartel: con que buscar, con que filtrar, quien tiene
 * delante y cuando actua. La lista de companias sigue pasando a la derecha; la
 * isla no se mueve y va contando el que esta en pantalla.
 *
 * Es una pieza de escritorio y solo de escritorio. En movil la ficha ya lleva
 * su propia informacion y su propio carro de fechas, y meter aqui un panel fijo
 * se comeria media pantalla de un telefono.
 */
export type Disciplina = string;

export default function IslaCartelera({
  artista,
  busqueda,
  alBuscar,
  disciplinas,
  filtro,
  alFiltrar,
  totalVisible,
  total,
  children,
}: {
  artista: Artista | undefined;
  busqueda: string;
  alBuscar: (v: string) => void;
  disciplinas: Disciplina[];
  filtro: Disciplina | null;
  alFiltrar: (d: Disciplina | null) => void;
  totalVisible: number;
  total: number;
  /** La programacion, que la pone la cartelera para no duplicar su logica. */
  children: React.ReactNode;
}) {
  return (
    <aside
      className="isla-cartelera"
      aria-label="Buscador y ficha del artista en pantalla"
    >
      {/* Lo que no se desplaza: buscar y filtrar tienen que estar siempre a
          la vista, porque son los mandos. Si se fueran con el scroll habria que
          volver arriba cada vez que se quiere cambiar de filtro. */}
      <div className="isla-fijo">
        <Controles
          busqueda={busqueda}
          alBuscar={alBuscar}
          disciplinas={disciplinas}
          filtro={filtro}
          alFiltrar={alFiltrar}
          totalVisible={totalVisible}
          total={total}
          id="isla"
        />
      </div>

      {/* Lo que se desplaza: la ficha de la compania, que es lo unico que
          puede crecer sin medida -una semblanza larga, once fechas-. */}
      <div className="isla-desplaza">
        {artista ? (
          /* La clave hace que React desmonte y monte este bloque al cambiar de
           compania, y el CSS lo anima al entrar. Es lo que permite escalonar
           nombre, semblanza y fechas en vez de fundir todo a la vez. */
          <div
            key={artista.id}
            className="isla-ficha"
            style={{ "--tinte": artista.tinte } as React.CSSProperties}
          >
            <h3 className="title-display text-[clamp(1.1rem,1.25vw,1.35rem)] font-medium text-[#f5f3f3]">
              {artista.nombre}
            </h3>

            <div className="isla-programacion">{children}</div>

            {/* La semblanza va plegada y detras de las fechas: quien mira la
              cartelera busca antes cuando actua que quien es. Se usa <details>
              y no un boton con estado porque el navegador ya trae el plegado
              accesible -teclado, lector de pantalla y buscar en la pagina- y
              funciona aunque el JavaScript no llegue a cargar. */}
            {artista.semblanza ? (
              <details className="isla-semblanza-plegada">
                <summary>
                  {/* Los dos rotulos existen siempre y el CSS ensena el que toca
                    segun este abierto o cerrado. Asi el boton dice lo que va a
                    pasar -"Ver semblanza", "Ocultar semblanza"- en vez de
                    dejarlo a la interpretacion de una flecha, que es lo que
                    tenia antes y no se entendia. */}
                  <span className="isla-ver-mas">Ver semblanza</span>
                  <span className="isla-ver-menos">Ocultar semblanza</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 6.5 8 10.5 12 6.5" />
                  </svg>
                </summary>
                <p className="isla-semblanza">{artista.semblanza}</p>
              </details>
            ) : null}
          </div>
        ) : (
          <p className="isla-vacio">
            Ninguna compañía coincide con la búsqueda.
          </p>
        )}
      </div>
    </aside>
  );
}

/**
 * Pastilla de filtro.
 *
 * Es un boton y no un enlace porque no navega: cambia lo que se ve. Lleva
 * aria-pressed para que un lector de pantalla anuncie si esta puesto, que es
 * algo que el color por si solo no comunica.
 */
function Filtro({
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
      className="isla-filtro"
      data-activo={activo ? "si" : "no"}
    >
      {children}
    </button>
  );
}

/**
 * Buscador y filtros.
 *
 * Vive aparte porque lo usan los dos sitios: la isla en pantalla ancha y la
 * barra plegable en movil. Duplicar el marcado habria significado duplicar
 * tambien los identificadores de la etiqueta y el campo, y entonces uno de los
 * dos <label> apuntaria al campo equivocado; de ahi que el id venga de fuera.
 */
export function Controles({
  busqueda,
  alBuscar,
  disciplinas,
  filtro,
  alFiltrar,
  totalVisible,
  total,
  id,
}: {
  busqueda: string;
  alBuscar: (v: string) => void;
  disciplinas: Disciplina[];
  filtro: Disciplina | null;
  alFiltrar: (d: Disciplina | null) => void;
  totalVisible: number;
  total: number;
  id: string;
}) {
  /* Se mira la cadena entera y no la recortada: quien haya tecleado solo
     espacios tiene igualmente algo que borrar. */
  const hayBusqueda = busqueda !== "";
  const hayFiltro = filtro !== null;

  return (
    <>
      <div className="isla-bloque">
        <label
          htmlFor={`${id}-buscar`}
          className="font-mono text-[0.7rem] tracking-[0.05em] text-[#8b8686] uppercase"
        >
          Buscar
        </label>
        <div className="isla-campo-caja mt-2">
          <input
            id={`${id}-buscar`}
            type="search"
            value={busqueda}
            onChange={(e) => alBuscar(e.target.value)}
            placeholder="Compañía, obra o municipio"
            className="isla-campo"
          />
          {/* El aspa solo existe cuando hay algo escrito: un boton de borrar
              sobre un campo vacio no hace nada y ensucia el unico control que
              tiene el bloque. */}
          {hayBusqueda ? (
            <button
              type="button"
              onClick={() => alBuscar("")}
              aria-label="Borrar lo buscado"
              className="isla-borrar"
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

      <div className="isla-bloque">
        <p className="font-mono text-[0.7rem] tracking-[0.05em] text-[#8b8686] uppercase">
          Disciplina
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {/* "Todas" es un filtro mas y no un boton de borrar: asi el grupo se
              lee como una sola eleccion y siempre hay una activa. */}
          <Filtro activo={filtro === null} alPulsar={() => alFiltrar(null)}>
            Todas
          </Filtro>
          {disciplinas.map((d) => (
            <Filtro
              key={d}
              activo={filtro === d}
              alPulsar={() => alFiltrar(filtro === d ? null : d)}
            >
              {d}
            </Filtro>
          ))}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3 font-mono text-[0.7rem] tracking-[0.05em]">
          <p aria-live="polite" className="text-[#6f6a6a]">
            {totalVisible === total
              ? `${total} compañías`
              : `${totalVisible} de ${total} compañías`}
          </p>
          {/* Devuelve la cartelera entera de un toque. Se solapa a proposito con
              "Todas" -que sigue siendo la forma de moverse entre disciplinas- y
              con el aspa del campo: lo que ninguno de los dos hace es deshacer
              busqueda y filtro a la vez, que es justo el estado del que cuesta
              salir. Aparece solo cuando hay algo que deshacer. */}
          {hayBusqueda || hayFiltro ? (
            <button
              type="button"
              onClick={() => {
                alBuscar("");
                alFiltrar(null);
              }}
              className="isla-limpiar shrink-0"
            >
              Limpiar todo
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

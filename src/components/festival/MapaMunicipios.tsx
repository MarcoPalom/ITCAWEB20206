"use client";

import { useEffect, useMemo, useState, useTransition, ViewTransition } from "react";

import type { Municipio } from "@/data/municipios";
import { MUNICIPIOS_MAPA, VIEWBOX_MUNICIPIOS } from "@/data/municipios_mapa";
import { estiloTono } from "@/data/paleta";
import MandosPlegables from "./MandosPlegables";
import { useEsAncha } from "./usarAnchura";

const [, , ANCHO, ALTO] = VIEWBOX_MUNICIPIOS.split(" ").map(Number);

/* Un solo indice de color por municipio, para todo el componente: el
   marcador del mapa y la ficha de color de la sheet son el mismo elemento
   con nombre de ViewTransition en dos momentos distintos, y si tomaran el
   tono de dos fuentes diferentes -el orden alfabetico de un lado, el numero
   del comite del otro- el morph terminaria con un cambio de color a media
   animacion en vez de uno limpio. */
const INDICE_TONO = new Map(MUNICIPIOS_MAPA.map((m, i) => [m.id, i]));

/**
 * Mapa interactivo de los 43 municipios de Tamaulipas.
 *
 * El contorno de cada municipio es puramente decorativo (SVG, aria-hidden):
 * varios -Miquihuana, Palmillas- son una astilla de pocos pixeles, y hacerlos
 * el propio control interactivo dejaria sin mapa util a quien no pueda hacer
 * clic milimetrico. El control real es un <button> HTML del mismo tamano
 * para los 43, superpuesto en el centroide de cada uno; ese boton es ademas
 * el elemento con nombre de ViewTransition, asi que el marcador -no el
 * poligono- es lo que morfea hacia la sheet.
 *
 * El nombre de la transicion (`municipio-sheet`) es fijo y no por id: React
 * exige que como mucho un elemento en pantalla lleve un nombre dado en cada
 * instante. Por eso el marcador seleccionado deja de llevarlo -su copia con
 * nombre se desmonta- en el mismo commit en que la cabecera de la sheet lo
 * toma prestado; al cerrar, ocurre al reves y el morph se reproduce en
 * sentido contrario.
 */
export default function MapaMunicipios({ municipios }: { municipios: Municipio[] }) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const esAncha = useEsAncha();

  const porId = useMemo(() => {
    const mapa = new Map(municipios.map((m) => [m.id, m]));
    return mapa;
  }, [municipios]);

  const seleccionado = seleccionadoId ? (porId.get(seleccionadoId) ?? null) : null;

  function seleccionar(id: string | null) {
    startTransition(() => setSeleccionadoId(id));
  }

  useEffect(() => {
    if (!seleccionadoId) return;
    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") seleccionar(null);
    }
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [seleccionadoId]);

  return (
    <section
      className="mapa-municipios"
      style={{ background: "var(--id-rosa)", color: "var(--id-tinta)" }}
    >
      <div className="mapa-municipios-cabecera">
        <p className="meta opacity-70">FICSM 2026</p>
        <h1 className="title-display mt-2 text-[clamp(2.25rem,7vw,5rem)] leading-[0.92] font-black tracking-[-0.03em]">
          Municipios
        </h1>
        <p className="mapa-municipios-entradilla">
          Los 43 municipios de Tamaulipas tienen programacion propia. Toca uno
          en el mapa o elige de la lista para ver su cartel.
        </p>
      </div>

      <div className="mapa-municipios-cuerpo">
        <div className="mapa-municipios-lienzo">
          <svg
            viewBox={VIEWBOX_MUNICIPIOS}
            className="mapa-municipios-svg"
            aria-hidden="true"
          >
            {MUNICIPIOS_MAPA.map((m, i) => (
              <path
                key={m.id}
                d={m.d}
                className="mapa-municipios-contorno"
                style={estiloTono(i)}
                data-activo={seleccionadoId === m.id ? "si" : "no"}
              />
            ))}
          </svg>

          {MUNICIPIOS_MAPA.map((m, i) => {
            const marcador = (
              <button
                type="button"
                onClick={() => seleccionar(seleccionadoId === m.id ? null : m.id)}
                className="mapa-municipios-marcador"
                style={
                  {
                    left: `${(m.centro[0] / ANCHO) * 100}%`,
                    top: `${(m.centro[1] / ALTO) * 100}%`,
                    ...estiloTono(i),
                  } as React.CSSProperties
                }
                aria-pressed={seleccionadoId === m.id}
              >
                <span className="sr-only">{m.nombre}</span>
              </button>
            );

            /* Solo el marcador seleccionado -y mientras no haya sheet abierta
               tomandole el nombre prestado- lo lleva puesto. Ver comentario
               de arriba del componente. */
            return seleccionadoId === m.id ? (
              <span key={m.id}>{marcador}</span>
            ) : (
              <ViewTransition key={m.id} name={`municipio-${m.id}`}>
                {marcador}
              </ViewTransition>
            );
          })}
        </div>

        <MandosPlegables
          rotulo="Lista de municipios"
          cuenta={seleccionado ? seleccionado.nombre : `${municipios.length}`}
        >
          <ListaMunicipios
            municipios={municipios}
            seleccionadoId={seleccionadoId}
            onSeleccionar={seleccionar}
          />
        </MandosPlegables>

        {esAncha ? (
          <div className="mapa-municipios-lista-fija">
            <ListaMunicipios
              municipios={municipios}
              seleccionadoId={seleccionadoId}
              onSeleccionar={seleccionar}
            />
          </div>
        ) : null}
      </div>

      {seleccionado ? (
        <Sheet municipio={seleccionado} onCerrar={() => seleccionar(null)} />
      ) : null}
    </section>
  );
}

function ListaMunicipios({
  municipios,
  seleccionadoId,
  onSeleccionar,
}: {
  municipios: Municipio[];
  seleccionadoId: string | null;
  onSeleccionar: (id: string) => void;
}) {
  return (
    <ul className="mapa-municipios-lista" aria-label="Los 43 municipios">
      {municipios.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            onClick={() => onSeleccionar(m.id)}
            aria-pressed={seleccionadoId === m.id}
            className="mapa-municipios-item"
            data-activo={seleccionadoId === m.id ? "si" : "no"}
          >
            <span className="mapa-municipios-item-numero">
              {String(m.numero).padStart(2, "0")}
            </span>
            <span>{m.nombre}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/* Domingo, sabado... el orden en que el comite anoto los dias no es
   necesariamente el cronologico -algunas filas del Excel se llenaron fuera
   de orden-, y aqui si importa: la sheet lista la programacion en el orden
   en que ocurre. */
const ORDEN_DIAS = [
  "Viernes 2",
  "Sábado 3",
  "Domingo 4",
  "Lunes 5",
  "Martes 6",
  "Miércoles 7",
  "Jueves 8",
  "Viernes 9",
  "Sábado 10",
  "Domingo 11",
];

function Sheet({ municipio, onCerrar }: { municipio: Municipio; onCerrar: () => void }) {
  const porDia = new Map<string, typeof municipio.eventos>();
  for (const evento of municipio.eventos) {
    const dia = evento.dias[0] ?? "Fecha por confirmar";
    porDia.set(dia, [...(porDia.get(dia) ?? []), evento]);
  }
  const dias = [...porDia.keys()].sort(
    (a, b) => ORDEN_DIAS.indexOf(a) - ORDEN_DIAS.indexOf(b),
  );

  return (
    <div className="mapa-municipios-velo" onClick={onCerrar}>
      <div
        className="mapa-municipios-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Programacion de ${municipio.nombre}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mapa-municipios-sheet-cabecera">
          <ViewTransition name="municipio-sheet">
            <span
              className="mapa-municipios-sheet-chip"
              style={estiloTono(INDICE_TONO.get(municipio.id) ?? 0)}
            >
              {String(municipio.numero).padStart(2, "0")}
            </span>
          </ViewTransition>
          <h2 className="title-display text-[clamp(1.5rem,4vw,2.25rem)] font-light">
            {municipio.nombre}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="mapa-municipios-sheet-cerrar"
            aria-label="Cerrar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 3l10 10M13 3 3 13" />
            </svg>
          </button>
        </div>

        <div className="mapa-municipios-sheet-conteos">
          <Conteo etiqueta="Internacional" valor={municipio.conteos.internacional} />
          <Conteo etiqueta="Nacional" valor={municipio.conteos.nacional} />
          <Conteo etiqueta="Tamaulipeco" valor={municipio.conteos.tamaulipeco} />
          <Conteo etiqueta="Local" valor={municipio.conteos.local} />
        </div>

        <div className="mapa-municipios-sheet-cuerpo">
          {dias.length === 0 ? (
            <p className="mapa-municipios-sheet-vacio">
              Programacion por confirmar.
            </p>
          ) : (
            dias.map((dia, i) => (
              <div
                key={dia}
                className="mapa-municipios-dia"
                style={{ "--orden": i } as React.CSSProperties}
              >
                <p className="mapa-municipios-dia-rotulo">{dia}</p>
                {(porDia.get(dia) ?? []).map((evento, j) => (
                  <article key={j} className="mapa-municipios-evento">
                    <p className="mapa-municipios-evento-hora">{evento.hora}</p>
                    <div>
                      <h3 className="mapa-municipios-evento-titulo">
                        {evento.titulo || evento.artista}
                      </h3>
                      {evento.titulo && evento.artista ? (
                        <p className="mapa-municipios-evento-artista">{evento.artista}</p>
                      ) : null}
                      <p className="mapa-municipios-evento-meta">
                        {[evento.disciplina, evento.procedencia].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mapa-municipios-evento-sede">{evento.sede}</p>
                      {evento.inauguracion ? (
                        <p className="mapa-municipios-evento-nota">
                          Inauguracion: {evento.inauguracion}
                        </p>
                      ) : null}
                      {evento.notas.map((nota, k) => (
                        <p key={k} className="mapa-municipios-evento-nota">
                          {nota}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Conteo({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="mapa-municipios-conteo">
      <p className="mapa-municipios-conteo-valor">{valor}</p>
      <p className="mapa-municipios-conteo-etiqueta">{etiqueta}</p>
    </div>
  );
}

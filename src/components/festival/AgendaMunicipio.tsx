"use client";

import { useEffect, useRef, useState } from "react";

import type { TipoEvento } from "@/data/municipios";

/**
 * La agenda de un municipio: una columna por dia y, al tocar un acto, la ficha
 * de quien lo hace.
 *
 * La rejilla tiene que ser densa -hasta 43 actos en Reynosa, en columnas de
 * 13rem- y ahi no cabe mas que el titulo y la hora. Todo lo demas -la
 * compania, de donde viene, la sede, la semblanza- vive en un panel que se abre
 * al tocar. Asi la agenda sigue leyendose de un vistazo, que es para lo que
 * sirve, sin esconder lo que hay detras de cada linea.
 *
 * El panel es un <dialog> nativo abierto con showModal(). No es pereza: de ahi
 * salen gratis y bien hechos el cierre con Escape, el foco atrapado dentro
 * mientras esta abierto, el fondo inerte al raton y al lector de pantalla, y el
 * anuncio como dialogo. Escrito a mano con un div y un onKeyDown, cada una de
 * esas cuatro cosas es un error a la espera.
 */
export type ActoAgenda = {
  /** Estable dentro de la agenda: dia + posicion. Solo para React. */
  id: string;
  titulo: string;
  artista: string;
  disciplina: string;
  procedencia: string;
  hora: string;
  /** "19:45", o null cuando el programa aun no la fija. Para el calendario. */
  horaCruda: string | null;
  /** Las fechas ISO del volcado. Varias cuando la funcion dura dias. */
  fechas: string[];
  sede: string;
  /** Las etiquetas del programa, p. ej. "Viernes 2". Una exposicion trae varias. */
  dias: string[];
  tipo: TipoEvento;
  descripcion: string | null;
  creditos: string[];
  notas: string[];
  inauguracion: string | null;
  /** De la ficha de la cartelera. Vacia cuando esa compania no tiene ficha. */
  semblanza: string;
  /** Ruta de su fotografia, o null si aun no ha entregado material. */
  foto: string | null;
  /** Codigos ISO para las banderas. Solo las internacionales traen. */
  banderas: string[];
};

export type DiaAgenda = {
  dia: string;
  tono: string;
  actos: ActoAgenda[];
  /** Avisos del municipio para ese dia. No son actos y no se pueden tocar. */
  avisos: string[];
};

/**
 * La direccion que se lleva ese acto al calendario del telefono.
 *
 * null cuando el programa todavia no ha fijado la fecha: un evento sin dia no
 * se puede agendar. Es la misma ruta que usa la cartelera general, que sirve el
 * .ics y no lo fabrica en el navegador -en el telefono, Safari trata un Blob
 * como descarga anonima y no siempre ofrece anadirlo al calendario-.
 */
function enlaceAgenda(acto: ActoAgenda, municipio: string): string | null {
  const desde = acto.fechas[0];
  if (!desde) return null;

  const datos = new URLSearchParams({
    /* La obra va con la compania cuando hay las dos y son distintas: en el
       calendario, dentro de tres semanas, "Cirko Alebrije" solo dice mucho
       menos que "Cirko Alebrije - Entreverte". Pero el volcado a veces repite
       el nombre en las dos columnas -"Son Kalunga y Ballet Folklorico de
       Pachuca"- y ahi juntarlas deja el nombre escrito dos veces. */
    titulo:
      acto.artista && acto.titulo && acto.artista !== acto.titulo
        ? `${acto.artista} - ${acto.titulo}`
        : acto.artista || acto.titulo,
    sede: acto.sede === "Por confirmar" ? "" : acto.sede,
    municipio,
    desde,
    hasta: acto.fechas[acto.fechas.length - 1] ?? desde,
    hora: acto.horaCruda ?? "",
  });

  return `/festival/evento?${datos}`;
}

export default function AgendaMunicipio({
  dias,
  municipio,
}: {
  dias: DiaAgenda[];
  municipio: string;
}) {
  const [acto, cambiarActo] = useState<ActoAgenda | null>(null);
  const panel = useRef<HTMLDialogElement | null>(null);

  /* Abrir y cerrar se hacen aqui y no en el onClick porque el dialogo tambien
     se cierra por su cuenta -Escape, el boton de dentro, el fondo-, y con dos
     sitios mandando sobre lo mismo se acaba con el estado diciendo "abierto" y
     el dialogo cerrado. Manda el estado; onClose lo devuelve a su sitio. */
  useEffect(() => {
    const d = panel.current;
    if (!d) return;
    if (acto && !d.open) d.showModal();
    if (!acto && d.open) d.close();
  }, [acto]);

  return (
    <>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] items-start gap-6">
        {dias.map(({ dia, tono, actos, avisos }) => (
          <div key={dia} className="overflow-hidden rounded-lg border border-line">
            <p
              className="px-3.5 py-2.5 font-mono text-[0.7rem] tracking-[0.06em] uppercase"
              style={{ background: `var(--id-${tono})`, color: `var(--sobre-${tono})` }}
            >
              {dia}
            </p>
            {actos.map((a) => (
              /* Boton y no un div con onClick: asi llega el teclado, el foco
                 visible y el anuncio como control, sin escribir nada. */
              <button
                key={a.id}
                type="button"
                onClick={() => cambiarActo(a)}
                className="agenda-acto"
                style={{ borderLeft: `3px solid var(--id-${tono})` }}
              >
                <span className="agenda-acto-titulo">{a.titulo || a.artista}</span>
                <span className="agenda-acto-hora">{a.hora}</span>
              </button>
            ))}
            {avisos.map((aviso) => (
              <p key={aviso} className="agenda-aviso">
                {aviso}
              </p>
            ))}
          </div>
        ))}
      </div>

      <dialog
        ref={panel}
        className="agenda-panel"
        aria-label="Ficha del espectáculo"
        onClose={() => cambiarActo(null)}
        /* Pulsar el fondo cierra. El click del fondo llega al propio <dialog>,
           asi que basta con mirar si el destino es el y no algo de dentro. Por
           eso el dialogo no lleva relleno propio: si lo llevara, pulsar su
           margen contaria como pulsar fuera. */
        onClick={(e) => {
          if (e.target === e.currentTarget) cambiarActo(null);
        }}
      >
        {acto ? (
          <Ficha
            acto={acto}
            municipio={municipio}
            alCerrar={() => cambiarActo(null)}
          />
        ) : null}
      </dialog>
    </>
  );
}

function Ficha({
  acto,
  municipio,
  alCerrar,
}: {
  acto: ActoAgenda;
  municipio: string;
  alCerrar: () => void;
}) {
  /* Cuando el programa no da titulo de obra, el titular es la compania: en ese
     caso no se repite debajo. */
  const titular = acto.titulo || acto.artista;
  const repiteNombre = acto.titulo !== "" && acto.artista !== "" && acto.artista !== acto.titulo;
  const agenda = enlaceAgenda(acto, municipio);

  return (
    <article className="agenda-ficha">
      {acto.foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/img/artistas/${acto.foto}/fondo.webp`}
          alt={`Fotografía de ${acto.artista || titular}`}
          loading="lazy"
          decoding="async"
          className="agenda-foto"
        />
      ) : null}

      <button type="button" onClick={alCerrar} aria-label="Cerrar" className="agenda-cerrar">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4.5 4.5 11.5 11.5" />
          <path d="M11.5 4.5 4.5 11.5" />
        </svg>
      </button>

      <div className="agenda-cuerpo">
        <p className="meta text-accent">
          {acto.dias.join(" · ") || "Fecha por confirmar"} · {acto.hora}
        </p>

        <h3 className="title-display mt-2 text-[clamp(1.5rem,4.5vw,2rem)] leading-tight font-light">
          {titular}
        </h3>

        {repiteNombre ? (
          <p className="mt-1.5 text-[0.95rem] font-semibold text-charcoal">{acto.artista}</p>
        ) : null}

        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.7rem] text-muted">
          {acto.banderas.map((codigo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={codigo}
              src={`/img/banderas/${codigo}.svg`}
              alt=""
              aria-hidden="true"
              className="inline-block h-3.5 w-3.5 rounded-full"
            />
          ))}
          {[acto.disciplina, acto.procedencia].filter(Boolean).join(" · ")}
        </p>

        {/* Va arriba y no al pie: en una hoja que sube desde abajo, lo que se
            quiere hacer con el acto tiene que verse sin desplazar, y la
            semblanza puede ser larga.

            Enlace y no boton: es una descarga, y asi funciona tambien si el
            javascript no llega a correr. El navegador ve un .ics y abre el
            calendario del telefono con la funcion ya rellenada.

            Solo en movil, por lo mismo que en la cartelera: en escritorio el
            calendario del visitante esta en otro aparato, asi que el enlace no
            lleva a ninguna parte util. Eso lo esconde .agenda-agendar en
            globals.css con su propia consulta de medios, no con la utilidad
            sm:hidden de Tailwind -ver alli por que aquella no ganaba-. */}
        {agenda ? (
          <a href={agenda} className="agenda-agendar">
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="1.5" />
              <path d="M2.25 6.25h11.5M5.5 2v2.5M10.5 2v2.5" />
            </svg>
            Agendar en mi calendario
          </a>
        ) : null}

        {/* La sede va en su propia linea y con rotulo: es el dato por el que se
            abre esta ficha tantas veces como por la semblanza. */}
        <Dato rotulo="Sede" valor={acto.sede} />
        {acto.inauguracion ? <Dato rotulo="Inauguración" valor={acto.inauguracion} /> : null}

        {acto.descripcion ? (
          <p className="mt-4 text-sm leading-relaxed text-charcoal">{acto.descripcion}</p>
        ) : null}

        {acto.semblanza ? (
          <p className="mt-4 text-sm leading-relaxed text-charcoal">{acto.semblanza}</p>
        ) : (
          /* Se dice que falta en vez de dejar el hueco: asi no parece que el
             panel se haya quedado a medio cargar. Pasa en las companias que no
             estan en la cartelera general -13 de 321 actos-. */
          <p className="mt-4 text-sm text-muted italic">
            Aún no hay semblanza de esta compañía en el programa.
          </p>
        )}

        {acto.creditos.length > 0 ? (
          <div className="mt-4">
            <p className="meta text-muted">Créditos</p>
            <ul className="mt-1.5 space-y-0.5 text-sm text-charcoal">
              {acto.creditos.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {acto.notas.length > 0 ? (
          <div className="agenda-notas">
            {acto.notas.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function Dato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <p className="mt-3 text-sm">
      <span className="meta text-muted">{rotulo}</span>
      <span className="mt-0.5 block text-charcoal">{valor}</span>
    </p>
  );
}

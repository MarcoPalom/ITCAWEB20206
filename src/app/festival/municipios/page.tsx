import type { Metadata } from "next";
import { ViewTransition } from "react";

import EnlaceBarrido from "@/components/festival/EnlaceBarrido";
import MarcoImagen from "@/components/MarcoImagen";
import { FESTIVAL } from "@/data/festival";
import { MUNICIPIOS } from "@/data/municipios";
import { MUNICIPIOS_FOTOS } from "@/data/municipios_fotos";
import { SITIO } from "@/data/sitio";

const DESCRIPCION = "La programación que recorre los 43 municipios de Tamaulipas.";

export const metadata: Metadata = {
  title: `Municipios | ${FESTIVAL.siglas} ${FESTIVAL.anio}`,
  description: DESCRIPCION,
  alternates: { canonical: `${SITIO}/festival/municipios` },
  /* openGraph propio: reemplaza el del layout raiz entero, asi que siteName
     y locale se repiten aqui en vez de heredarse campo a campo. */
  openGraph: {
    siteName: "ITCA",
    locale: "es_MX",
    title: `Municipios | ${FESTIVAL.siglas} ${FESTIVAL.anio}`,
    description: DESCRIPCION,
    url: `${SITIO}/festival/municipios`,
    type: "website",
    images: [`${SITIO}/opengraph-image.png`],
  },
};

/**
 * Tamano de la ficha segun cuantos espectaculos trae ese municipio -no segun
 * si tiene sede confirmada-: a mas programacion, mas espacio en la rejilla.
 * Solo se varia el ancho (col-span), nunca el alto: todas las fichas ocupan
 * una sola fila, igual que el bento de Sedes.tsx, y por eso no deja huecos
 * -un row-span distinto por ficha si los deja, porque el alto de cada fila
 * la fija el contenido y dos filas de alto distinto no encajan entre si-.
 */
function tamano(totalEspectaculos: number) {
  if (totalEspectaculos >= 19) {
    return { col: "col-span-2 sm:col-span-3", proporcion: "21 / 9", titulo: "text-2xl sm:text-3xl" };
  }
  if (totalEspectaculos >= 10) {
    return { col: "col-span-2", proporcion: "16 / 9", titulo: "text-lg sm:text-xl" };
  }
  return { col: "", proporcion: "1 / 1", titulo: "text-sm sm:text-base" };
}

export default function MunicipiosPage() {
  return (
    <ViewTransition key="municipios-bento" enter="revelar" exit="debajo" default="none">
      <main className="flex-1">
        {/* bg-bone explicito y no heredado del body: el barrido circular
            revela una instantanea de esta seccion tal como la pinta el
            navegador, y una seccion sin fondo propio pinta transparente en
            sus huecos -el espacio entre fichas, los margenes-. Ahi se
            colaba la pagina anterior por debajo del circulo ya "revelado",
            como si el barrido nunca hubiera cubierto esa zona. Todas las
            demas secciones tienen fondo explicito propio (el tinte de la
            portadilla, o el oscuro de la cartelera); esta, al ser la unica
            clara que no lo tenia, era la unica donde el hueco se notaba. */}
        <section className="border-b border-line bg-bone py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {MUNICIPIOS.map((m) => {
                const { col, proporcion, titulo } = tamano(m.totalEspectaculos);
                const foto = MUNICIPIOS_FOTOS[m.id];

                return (
                  <EnlaceBarrido
                    key={m.id}
                    href={`/festival/municipios/${m.id}`}
                    className={`group flex [content-visibility:auto] [contain-intrinsic-size:auto_380px] ${col}`}
                  >
                    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      {foto ? (
                        <div className="overflow-hidden" style={{ aspectRatio: proporcion }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/img/municipios/${m.id}.jpg`}
                            alt={`Fotografía de ${m.nombre}. ${foto.autor ? `Autor: ${foto.autor}.` : ""} ${foto.licencia}, via Wikimedia Commons.`}
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
          </div>
        </section>
      </main>
    </ViewTransition>
  );
}

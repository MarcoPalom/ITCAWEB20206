import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import CarteleraArtistas from "@/components/festival/CarteleraArtistas";
import MapaMunicipios from "@/components/festival/MapaMunicipios";
import { ARTISTAS } from "@/data/artistas";
import { FESTIVAL } from "@/data/festival";
import { MUNICIPIOS } from "@/data/municipios";
import { SECCIONES, seccionPorSlug } from "@/data/secciones";

export function generateStaticParams() {
  return SECCIONES.map((s) => ({ seccion: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seccion: string }>;
}): Promise<Metadata> {
  const { seccion } = await params;
  const datos = seccionPorSlug(seccion);
  if (!datos) return {};
  return {
    title: `${datos.titulo} | ${FESTIVAL.siglas} ${FESTIVAL.anio}`,
    description: datos.entradilla,
  };
}

export default async function SeccionPage({
  params,
}: {
  params: Promise<{ seccion: string }>;
}) {
  const { seccion } = await params;
  const datos = seccionPorSlug(seccion);
  if (!datos) notFound();

  const artistas = ARTISTAS[seccion] ?? [];

  return (
    /* La key es imprescindible: las cuatro secciones comparten este mismo
       page, asi que al ir de una a otra React reutilizaria el componente y lo
       trataria como una actualizacion. Con la key cambia la identidad, hay
       desmontaje y montaje, y las animaciones de entrada y salida se disparan. */
    <ViewTransition key={seccion} enter="revelar" exit="debajo" default="none">
      <main className="flex-1">
        {artistas.length > 0 ? (
          /* Donde hay artistas, la cartelera es lo primero que se ve: nada de
             portadilla de bienvenida por delante. El circulo del barrido
             revela ya la fotografia del primer artista. */
          <CarteleraArtistas artistas={artistas} />
        ) : seccion === "municipios" ? (
          /* Unica seccion sin cartelera de artistas que aun asi no se queda en
             la portadilla de color: tiene su propio mapa interactivo. */
          <MapaMunicipios municipios={MUNICIPIOS} />
        ) : (
          /* Las secciones sin cartelera se quedan en su portadilla de color. */
          <section
            className="flex min-h-svh flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8"
            style={{ background: datos.tinte, color: datos.sobre }}
          >
            <p className="meta opacity-70">
              {FESTIVAL.siglas} {FESTIVAL.anio}
            </p>

            <h1 className="title-display mt-4 text-[clamp(2.75rem,9vw,9rem)] leading-[0.88] font-black tracking-[-0.045em]">
              {datos.titulo}
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-[1.0625rem] leading-relaxed">
              {datos.entradilla}
            </p>
          </section>
        )}
      </main>
    </ViewTransition>
  );
}

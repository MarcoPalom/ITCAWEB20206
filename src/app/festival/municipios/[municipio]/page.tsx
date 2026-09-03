import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import CartelMunicipio from "@/components/festival/CartelMunicipio";
import EnlaceBarrido from "@/components/festival/EnlaceBarrido";
import HorariosMunicipio from "@/components/festival/HorariosMunicipio";
import { MUNICIPIOS, municipioPorId } from "@/data/municipios";
import { FESTIVAL } from "@/data/festival";

export function generateStaticParams() {
  return MUNICIPIOS.map((m) => ({ municipio: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ municipio: string }>;
}): Promise<Metadata> {
  const { municipio } = await params;
  const datos = municipioPorId(municipio);
  if (!datos) return {};
  return {
    title: `${datos.nombre} | Municipios | ${FESTIVAL.siglas} ${FESTIVAL.anio}`,
    description: `Programacion de ${datos.nombre} en el ${FESTIVAL.nombre}.`,
  };
}

export default async function MunicipioPage({
  params,
}: {
  params: Promise<{ municipio: string }>;
}) {
  const { municipio } = await params;
  const datos = municipioPorId(municipio);
  if (!datos) notFound();

  return (
    <>
      {/* Fija: el cartel es alto y los horarios pueden serlo mas -hasta 43
          actividades en Reynosa-, asi que un enlace solo al pie obligaria a
          bajar toda la pagina para volver. Con posicion fija esta a mano en
          todo momento, encima de la seccion oscura y de la clara por igual
          -de ahi el fondo propio con blur, igual que la isla de navegacion
          del pie-.

          Fuera del ViewTransition, con su propio viewTransitionName, por el
          mismo motivo que la isla y la marca: es fija, no se desplaza con el
          resto de la pagina, y sin nombre propio el navegador la mete en la
          misma instantanea plana que el resto del contenido. Ahi el barrido
          circular no la respeta como un elemento aparte -no hay circulo que
          valga sobre un elemento que ya esta fijo en pantalla-, y el
          resultado es un reborde irregular en vez de un circulo limpio. Con
          nombre propio pasa a su propio grupo, igual que "isla" y "marca",
          y globals.css le aplica el mismo fundido corto en vez del barrido. */}
      <EnlaceBarrido
        href="/festival/municipios"
        style={{ viewTransitionName: "volver-municipios" }}
        className="fixed top-4 left-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/85 py-2 pr-4 pl-3 text-sm text-charcoal shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors hover:bg-surface sm:top-6 sm:left-6"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.5 3.5 5 9l5.5 5.5" />
        </svg>
        Municipios
      </EnlaceBarrido>

      <ViewTransition key={`municipio-${municipio}`} enter="revelar" exit="debajo" default="none">
        <main className="flex-1">
          {/* Cartel: poster de lineup, oscuro, con los nombres en jerarquia
              de alcance (internacional > nacional > tamaulipeco > local). */}
          <CartelMunicipio municipio={datos} />

          {/* Horarios: rejilla de columnas por dia, clara. */}
          <HorariosMunicipio municipio={datos} />
        </main>
      </ViewTransition>
    </>
  );
}

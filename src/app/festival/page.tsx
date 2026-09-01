import type { Metadata } from "next";
import { ViewTransition } from "react";

import PortadaFestival from "@/components/festival/PortadaFestival";
import { FESTIVAL } from "@/data/festival";

export const metadata: Metadata = {
  title: `${FESTIVAL.nombre} | ITCA`,
  description: `Primera edicion, del ${FESTIVAL.fechas}. Musica, danza, teatro, cine y letras en seis sedes del litoral de Tamaulipas. Entrada libre.`,
};

export default function FestivalPage() {
  return (
    /* El ViewTransition va aqui, dentro de la page, y no en el layout: un
       layout no se desmonta al cambiar de ruta, asi que React lo trataria como
       una actualizacion y las animaciones de entrada y salida no llegarian a
       dispararse. Ese fue el motivo de que antes no se animara nada. */
    <ViewTransition enter="revelar" exit="debajo" default="none">
      <main className="flex-1">
        <PortadaFestival />
      </main>
    </ViewTransition>
  );
}

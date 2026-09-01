import TunelPaneles from "./TunelPaneles";
import { FESTIVAL } from "@/data/festival";

/**
 * Portada del festival: un solo viewport, sin scroll interno.
 *
 * La composicion es un tunel de fotografias que gira alrededor de un punto de
 * vista fijo, con el titular arriba y la entradilla abajo, en el hueco que
 * dejan los paneles del fondo. Mientras no haya material, los paneles son
 * marcos vacios: la geometria se lee igual y nadie confunde un relleno de
 * color con la foto definitiva.
 */
export default function PortadaFestival() {
  return (
    <section className="relative flex h-svh min-h-136 flex-col overflow-hidden bg-bone">
      <TunelPaneles />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="pt-20 sm:pt-24">
          {/* El acronimo es el titulo, en el peso mas alto de Encode. La
              variante variable llega a 900, asi que no hace falta condensarlo
              ni forzar mayusculas por CSS: va escrito ya en versal.

              Va en morado y no en tinta porque es el unico de los ocho colores
              del imagotipo que aguanta como texto sobre el fondo claro: 6.2:1,
              contra el 3.9:1 del azul, que es el siguiente. Los demas se
              quedan por debajo de 3.2:1 y solo sirven de relleno. */}
          <h1 className="title-display text-[clamp(4rem,10vw,12rem)] leading-[0.85] font-black tracking-[-0.045em] text-[var(--id-morado)]">
            {FESTIVAL.siglas} {FESTIVAL.anio}
          </h1>
        </div>

        {/* Pie de portada. El relleno inferior deja libre la franja donde
            flota la isla, para que no se pisen. */}
        <div className="mt-auto flex w-full flex-col items-center gap-4 pb-[17svh]">
          {/* Las fechas van en cartel: fondo propio y relleno generoso, que es
              lo que las separa del resto y las hace destacar. */}
          <p className="cartel-fechas">{FESTIVAL.fechasLargas}</p>

          <p className="max-w-lg text-[clamp(0.95rem,1.4vw,1.25rem)] leading-snug text-charcoal">
            {FESTIVAL.nombre}
          </p>
        </div>
      </div>

      {/* En movil este renglon cae justo donde flota la isla, asi que solo se
          muestra a partir de tableta. */}
      <p className="meta absolute bottom-4 left-4 z-10 hidden text-muted sm:left-6 sm:block lg:left-8">
        Companias participantes en la edicion 2026
      </p>
    </section>
  );
}

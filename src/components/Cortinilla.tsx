import Link from "next/link";

import { FESTIVAL } from "@/data/festival";

/**
 * Cortinilla de obra: lo unico que se sirve en la raiz mientras el sitio del
 * ITCA no este terminado.
 *
 * No es una capa por encima de la pagina, es la pagina. La diferencia importa:
 * una cortinilla superpuesta se quita desde el inspector, se salta con el
 * teclado y deja el contenido de debajo indexable y descargable. Aqui el sitio
 * institucional no llega a renderizarse, asi que no hay nada por detras que
 * flanquear -y de paso el visitante no se descarga una pagina que no va a ver-.
 *
 * No lleva boton de cerrar a proposito. La unica salida es el festival, que es
 * justo lo que se quiere ofrecer mientras tanto.
 */
export default function Cortinilla() {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center bg-bone px-6 py-24">
      <div className="w-full max-w-xl">
        <p className="font-mono text-xs tracking-[0.05em] text-muted uppercase">
          Instituto Tamaulipeco para la Cultura y las Artes
        </p>

        <h1 className="title-display mt-6 text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] font-medium tracking-[-0.03em] text-charcoal">
          El sitio del ITCA está en construcción
        </h1>

        <p className="mt-6 max-w-prose text-base leading-relaxed text-charcoal">
          Estamos trabajando en el sitio del Instituto. Mientras tanto ya puede
          consultarse el del {FESTIVAL.nombre}, con el programa por compañía,
          las sedes y los horarios.
        </p>

        {/* El borde de 1px es el recurso estructural del sistema; separa el
            bloque de invitacion del texto sin necesidad de una tarjeta. */}
        <div className="mt-10 border-t border-line pt-10">
          <Link
            href="/festival"
            /* Alto minimo de 44px por area tactil. El primario va en charcoal,
               no en el acento: el acento se reserva para texto y etiquetas. */
            className="inline-flex min-h-11 items-center rounded-md bg-charcoal px-6 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-bone focus-visible:outline-none"
          >
            Ir al sitio del festival
          </Link>

          <p className="mt-6 font-mono text-xs tracking-[0.05em] text-muted uppercase">
            {FESTIVAL.siglas} {FESTIVAL.anio} — {FESTIVAL.edicion} —{" "}
            {FESTIVAL.fechas}
          </p>
        </div>
      </div>
    </main>
  );
}

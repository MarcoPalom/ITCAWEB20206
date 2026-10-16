import { EJES as EJES_ITCA } from "@/data/itca";

/* Los cuatro ejes de accion del Instituto, cada uno seguido de sus
   programas: la cinta dice que hace el ITCA, no solo como se organiza. */
const EJES = EJES_ITCA.flatMap((e) => [e.nombre, ...e.programas]);

export default function Marquee() {
  // Se duplica la lista para que el desplazamiento del 50% cierre el bucle sin salto.
  const cinta = [...EJES, ...EJES];

  return (
    <div className="overflow-hidden border-b border-line bg-bone py-4">
      <div className="flex w-max animate-drift" aria-hidden="true">
        {cinta.map((eje, i) => (
          <span key={i} className="meta flex shrink-0 items-center text-muted">
            {eje}
            <span className="mx-6 text-line">&mdash;</span>
          </span>
        ))}
      </div>
      <span className="sr-only">
        Ejes de acción y programas del Instituto: {EJES.join(", ")}.
      </span>
    </div>
  );
}

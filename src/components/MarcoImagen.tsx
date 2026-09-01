type MarcoImagenProps = {
  /** Que fotografia ira aqui. Se muestra literalmente en el marcador. */
  descripcion: string;
  /** Proporcion del hueco, en formato CSS: "3 / 4", "16 / 9". */
  proporcion?: string;
  /** "clara" sobre fondo bone, "oscura" sobre fondo charcoal. */
  tono?: "clara" | "oscura";
  className?: string;
};

/**
 * Hueco reservado para una fotografia que todavia no existe.
 *
 * Es deliberadamente un marco vacio con borde de 1px y una etiqueta en mono
 * que dice que ira dentro: nada de degradados de relleno, que acaban
 * confundiendose con diseno final y sobreviven a la entrega.
 */
export default function MarcoImagen({
  descripcion,
  proporcion = "4 / 3",
  tono = "clara",
  className = "",
}: MarcoImagenProps) {
  const oscura = tono === "oscura";

  return (
    <div
      role="img"
      aria-label={`Espacio reservado para fotografia: ${descripcion}`}
      style={{ aspectRatio: proporcion }}
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-lg border p-5 ${
        oscura
          ? "border-white/15 bg-white/[0.03]"
          : "border-line bg-bone"
      } ${className}`}
    >
      <span
        className={`meta ${oscura ? "text-muted-inverse" : "text-muted"}`}
        aria-hidden="true"
      >
        Fotografia pendiente
      </span>

      {/* Cruz de encuadre: marca el centro del hueco sin llenarlo de color. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
      >
        <span
          className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 ${
            oscura ? "bg-white/20" : "bg-line"
          }`}
        />
        <span
          className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 ${
            oscura ? "bg-white/20" : "bg-line"
          }`}
        />
      </span>

      <span
        aria-hidden="true"
        className={`relative max-w-[28ch] font-mono text-xs leading-relaxed ${
          oscura ? "text-muted-inverse" : "text-muted"
        }`}
      >
        {descripcion}
      </span>
    </div>
  );
}

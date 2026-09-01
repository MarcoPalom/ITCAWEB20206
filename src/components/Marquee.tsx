const EJES = [
  "Cultura comunitaria",
  "Desarrollo cultural",
  "Infancias y juventudes",
  "Patrimonio",
  "Fomento literario",
];

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
        Ejes de accion del Instituto: {EJES.join(", ")}.
      </span>
    </div>
  );
}

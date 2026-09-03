import type { Municipio } from "@/data/municipios";
import { tono } from "@/data/paleta";

/* El comite no siempre llena las columnas del Excel en orden cronologico:
   aqui si importa, la rejilla de horarios ordena los dias como ocurren y no
   como se capturaron. */
const ORDEN_DIAS = [
  "Viernes 2",
  "Sábado 3",
  "Domingo 4",
  "Lunes 5",
  "Martes 6",
  "Miércoles 7",
  "Jueves 8",
  "Viernes 9",
  "Sábado 10",
  "Domingo 11",
];

/**
 * Horarios de un municipio como rejilla de columnas -una por dia, como una
 * tabla de horarios de festival reparte una columna por escenario-, no como
 * la lista apilada de la Programacion general del sitio. Cada columna lleva
 * su cabecera de color y, debajo, nombre + hora por fila.
 */
export default function HorariosMunicipio({ municipio }: { municipio: Municipio }) {
  const porDia = new Map<string, typeof municipio.eventos>();
  for (const evento of municipio.eventos) {
    const dia = evento.dias[0] ?? "Fecha por confirmar";
    porDia.set(dia, [...(porDia.get(dia) ?? []), evento]);
  }
  const dias = [...porDia.keys()].sort(
    (a, b) => ORDEN_DIAS.indexOf(a) - ORDEN_DIAS.indexOf(b),
  );

  return (
    <section className="border-t border-line bg-bone px-4 py-20 text-charcoal sm:px-6">
      <p className="meta text-center text-accent">Horarios oficiales</p>
      <h2 className="title-display mt-2 text-center text-[clamp(2rem,5vw,3.25rem)] font-light">
        {municipio.nombre}
      </h2>

      {dias.length === 0 ? (
        <p className="mt-8 text-center text-muted">Programación por confirmar.</p>
      ) : (
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] items-start gap-6">
          {dias.map((dia, i) => {
            const idTono = tono(i);
            return (
              <div key={dia} className="overflow-hidden rounded-lg border border-line">
                <p
                  className="px-3.5 py-2.5 font-mono text-[0.7rem] tracking-[0.06em] uppercase"
                  style={{
                    background: `var(--id-${idTono})`,
                    color: `var(--sobre-${idTono})`,
                  }}
                >
                  {dia}
                </p>
                {(porDia.get(dia) ?? []).map((evento, j) => (
                  <div
                    key={j}
                    className="border-t border-line py-3 pr-3.5 pl-3"
                    style={{ borderLeft: `3px solid var(--id-${idTono})` }}
                  >
                    <p className="text-sm leading-snug font-bold text-charcoal">
                      {evento.titulo || evento.artista}
                    </p>
                    <p className="mt-1 font-mono text-[0.7rem] text-muted">{evento.hora}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <p className="meta mt-12 text-center text-muted">Entrada libre en todas las sedes</p>
    </section>
  );
}

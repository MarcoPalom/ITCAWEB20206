import { artistaPorId } from "@/data/artistas";
import type { Municipio } from "@/data/municipios";
import { tono } from "@/data/paleta";

import AgendaMunicipio, { type DiaAgenda } from "./AgendaMunicipio";

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
 *
 * Este componente se queda en el servidor y solo arma los datos; la rejilla y
 * el panel que se abre al tocar un acto los pinta AgendaMunicipio, que si es
 * de cliente. El reparto no es caprichoso: el cruce con la cartelera -de donde
 * salen la semblanza y la fotografia- necesita src/data/artistas.ts, que
 * arrastra 213KB de volcado. Hecho aqui, al navegador solo bajan los actos de
 * este municipio con su semblanza ya pegada.
 */
export default function HorariosMunicipio({ municipio }: { municipio: Municipio }) {
  const porDia = new Map<string, typeof municipio.eventos>();
  for (const evento of municipio.eventos) {
    const dia = evento.dias[0] ?? "Fecha por confirmar";
    porDia.set(dia, [...(porDia.get(dia) ?? []), evento]);
  }
  const orden = [...porDia.keys()].sort(
    (a, b) => ORDEN_DIAS.indexOf(a) - ORDEN_DIAS.indexOf(b),
  );

  const dias: DiaAgenda[] = orden.map((dia, i) => ({
    dia,
    tono: tono(i),
    /* Los eventos de tipo "nota" no son actos: son avisos que mando el
       municipio -"esos dias tenemos la Feria del Pueblo", "la sede es la
       Concha Acustica"- y vienen con titulo, artista y hora vacios. Hasta
       ahora se colaban en la rejilla como filas completamente en blanco. Van
       aparte, al pie de la columna y sin ser tocables: no hay ficha que abrir
       detras de un aviso. */
    avisos: (porDia.get(dia) ?? [])
      .filter((e) => e.tipo === "nota")
      .flatMap((e) => e.notas),
    actos: (porDia.get(dia) ?? []).filter((e) => e.tipo !== "nota").map((e, j) => {
      /* Puede no haber ficha: las companias que el comite retiro de la
         cartelera siguen programadas en sus municipios. Se pinta igual, sin
         semblanza y sin foto. */
      const ficha = artistaPorId(e.idArtista);
      return {
        id: `${dia}-${j}`,
        titulo: e.titulo,
        artista: e.artista,
        disciplina: e.disciplina,
        procedencia: e.procedencia,
        hora: e.hora,
        horaCruda: e.horaCruda,
        fechas: e.fechas,
        sede: e.sede,
        dias: e.dias,
        tipo: e.tipo,
        descripcion: e.descripcion,
        creditos: e.creditos,
        notas: e.notas,
        inauguracion: e.inauguracion,
        semblanza: ficha?.semblanza ?? "",
        foto: ficha?.foto ?? null,
        banderas: ficha?.banderas ?? [],
      };
    }),
  }));

  return (
    <section className="border-t border-line bg-bone px-4 py-20 text-charcoal sm:px-6">
      <p className="meta text-center text-accent">Horarios oficiales</p>
      <h2 className="title-display mt-2 text-center text-[clamp(2rem,5vw,3.25rem)] font-light">
        {municipio.nombre}
      </h2>

      {dias.length === 0 ? (
        <p className="mt-8 text-center text-muted">Programación por confirmar.</p>
      ) : (
        <>
          {/* Sin este renglon nadie toca nada: una fila de agenda no se lee
              como un boton, y la ficha de la compania se quedaria sin abrir. */}
          <p className="mt-3 text-center text-sm text-muted">
            Toca un espectáculo para ver quién lo presenta.
          </p>
          <AgendaMunicipio dias={dias} municipio={municipio.nombre} />
        </>
      )}

      <p className="meta mt-12 text-center text-muted">Entrada libre en todas las sedes</p>
    </section>
  );
}

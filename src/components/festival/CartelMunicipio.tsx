import type { Municipio, Nivel } from "@/data/municipios";
import { FESTIVAL } from "@/data/festival";
import { tono } from "@/data/paleta";

/**
 * El cartel de un municipio, al estilo de un poster de lineup de festival:
 * nombres en bloques centrados, mas grandes cuanto mas lejos viene la
 * compania. Sin isla de busqueda ni fichas individuales -esto no es la
 * cartelera general, es el cartel que se cuelga-.
 *
 * La jerarquia de tamanos no se inventa a ojo: usa las mismas cuatro
 * categorias que ya cuenta el comite (numero_de_actividades: Int/Nac/Tam/
 * Local), calculadas por evento en nivelDe() (src/data/municipios.ts). Quien
 * viene de mas lejos encabeza el cartel, igual que en cualquier lineup real.
 */
const ORDEN: { nivel: Nivel; clase: string }[] = [
  { nivel: "internacional", clase: "text-[clamp(1.9rem,5.2vw,3.75rem)]" },
  { nivel: "nacional", clase: "text-[clamp(1.4rem,3.6vw,2.35rem)]" },
  { nivel: "tamaulipeco", clase: "text-[clamp(1.1rem,2.6vw,1.65rem)]" },
  { nivel: "local", clase: "text-[clamp(0.85rem,1.9vw,1.2rem)]" },
];

/* Los 8 iconos del imagotipo, uno por tono de la paleta. Se repiten hasta
   cubrir cualquier ancho de pantalla, como la cenefa de un cartel impreso. */
const ICONOS = [
  "Recurso 2.png",
  "Recurso 3.png",
  "Recurso 5.png",
  "Recurso 6.png",
  "Recurso 7.png",
  "Recurso 8.png",
  "Recurso 9.png",
  "Recurso 10.png",
];
const BANDA = [...ICONOS, ...ICONOS, ...ICONOS, ...ICONOS];

function BandaIconos() {
  return (
    <div aria-hidden="true" className="flex w-full">
      {BANDA.map((archivo, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={`/icons/${archivo}`}
          alt=""
          className="aspect-square w-[6.25%] flex-none object-cover"
        />
      ))}
    </div>
  );
}

export default function CartelMunicipio({ municipio }: { municipio: Municipio }) {
  const grupos = ORDEN.map(({ nivel, clase }) => {
    /* Un mismo nombre puede repetirse -una exposicion que dura los diez dias
       del festival cuenta como un evento por dia-, y en un cartel un nombre
       no se cuelga dos veces. */
    const nombres = [
      ...new Set(
        municipio.eventos
          .filter((e) => e.nivel === nivel)
          .map((e) => e.artista || e.titulo)
          .filter(Boolean),
      ),
    ];
    return { clase, nombres };
  }).filter((g) => g.nombres.length > 0);

  const total = municipio.totalEspectaculos;

  return (
    <section className="flex min-h-svh flex-col items-center bg-charcoal text-center text-[#f0eeee]">
      <BandaIconos />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/identidad/logo-blanco.svg"
          alt={FESTIVAL.nombre}
          className="h-16 w-auto sm:h-24"
        />

        <div className="mt-6 flex w-full max-w-4xl justify-between gap-8 opacity-70">
          <p className="meta">{FESTIVAL.fechasLargas}</p>
          <p className="meta">
            {FESTIVAL.siglas} {FESTIVAL.anio}
          </p>
        </div>

        <h1 className="title-display mt-5 text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.94] font-black tracking-[-0.02em]">
          {municipio.nombre}
        </h1>

        <div className="mt-12 flex max-w-4xl flex-col gap-5">
          {grupos.length === 0 ? (
            <p className="mt-4 opacity-60">Programación por confirmar.</p>
          ) : (
            grupos.map((g, i) => (
              <p key={i} className={`title-display font-semibold ${g.clase}`}>
                {g.nombres.map((nombre, j) => (
                  <span key={nombre}>
                    {j > 0 ? (
                      <span
                        className="mx-2 font-sans font-normal"
                        style={{ color: `var(--id-${tono(i * 3 + j)})` }}
                      >
                        •
                      </span>
                    ) : null}
                    {nombre}
                  </span>
                ))}
              </p>
            ))
          )}
        </div>

        <p className="meta mt-12 opacity-60">
          {total} {total === 1 ? "actividad" : "actividades"} · Entrada libre
        </p>
      </div>

      <BandaIconos />
    </section>
  );
}

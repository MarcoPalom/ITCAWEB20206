import Reveal from "@/components/Reveal";
import { FESTIVAL } from "@/data/festival";

const BLOQUES = [
  {
    titulo: "Acceso",
    texto:
      "Todas las actividades son gratuitas. El aforo de cada sede se cubre por orden de llegada; las funciones de teatro y danza abren puertas treinta minutos antes.",
  },
  {
    titulo: "Como llegar",
    texto:
      "Hay transporte gratuito de ida y vuelta desde las cabeceras municipales a Playa Miramar, La Pesca y Barra del Tordo los cinco dias. Salidas dos horas antes de cada funcion.",
  },
  {
    titulo: "Accesibilidad",
    texto:
      "Acceso en silla de ruedas y pasarela sobre arena en las cinco sedes de playa. Interpretacion en Lengua de Senas Mexicana en los actos de apertura y clausura.",
  },
  {
    titulo: "Contacto",
    texto:
      "Prensa, produccion y solicitudes de acreditacion en la Direccion de Festivales del Instituto.",
    enlace: { texto: "festivales@itca.gob.mx", href: "mailto:festivales@itca.gob.mx" },
  },
];

export default function InfoPractica() {
  return (
    <>
      <section id="informacion" className="border-b border-line py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-xl">
              <p className="meta text-accent">Informacion practica</p>
              <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
                Antes de venir
              </h2>
            </div>
          </Reveal>

          <dl className="mt-14 grid grid-cols-1 gap-px border-t border-line sm:grid-cols-2">
            {BLOQUES.map((bloque, i) => (
              <Reveal
                key={bloque.titulo}
                delay={i * 80}
                className="border-b border-line py-8 sm:px-8 sm:first:pl-0 sm:[&:nth-child(odd)]:pl-0 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pr-0"
              >
                <dt className="title-display text-xl font-light">{bloque.titulo}</dt>
                <dd className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                  {bloque.texto}
                  {bloque.enlace ? (
                    <>
                      {" "}
                      <a
                        href={bloque.enlace.href}
                        className="text-accent transition-opacity hover:opacity-70"
                      >
                        {bloque.enlace.texto}
                      </a>
                    </>
                  ) : null}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-charcoal text-bone">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="meta text-accent-inverse">{FESTIVAL.fechaCorta}</p>
            <p className="title-display mt-4 max-w-2xl text-[clamp(1.75rem,4vw,2.75rem)] font-light">
              {FESTIVAL.nombre}
            </p>
            <p className="mt-4 text-sm text-muted-inverse">{FESTIVAL.entrada}</p>
          </div>

          <a
            href="#programacion"
            className="flex h-12 w-fit items-center rounded bg-bone px-6 text-sm font-medium text-charcoal transition-transform hover:opacity-90 active:scale-[0.98]"
          >
            Consultar la programacion
          </a>
        </div>
      </section>
    </>
  );
}

import Reveal from "@/components/Reveal";
import { CIFRAS } from "@/data/festival";
import { estiloTono } from "@/data/paleta";

export default function Manifiesto() {
  return (
    <section id="el-festival" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="meta text-accent">El festival</p>
            <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
              Seno Mexicano fue el nombre antes que Golfo
            </h2>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
            <div className="max-w-2xl space-y-6 leading-relaxed text-charcoal">
              <p>
                Durante tres siglos, la costa que hoy llamamos Golfo de Mexico
                se nombro Seno Mexicano en las cartas de navegacion. El festival
                recupera ese nombre para hablar de un litoral que fue puerto,
                frontera y punto de llegada, y que sigue siendolo.
              </p>
              <p>
                La primera edicion reune programacion de musica, danza, teatro,
                cine, letras y artes populares en seis sedes del litoral
                tamaulipeco, con delegaciones invitadas de paises del Atlantico
                y del Caribe. Todas las actividades son de acceso libre.
              </p>
              <p className="text-muted">
                Organiza el Instituto Tamaulipeco para la Cultura y las Artes,
                con los ayuntamientos de Ciudad Madero, Soto la Marina, Aldama,
                Matamoros, San Fernando y Tampico.
              </p>
            </div>
          </Reveal>
        </div>

        <dl className="mt-20 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {CIFRAS.map((cifra, i) => (
            <Reveal
              key={cifra.etiqueta}
              delay={i * 80}
              className="border-b border-line px-0 py-8 lg:border-b-0 lg:px-8 lg:first:pl-0 lg:[&:not(:first-child)]:border-l"
            >
              <dt
                style={estiloTono(i + 3)}
                className="ficha-color flex h-[clamp(3rem,7vw,4.75rem)] w-[clamp(3rem,7vw,4.75rem)] items-center justify-center rounded-lg text-[clamp(1.75rem,4vw,2.75rem)] font-semibold"
              >
                {cifra.dato}
              </dt>
              <dd className="meta mt-2 text-muted">{cifra.etiqueta}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

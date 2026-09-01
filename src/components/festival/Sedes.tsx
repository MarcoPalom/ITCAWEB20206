import MarcoImagen from "@/components/MarcoImagen";
import Reveal from "@/components/Reveal";
import { SEDES } from "@/data/festival";
import { estiloTono } from "@/data/paleta";

export default function Sedes() {
  return (
    <section id="sedes" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-xl">
            <p className="meta text-accent">Sedes</p>
            <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
              Donde ocurre
            </h2>
            <p className="mt-6 leading-relaxed text-muted">
              Seis recintos al aire libre entre Tampico y Matamoros. Cada sede
              programa una parte del festival y conserva su propio caracter.
            </p>
          </div>
        </Reveal>

        {/* Bento asimetrico: la primera sede ocupa dos columnas porque es el
            escenario mayor. Las demas van a una. */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEDES.map((sede, i) => (
            <Reveal
              key={sede.id}
              delay={i * 80}
              as="article"
              className={i === 0 ? "sm:col-span-2" : undefined}
            >
              <div
                id={`sede-${sede.id}`}
                className="flex h-full scroll-mt-8 flex-col rounded-lg border border-line bg-surface p-6 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <MarcoImagen
                  descripcion={sede.foto}
                  proporcion={i === 0 ? "16 / 9" : "4 / 3"}
                />

                <div className="mt-6 flex flex-1 flex-col">
                  <p className="flex items-center gap-3">
                    <span
                      style={estiloTono(i)}
                      className="ficha-color flex h-7 w-7 items-center justify-center rounded font-mono text-xs"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="meta text-muted">{sede.municipio}</span>
                  </p>
                  <h3 className="title-display mt-2 text-2xl font-light">
                    {sede.nombre}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {sede.caracter}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";

type EnlaceProps = {
  id?: string;
  titulo: string;
  desc: string;
  href: string;
  className?: string;
};

const Enlace = ({ id, titulo, desc, href, className = "" }: EnlaceProps) => (
  <a
    id={id}
    href={href}
    className={`group flex flex-col justify-between rounded-lg border border-line bg-surface p-8 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${className}`}
  >
    <div className="flex h-32 items-center justify-center rounded border border-dashed border-line bg-bone">
      <span className="meta text-muted">Imagen pendiente</span>
    </div>
    <div className="mt-8">
      <h3 className="title-display text-2xl font-light">{titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
      <span className="meta mt-5 inline-block text-accent transition-opacity group-hover:opacity-70">
        Ir al sitio
      </span>
    </div>
  </a>
);

export default function EnlacesGenerales() {
  return (
    <section className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="meta text-accent">Espacios vinculados</p>
            <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
              Presentes, aunque vivan afuera
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted">
              Convocatorias, biblioteca y redes se publican en plataformas
              externas. Aqui tienen un lugar fijo para que nadie tenga que
              buscarlas.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <Enlace
              id="convocatorias"
              titulo="Convocatorias"
              desc="Premios, becas y estimulos abiertos para artistas y gestores culturales de Tamaulipas, con sus bases y fechas de cierre."
              href="#"
              className="h-full"
            />
          </Reveal>

          <Reveal delay={80}>
            <Enlace
              id="biblioteca"
              titulo="Biblioteca Virtual"
              desc="Acervo digital de consulta libre: obra publicada por el Instituto y fondos documentales del Estado."
              href="#"
              className="h-full"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

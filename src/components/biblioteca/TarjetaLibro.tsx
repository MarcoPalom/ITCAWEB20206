import Image from "next/image";
import Link from "next/link";

export type LibroResumen = {
  slug: string;
  titulo: string;
  subtitulo?: string;
  firma: string;
  coleccion: string;
  nombreColeccion: string;
  genero: string;
  anio: number;
  altoPortada: number;
};

/**
 * Libro en una rejilla: la portada manda y el texto la acompana debajo, como
 * en el lomo de un estante de novedades. La portada lleva su proporcion real
 * -Acroama es mas angosta que Altas Llamas- y no se recorta a un molde comun:
 * cortar una portada es cortar el diseno de alguien.
 */
export default function TarjetaLibro({
  libro,
  mostrarColeccion = false,
  prioridad = false,
}: {
  libro: LibroResumen;
  mostrarColeccion?: boolean;
  prioridad?: boolean;
}) {
  return (
    <Link
      href={`/bibliotecavirtual/libro/${libro.slug}`}
      className="group flex flex-col rounded-lg focus-visible:outline-offset-4"
    >
      <div className="flex aspect-[2/3] items-end justify-center">
        <Image
          src={`/biblioteca/portadas/${libro.slug}.webp`}
          alt={`Portada de ${libro.titulo}`}
          width={720}
          height={libro.altoPortada}
          sizes="(min-width: 1280px) 220px, (min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
          priority={prioridad}
          className="h-auto max-h-full w-auto max-w-full rounded-[3px] border border-line transition-transform duration-200 ease-out group-hover:-translate-y-1"
        />
      </div>
      <div className="mt-4">
        <p className="meta text-muted">
          {mostrarColeccion ? `${libro.nombreColeccion} · ` : ""}
          {libro.genero}
        </p>
        <h3 className="title-display mt-2 text-lg leading-snug transition-colors group-hover:text-accent">
          {libro.titulo}
        </h3>
        <p className="mt-1 text-sm text-muted">{libro.firma}</p>
      </div>
    </Link>
  );
}

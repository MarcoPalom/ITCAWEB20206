import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LectorPdf from "@/components/biblioteca/LectorPdf";
import { LIBROS, firmaDe, libroPorSlug, rutaPdf } from "@/data/biblioteca";
import { SITIO } from "@/data/sitio";

export function generateStaticParams() {
  return LIBROS.map((l) => ({ libro: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ libro: string }>;
}): Promise<Metadata> {
  const { libro } = await params;
  const l = libroPorSlug(libro);
  if (!l) return {};
  return {
    title: `Leer ${l.titulo} | Biblioteca Virtual | ITCA`,
    /* El lector se pinta en el navegador: para un buscador no hay nada que
       leer aqui, y la pagina que tiene que salir en resultados es la ficha. */
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITIO}/bibliotecavirtual/libro/${l.slug}` },
  };
}

export default async function LeerPage({
  params,
}: {
  params: Promise<{ libro: string }>;
}) {
  const { libro } = await params;
  const l = libroPorSlug(libro);
  if (!l) notFound();

  return (
    <LectorPdf
      slug={l.slug}
      titulo={l.titulo}
      firma={l.autores.length > 3 ? "Antología" : firmaDe(l)}
      pdf={rutaPdf(l)}
      ficha={`/bibliotecavirtual/libro/${l.slug}`}
    />
  );
}

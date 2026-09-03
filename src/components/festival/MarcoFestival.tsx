"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { seccionPorSlug } from "@/data/secciones";
import IslaNav from "./IslaNav";

/**
 * Marco comun de las paginas del festival: la marca y la isla.
 *
 * No hay aqui ninguna capa de transicion. El barrido circular lo gobierna el
 * navegador con la View Transitions API desde globals.css, y esa es justo la
 * razon de que ahora si revele la pagina de verdad: el navegador congela una
 * instantanea de la pagina que se va y recorta encima la de la pagina nueva,
 * con su contenido. Una capa hecha a mano solo puede animar un color plano,
 * que es lo que se veia mal.
 */
export default function MarcoFestival({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();
  const slug = ruta.split("/")[2] ?? "";
  const seccion = seccionPorSlug(slug);

  /* Las secciones con cartelera abren sobre fotografia oscura, asi que la
     marca va clara; las que se quedan en su portadilla de color usan la tinta
     que le corresponde a ese color. */
  const tintaMarca = seccion?.cartelera
    ? "#f0eeee"
    : (seccion?.sobre ?? "var(--color-charcoal)");

  /* La marca solo esta en la portada del festival. En las carteleras estorba:
     se pinta encima de la fotografia a sangre, justo sobre la primera ficha, y
     no hace falta como salida porque la isla de abajo ya lleva a todas partes
     -incluida esta misma portada-.

     Al pasar de la portada a una seccion, "marca" existe en la instantanea
     vieja y no en la nueva. Eso no hay que tratarlo aparte: el navegador lo
     resuelve como una salida y le aplica el fundido de 200ms que ya declara
     globals.css para ::view-transition-old(marca). */
  const esPortada = !slug;

  return (
    <>
      {esPortada ? (
        <header
          className="absolute inset-x-0 top-0 z-50"
          style={{ viewTransitionName: "marca" }}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              aria-label="Inicio, sitio del ITCA"
              className="title-display text-2xl transition-opacity hover:opacity-70"
              style={{ color: tintaMarca }}
            >
              ITCA
            </Link>
          </div>
        </header>
      ) : null}

      {children}

      <IslaNav />
    </>
  );
}

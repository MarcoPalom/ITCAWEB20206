"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { SECCIONES } from "@/data/secciones";

/**
 * Isla flotante: la navegacion del festival.
 *
 * En pantalla ancha caben los cinco destinos y el orden es fijo, con Inicio de
 * eje. En movil no caben -piden unos 600px sobre 356 disponibles- asi que la
 * isla funciona como un dial: el destino activo se coloca siempre en el centro
 * y los demas rotan a su alrededor conservando el orden ciclico. Asi siempre
 * quedan dos a cada lado, cualquier ruta esta a un toque o dos, y el swipe
 * sigue disponible para ir directo.
 *
 * La rotacion se hace con la propiedad order del flex, no reordenando el DOM.
 * De ese modo el orden de lectura y el de tabulacion no cambian nunca al
 * navegar, y el HTML del servidor y el del cliente coinciden.
 *
 * Los enlaces anotan ademas en el elemento raiz donde se pulso: el circulo del
 * barrido nace justo ahi.
 */
type Punto = {
  href: string;
  titulo: string;
  /** Color de la seccion. Inicio no lleva. */
  tinte?: string;
};

const seccion = (slug: string): Punto => {
  const s = SECCIONES.find((x) => x.slug === slug)!;
  return { href: `/festival/${s.slug}`, titulo: s.titulo, tinte: s.tinte };
};

/* Orden base, el de escritorio: Inicio al centro con dos secciones a cada
   lado. En movil este mismo anillo se rota. */
const BASE: Punto[] = [
  seccion("tamaulipecos"),
  seccion("nacionales"),
  { href: "/festival", titulo: "Inicio" },
  seccion("internacionales"),
  seccion("municipios"),
];

const CENTRO = 2;

function marcarOrigen(evento: React.MouseEvent) {
  const raiz = document.documentElement;
  raiz.style.setProperty("--bx", `${evento.clientX}px`);
  raiz.style.setProperty("--by", `${evento.clientY}px`);
}

export default function IslaNav() {
  const ruta = usePathname();
  const activoRef = useRef<HTMLAnchorElement | null>(null);
  const carroRef = useRef<HTMLDivElement | null>(null);
  /* El primer pintado coloca el carro de un salto; a partir de ahi se desliza. */
  const yaMontado = useRef(false);

  const activo = Math.max(
    0,
    BASE.findIndex((p) => p.href === ruta),
  );

  /* Girado el dial, el activo queda en el centro de la fila; falta llevarlo al
     centro de la parte visible, porque en movil la isla se desborda y si no la
     pastilla activa queda cortada.

     Se calcula con rectangulos y se mueve el carro, en vez de usar
     scrollIntoView: aquel arrastra el elemento mas cercano que pueda
     desplazarse y no siempre es este, y ademas no da manera de distinguir el
     primer pintado -donde el salto debe ser seco- de una navegacion posterior,
     donde deslizarse acompana al cambio. */
  useEffect(() => {
    const carro = carroRef.current;
    const enlace = activoRef.current;
    if (!carro || !enlace) return;

    const cajaEnlace = enlace.getBoundingClientRect();
    const cajaCarro = carro.getBoundingClientRect();
    const destino =
      carro.scrollLeft +
      (cajaEnlace.left + cajaEnlace.width / 2) -
      (cajaCarro.left + cajaCarro.width / 2);

    const suave =
      yaMontado.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    carro.scrollTo({ left: destino, behavior: suave ? "smooth" : "auto" });
    yaMontado.current = true;
  }, [ruta]);

  return (
    <nav
      aria-label="Secciones del festival"
      /* Fija al pie y por encima de todo: es el unico menu, asi que tiene que
         estar siempre a mano. El view-transition-name la deja fuera del
         barrido: se queda quieta mientras el circulo recorre la pantalla. */
      className="fixed inset-x-0 bottom-[5svh] z-50 flex justify-center px-4"
      style={{ viewTransitionName: "isla" }}
    >
      <div
        ref={carroRef}
        className="isla-carro w-fit max-w-full overflow-x-auto rounded-full border border-line bg-surface/85 p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex items-center gap-1">
          {BASE.map((punto, i) => {
            const esActivo = i === activo;
            /* Posicion en la fila una vez girado el dial: el activo al centro
               y el resto conservando el orden ciclico. */
            const orden = (i - activo + CENTRO + BASE.length) % BASE.length;

            return (
              <li
                key={punto.href}
                className="isla-punto"
                style={{ "--orden": orden } as React.CSSProperties}
              >
                <Link
                  ref={esActivo ? activoRef : undefined}
                  href={punto.href}
                  aria-current={esActivo ? "page" : undefined}
                  onClick={marcarOrigen}
                  className={`flex h-11 items-center gap-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    punto.tinte ? "px-4" : "px-5 font-medium"
                  } ${
                    esActivo
                      ? "bg-charcoal font-medium text-bone"
                      : "text-charcoal hover:bg-[color-mix(in_srgb,var(--id-tinta)_7%,transparent)]"
                  }`}
                >
                  {punto.tinte ? (
                    <span
                      aria-hidden="true"
                      style={{ background: punto.tinte }}
                      className="h-1.5 w-1.5 flex-none rounded-full"
                    />
                  ) : null}
                  {punto.titulo}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

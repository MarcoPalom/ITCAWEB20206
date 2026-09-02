"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

/**
 * Los mandos de la cartelera en movil: buscador y filtros, plegados.
 *
 * Se despliega con GSAP y no con una transicion CSS por un motivo concreto: la
 * altura del panel depende de cuantos filtros haya, y no se puede transicionar
 * hacia "auto". Las salidas habituales son fijar una altura maxima a ojo -que
 * corta el contenido o deja hueco- o el truco de grid-template-rows. GSAP mide
 * el contenido y anima hasta esa altura exacta, que es lo unico que sirve
 * cuando el numero de filtros lo decide el volcado.
 *
 * No se usa <details> aunque seria lo mas barato en accesibilidad: el navegador
 * enseña y esconde el contenido de golpe al alternar el atributo open, y no da
 * manera de retenerlo mientras se anima el cierre. Se sustituye por un boton
 * con aria-expanded y aria-controls, que es el equivalente declarado en ARIA.
 */
export default function MandosPlegables({
  rotulo,
  cuenta,
  children,
}: {
  rotulo: string;
  /** Lo que se ve cuando esta cerrado: la unica pista de que hay filtro puesto. */
  cuenta: string;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement | null>(null);
  const cuerpo = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = cuerpo.current;
      if (!el) return;

      /* Con movimiento reducido no hay despliegue: se pone o se quita, y el
         contenido queda legible en su posicion final. */
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { height: abierto ? "auto" : 0, opacity: abierto ? 1 : 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (abierto) {
          /* height: auto se mide, se anima hasta esa cifra y se devuelve a auto
             al terminar; asi el panel sigue creciendo solo si cambia el
             contenido -por ejemplo al filtrar y cambiar la cuenta-. */
          gsap.set(el, { height: "auto", opacity: 1 });
          gsap.from(el, {
            height: 0,
            opacity: 0,
            duration: 0.42,
            ease: "power3.out",
            /* Al terminar se deja en auto y no en la cifra medida, para que el
               panel siga creciendo si cambia el contenido -al filtrar cambia la
               cuenta, y con dos filas de pastillas cambia el alto-.

               Y nada de clearProps: eso devolveria el alto al valor de la hoja,
               que es 0, y el panel se cerraria solo al terminar de abrirse. Es
               justo lo que pasaba. */
            onComplete: () => gsap.set(el, { height: "auto" }),
          });
          gsap.from(el.querySelectorAll(".isla-bloque"), {
            y: 10,
            opacity: 0,
            duration: 0.38,
            stagger: 0.06,
            delay: 0.08,
            ease: "power3.out",
          });
        } else {
          gsap.to(el, {
            height: 0,
            opacity: 0,
            duration: 0.32,
            ease: "power2.inOut",
          });
        }
      });

      return () => mm.revert();
    },
    { dependencies: [abierto], scope: raiz, revertOnUpdate: true },
  );

  return (
    <div ref={raiz} className="cartelera-mandos lg:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="mandos-cuerpo"
        className="cartelera-mandos-boton"
      >
        <span>{rotulo}</span>
        <span className="cartelera-mandos-cuenta">{cuenta}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-abierto={abierto ? "si" : "no"}
        >
          <path d="M4 6.5 8 10.5 12 6.5" />
        </svg>
      </button>

      {/* El contenido esta siempre en el arbol y solo se le anima el alto: si se
          desmontara al cerrar, el foco del teclado saltaria al vacio y el
          buscador perderia lo escrito.

          El estado plegado inicial lo pone la hoja de estilo y no el atributo
          style: escrito en el JSX, React lo reaplicaba en cada repintado y
          pisaba el alto que GSAP acababa de dejar, con lo que el panel se
          cerraba solo a los pocos cientos de milisegundos de abrirse. */}
      <div
        id="mandos-cuerpo"
        ref={cuerpo}
        className="cartelera-mandos-cuerpo"
        inert={!abierto}
      >
        <div className="cartelera-mandos-interior">{children}</div>
      </div>
    </div>
  );
}

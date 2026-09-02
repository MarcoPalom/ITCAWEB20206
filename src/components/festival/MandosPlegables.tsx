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

      /* Movimiento reducido: se pone o se quita, sin recorrido. Se comprueba con
         matchMedia del navegador y no con gsap.matchMedia() a proposito: aquel
         crea su propio contexto por consulta y aqui, dentro de un hook que se
         re-sincroniza en cada cambio de estado, sus altas y bajas se pisaban
         con el ciclo del efecto y acababan sin escribir nada. */
      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (quieto) {
        gsap.set(el, { height: abierto ? "auto" : 0, opacity: abierto ? 1 : 0 });
        return;
      }

      /* Se anima hacia "auto" y no hacia una cifra medida: GSAP mide el
         contenido, anima hasta ahi y deja height:auto puesto, con lo que el
         panel sigue creciendo solo si cambia el contenido -al filtrar cambia la
         cuenta, y con dos filas de pastillas cambia el alto-. */
      if (abierto) {
        gsap.to(el, { height: "auto", opacity: 1, duration: 0.42, ease: "power3.out" });
        gsap.from(el.querySelectorAll(".isla-bloque"), {
          y: 10,
          opacity: 0,
          duration: 0.38,
          stagger: 0.06,
          delay: 0.08,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.32, ease: "power2.inOut" });
      }
    },
    { dependencies: [abierto], scope: raiz },
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

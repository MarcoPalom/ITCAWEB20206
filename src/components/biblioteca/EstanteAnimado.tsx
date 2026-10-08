"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

type Portada = { slug: string; altoPortada: number };

/** Sentido de cada columna: las de los lados suben, la del centro baja. */
const SENTIDOS = [-1, 1, -1] as const;
/** Segundos por vuelta. Distintos para que las columnas no vayan al paso. */
const DURACIONES = [46, 54, 50];
/** Punto de la vuelta en el que arranca cada columna, para que no empiecen
    alineadas. Tambien es la posicion que se ve sin JavaScript. */
const ARRANQUES = [0, 0.42, 0.21];

/** Veces que se repiten los libros en cada tira. Con dos, una vuelta (dos
    portadas) mide menos que el estante y al final asomaba un hueco; con tres
    siempre hay portadas de sobra por debajo. */
const COPIAS = 3;
const VUELTA = 100 / COPIAS;

/** Desplazamiento vertical, en % del alto de la tira, en un punto de la vuelta. */
const posicion = (sentido: number, progreso: number) =>
  sentido < 0 ? -VUELTA * progreso : -VUELTA + VUELTA * progreso;

/**
 * Estante de la cabecera: tres columnas de portadas en movimiento continuo,
 * las de los lados subiendo y la del centro bajando, como un expositor
 * giratorio de libreria.
 *
 * Cada columna es una tira con sus libros repetidos tres veces; la tira se
 * desplaza exactamente una de esas repeticiones y vuelve a empezar, de modo
 * que el salto no se ve. Solo se anima transform.
 *
 * El sistema de diseno no admite un bucle que no se pueda detener, y WCAG
 * 2.2.2 pide lo mismo para cualquier movimiento de mas de cinco segundos: se
 * frena al pasar el raton, tiene un boton de pausa, se para cuando sale de
 * pantalla y con "reducir movimiento" no arranca. En ese caso, y sin
 * JavaScript, el estante se ve quieto con las columnas escalonadas.
 */
export default function EstanteAnimado({ portadas }: { portadas: Portada[] }) {
  const raiz = useRef<HTMLDivElement>(null);
  const tiras = useRef<(HTMLDivElement | null)[]>([]);
  const tweens = useRef<gsap.core.Tween[]>([]);
  const [pausado, setPausado] = useState(false);
  const pausadoRef = useRef(false);
  const fueraRef = useRef(false);
  const encimaRef = useRef(false);
  const velocidad = useRef<(objetivo: number) => void>(() => {});

  const columnas = [0, 1, 2].map((c) => portadas.filter((_, i) => i % 3 === c));

  useGSAP(
    (_contexto, contextSafe) => {
      /* Frenado y arranque suaves: se lleva la velocidad a cero en vez de
         cortar en seco, que en un movimiento tan lento se leeria como un
         tiron. Se crea aqui dentro, con contextSafe, para que los tweens que
         lancen los eventos se limpien con el resto al desmontar. */
      velocidad.current = contextSafe!((objetivo: number) => {
        if (tweens.current.length === 0) return;
        if (objetivo > 0) for (const t of tweens.current) if (!fueraRef.current) t.resume();
        gsap.to(tweens.current, {
          timeScale: objetivo,
          duration: 0.8,
          ease: "power2.out",
          overwrite: true,
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        tweens.current = tiras.current.map((tira, c) => {
          const sentido = SENTIDOS[c];
          return gsap
            .fromTo(
              tira,
              { y: 0, yPercent: posicion(sentido, 0) },
              {
                yPercent: posicion(sentido, 1),
                duration: DURACIONES[c],
                ease: "none",
                repeat: -1,
              },
            )
            .progress(ARRANQUES[c]);
        });

        /* Fuera de pantalla no hay nada que mover. */
        const io = new IntersectionObserver(([e]) => {
          fueraRef.current = !e.isIntersecting;
          for (const t of tweens.current) {
            if (fueraRef.current) t.pause();
            else if (!pausadoRef.current) t.resume();
          }
        });
        if (raiz.current) io.observe(raiz.current);

        return () => {
          io.disconnect();
          tweens.current = [];
        };
      });
    },
    { scope: raiz },
  );

  const alternar = () => {
    const siguiente = !pausado;
    pausadoRef.current = siguiente;
    setPausado(siguiente);
    velocidad.current(siguiente || encimaRef.current ? 0 : 1);
  };

  return (
    <div ref={raiz}>
      <div
        aria-hidden="true"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          encimaRef.current = true;
          velocidad.current(0);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          encimaRef.current = false;
          if (!pausadoRef.current) velocidad.current(1);
        }}
        className="grid h-[34rem] grid-cols-3 gap-4 overflow-hidden"
      >
        {columnas.map((libros, c) => (
          <div key={c} className="min-w-0">
            <div
              ref={(el) => {
                tiras.current[c] = el;
              }}
              className="will-change-transform"
              style={{ transform: `translateY(${posicion(SENTIDOS[c], ARRANQUES[c])}%)` }}
            >
              {/* Varias vueltas de los mismos libros: la siguiente entra
                  mientras la anterior sale. Separacion con padding y no con
                  gap, para que cada vuelta mida exactamente lo mismo. */}
              {Array.from({ length: COPIAS }, () => libros).flat().map((l, i) => (
                <div key={i} className="pb-4">
                  <Image
                    src={`/biblioteca/portadas/${l.slug}.webp`}
                    alt=""
                    width={720}
                    height={l.altoPortada}
                    sizes="180px"
                    priority={i < libros.length}
                    className="h-auto w-full rounded-[3px] border border-line"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={alternar}
        aria-pressed={pausado}
        className="meta mt-4 ml-auto flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-charcoal motion-reduce:hidden"
      >
        <span aria-hidden="true" className="flex h-3 w-3 items-center justify-center">
          {pausado ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3">
              <path fill="currentColor" d="M2 1l9 5-9 5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="h-3 w-3">
              <path fill="currentColor" d="M2 1h3v10H2zM7 1h3v10H7z" />
            </svg>
          )}
        </span>
        {pausado ? "Reanudar estante" : "Pausar estante"}
      </button>
    </div>
  );
}

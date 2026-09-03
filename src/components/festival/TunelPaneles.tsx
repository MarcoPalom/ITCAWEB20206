"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";

import { FESTIVAL } from "@/data/festival";
import { estiloTono } from "@/data/paleta";

/**
 * Una caratula por compania participante, en el orden en que se recorren.
 *
 * Los paneles son cuadrados, como una funda de LP, y todos miden lo mismo. Eso
 * no es solo estetico: la proporcion del panel fija el radio del cilindro y con
 * el toda la perspectiva de la portada, porque las cuerdas tienen que cerrar
 * los 360 grados. Dieciseis fundas es lo que permite que la banda cruce el
 * encuadre entero sin que la mas cercana desborde la pantalla.
 *
 * Las fotos vienen ya recortadas en cuadrado (public/img/festival), asi que
 * aqui no hay reencuadre que ajustar.
 */
const ANCHO_FUNDA = 1;

/**
 * El cilindro alterna funda e icono, uno y uno.
 *
 * Los iconos del imagotipo ya vienen como azulejos cuadrados, del mismo formato
 * que las caratulas, asi que entran como un panel mas sin tocar la geometria:
 * dieciseis paneles cuadrados, que es exactamente lo que estaba verificado.
 *
 * Esa es tambien la razon de que las fundas sean ocho y no dieciseis. El radio
 * del cilindro lo fija la suma de anchuras, y el reparto ocho y ocho es el
 * unico que intercala los ocho iconos -cada uno una sola vez- sin alterar la
 * perspectiva ni repetir ninguno.
 */
type Hueco =
  | { tipo: "funda"; slug: string; alt: string }
  | { tipo: "icono"; slug: string; alt: string };

const HUECOS: Hueco[] = [
  { tipo: "funda", slug: "cia-ome", alt: "Tres intérpretes de Cía. Ome con máscaras de madera" },
  { tipo: "icono", slug: "icono-01", alt: "" },
  { tipo: "funda", slug: "irish-dance-theatre", alt: "Bailarines de Irish Dance Theatre en escena" },
  { tipo: "icono", slug: "icono-02", alt: "" },
  { tipo: "funda", slug: "momi-maiga", alt: "Momi Maiga, músico de Senegal" },
  { tipo: "icono", slug: "icono-03", alt: "" },
  { tipo: "funda", slug: "nahuel-penissi", alt: "Nahuel Penissi, cantautor argentino" },
  { tipo: "icono", slug: "icono-04", alt: "" },
  { tipo: "funda", slug: "performance-de-rua-do-palhaco-satin", alt: "El payaso Satin, de Performance de rua do palhaco Satin" },
  { tipo: "icono", slug: "icono-05", alt: "" },
  { tipo: "funda", slug: "rita-donte", alt: "Rita Donte cantando con turbante azul" },
  { tipo: "icono", slug: "icono-06", alt: "" },
  { tipo: "funda", slug: "sampling-is-beautiful", alt: "Los tres integrantes de Sampling is Beautiful en una calle" },
  { tipo: "icono", slug: "icono-07", alt: "" },
  { tipo: "funda", slug: "manoella-torres", alt: "Manoella Torres cantando entre humo escénico" },
  { tipo: "icono", slug: "icono-08", alt: "" },
];

/** Duracion de una vuelta completa del cilindro. */
const VUELTA = "72s";

/**
 * Radio del cilindro, en multiplos de la altura del panel.
 *
 * No se elige: es el unico radio en el que las anchuras dadas encajan de canto
 * a canto y cierran exactamente los 360 grados. Cada panel es la cuerda de su
 * propio arco, asi que la condicion es sum(2*asin(w/2R)) = 2*PI, y se resuelve
 * por biseccion porque la suma decrece de forma monotona con R.
 */
function radioCilindro(anchos: number[]): number {
  const vuelta = (r: number) =>
    anchos.reduce((suma, w) => suma + 2 * Math.asin(Math.min(1, w / (2 * r))), 0);

  let bajo = Math.max(...anchos) / 2 + 1e-6;
  let alto = 100;
  for (let i = 0; i < 120; i += 1) {
    const medio = (bajo + alto) / 2;
    if (vuelta(medio) > 2 * Math.PI) bajo = medio;
    else alto = medio;
  }
  return (bajo + alto) / 2;
}

/* La relacion entre el radio y la distancia focal -la fuerza de la
   perspectiva- vive en globals.css, bajo .tunel, porque cambia con el ancho de
   la pantalla. Alli esta explicado por que no puede bajar de 0.8. */

const RADIO = radioCilindro(HUECOS.map(() => ANCHO_FUNDA));

/**
 * Arco que queda dentro del encuadre. Pasados estos grados el panel ya se ha
 * salido por el lateral, asi que entrar y salir ocurre fuera de pantalla.
 *
 * El tope no es libre: el desplazamiento horizontal alcanza su maximo en
 * acos(-k) -unos 166 grados- y a partir de ahi el panel vuelve hacia el centro.
 * Un panel que cruce ese pliegue se dobla sobre si mismo y abre cunas de fondo,
 * asi que hay que apagarlo antes, contando tambien su media anchura.
 */
const ARCO_VISIBLE = 132;

/**
 * Solape entre paneles. Colocados como cuerdas ya comparten arista exacta, pero
 * cerca del lateral la perspectiva magnifica cualquier redondeo de subpixel:
 * este margen garantiza que la banda no se abra nunca. No se nota, porque los
 * paneles son opacos y se tapan entre si.
 */
const SOLAPE = 1.015;

/** Angulo del centro de cada panel, con el primero mirando de frente. */
const PANELES = (() => {
  const arcos = HUECOS.map(() => 2 * Math.asin(ANCHO_FUNDA / (2 * RADIO)));
  let acumulado = 0;
  return HUECOS.map((hueco, i) => {
    const centro = acumulado + arcos[i] / 2;
    acumulado += arcos[i];
    /* Apotema de la cuerda, en fraccion del radio: a esa distancia del eje va
       el plano del panel para que sus esquinas caigan sobre la circunferencia. */
    const apotema = Math.cos(arcos[i] / 2);
    const grados = (centro * 180) / Math.PI - (arcos[0] * 90) / Math.PI;
    /* Mismo angulo medido en el rango -180..180, que es donde se ve si el
       panel esta delante o detras del punto de vista, y de que lado cae. */
    const medido = ((grados + 540) % 360) - 180;
    const desdeElFrente = Math.abs(medido);
    return {
      ...hueco,
      grados,
      apotema,
      /* Marca los paneles que caen detras del punto de vista. Solo importa con
         el cilindro parado: girando, la animacion los gobierna. */
      detras: desdeElFrente > ARCO_VISIBLE,
      /* El panel esta de frente en la fraccion grados/360 de la vuelta. El
         retardo negativo adelanta su ciclo de aparicion hasta ahi. */
      fase: ((grados / 360) % 1) - 1,
      /* De que lado de la pantalla nace en la entrada: -1 izquierda, 1
         derecha. El del frente exacto (medido 0) no importa, cae de un lado
         cualquiera. */
      lado: medido < 0 ? -1 : 1,
      /* Distancia angular al frente, 0..180: gobierna el retardo de la
         entrada -el frente llega primero, los laterales despues, como si la
         banda se completara hacia los dos lados a la vez-. */
      distanciaFrente: desdeElFrente,
    };
  });
})();

export default function TunelPaneles() {
  const ref = useRef<HTMLDivElement>(null);

  /* El cilindro arranca girando desde el propio HTML: el giro es cosa del CSS
     y no espera a que hidrate nada. Lo unico que aporta el JS es pararlo
     cuando la portada sale de pantalla, de modo que si el script no llega a
     correr la portada sigue viva en vez de quedarse muerta. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        el.dataset.activo = entrada.isIntersecting ? "si" : "no";
      },
      { threshold: 0 },
    );

    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  /* Bienvenida: la banda no aparece completa de golpe, entra desde los dos
     lados como si se fuera montando delante de quien llega. --entrada
     desplaza cada panel en el eje X de pantalla antes de que rotateY lo
     lleve a su sitio en el cilindro (ver .tunel-panel en globals.css), asi
     que el anillo sigue girando por CSS desde el primer fotograma sin que
     las dos animaciones se estorben.

     Es GSAP y no CSS porque el retardo de cada panel depende de un numero
     que solo existe aqui -su distancia angular al frente, PANELES[i].
     distanciaFrente- y no de su orden en el DOM: con el retardo creciendo
     desde el frente hacia los lados, el panel central llega primero y la
     banda se completa hacia ambos lados a la vez, en vez de barrer de
     principio a fin como haria un stagger por indice.

     useLayoutEffect y no useEffect: --entrada tiene que quedar puesto antes
     de la primera pintura, o se veria un fogonazo de la banda ya completa
     antes de desarmarse para animar la entrada. */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paneles = gsap.utils.toArray<HTMLElement>(".tunel-panel", el);
    paneles.forEach((panel, i) => {
      gsap.set(panel, { "--entrada": `${PANELES[i].lado * 90}vw` });
    });

    const animacion = gsap.to(paneles, {
      "--entrada": "0vw",
      duration: 1.1,
      ease: "power3.out",
      delay: (i: number) => (PANELES[i].distanciaFrente / 180) * 0.5,
    });

    return () => {
      animacion.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-activo="si"
      aria-hidden="true"
      className="tunel pointer-events-none absolute inset-0"
      style={
        {
          /* Solo lo que sale del calculo. El tamano y la fuerza de la
             perspectiva viven en globals.css, porque cambian en movil y una
             declaracion en linea ganaria a la media query. */
          "--tunel-factor": RADIO.toFixed(4),
          "--tunel-t": VUELTA,
        } as React.CSSProperties
      }
    >
      <div className="tunel-anillo">
        {PANELES.map((panel, i) => (
          <div
            key={panel.slug}
            data-detras={panel.detras ? "si" : undefined}
            className="tunel-panel"
            style={
              {
                "--angulo": `${panel.grados.toFixed(3)}deg`,
                "--dist": `calc(var(--tunel-r) * ${panel.apotema.toFixed(5)})`,
                "--ancho": `calc(var(--tunel-h) * ${(ANCHO_FUNDA * SOLAPE).toFixed(4)})`,
                "--retardo": `calc(${VUELTA} * ${panel.fase.toFixed(4)})`,
              } as React.CSSProperties
            }
          >
            <span className="tunel-hueco">
              {panel.tipo === "icono" ? (
                /* El azulejo del imagotipo entra a sangre: ya viene cuadrado y
                   con su propio color de fondo, asi que no necesita ni marco ni
                   rotulacion. */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="tunel-icono"
                  src={`/img/festival/${panel.slug}.webp`}
                  alt=""
                  decoding="async"
                  fetchPriority="low"
                />
              ) : (
              <span className="vinilo-funda">
                {/* Imagen suelta y no next/image: la caratula ya tiene medida
                    fija en el cilindro y el archivo viene recortado en cuadrado,
                    asi que no hay nada que redimensionar ni reservar. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/img/festival/${panel.slug}.webp`}
                  alt={panel.alt}
                  decoding="async"
                  fetchPriority="low"
                />

                <span className="vinilo-velo" />

                <span className="vinilo-texto">
                  <span className="vinilo-cab">
                    <span className="vinilo-marca">
                      Festival
                      <br />
                      Internacional
                    </span>
                    <span className="vinilo-sello ficha-color" style={estiloTono(i)}>
                      <span>ITCA</span>
                    </span>
                  </span>

                  <span className="vinilo-titulo">
                    Costa del
                    <br />
                    Seno Mexicano
                  </span>

                  <span className="vinilo-lista">
                    Música &middot; Danza &middot; Teatro &middot; Cine &middot;
                    Letras &middot; Artes populares &middot; Circo
                  </span>

                  <span className="vinilo-pie">
                    <span className="vinilo-codigo">
                      <span className="vinilo-barras" />
                      <span className="vinilo-cifra">
                        FICSM 26 &middot; {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="vinilo-fecha">{FESTIVAL.fechaCorta}</span>
                  </span>
                </span>
              </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

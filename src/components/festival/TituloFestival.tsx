"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { cuandoAterrice } from "./TunelPaneles";

/**
 * El titular de la portada, que cada tantos segundos cambia de color y presta
 * una de sus letras a un icono del imagotipo.
 *
 * La gracia es que no se sustituye la palabra entera sino un caracter cada vez:
 * asi "FICSM 2026" se sigue leyendo siempre, y el icono se lee como un guino y
 * no como un jeroglifico. Los iconos son azulejos cuadrados con fondo propio
 * -no siluetas recortadas-, de modo que entran como una tesela de color en
 * mitad de la palabra, que es como funcionan en el resto del sitio.
 *
 * Las letras no se van del DOM: se quedan con opacidad 0 debajo del icono. Un
 * lector de pantalla sigue leyendo "FICSM 2026" y los iconos van marcados como
 * decorativos.
 */

/**
 * Que caracter cede el sitio a que icono, y de que color se tine el titular
 * mientras dura.
 *
 * Los cuatro pares no son un capricho: son los unicos donde la figura del icono
 * aguanta como sustituta de la letra. Del resto de la palabra -F, C, S, 2- no
 * hay icono que se le parezca, y meterlo a la fuerza no se leeria como ingenio
 * sino como una palabra rota.
 *
 * El color de cada par sale del propio icono, que lleva figura y fondo en dos
 * tonos de la paleta: se toma el que ademas aguanta como tinta sobre el hueso.
 * Entre los cuatro se cubren los cuatro tonos legibles, y los otros cuatro
 * -amarillo, lavanda, rosa, turquesa- salen igualmente en pantalla dentro de
 * los propios azulejos, que es donde la paleta manda usarlos: como relleno.
 */
type Relevo = {
  /** Se sustituye su primera aparicion en el titular. */
  caracter: string;
  archivo: string;
  /** Que se ve en el azulejo. Va al alt de nada, es para quien lea esto. */
  figura: string;
  tono: string;
};

const RELEVOS: Relevo[] = [
  /* Dos corcheas: dos astiles y dos cabezas, que es la silueta de una M. */
  { caracter: "M", archivo: "Recurso 6.png", figura: "dos notas musicales", tono: "morado" },
  /* Flor de sol: radial y cerrada, cae redonda en el hueco del cero. */
  { caracter: "0", archivo: "Recurso 5.png", figura: "flor de sol", tono: "verde" },
  /* Figura vertical y estrecha, del ancho de un asta. */
  { caracter: "I", archivo: "Recurso 8.png", figura: "figura vertical", tono: "azul" },
  /* Espiral con cola: un seis dibujado a mano no queda muy lejos. */
  { caracter: "6", archivo: "Recurso 10.png", figura: "espiral", tono: "coral" },
];

/** Segundos que dura el turno de cada relevo, icono incluido. */
const COMPAS = 4.6;

/** De esos segundos, cuantos se queda el icono en el sitio de la letra. */
const ESTANCIA = 2.4;

/** Lo que tarda la ficha en dar media vuelta. */
const VUELTA = 0.55;

export default function TituloFestival({ texto }: { texto: string }) {
  const raiz = useRef<HTMLHeadingElement>(null);

  /* El texto se parte en palabras, y dentro de cada una solo se envuelve en
     <span> el caracter que tiene relevo. Envolver cada letra tambien habria
     valido, pero un <span> por letra rompe el kerning entre pares en algunos
     motores, y en un titular de doce rem eso se ve.

     Cada palabra va en su propia caja sin cortes. Hace falta porque un
     inline-block es una oportunidad de corte de linea: en un telefono el
     titular partia por dentro del ano -"FICSM 2·2" arriba y "6" abajo- justo
     por el hueco del cero. Con las palabras cerradas, el unico sitio por donde
     puede partir es el espacio, que es donde debe. */
  const usados = new Set<string>();

  const palabra = (letras: string, clave: number) => {
    const trozos: React.ReactNode[] = [];
    let corrido = "";

    [...letras].forEach((c, i) => {
      const relevo = usados.has(c) ? undefined : RELEVOS.find((r) => r.caracter === c);
      if (!relevo) {
        corrido += c;
        return;
      }
      usados.add(c);
      if (corrido) {
        trozos.push(corrido);
        corrido = "";
      }
      trozos.push(
        <span key={i} className="titulo-hueco" data-relevo={relevo.caracter}>
          <span className="titulo-letra">{c}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="titulo-icono"
            src={`/icons/${relevo.archivo}`}
            alt=""
            aria-hidden="true"
            decoding="async"
          />
        </span>,
      );
    });
    if (corrido) trozos.push(corrido);

    return (
      <span key={clave} className="titulo-palabra">
        {trozos}
      </span>
    );
  };

  const trozos = texto
    .split(" ")
    .flatMap((letras, i) => (i === 0 ? [palabra(letras, i)] : [" ", palabra(letras, i)]));

  useLayoutEffect(() => {
    const h = raiz.current;
    if (!h) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const huecos = gsap.utils.toArray<HTMLElement>(".titulo-hueco", h);
    if (huecos.length === 0) return;

    /* Los tonos se leen resueltos del CSS, no escritos aqui: GSAP no sabe
       interpolar un var() y ademas la paleta vive en globals.css, que es donde
       tiene que poder cambiar sin tocar este archivo. */
    const color = (tono: string) =>
      getComputedStyle(h).getPropertyValue(`--id-${tono}`).trim();

    const linea = gsap.timeline({ repeat: -1, paused: true });

    /* Letra e icono son las dos caras de una misma ficha, y lo que gira es la
       ficha entera: media vuelta y ensena el icono, otra media y vuelve la
       letra. El hueco nunca se queda vacio, porque siempre hay una cara
       mirando al frente -de eso se encarga backface-visibility, no una
       opacidad-. Con dos piezas independientes fundiendose habia instantes en
       los que ninguna estaba del todo, y ahi el titular se leia incompleto. */
    huecos.forEach((hueco, n) => {
      const relevo = RELEVOS.find((r) => r.caracter === hueco.dataset.relevo);
      if (!relevo) return;
      const turno = n * COMPAS;

      /* El color viaja mas despacio que el giro y arranca a la vez: asi la
         palabra se esta tinendo mientras la ficha voltea, y el cambio se lee
         como una sola cosa y no como dos efectos pegados. */
      linea.to(h, { color: color(relevo.tono), duration: 1.1, ease: "power2.inOut" }, turno);

      linea.to(
        hueco,
        { rotateX: 180, transformPerspective: 800, duration: VUELTA, ease: "power2.inOut" },
        turno,
      );

      /* Y la vuelta, para que entre relevo y relevo el titular se lea con todas
         sus letras. */
      linea.to(
        hueco,
        { rotateX: 360, transformPerspective: 800, duration: VUELTA, ease: "power2.inOut" },
        turno + ESTANCIA,
      );
    });

    /* El ciclo espera a que el anillo aterrice y a que el titular acabe de
       descubrirse: empezar a voltear letras mientras el titular todavia se esta
       dibujando serian dos animaciones sobre la misma pieza a la vez. */
    const soltarEspera = cuandoAterrice(() => linea.play(), {
      respiro: 1.4,
      esperaSola: 1.2,
    });

    return () => {
      soltarEspera();
      linea.kill();
      gsap.set(h, { clearProps: "color" });
      gsap.set(huecos, { clearProps: "transform" });
    };
  }, []);

  return (
    <h1
      ref={raiz}
      /* El titular queda partido en trozos por los huecos de relevo, que son
         inline-block: al extraer el texto salen cortes -"FI CSM 20 26"- y hay
         lectores que los marcan como pausas. El rotulo declara de una vez el
         nombre entero, que es ademas exactamente lo que se ve escrito. */
      aria-label={texto}
      className="portada-titulo title-display text-[clamp(4rem,10vw,12rem)] leading-[0.85] font-black tracking-[-0.045em] text-[var(--id-morado)]"
    >
      {trozos}
    </h1>
  );
}

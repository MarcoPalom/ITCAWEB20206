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
    };
  });
})();

/* --- Entrada: del halo al centro del anillo ------------------------------
 *
 * La camara de CSS no se puede mover: perspective es un numero fijo del
 * contenedor. Asi que lo que se mueve es el anillo delante de ella, en un
 * envoltorio propio -.tunel-camara-, y el efecto es el mismo.
 *
 * Empieza lejos y tumbado: desde ahi se ve el aro entero, como un halo. De ahi
 * viene hasta 0 y 0deg, que es la identidad y por tanto el encuadre definitivo
 * de siempre. Ese es el motivo de plantearlo asi: el aterrizaje es exacto y no
 * hay que tocar radio, apotema, fase ni giro.
 *
 * El zoom no lo hace un scale, lo hace la propia perspectiva al acercarse. Un
 * scale agranda la imagen; esto atraviesa el espacio, que es lo que se nota.
 */

/**
 * Distancia del halo, en radios del cilindro. Negativa: lo aleja de la camara.
 *
 * Cuanto mas lejos, mas completo se ve el aro y mas plano: la perspectiva se
 * aplana con la distancia y los paneles del fondo dejan de verse mas pequenos
 * que los de delante, que es de donde sale la sensacion de profundidad. A -2.1
 * el aro sigue cabiendo entero y la diferencia entre el panel cercano y el
 * lejano todavia se lee.
 */
const HALO_Z = -2.1;

/**
 * Inclinacion del halo, en grados. A 0 el aro se ve de canto; a 90 seria un
 * circulo plano visto desde arriba.
 *
 * Aqui esta la delgadez. Los paneles son verticales, asi que tumbar el aro los
 * escorza: su altura aparente es el coseno de este angulo. A 68 grados quedaba
 * en 0.37 de la altura real, un 7% del diametro del aro -una tira finisima, que
 * es lo que hacia leer el poligono de 16 lados en vez de un cilindro-. A 36 la
 * altura aparente sube a 0.81 y el aro pasa a leerse como una pared con cuerpo.
 *
 * No baja mas porque por debajo de unos 11 grados la pared cercana tapa a la del
 * fondo y se deja de ver el aro completo, que es lo que se queria ensenar.
 *
 * Viaja sin unidad y el CSS le pone la unidad con calc. Ver .tunel-camara en
 * globals.css: escrita con unidad, un solo fotograma mal formado invalida el
 * transform entero.
 */
const HALO_TILT = 36;

/**
 * Giro extra de la camara alrededor del eje del cilindro, en grados, que se
 * consume durante la entrada.
 *
 * Es lo que mas volumen da, y no es un adorno: el paralaje -que los paneles
 * cercanos se desplacen mas que los del fondo- es la senal de profundidad mas
 * fuerte que tiene un ojo, mucho mas que el escorzo. Un aro quieto se lee como
 * un dibujo; el mismo aro orbitando se lee como un objeto.
 *
 * Va aparte del giro continuo del anillo -72s, cinco grados por segundo- que a
 * lo largo del medio segundo de halo no se nota siquiera. Termina en 0, asi que
 * el encuadre final sigue siendo exacto.
 */
const HALO_GIRO = -48;

/**
 * Aviso de que el anillo ya esta en su sitio.
 *
 * Lo espera la isla para abrirse despues y no a la vez. Se avisa por evento y
 * no exportando la duracion porque asi no hay dos sitios que tengan que sumar
 * lo mismo: quien cambie HALO o ENTRADA no deja a la isla descolocada, y si
 * algun dia la entrada acaba antes -o no llega a correr- el aviso llega cuando
 * de verdad toca.
 */
export const TUNEL_ATERRIZADO = "ficsm:tunel-aterrizado";

/**
 * Red por si el aviso no llegara.
 *
 * GSAP se mueve con requestAnimationFrame, que en una pestana en segundo plano
 * no corre: una portada abierta en una pestana de fondo dejaria el anillo a
 * medio viaje y el aviso sin dar. Lo que espera detras -la isla, que es la
 * navegacion del sitio- no puede quedarse escondido, asi que pasado este tiempo
 * arranca igual.
 */
const RED = 6000;

/**
 * Llama a `hacer` cuando el anillo llegue a su sitio.
 *
 * Si en esta pagina no hay entrada que esperar -otra seccion, o la portada con
 * la entrada ya vista- arranca sola tras una espera corta. Devuelve la funcion
 * de limpieza, que hay que llamar al desmontar.
 *
 * Vive aqui, junto a quien da el aviso, porque ya son tres los que lo esperan
 * -la isla, el titular y su ciclo de color- y cada uno con su propia copia de
 * la escucha, el temporizador y la red era la forma segura de que una de las
 * tres se quedara desincronizada al tocar cualquier cosa.
 */
export function cuandoAterrice(
  hacer: () => void,
  { respiro = 0.15, esperaSola = 0.35 } = {},
): () => void {
  let temporizador = 0;

  const alAterrizar = () => {
    window.removeEventListener(TUNEL_ATERRIZADO, alAterrizar);
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(hacer, respiro * 1000);
  };

  /* TunelPaneles pone data-intro nada mas arrancar, y su efecto corre antes que
     el de quien llama aqui: la portada es hija del marco del festival y la isla
     su hermana posterior, asi que React ejecuta los efectos en ese orden. */
  if (document.querySelector('.tunel[data-intro="si"]')) {
    window.addEventListener(TUNEL_ATERRIZADO, alAterrizar);
    temporizador = window.setTimeout(alAterrizar, RED);
  } else {
    temporizador = window.setTimeout(hacer, esperaSola * 1000);
  }

  return () => {
    window.removeEventListener(TUNEL_ATERRIZADO, alAterrizar);
    window.clearTimeout(temporizador);
  };
}

/** Segundos que el aro se queda quieto y lejos antes de venirse. */
const HALO = 0.5;

/** Segundos del viaje hasta el sitio definitivo. */
const ENTRADA = 1.9;

/**
 * En que punto del viaje se devuelve el mando a tunel-asomar.
 *
 * Antes del final y no al acabar: pasado ese punto los paneles empiezan a
 * cruzar el plano de la camara, y ahi el descarte tiene que estar ya operando o
 * uno de ellos se abre a pantalla completa. Con la camara todavia fuera del
 * anillo el relevo no se ve.
 */
const SUELTA = 0.78;

/**
 * Si la entrada ya se vio en esta carga de la pagina.
 *
 * Una variable de modulo, no sessionStorage ni localStorage, y esa eleccion es
 * justo lo que define cuando se repite: el modulo vive lo que vive la pagina.
 * Al recargar -o al llegar de fuera- se evalua de cero y vuelve a false, asi
 * que la entrada sale; al moverse por el sitio no, porque la navegacion de Next
 * no recarga nada y el modulo sigue en pie aunque el componente se desmonte y
 * se vuelva a montar.
 *
 * Con sessionStorage la marca sobreviviria a la recarga y la entrada no se
 * volveria a ver en toda la pestana; con localStorage, nunca mas. Aqui no hay
 * nada que guardar en el navegador, y por tanto nada que fallar en navegacion
 * privada.
 */
let yaVista = false;

export default function TunelPaneles() {
  const ref = useRef<HTMLDivElement>(null);
  const camara = useRef<HTMLDivElement>(null);

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

  /* useLayoutEffect y no useEffect: el estado de partida tiene que quedar
     puesto antes de la primera pintura, o se veria un fotograma del tunel ya
     compuesto antes de irse lejos para entrar. */
  useLayoutEffect(() => {
    const el = ref.current;
    const cam = camara.current;
    if (!el || !cam) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Una sola vez por carga de pagina. Se marca antes de montar nada, no al
       terminar: asi un desmontaje a media entrada -irse a otra seccion sin
       esperar- tampoco la deja pendiente de volver a salir. */
    if (yaVista) return;
    yaVista = true;

    /* El titular y las fechas son hermanos del tunel, no hijos, asi que se
       buscan desde la portada. Si no estuvieran, la entrada del anillo sigue
       funcionando igual.

       Van por separado porque no entran igual: el titular se descubre de abajo
       hacia arriba y el resto se funde. Si el titular estuviera dentro de lo
       que se funde, se veria descubrirse a media transparencia. */
    const portada = el.closest("[data-portada]");
    const titulo = portada?.querySelector<HTMLElement>(".portada-titulo") ?? null;
    const texto = portada?.querySelectorAll(".portada-cuerpo");

    el.dataset.intro = "si";
    gsap.set(cam, {
      "--intro-z": HALO_Z,
      "--intro-tilt": HALO_TILT,
      "--intro-giro": HALO_GIRO,
    });
    if (texto?.length) gsap.set(texto, { opacity: 0 });
    if (titulo) {
      titulo.dataset.abriendo = "si";
      gsap.set(titulo, { "--titulo-abre": 100, yPercent: 8 });
    }

    const linea = gsap.timeline();

    linea.to(
      cam,
      {
        "--intro-z": 0,
        "--intro-tilt": 0,
        duration: ENTRADA,
        ease: "power2.inOut",
        /* Solo mientras dura: una capa promovida para siempre cuesta memoria
           y aqui el anillo ya tiene la suya. */
        onStart: () => {
          cam.style.willChange = "transform";
        },
        /* El aviso va en este tween y no al final de la linea entera: lo que la
           isla espera es que el anillo llegue a su sitio, no que acabe de
           entrar el titular, que se solapa un poco despues. */
        onComplete: () => {
          cam.style.willChange = "";
          window.dispatchEvent(new Event(TUNEL_ATERRIZADO));
        },
      },
      HALO,
    );

    /* El giro va en su propia curva y empieza con el halo, no con el viaje: es
       ahi, con el aro quieto y lejos, donde el paralaje tiene que hacer su
       trabajo. Y se gasta antes de aterrizar -power1.out consume casi todo el
       angulo al principio-, porque un aro que sigue orbitando cuando la camara
       ya esta dentro se lee como un barrido lateral y no como una llegada. */
    linea.to(
      cam,
      {
        "--intro-giro": 0,
        duration: HALO + ENTRADA * 0.85,
        ease: "power1.out",
      },
      0,
    );

    linea.call(
      () => {
        delete el.dataset.intro;
      },
      undefined,
      HALO + ENTRADA * SUELTA,
    );

    /* El texto espera a que el anillo pare. Antes entraba montado sobre el
       ultimo tramo del viaje, pero con la camara todavia moviendose el titular
       se leia a la vez que el fondo cambiaba y las dos cosas se estorbaban.

       Primero el titular, que se descubre de abajo hacia arriba -el borde de
       arriba del recorte baja y va dejando ver la letra desde su base- con un
       empujon corto hacia arriba. Luego las fechas y la entradilla, que se
       funden: son texto de apoyo y no tienen que competir con el titular. */
    const ATERRIZA = HALO + ENTRADA;

    if (titulo) {
      linea.to(
        titulo,
        {
          "--titulo-abre": 0,
          yPercent: 0,
          duration: 0.95,
          ease: "power3.out",
          /* El recorte se quita al acabar: con leading 0.85 la letra sobresale
             de su caja, y un clip-path vigente le comeria las puntas para
             siempre. */
          onComplete: () => {
            delete titulo.dataset.abriendo;
          },
        },
        ATERRIZA,
      );
    }

    if (texto?.length) {
      linea.to(texto, { opacity: 1, duration: 0.6, ease: "power2.out" }, ATERRIZA + 0.35);
    }

    return () => {
      linea.kill();
      delete el.dataset.intro;
      cam.style.willChange = "";
      gsap.set(cam, { clearProps: "--intro-z,--intro-tilt,--intro-giro" });
      if (texto?.length) gsap.set(texto, { clearProps: "opacity" });
      if (titulo) {
        delete titulo.dataset.abriendo;
        gsap.set(titulo, { clearProps: "--titulo-abre,transform" });
      }
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
      {/* Envoltorio de camara. Aparte del anillo a proposito: aquel tiene el
          transform tomado por la animacion del giro, y dos animaciones no
          comparten propiedad. Asi el giro sigue siendo CSS puro -arranca sin
          esperar a que hidrate nada- y GSAP solo mueve el punto de vista. */}
      <div ref={camara} className="tunel-camara">
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
    </div>
  );
}

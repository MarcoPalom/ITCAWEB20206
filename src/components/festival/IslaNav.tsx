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
 * Los enlaces anotan ademas en el elemento raiz el centro de la pastilla y el
 * radio que hace falta: el circulo del barrido nace justo en el boton pulsado.
 */
type Punto = {
  href: string;
  titulo: string;
  /** Color de la seccion. Inicio no lleva. */
  tinte?: string;
  /** Tinta medida para ese color. Viene de SECCIONES, no se improvisa. */
  sobre?: string;
};

const seccion = (slug: string): Punto => {
  const s = SECCIONES.find((x) => x.slug === slug)!;
  return {
    href: `/festival/${s.slug}`,
    titulo: s.titulo,
    tinte: s.tinte,
    sobre: s.sobre,
  };
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

/**
 * Fija donde nace el circulo del barrido y cuanto tiene que crecer.
 *
 * Las tres cifras van a una hoja de estilo del <head>, no a estado de React, y
 * esa es la razon de que sobrevivan al cambio de ruta: el arbol de la pagina se
 * desmonta entero, pero el <head> sigue siendo el mismo mientras el navegador
 * anima las instantaneas.
 *
 * Las coordenadas son del viewport -salen de getBoundingClientRect- que es el
 * sistema en el que resuelve clip-path sobre la instantanea. No se mezclan con
 * pageX/pageY, que llevarian el scroll sumado.
 */
export function fijarOrigen(x: number, y: number) {
  const ancho = window.innerWidth;
  const alto = window.innerHeight;

  /* Radio exacto: la distancia a la esquina mas lejana. Antes esto era un 150%
     generico, que cubre pero se pasa de largo, y de dos maneras: el porcentaje
     se mide contra la caja de la instantanea -no contra el viewport- asi que en
     una seccion mas alta que la pantalla el circulo crecia desmedido, y al
     nacer al pie el barrido terminaba de revelar mucho antes que la animacion,
     dejando muerto el ultimo tramo. Con la esquina real, el circulo acaba de
     cubrir justo cuando acaba el movimiento. */
  const radio = Math.max(
    Math.hypot(x, y),
    Math.hypot(ancho - x, y),
    Math.hypot(x, alto - y),
    Math.hypot(ancho - x, alto - y),
  );

  /* Las cifras se escriben literales dentro de los fotogramas, no como
     variables que el keyframe lea con var(). Es a proposito: el arbol de
     pseudo-elementos de la transicion lo genera el navegador aparte, y hacer
     depender el origen de que una custom property de <html> herede hasta
     ::view-transition-new es el unico punto de toda la cadena que no se puede
     comprobar desde el propio codigo. Si esa herencia falla, el circulo cae al
     valor de reserva -abajo y centrado, o sea por el medio de la isla- y el
     boton pulsado deja de importar. Con los pixeles ya puestos en la regla no
     hay nada que heredar.

     Se reescribe una sola hoja, siempre la misma, y antes de navegar: cuando
     el navegador toma la instantanea la regla ya esta en su sitio. */
  const hoja =
    document.getElementById("barrido-origen") ??
    Object.assign(document.createElement("style"), { id: "barrido-origen" });
  /* Se recoloca al final del head en cada escritura, no solo al crearla: estos
     fotogramas pisan por nombre a los de globals.css, y pisar por nombre lo
     decide el orden del documento. Si el router llegara a anadir una hoja
     despues, la nuestra dejaria de ganar sin previo aviso. */
  document.head.append(hoja);
  /* Px de CSS, tal cual. Hubo aqui una multiplicacion por devicePixelRatio,
     deducida de un solo fotograma en una pantalla al 125% donde el circulo
     salia a 0.79 del camino. Esa correccion era falsa como regla general y
     rompia el movil, donde el ratio es 2 o 3: multiplicar por ahi mandaba el
     origen fuera de la pantalla. La prueba de que en movil los px de CSS son
     los correctos estaba a la vista desde el principio: la version primera ya
     escribia px -los del clic- y en el telefono se veia bien. */
  hoja.textContent =
    `@keyframes revelar-circulo{` +
    `from{clip-path:circle(0px at ${x}px ${y}px)}` +
    `to{clip-path:circle(${radio}px at ${x}px ${y}px)}}`;
}

/**
 * Origen del barrido: la columna de la pastilla pulsada, a la altura del borde
 * superior de la isla.
 *
 * La horizontal es el centro del boton, no el punto del dedo: dentro de una
 * pastilla de 44px de alto el clic cae cada vez en un sitio distinto y el
 * circulo saldria descentrado sin motivo. currentTarget es siempre el <a> al
 * que esta colgado el handler, aunque se pulse el punto de color de dentro.
 *
 * La vertical es el borde de la isla y no el centro de la pastilla, que seria
 * lo literal. El motivo es que la isla se pinta por encima del barrido -tiene
 * grupo propio y z-index 100- y su fondo es blanco al 85%, de modo que los
 * primeros 28.8px de crecimiento quedan velados: naciendo en el centro exacto
 * del boton, el circulo no se ve hasta rebasar la isla, y para entonces ya mide
 * 29px de radio, asi que aparece de golpe. Naciendo en el borde empieza en cero
 * justo donde se ve, y el salto desaparece. La columna sigue siendo la del
 * boton, que es lo que distingue una pastilla de otra.
 *
 * Se mide antes de navegar, con la isla todavia en su sitio; despues la caja ya
 * no sirve, porque en movil el carro se desliza para recentrar el activo.
 */
/**
 * Cuanto dura el barrido, en milisegundos. Tiene que coincidir con la duracion
 * de revelar-circulo en globals.css: es lo unico que permite saber, sin
 * preguntarle al navegador, si el barrido anterior sigue corriendo.
 */
const BARRIDO = 900;

/** Instante del ultimo barrido lanzado. Fuera del componente porque el arbol se
 *  desmonta entero en cada cambio de ruta y un ref no sobreviviria. */
let ultimoBarrido = 0;

/* Barrido encadenado: si el anterior no ha terminado, este sale corto.

   Pulsar otro enlace a media animacion obliga al navegador a abortar la
   transicion en curso -que ya de por si da un salto- y a reconstruir la
   seccion entera encima de la anterior. Alargar 900ms mas de espectaculo
   sobre ese destrozo no aporta nada: quien va encadenando toques quiere
   llegar, no mirar. Con el barrido corto la pagina se asienta enseguida y el
   siguiente toque ya la encuentra quieta.

   El marcador vive en <html> y no en el arbol de React porque los
   pseudo-elementos de la transicion cuelgan de la raiz del documento, que es
   lo unico que sigue en pie mientras la pagina se cambia por debajo. */
function marcarBarrido() {
  const ahora = performance.now();
  document.documentElement.dataset.barrido =
    ahora - ultimoBarrido < BARRIDO ? "corto" : "normal";
  ultimoBarrido = ahora;
}

function marcarOrigen(evento: React.MouseEvent<HTMLAnchorElement>) {
  const boton = evento.currentTarget;
  const caja = boton.getBoundingClientRect();
  const isla = boton.closest(".isla-carro")?.getBoundingClientRect() ?? caja;

  /* La columna se acota a la parte visible de la isla. En movil la isla es un
     dial que se desplaza, y una pastilla puede quedar a medias fuera del
     recorte o directamente fuera: su centro daria entonces una coordenada que
     no se corresponde con nada que el usuario vea -llega a ser negativa- y el
     circulo naceria fuera de la pantalla. */
  const x = Math.min(
    Math.max(caja.left + caja.width / 2, isla.left),
    isla.right,
  );

  fijarOrigen(x, isla.top);
  marcarBarrido();
}

/**
 * Version generica de marcarOrigen para enlaces que no viven en la isla -las
 * fichas del bentobox de municipios, el boton fijo de "volver"-. Sin isla que
 * acotar, el origen es sencillamente el centro del propio elemento pulsado.
 */
export function marcarOrigenClic(evento: React.MouseEvent<HTMLAnchorElement>) {
  const caja = evento.currentTarget.getBoundingClientRect();
  fijarOrigen(caja.left + caja.width / 2, caja.top + caja.height / 2);
  marcarBarrido();
}

export default function IslaNav() {
  const ruta = usePathname();
  const activoRef = useRef<HTMLAnchorElement | null>(null);
  const carroRef = useRef<HTMLDivElement | null>(null);
  /* El primer pintado coloca el carro de un salto; a partir de ahi se desliza. */
  const yaMontado = useRef(false);

  /* Por segmento y no por igualdad de ruta exacta: Municipios, a diferencia
     de las demas secciones, tiene paginas hijas -/festival/municipios/tampico-
     que siguen siendo esa seccion. Mismo criterio que ya usa MarcoFestival
     para la tinta de la marca, para que ambos coincidan siempre. */
  const segmento = ruta.split("/")[2];
  const activo = Math.max(
    0,
    BASE.findIndex((p) => p.href === (segmento ? `/festival/${segmento}` : "/festival")),
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

  /* Origen de reserva. Una navegacion puede empezar sin que se pulse ninguna
     pastilla -atras y adelante del navegador- y entonces no hay boton del que
     tomar la caja. Sin esto quedarian vigentes las coordenadas del ultimo clic,
     que ya no significan nada: el circulo naceria en la pastilla equivocada.
     Se cae al centro de la isla, que es de donde sale la navegacion.

     Solo en popstate. Aqui hubo tambien una escucha de resize, y en el telefono
     era un error: al desplazarse, la barra de direcciones se pliega y dispara
     resize, de modo que los fotogramas se reescribian con el barrido ya en
     marcha y el circulo daba un salto a media animacion. El evento de popstate
     no tiene ese problema porque llega antes de que el router arranque nada.

     Por lo mismo no se escribe nada al montar: mientras no se haya pulsado,
     mandan los fotogramas de globals.css, que van en porcentajes y cubren se
     empiece donde se empiece. */
  useEffect(() => {
    const desdeLaIsla = () => {
      const carro = carroRef.current;
      if (!carro) return;
      const caja = carro.getBoundingClientRect();
      fijarOrigen(caja.left + caja.width / 2, caja.top);
    };

    window.addEventListener("popstate", desdeLaIsla);
    return () => window.removeEventListener("popstate", desdeLaIsla);
  }, []);

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
                  /* Activa, la pastilla se pinta del color de su seccion, con la
                     tinta que SECCIONES tiene medida para ese fondo. Inicio no
                     tiene color propio y se queda en charcoal, que es el boton
                     primario del sistema. */
                  style={
                    esActivo && punto.tinte
                      ? {
                          background: punto.tinte,
                          color: punto.sobre,
                          /* Filete de 1px por dentro. Hace falta en la seccion
                             cuya portadilla es de su mismo color: alli la
                             pastilla queda a 1.8:1 contra el contenedor claro
                             de la isla, por debajo del 3:1 que pide el contorno
                             de un control. Se tine con currentColor, o sea con
                             la tinta de la propia pastilla, que ya esta medida
                             para contrastar con su relleno: asi el filete se ve
                             sobre cualquiera de los cuatro colores sin fijar un
                             gris que funcione solo en algunos.

                             Va como sombra interior y no como borde para no
                             ensanchar la caja: la isla no se anima en el barrido
                             y un cambio de ancho al navegar daria un salto. */
                          boxShadow:
                            "inset 0 0 0 1px color-mix(in srgb, currentColor 35%, transparent)",
                        }
                      : undefined
                  }
                  className={`flex h-11 items-center gap-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    punto.tinte ? "px-4" : "px-5 font-medium"
                  } ${
                    esActivo
                      ? `font-medium ${punto.tinte ? "" : "bg-charcoal text-bone"}`
                      : "text-charcoal hover:bg-[color-mix(in_srgb,var(--id-tinta)_7%,transparent)]"
                  }`}
                >
                  {punto.tinte ? (
                    /* Activa, el color ya lo lleva la pastilla entera y el punto
                       de ese mismo color desapareceria; pasa a la tinta. Se
                       conserva en vez de quitarlo porque su hueco sostiene el
                       ancho: la isla no se anima en el barrido, y encoger una
                       pastilla al navegar daria un salto seco. */
                    <span
                      aria-hidden="true"
                      style={{ background: esActivo ? "currentColor" : punto.tinte }}
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

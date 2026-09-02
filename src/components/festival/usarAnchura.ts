"use client";

import { useEffect, useState } from "react";

/**
 * Si la pantalla es ancha, con la misma frontera que usa el CSS (1024px).
 *
 * Existe porque ocultar con CSS no basta cuando hay video de por medio: un
 * <video> dentro de un contenedor display:none se sigue descargando si lleva
 * preload, y con autoplay reserva decodificador igual. En un telefono eso
 * significaba cargar tres videos para ensenar uno, y iOS responde a eso
 * dejando de reproducir unos, y descartando la pestana cuando se acumula.
 *
 * Devuelve null hasta que monta, no false: en el servidor no hay ventana que
 * medir, y afirmar "no es ancha" pintaria el bloque de movil en el HTML para
 * luego cambiarlo, que es justo el parpadeo que se quiere evitar.
 */
export function usarEsAncha(): boolean | null {
  const [esAncha, setEsAncha] = useState<boolean | null>(null);

  useEffect(() => {
    const consulta = window.matchMedia("(min-width: 1024px)");
    const leer = () => setEsAncha(consulta.matches);
    leer();
    consulta.addEventListener("change", leer);
    return () => consulta.removeEventListener("change", leer);
  }, []);

  return esAncha;
}

/**
 * Nombres corregidos de las companias.
 *
 * Como se llama de verdad una compania, cuando el volcado la trae de otro modo.
 * Vive aqui y no en el JSON a proposito: el volcado lo regenera el comite y lo
 * sustituimos entero cada vez, asi que una correccion escrita alli se perderia
 * en la siguiente entrega.
 *
 * Vive en su propio modulo y no dentro de artistas.ts porque hacen falta los dos
 * volcados: la cartelera sale de festival_por_artista.json y las fichas de
 * municipio de festival_por_municipio.json, y sin compartir esta lista la misma
 * compania se publicaba de dos maneras -"CIA. Circo Flotante" en las 22 fichas
 * de municipio donde aparece y el nombre corregido en la cartelera-. Importar
 * artistas.ts desde el codigo de cliente no es opcion: arrastra 213KB de JSON al
 * navegador.
 */

/* Las claves son las del volcado por artista, que es lo unico estable entre
   entregas: minusculas, sin acentos, sin comillas y con los espacios
   normalizados. claveDe() reproduce esa forma exacta -comprobado contra las 184
   fichas del volcado- para poder buscar aqui partiendo de un nombre suelto,
   que es lo unico que traen los eventos por municipio. */
const NOMBRES = new Map<string, string>([
  ["cia. teatro en espiral", "Colectivo de Teatro en Espiral"],
  /* El comite escribe la abreviatura de tres maneras -"CIA.", "Cia." y
     "Compañía"- y ninguna de las dos primeras lleva el acento que le toca. */
  ["cia. circo flotante", "Cía. Circo Flotante"],
  ["cia. ome", "Cía. Ome"],
  ["raul di blasio", "Raúl Di Blasio"],
  ["meche ramirez y musicos tamaulipecos", "Meche Rodríguez"],
  /* "Puras del Norte" es el nombre del espectaculo, no de la compania: la
     agrupacion que lo presenta se llama Grupo Pendiente. */
  ["puras del norte", "Grupo Pendiente"],
]);

export function claveDe(artista: string): string {
  return artista
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/["“”]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** El nombre corregido si lo hay, y si no el del volcado con los espacios en su
    sitio. Para quien ya tiene la clave del volcado esta nombrePorClave(). */
export function nombreArtista(artista: string): string {
  return NOMBRES.get(claveDe(artista)) ?? artista.replace(/\s+/g, " ").trim();
}

export function nombrePorClave(clave: string): string | undefined {
  return NOMBRES.get(clave);
}

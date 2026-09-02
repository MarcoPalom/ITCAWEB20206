/**
 * Enlace a Google Maps para una sede del festival.
 *
 * Vive aparte de artistas.ts, como imagenes.ts, porque quien lo usa es la
 * cartelera y esa es codigo de cliente: aquel importa el volcado del programa y
 * traerselo por una funcion de dos lineas mete 213KB de JSON en el navegador.
 */

/** El festival entero transcurre en Tamaulipas. */
const REGION = "Tamaulipas, Mexico";

/**
 * Busqueda de la sede en Google Maps, o null si todavia no hay sede.
 *
 * Se usa el esquema oficial de URL de Maps -search con api=1- y no una direccion
 * de maps.google.com armada a mano: aquel es el que Google documenta como
 * estable y el que abre la aplicacion en el telefono en vez del navegador.
 *
 * La consulta lleva municipio, estado y pais ademas del recinto, y no es
 * palabreria: de los 43 municipios del cartel hay varios que se llaman como
 * otros sitios de Mexico -Hidalgo, Guerrero, Victoria, Ocampo, Mier-, y muchas
 * sedes son un generico del tipo "Plaza Principal". Sin la region, la busqueda
 * se va a otro estado.
 */
export function enlaceMapa(sede: string, municipio: string): string | null {
  if (!sede || sede === "Por confirmar") return null;

  const consulta = [sede, municipio, REGION].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

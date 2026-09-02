/**
 * Rutas del material de un artista. Todas viven bajo la misma carpeta.
 *
 * Vive aparte de artistas.ts a proposito, y no es una manía de orden: aquel
 * importa el volcado del programa -213KB de JSON- y la cartelera es componente
 * de cliente. Con esta funcion alli dentro, importarla arrastraba el programa
 * entero al navegador, aunque el componente solo quisiera construir una ruta.
 * Aqui no hay nada que arrastrar.
 */
export function imagenesDe(foto: string) {
  return {
    fondo: `/img/artistas/${foto}/fondo.webp`,
    cards: [`/img/artistas/${foto}/a.webp`, `/img/artistas/${foto}/b.webp`],
    clip: `/img/artistas/${foto}/clip.mp4`,
    /* Un fotograma del propio clip. Es lo que se ve mientras el video carga y,
       sobre todo, lo que se ve si no llega a reproducirse nunca: en ahorro de
       datos o de bateria el movil bloquea la reproduccion automatica, y sin
       poster ahi quedaria un rectangulo negro. */
    poster: `/img/artistas/${foto}/poster.webp`,
  };
}

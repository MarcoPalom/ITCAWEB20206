import type { NextConfig } from "next";

// View Transitions ya no requieren flag experimental desde Next.js 16.3 (funcionan out of the box).
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /**
         * Las fotografias y los clips, en cache de verdad.
         *
         * Next sirve todo lo de public/ con "Cache-Control: public, max-age=0",
         * y eso obliga al navegador a preguntar por cada imagen en cada visita
         * aunque ya la tenga entera. Medido contra produccion: la primera
         * descarga de una foto tardaba 587ms y las siguientes 180ms constantes,
         * que es el viaje de ida y vuelta para que el servidor conteste "no ha
         * cambiado" sin mandar un solo byte. Se notaba sobre todo al abrir la
         * ficha de un artista desde la agenda de su municipio, donde la imagen
         * ni siquiera existe hasta que se toca.
         *
         * No lleva immutable ni un ano de vida, que es lo que Next si pone en
         * sus propios bultos: aquellos van con un hash en el nombre y cambiar
         * el contenido cambia la url, mientras que estas fotos se sustituyen
         * conservando el nombre -llegan por entregas del comite- y quedarian
         * congeladas. La combinacion de abajo es la que corresponde a un
         * archivo que puede cambiar sin avisar: se da por bueno durante una
         * hora, y despues se sigue ensenando el que hay mientras se comprueba
         * en segundo plano si llego otro.
         */
        source: "/img/:ruta*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=604800",
          },
        ],
      },
      {
        /* Los iconos del imagotipo y las banderas si son estables: se
           escribieron una vez y no se tocan. */
        source: "/icons/:ruta*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /* Integracion de React con la View Transitions API. Es lo que permite que
       el circulo revele la pagina nueva de verdad -con su contenido- sobre una
       instantanea congelada de la anterior. Sin esto solo se puede animar una
       capa de color, que es justo lo que se veia mal. */
    viewTransition: true,
  },
};

export default nextConfig;

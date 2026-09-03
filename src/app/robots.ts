import type { MetadataRoute } from "next";

import { SITIO } from "@/data/sitio";

/**
 * Todo permitido, sin disallow: la cortinilla de "/" (ver app/page.tsx) ya se
 * excluye con un noindex en la propia pagina, no aqui. Un disallow de
 * robots.txt le esconde la pagina al rastreador antes de que llegue a leer
 * esa etiqueta, y Google puede terminar indexando la URL de todos modos -sin
 * descripcion, solo por los enlaces que apuntan a ella-, que es peor que
 * dejarla entrar y que respete el noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}

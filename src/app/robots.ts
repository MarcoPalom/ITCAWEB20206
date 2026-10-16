import type { MetadataRoute } from "next";

import { SITIO } from "@/data/sitio";

/** Todo permitido: no hay nada en el sitio que deba quedar fuera del indice. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}

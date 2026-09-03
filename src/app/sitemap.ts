import type { MetadataRoute } from "next";

import { MUNICIPIOS } from "@/data/municipios";
import { SECCIONES } from "@/data/secciones";
import { SITIO } from "@/data/sitio";

/**
 * "/" no aparece: es la cortinilla del sitio institucional (ver app/page.tsx)
 * y ya lleva noindex, asi que no tiene sentido ofrecersela al rastreador como
 * si fuera contenido. /festival es la portada real del festival y por eso
 * lleva la prioridad mas alta.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  const secciones = SECCIONES.filter((s) => s.slug !== "municipios").map(
    (s) => ({
      url: `${SITIO}/festival/${s.slug}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  const municipios = MUNICIPIOS.map((m) => ({
    url: `${SITIO}/festival/municipios/${m.id}`,
    lastModified: ahora,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: `${SITIO}/festival`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...secciones,
    {
      url: `${SITIO}/festival/municipios`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...municipios,
  ];
}

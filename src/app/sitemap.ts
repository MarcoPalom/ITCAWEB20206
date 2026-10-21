import type { MetadataRoute } from "next";

import { AUTORES, COLECCIONES, LIBROS } from "@/data/biblioteca";
import { MUNICIPIOS } from "@/data/municipios";
import { SECCIONES } from "@/data/secciones";
import { SITIO } from "@/data/sitio";

/**
 * La portada del sitio institucional y la del festival llevan la prioridad
 * mas alta; el resto, segun cuanto cambian.
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
      url: SITIO,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITIO}/beneficiarios`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
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
    {
      url: `${SITIO}/bibliotecavirtual`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITIO}/bibliotecavirtual/autores`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...COLECCIONES.map((c) => ({
      url: `${SITIO}/bibliotecavirtual/coleccion/${c.slug}`,
      lastModified: ahora,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...LIBROS.map((l) => ({
      url: `${SITIO}/bibliotecavirtual/libro/${l.slug}`,
      lastModified: ahora,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...AUTORES.map((a) => ({
      url: `${SITIO}/bibliotecavirtual/autores/${a.slug}`,
      lastModified: ahora,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}

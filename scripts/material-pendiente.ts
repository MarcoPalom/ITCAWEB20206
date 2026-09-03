/**
 * Regenera MATERIAL_PENDIENTE.md a partir de la cartelera ya derivada.
 *
 * El documento se lo lleva el ITCA para reclamar material a las companias, asi
 * que no puede escribirse a mano: cada volcado nuevo del comite mueve las
 * cuentas -la entrega del 2 de septiembre paso de 142 fichas a 181- y una
 * lista desfasada hace reclamar fotos que ya llegaron.
 *
 *   npx tsx scripts/material-pendiente.ts
 *
 * Lee de ARTISTAS y no del JSON crudo a proposito: lo que interesa es lo que
 * de verdad sale en la cartelera, ya con las retiradas fuera y las fusiones
 * hechas. Los nombres van con sus acentos, que es como los escribe el comite.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { ARTISTAS, type Seccion } from "../src/data/artistas";
import bruto from "../src/data/festival_por_artista.json";

const SECCIONES: [Seccion, string][] = [
  ["internacionales", "Internacionales"],
  ["nacionales", "Nacionales"],
  ["tamaulipecos", "Tamaulipecos"],
];

/* La cartelera guarda el nombre sin acentos por convencion del sitio; aqui hace
   falta el original, y el volcado es quien lo tiene. Se casa por id. */
const identificador = (clave: string) =>
  clave
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const original = new Map(
  bruto.artistas.map((a) => [
    identificador(a.clave),
    {
      nombre: a.artista.replace(/\s+/g, " ").trim(),
      disciplina: a.disciplinas[0] ?? "(sin dato)",
      procedencia: a.procedencias.join(" / ") || "(sin dato)",
    },
  ]),
);

const falta = (a: { foto: string | null; clip: boolean }) =>
  !a.foto ? "**foto y video**" : !a.clip ? "**video**" : null;

const fichas = SECCIONES.flatMap(([slug]) => ARTISTAS[slug]);
const sinFoto = fichas.filter((a) => !a.foto).length;
const sinVideo = fichas.filter((a) => !a.clip).length;

const lineas: string[] = [
  "# Material pendiente — FICSM 2026",
  "",
  `Generado con \`npx tsx scripts/material-pendiente.ts\` a partir de \`src/data/festival_por_artista.json\` (${fichas.length} companias en cartelera).`,
  "",
  `- **Sin fotografia:** ${sinFoto} — la ficha sale con marcador de posicion.`,
  `- **Sin video:** ${sinVideo} — la ficha se queda con dos turnos en vez de tres.`,
  "",
  "Se necesitan **tres fotografias** por compania (una apaisada para el fondo y dos para la",
  "ficha) y **un video** cualquiera, del que se recorta un clip de dos segundos.",
  "",
  "| Seccion | Fichas | Sin foto | Sin video |",
  "|---|---|---|---|",
];

for (const [slug, titulo] of SECCIONES) {
  const l = ARTISTAS[slug];
  lineas.push(
    `| ${titulo} | ${l.length} | ${l.filter((a) => !a.foto).length} | ${l.filter((a) => !a.clip).length} |`,
  );
}

for (const [slug, titulo] of SECCIONES) {
  const pendientes = ARTISTAS[slug].filter((a) => falta(a));
  if (pendientes.length === 0) continue;

  lineas.push(
    "",
    `## ${titulo} — ${pendientes.length} de ${ARTISTAS[slug].length} con algo pendiente`,
    "",
    "| Compania | Falta | Disciplina | Procedencia | Fechas |",
    "|---|---|---|---|---|",
  );

  const filas = pendientes.map((a) => {
    const o = original.get(a.id);
    return {
      nombre: o?.nombre ?? a.nombre,
      fila: `| ${o?.nombre ?? a.nombre} | ${falta(a)} | ${o?.disciplina ?? "(sin dato)"} | ${o?.procedencia ?? "(sin dato)"} | ${a.presentaciones.length} |`,
    };
  });

  filas.sort((x, y) => x.nombre.localeCompare(y.nombre, "es"));
  lineas.push(...filas.map((f) => f.fila));
}

const salida = join(import.meta.dirname, "..", "MATERIAL_PENDIENTE.md");
writeFileSync(salida, lineas.join("\n") + "\n", "utf8");
console.log(`${salida}: ${fichas.length} fichas, ${sinFoto} sin foto, ${sinVideo} sin video`);

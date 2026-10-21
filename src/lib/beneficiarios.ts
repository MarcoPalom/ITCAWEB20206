import { existsSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * Lectura del padron de beneficiarios (la base la crea y la carga
 * scripts/beneficiarios.mjs). Solo se usa en el servidor.
 */

/* La ruta solo se conoce al ejecutar: el comentario evita que Turbopack trate
   de rastrear desde aqui todo el proyecto como si fuera codigo del servidor. */
const RUTA = process.env.ITCA_DB ?? join(/* turbopackIgnore: true */ process.cwd(), "datos", "itca.db");

export type Convocatoria = { id: number; nombre: string; anio: number; personas: number };

export type Coincidencia = {
  convocatoria: string;
  anio: number;
  nombre: string;
  /** "mismo": el nombre coincide tal cual (sin acentos ni titulos);
      "similar": uno contiene al otro, p. ej. le falta el segundo apellido. */
  tipo: "mismo" | "similar";
};

export type Beneficiario = {
  id: number;
  nombre: string;
  convocatoriaId: number;
  convocatoria: string;
  anio: number;
  /** Apoyos dentro de esta misma convocatoria. */
  apoyos: number;
  coincidencias: Coincidencia[];
};

export type Padron = { convocatorias: Convocatoria[]; beneficiarios: Beneficiario[] };

/* Titulos y grados que a veces se anteponen al nombre y no lo distinguen. */
const TITULOS = new Set([
  "dr", "dra", "mtro", "mtra", "lic", "ing", "arq", "prof", "profa", "c", "cp", "mc", "maestro", "maestra",
]);

const fichas = (nombre: string) =>
  nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !TITULOS.has(t));

/**
 * Dos nombres se consideran la misma persona si, quitados acentos y titulos,
 * son iguales, o si todas las palabras del mas corto estan en el mas largo y
 * el corto tiene al menos tres (nombre y dos apellidos, o dos nombres y un
 * apellido). Con menos de tres, "Andrés Gea" casaria con cualquier Andrés
 * Gea Algo, y el riesgo de confundir a dos personas es demasiado alto.
 */
function comparar(a: string[], b: string[]): Coincidencia["tipo"] | null {
  if (a.join(" ") === b.join(" ")) return "mismo";
  const [corto, largo] = a.length <= b.length ? [a, b] : [b, a];
  if (corto.length < 3) return null;
  const resto = [...largo];
  for (const t of corto) {
    const i = resto.indexOf(t);
    if (i < 0) return null;
    resto.splice(i, 1);
  }
  return "similar";
}

export function leerPadron(): Padron {
  if (!existsSync(RUTA)) return { convocatorias: [], beneficiarios: [] };
  const db = new DatabaseSync(RUTA, { readOnly: true });
  try {
    const convocatorias = db
      .prepare(
        `SELECT c.id, c.nombre, c.anio, COUNT(b.id) AS personas
           FROM convocatorias c LEFT JOIN beneficiarios b ON b.convocatoria_id = c.id
          GROUP BY c.id ORDER BY c.anio DESC, c.nombre`,
      )
      /* node:sqlite devuelve filas sin prototipo, y React no deja pasarlas
         asi a un componente de cliente: se copian a objetos normales. */
      .all()
      .map((f) => ({ ...f })) as Convocatoria[];

    const filas = db
      .prepare(
        `SELECT b.id, b.nombre, b.apoyos, c.id AS convocatoriaId, c.nombre AS convocatoria, c.anio
           FROM beneficiarios b JOIN convocatorias c ON c.id = b.convocatoria_id
          ORDER BY b.nombre COLLATE NOCASE`,
      )
      .all()
      .map((f) => ({ ...f })) as Omit<Beneficiario, "coincidencias">[];

    const conFichas = filas.map((f) => ({ ...f, fichas: fichas(f.nombre) }));
    const beneficiarios = conFichas.map(({ fichas: propias, ...f }) => ({
      ...f,
      coincidencias: conFichas
        .filter((o) => o.convocatoriaId !== f.convocatoriaId)
        .flatMap((o) => {
          const tipo = comparar(propias, o.fichas);
          return tipo
            ? [{ convocatoria: o.convocatoria, anio: o.anio, nombre: o.nombre, tipo }]
            : [];
        }),
    }));

    /* Orden alfabetico sin acentos: "Álvaro" va con la A, no al final. */
    beneficiarios.sort((x, y) => x.nombre.localeCompare(y.nombre, "es"));
    return { convocatorias, beneficiarios };
  } finally {
    db.close();
  }
}

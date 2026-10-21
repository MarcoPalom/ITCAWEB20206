/**
 * Base de datos del padron de beneficiarios de convocatorias.
 *
 * Es un archivo SQLite que vive fuera del codigo: en el servidor,
 * /var/www/itca/datos/itca.db (la carpeta datos/ esta en .gitignore, asi que
 * ni un git pull ni un despliegue la tocan). La pagina /beneficiarios la lee
 * en cada visita, de modo que cargar un concentrado nuevo no requiere
 * recompilar el sitio.
 *
 * Usa node:sqlite, que viene con Node 22: no hay dependencia que instalar ni
 * modulo nativo que compilar en el servidor.
 *
 * Comandos:
 *   node scripts/beneficiarios.mjs importar lote.json
 *   node scripts/beneficiarios.mjs listar
 *   node scripts/beneficiarios.mjs quitar-convocatoria <id>
 *
 * lote.json lo genera scripts/excel-beneficiarios.py a partir del Excel.
 * Importar es idempotente: volver a cargar el mismo lote no duplica nada, y
 * cargar un concentrado ampliado solo agrega los nombres nuevos.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const RUTA = process.env.ITCA_DB ?? join(process.cwd(), "datos", "itca.db");

function abrir() {
  mkdirSync(dirname(RUTA), { recursive: true });
  const db = new DatabaseSync(RUTA);
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS convocatorias (
      id      INTEGER PRIMARY KEY,
      nombre  TEXT    NOT NULL,
      anio    INTEGER NOT NULL,
      cargada TEXT    NOT NULL DEFAULT (datetime('now')),
      UNIQUE (nombre, anio)
    );
    CREATE TABLE IF NOT EXISTS beneficiarios (
      id             INTEGER PRIMARY KEY,
      convocatoria_id INTEGER NOT NULL REFERENCES convocatorias(id) ON DELETE CASCADE,
      nombre         TEXT    NOT NULL,
      -- Veces que la persona aparece en el concentrado de esa convocatoria:
      -- mas de una es un doble apoyo dentro de la misma convocatoria.
      apoyos         INTEGER NOT NULL DEFAULT 1,
      UNIQUE (convocatoria_id, nombre)
    );
  `);
  return db;
}

function importar(archivo) {
  const lote = JSON.parse(readFileSync(archivo, "utf8"));
  const db = abrir();
  const conv = db.prepare(
    "INSERT INTO convocatorias (nombre, anio) VALUES (?, ?) ON CONFLICT (nombre, anio) DO UPDATE SET nombre = excluded.nombre RETURNING id",
  );
  /* El concentrado de una convocatoria es su lista completa: el numero de
     apoyos se toma del lote tal cual, asi recargarlo no lo infla. */
  const ben = db.prepare(
    `INSERT INTO beneficiarios (convocatoria_id, nombre, apoyos) VALUES (?, ?, ?)
     ON CONFLICT (convocatoria_id, nombre) DO UPDATE SET apoyos = excluded.apoyos`,
  );
  const existe = db.prepare("SELECT 1 FROM beneficiarios WHERE convocatoria_id = ? AND nombre = ?");
  db.exec("BEGIN");
  try {
    for (const c of lote.convocatorias) {
      const { id } = conv.get(c.nombre.trim(), c.anio);
      const veces = new Map();
      for (const n of c.beneficiarios) {
        const nombre = n.replace(/\s+/g, " ").trim();
        if (nombre) veces.set(nombre, (veces.get(nombre) ?? 0) + 1);
      }
      let nuevos = 0;
      for (const [nombre, k] of veces) {
        if (!existe.get(id, nombre)) nuevos++;
        ben.run(id, nombre, k);
        if (k > 1) console.log(`  aviso: ${nombre} aparece ${k} veces en ${c.nombre}`);
      }
      console.log(`${c.nombre} (${c.anio}): ${veces.size} personas, ${nuevos} nuevas`);
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

function listar() {
  const db = abrir();
  const filas = db
    .prepare(
      `SELECT c.id, c.nombre, c.anio, c.cargada, COUNT(b.id) AS personas, SUM(b.apoyos) AS apoyos
         FROM convocatorias c LEFT JOIN beneficiarios b ON b.convocatoria_id = c.id
        GROUP BY c.id ORDER BY c.anio DESC, c.nombre`,
    )
    .all();
  console.table(filas);
}

function quitarConvocatoria(id) {
  const db = abrir();
  const r = db.prepare("DELETE FROM convocatorias WHERE id = ?").run(Number(id));
  console.log(r.changes ? `Convocatoria ${id} eliminada con sus beneficiarios.` : `No existe la convocatoria ${id}.`);
}

const [orden, arg] = process.argv.slice(2);
if (orden === "importar" && arg) importar(arg);
else if (orden === "listar") listar();
else if (orden === "quitar-convocatoria" && arg) quitarConvocatoria(arg);
else {
  console.log("Uso: node scripts/beneficiarios.mjs importar lote.json | listar | quitar-convocatoria <id>");
  process.exit(1);
}

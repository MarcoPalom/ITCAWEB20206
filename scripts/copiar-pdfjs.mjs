/**
 * Copia a public/pdfjs/ lo que el lector de la Biblioteca Virtual pide en
 * tiempo de ejecucion: el worker de PDF.js, las fuentes estandar (para los PDF
 * que no incrustan alguna de las 14 basicas), los perfiles ICC y los
 * decodificadores wasm de imagen.
 *
 * Se copian en cada instalacion y antes de cada build, y no se versionan: el
 * worker tiene que ser exactamente de la misma version que la libreria que se
 * empaqueta en el bundle, o PDF.js se niega a arrancar. Copiandolo desde
 * node_modules no hay forma de que se desincronicen.
 */
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const origen = dirname(require.resolve("pdfjs-dist/package.json"));
const destino = join(process.cwd(), "public", "pdfjs");

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });

cpSync(join(origen, "build", "pdf.worker.min.mjs"), join(destino, "pdf.worker.min.mjs"));
cpSync(join(origen, "standard_fonts"), join(destino, "standard_fonts"), { recursive: true });
cpSync(join(origen, "iccs"), join(destino, "iccs"), { recursive: true });
cpSync(join(origen, "wasm"), join(destino, "wasm"), {
  recursive: true,
  /* quickjs solo sirve para ejecutar el JavaScript incrustado en un PDF, y el
     lector lo tiene desactivado. */
  filter: (ruta) => !/quickjs/.test(ruta),
});

console.log("pdfjs: recursos copiados a public/pdfjs");

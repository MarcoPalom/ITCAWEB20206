import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, "..");

const { MUNICIPIOS_FOTOS } = await import(
  pathToFileURL(path.join(RAIZ, "src/data/municipios_fotos.ts")).href
);

function sinAcentos(t) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function identificador(nombre) {
  return sinAcentos(nombre)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const bruto = JSON.parse(
  readFileSync(path.join(RAIZ, "src/data/festival_por_municipio.json"), "utf8"),
);
const municipios = bruto.municipios
  .map((m) => ({ id: identificador(m.municipio), nombre: m.municipio }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

const tarjetas = municipios
  .map((m) => {
    const foto = MUNICIPIOS_FOTOS[m.id];
    return `
    <div class="tarjeta ${foto ? "" : "sin-foto"}">
      ${
        foto
          ? `<img src="../public/img/municipios/${m.id}.jpg" loading="lazy">`
          : `<div class="vacio">sin foto</div>`
      }
      <p class="nombre">${m.nombre}</p>
      <p class="titulo">${foto?.titulo ?? ""}</p>
      <p class="licencia">${foto?.licencia ?? ""}</p>
    </div>`;
  })
  .join("\n");

writeFileSync(
  path.join(AQUI, "contact-sheet.html"),
  `<!doctype html><html><head><meta charset="utf-8"><title>Contact sheet</title>
  <style>
    body { font-family: sans-serif; background: #111; color: #eee; margin: 0; padding: 1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
    .tarjeta { background: #1c1c1c; border-radius: 6px; overflow: hidden; }
    .tarjeta.sin-foto { outline: 2px solid red; }
    img { width: 100%; height: 130px; object-fit: cover; display: block; }
    .vacio { height: 130px; display: flex; align-items: center; justify-content: center; color: red; }
    p { margin: 0.25rem 0.5rem; font-size: 0.7rem; line-height: 1.3; }
    .nombre { font-weight: bold; font-size: 0.85rem; }
    .titulo { color: #aaa; }
    .licencia { color: #6a6; }
  </style></head><body><div class="grid">${tarjetas}</div></body></html>`,
);
console.log("Escrito scripts/contact-sheet.html");

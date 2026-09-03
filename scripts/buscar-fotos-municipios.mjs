/**
 * Busca y optimiza una fotografia libre de derechos por cada uno de los 43
 * municipios de Tamaulipas, para las fichas del bentobox de
 * /festival/municipios.
 *
 * Fuente: Wikimedia Commons, via su API de busqueda (accion "query" +
 * generador "search" acotado al namespace de archivos). Solo se aceptan
 * licencias libres (CC BY, CC BY-SA o dominio publico) y se descartan mapas,
 * escudos, banderas y logotipos por nombre de archivo -no son la fotografia
 * que se busca-.
 *
 * Este script corre una sola vez (o cuando haga falta rehacer el banco de
 * fotos) y su salida se commitea: las fotos en public/img/municipios/ y la
 * constancia de autoria en src/data/municipios_fotos.ts. En runtime no
 * interviene ninguna llamada de red.
 *
 * Uso: node scripts/buscar-fotos-municipios.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, "..");
const DESTINO = path.join(RAIZ, "public/img/municipios");
mkdirSync(DESTINO, { recursive: true });

/* Node no resuelve el grafo de modulos de Next (alias "@/", extensiones
   implicitas) fuera de su bundler, asi que este script no importa
   src/data/municipios.ts: deriva por su cuenta el par id/nombre que necesita,
   directo del mismo JSON, con el mismo esquema de slug -sin acentos,
   minusculas, guiones- que usa ese modulo. */
function sinAcentos(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
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
const MUNICIPIOS = bruto.municipios
  .map((m) => ({ id: identificador(m.municipio), nombre: m.municipio }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

const AGENTE =
  "ITCAWEB20206-buscar-fotos/1.0 (https://itcadigital.mx; sitio del Festival Internacional de la Costa del Seno Mexicano)";

/* Nombres de archivo que delatan que no es una fotografia del lugar sino un
   mapa, escudo, bandera o logotipo. Sin limites de palabra en "mapa"/"map":
   los mapas de ubicacion de Wikipedia suelen nombrarse pegado a lo que
   sigue -"MapaRioBravoTamps.png"- y \b no corta ahi. */
const NO_FOTO =
  /(mapa|map|ubicacion|location|escudo|coat.?of.?arms|bandera|flag|logo|localizacion|plano|stemma)/i;

/* Los mapas de "ubicacion dentro del estado" de Wikipedia son casi siempre
   SVG; una fotografia real casi nunca lo es. Extension y no solo nombre,
   porque varios de esos mapas se llaman igual que el propio municipio
   ("Padilla en Tamaulipas.svg") y no traen ninguna palabra de NO_FOTO. */
function esSvg(titulo) {
  return /\.svg$/i.test(titulo);
}

const LICENCIAS_LIBRES = /^(cc |public domain|pd|cc0)/i;

/* La busqueda de texto libre de Commons empareja por cualquier coincidencia
   de palabras, y "Cruillas" o "San Nicolas" o "Mendez" tambien son un
   festival en Barcelona, un pueblo en Macedonia del Norte o un almirante en
   Ferrol. Sin exigir que "tamaulipas" aparezca en el titulo o en las
   categorias del archivo, la mitad de las 43 fotos de la primera pasada
   salieron de otro lugar del mundo. */
function mencionaTamaulipas(pagina, info) {
  const bolsa = [
    pagina.title,
    info.extmetadata?.Categories?.value,
    info.extmetadata?.ImageDescription?.value,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return bolsa.includes("tamaulipas");
}

/**
 * Con reintento y espera creciente ante un 429: la primera pasada disparaba
 * hasta 6 peticiones por municipio (varias categorias + busqueda +
 * descarga) sin pausa entre ellas, y Commons empezo a devolver "Too Many
 * Requests" a partir del municipio 16. Tres intentos con espera doblada
 * -1s, 2s, 4s- alcanza sin tener que alargar la pausa fija de todos modos.
 */
async function conReintentos(pedir) {
  for (let intento = 0; ; intento++) {
    const res = await pedir();
    if (res.status !== 429) return res;
    if (intento >= 3) return res;
    await new Promise((r) => setTimeout(r, 1000 * 2 ** intento));
  }
}

async function llamarApi(params) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({ format: "json", ...params }).toString();
  const res = await conReintentos(() => fetch(url, { headers: { "User-Agent": AGENTE } }));
  if (!res.ok) throw new Error(`Commons respondio ${res.status}`);
  return res.json();
}

async function porCategoria(categoria) {
  const json = await llamarApi({
    action: "query",
    generator: "categorymembers",
    gcmtitle: categoria,
    gcmtype: "file",
    gcmlimit: "20",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
  });
  return Object.values(json.query?.pages ?? {});
}

async function porBusqueda(termino) {
  const json = await llamarApi({
    action: "query",
    generator: "search",
    gsrsearch: termino,
    gsrnamespace: "6",
    gsrlimit: "15",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
  });
  return Object.values(json.query?.pages ?? {});
}

function elegirMejor(paginas, { exigirTamaulipas }) {
  const candidatas = paginas
    .filter((p) => !NO_FOTO.test(p.title) && !esSvg(p.title))
    .map((p) => ({ pagina: p, info: p.imageinfo?.[0] }))
    .filter(
      (c) =>
        c.info &&
        LICENCIAS_LIBRES.test(c.info.extmetadata?.LicenseShortName?.value ?? "") &&
        c.info.width >= 500 &&
        (!exigirTamaulipas || mencionaTamaulipas(c.pagina, c.info)),
    )
    .sort((a, b) => b.info.width * b.info.height - a.info.width * a.info.height);

  return candidatas[0] ?? null;
}

/**
 * Categoria antes que busqueda: las categorias de Commons las arma a mano
 * gente que sabe de que pueblo esta hablando, y la busqueda de texto libre
 * no. Se prueban variantes de nombre porque no todos los municipios usan el
 * mismo patron ("X, Tamaulipas" para los chicos, "X" a secas para ciudades
 * conocidas como Tampico o Reynosa).
 */
/**
 * Sustituciones a mano, decididas mirando el contact-sheet (scripts/
 * contact-sheet.mjs) despues de la primera pasada automatica. La categoria
 * de Commons no distingue una fotografia del pueblo de una rana, una planta,
 * un retrato o -en Miguel Aleman- una fotografia de Roma, Texas, el pueblo
 * fronterizo del otro lado del rio: eso solo se ve mirando la imagen. Estas
 * 11 quedan fijas por titulo exacto, sin pasar por la heuristica.
 */
const SUSTITUCIONES = {
  "Abasolo": "Presidencia Municipal, Abasolo, Tamaulipas.jpg",
  "Burgos": "Presidencia Municipal, Burgos, Tamaulipas.jpg",
  "Camargo": "Oficina Postal de Ciudad Camargo, Tamaulipas, ca. 1910.jpg",
  "Guerrero": "Oficina Postal de Ciudad Guerrero, Tamaulipas 1910.jpg",
  "Jaumave": "Jaumave, Tamaulipas.jpg",
  "Jiménez": "Presidencia Municipal, Jiménez, Tamaulipas.jpg",
  "Madero": "Amanecer Playa Ciudad Madero.jpg",
  "Matamoros": "Presidencia Municipal - Matamoros - Foto nocturna 2018.jpg",
  "Mier": "Ciudad Mier, Tamaulipas, Mexico - panoramio.jpg",
  "Miguel Alemán": "Miguel Alemán Centro.jpg",
  "Miquihuana": "Miquihuana, Tamaulipas.jpg",
  "San Fernando": "San Fernando Parque, Tamaulipas.jpg",
  /* "Arroyo El Coyote Nuevo Laredo.png" -el que salia por categoria- es real
     y esta bien ubicado, pero es una macro de zacate seco: se ve al abrirlo
     entero, no en la miniatura del contact-sheet. Aerea de la ciudad al
     atardecer en su lugar. */
  "Nuevo Laredo": "Nuevo Laredo south side.png",
  /* Sin categoria ni busqueda directa: "Gustavo Diaz Ordaz" comparte nombre
     con un expresidente, un aeropuerto (que en realidad esta en Reynosa) y
     una avenida en Irapuato, y eso ahoga cualquier busqueda de texto libre.
     La imagen la saco del propio infobox del articulo de Wikipedia sobre el
     municipio: el transbordador de Los Ebanos, el cruce fronterizo que le
     da identidad al pueblo. */
  "Gustavo Díaz Ordaz":
    "The hand-pulled Los Ebanos Ferry or El Chalan, formally known as the Los Ebanos-Diaz Ordaz Ferry, a hand-operated cable car-pedestrian ferry that travels across the Rio Grande River between Los Ebanos LCCN2014631807.tif",
};

async function porTitulo(titulo) {
  const json = await llamarApi({
    action: "query",
    titles: `File:${titulo}`,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
  });
  return Object.values(json.query?.pages ?? {});
}

async function buscarFoto(nombre) {
  if (SUSTITUCIONES[nombre]) {
    const paginas = await porTitulo(SUSTITUCIONES[nombre]);
    const elegida = elegirMejor(paginas, { exigirTamaulipas: false });
    if (elegida) return elegida;
  }

  const categorias = [
    `Category:${nombre}, Tamaulipas`,
    `Category:${nombre} Municipality, Tamaulipas`,
    `Category:${nombre} Municipality`,
    `Category:${nombre}`,
  ];

  for (const cat of categorias) {
    const paginas = await porCategoria(cat);
    await new Promise((r) => setTimeout(r, 200));
    if (paginas.length === 0) continue;
    /* La categoria ya identifica el lugar: no hace falta que cada archivo
       repita "Tamaulipas" en su propio titulo. */
    const elegida = elegirMejor(paginas, { exigirTamaulipas: false });
    if (elegida) return elegida;
  }

  const paginas = await porBusqueda(`${nombre} Tamaulipas`);
  return elegirMejor(paginas, { exigirTamaulipas: true });
}

async function descargar(url) {
  const res = await conReintentos(() => fetch(url, { headers: { "User-Agent": AGENTE } }));
  if (!res.ok) throw new Error(`No se pudo descargar ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const manifiesto = {};
let encontradas = 0;

for (const [i, m] of MUNICIPIOS.entries()) {
  process.stdout.write(`[${i + 1}/${MUNICIPIOS.length}] ${m.nombre}... `);
  try {
    const elegida = await buscarFoto(m.nombre);

    if (!elegida) {
      console.log("sin resultado confiable, se deja sin foto");
      manifiesto[m.id] = null;
      continue;
    }

    const cruda = await descargar(elegida.info.url);
    await sharp(cruda)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 74, mozjpeg: true })
      .toFile(path.join(DESTINO, `${m.id}.jpg`));

    manifiesto[m.id] = {
      titulo: elegida.pagina.title,
      autor: (elegida.info.extmetadata?.Artist?.value ?? "")
        .replace(/<[^>]+>/g, "")
        .trim(),
      licencia: elegida.info.extmetadata?.LicenseShortName?.value ?? "",
      fuente: elegida.info.descriptionurl ?? elegida.info.url,
    };
    encontradas++;
    console.log(`OK (${elegida.pagina.title})`);
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    manifiesto[m.id] = null;
  }

  /* Cortesia con la API de Commons: una pausa entre municipio y municipio. */
  await new Promise((r) => setTimeout(r, 350));
}

const salida = `/**
 * Constancia de autoria de las fotografias de public/img/municipios/.
 *
 * Derivado -no escrito a mano- por scripts/buscar-fotos-municipios.mjs.
 * Cada entrada es la foto elegida en Wikimedia Commons para ese municipio,
 * con licencia libre (CC BY, CC BY-SA o dominio publico); null donde no
 * aparecio ninguna que cumpliera. Para regenerar, ver ese script.
 */
export type FotoMunicipio = {
  titulo: string;
  autor: string;
  licencia: string;
  fuente: string;
};

export const MUNICIPIOS_FOTOS: Record<string, FotoMunicipio | null> = ${JSON.stringify(manifiesto, null, 2)};
`;

writeFileSync(path.join(RAIZ, "src/data/municipios_fotos.ts"), salida);
console.log(`\nListo: ${encontradas}/${MUNICIPIOS.length} municipios con foto.`);

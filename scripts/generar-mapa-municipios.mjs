/**
 * Genera src/data/municipios_mapa.ts a partir del contorno de los 43
 * municipios de Tamaulipas.
 *
 * Fuente: "Division politica municipal, 1:250 000, 2018", autoria INEGI,
 * publicada por la CONABIO bajo los Terminos de Libre Uso de INEGI
 * (reutilizacion y redistribucion libres citando la fuente):
 *   http://geoportal.conabio.gob.mx/metadatos/doc/html/muni_2018gw.html
 *   http://www.conabio.gob.mx/informacion/gis/maps/geo/muni_2018gw.zip
 *
 * No se copia nada a mano: este script se corre una sola vez (o cuando haga
 * falta regenerar) y su salida se commitea. En runtime no interviene ninguna
 * libreria de mapas ni de proyeccion: solo hay atributos "d" de SVG.
 *
 * Pasos para regenerar desde cero:
 *   1. Descargar y descomprimir el zip de arriba en scripts/fuente/.
 *   2. node scripts/filtrar-tamaulipas.mjs   (si no existe ya tamaulipas.geojson)
 *   3. npx mapshaper tamaulipas.geojson -simplify visvalingam 3% keep-shapes \
 *        -clean -o tamaulipas.simple.geojson format=geojson
 *   4. node scripts/generar-mapa-municipios.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { geoTransform, geoPath } from "d3-geo";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, "..");

/* El shapefile de INEGI/CONABIO nombra dos municipios distinto de como los
   nombra el volcado del comite del festival (festival_por_municipio.json).
   Se renombran aqui, en el origen, para que el resto del pipeline -y el id
   que comparten mapa y programacion- trabaje con un solo nombre por
   municipio. */
const ALIAS = {
  "El Mante": "Mante",
  "Ciudad Madero": "Madero",
};

/**
 * Los shapefiles suelen guardar el anillo exterior en sentido horario; el
 * estandar GeoJSON (RFC 7946) lo exige antihorario. No es la causa del bug
 * de proyeccion de mas abajo -eso fue el resampleo esferico de d3-geo-, pero
 * se corrige de todos modos: es higiene de datos correcta y sin costo, y
 * evita sorpresas si algun municipio llegara a tener un anillo interior
 * (un hueco) en una version futura del shapefile.
 */
function areaSenal(anillo) {
  let area = 0;
  for (let i = 0; i < anillo.length - 1; i++) {
    const [x1, y1] = anillo[i];
    const [x2, y2] = anillo[i + 1];
    area += x1 * y2 - x2 * y1;
  }
  return area / 2;
}

function corregirSentido(geometria) {
  const poligonos =
    geometria.type === "Polygon" ? [geometria.coordinates] : geometria.coordinates;
  for (const anillos of poligonos) {
    anillos.forEach((anillo, i) => {
      const exterior = i === 0;
      const horario = areaSenal(anillo) < 0;
      if (exterior === horario) anillo.reverse();
    });
  }
}

/** camara-la-quinta -> sin acentos, minusculas, espacios a guion. */
function slug(nombre) {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const geojson = JSON.parse(
  readFileSync(path.join(AQUI, "fuente", "tamaulipas.simple.geojson"), "utf8"),
);

if (geojson.features.length !== 43) {
  throw new Error(
    `Se esperaban 43 municipios y llegaron ${geojson.features.length}. Revisa el filtro de CVE_ENT.`,
  );
}

geojson.features.forEach((f) => corregirSentido(f.geometry));

/* Lienzo de salida. Tamaulipas es mas alto que ancho -de la frontera al
   tropico-, de ahi el viewBox vertical. El margen del 4% evita que el trazo
   de los municipios de la orilla se corte contra el borde del SVG. */
const ANCHO = 560;
const ALTO = 1040;
const MARGEN = 0.04;

/* No se usa geoMercator: su recorte y resampleo adaptativo estan pensados
   para el globo completo, y sobre un area tan chica -3 grados de longitud-
   el resampleo se confundia y unia vertices por el lado largo, inflando
   cada municipio hasta el bounding box entero del lienzo (los 43 salian con
   el mismo bounding box gigante en la primera prueba visual). Para un solo
   estado alcanza con una proyeccion equirectangular corregida por latitud
   -sin curvatura ni recorte esferico de por medio-, montada a mano sobre
   geoTransform. */
let minLon = Infinity,
  maxLon = -Infinity,
  minLat = Infinity,
  maxLat = -Infinity;
function medir(coords) {
  if (typeof coords[0] === "number") {
    const [lon, lat] = coords;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  } else {
    coords.forEach(medir);
  }
}
geojson.features.forEach((f) => medir(f.geometry.coordinates));

/* Correccion por latitud: a esta altura del globo, un grado de longitud
   mide menos en el terreno que uno de latitud. Sin corregir, el mapa saldria
   mas ancho de lo que es Tamaulipas en la realidad. */
const corLat = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
const anchoGeo = (maxLon - minLon) * corLat;
const altoGeo = maxLat - minLat;
const areaAncho = ANCHO * (1 - 2 * MARGEN);
const areaAlto = ALTO * (1 - 2 * MARGEN);
const escala = Math.min(areaAncho / anchoGeo, areaAlto / altoGeo);
const desplazoX = (ANCHO - anchoGeo * escala) / 2;
const desplazoY = (ALTO - altoGeo * escala) / 2;

const proyeccion = geoTransform({
  point(lon, lat) {
    this.stream.point(
      desplazoX + (lon - minLon) * corLat * escala,
      /* Y invertida: la latitud crece hacia el norte y el SVG hacia abajo. */
      desplazoY + (maxLat - lat) * escala,
    );
  },
});
const trazador = geoPath(proyeccion);

const vistos = new Set();
const municipios = geojson.features
  .map((f) => {
    const nombreOrigen = f.properties.nombre;
    const nombre = ALIAS[nombreOrigen] ?? nombreOrigen;
    const id = slug(nombre);
    vistos.add(nombre);
    return {
      id,
      nombre,
      d: trazador(f),
      centro: trazador.centroid(f).map((n) => Math.round(n * 100) / 100),
    };
  })
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

/* Contraste contra el volcado del comite: si un nombre no cruza 1:1, mejor
   que el script truene aqui a que un municipio se quede mudo en el mapa. */
const bruto = JSON.parse(
  readFileSync(path.join(RAIZ, "src/data/festival_por_municipio.json"), "utf8"),
);
const nombresPrograma = new Set(bruto.municipios.map((m) => m.municipio));
const sinPrograma = municipios.filter((m) => !nombresPrograma.has(m.nombre));
const sinMapa = [...nombresPrograma].filter((n) => !vistos.has(n));

if (sinPrograma.length || sinMapa.length) {
  console.error("Nombres del mapa sin programa:", sinPrograma.map((m) => m.nombre));
  console.error("Nombres del programa sin mapa:", sinMapa);
  throw new Error("Los nombres de mapa y programa no cruzan 1:1. Revisa ALIAS.");
}

const salida = `/**
 * Contorno de los 43 municipios de Tamaulipas, ya proyectado a SVG.
 *
 * Derivado -no escrito a mano- por scripts/generar-mapa-municipios.mjs a
 * partir del Marco Geoestadistico de INEGI (edicion CONABIO 2018), bajo los
 * Terminos de Libre Uso de INEGI. Para regenerarlo, ver las instrucciones al
 * principio de ese script.
 *
 * "id" es el mismo esquema de slug que usa src/data/municipios.ts, asi que
 * ambos modulos se cruzan por id sin tabla de traduccion aparte.
 */
export const VIEWBOX_MUNICIPIOS = "0 0 ${ANCHO} ${ALTO}";

export type MunicipioMapa = {
  id: string;
  nombre: string;
  /** Atributo "d" del contorno, listo para <path>. */
  d: string;
  /** Centroide visual en coordenadas del viewBox, para anclar el marcador. */
  centro: [number, number];
};

export const MUNICIPIOS_MAPA: MunicipioMapa[] = ${JSON.stringify(municipios, null, 2)};
`;

writeFileSync(path.join(RAIZ, "src/data/municipios_mapa.ts"), salida);
console.log(`Escrito src/data/municipios_mapa.ts con ${municipios.length} municipios.`);

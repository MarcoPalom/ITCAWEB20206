import bruto from "./festival_por_artista.json";

/**
 * Cartelera por seccion, derivada del programa real.
 *
 * La fuente es festival_por_artista.json, el volcado del Excel del comite: 144
 * artistas con sus 363 presentaciones. Aqui no se copia nada a mano; se deriva,
 * de manera que cuando llegue un volcado nuevo baste sustituir el JSON.
 *
 * Este modulo importa ese JSON de 213KB, asi que solo puede consumirlo codigo
 * de servidor. Por eso MarcoFestival, que es cliente, ya no pregunta aqui si
 * una seccion tiene cartelera sino que lo lee de SECCIONES: importarlo desde el
 * cliente arrastraria el programa entero al navegador.
 */

/* --- Reparto por seccion ------------------------------------------------
   El JSON no trae la seccion: trae la procedencia en texto libre, tal como
   venia en la hoja de calculo -"Tamaulipas", "Nuevo Leon", "Senegal",
   "Portugal/Mexico", "Programacion Local"-. La seccion se deduce de ahi.

   "Programacion Local" cuenta como Tamaulipas: son los 40 grupos que programa
   cada municipio del estado. Y una procedencia mixta manda a la mas lejana,
   porque es la que explica por que esta en el cartel: "Portugal/Mexico" es
   internacional y "Jalisco/Tamaulipas", nacional. */
const PAISES = [
  "portugal",
  "irlanda",
  "australia",
  "senegal",
  "argentina",
  "brasil",
  "cuba",
  "francia",
  "puerto rico",
  "estados unidos",
  "internacional",
];

export type Seccion = "tamaulipecos" | "nacionales" | "internacionales";

function seccionDe(procedencias: string[]): Seccion {
  const texto = sinAcentos(procedencias.join(" / ")).toLowerCase();

  if (PAISES.some((p) => texto.includes(p))) return "internacionales";
  if (texto.includes("tamaulipas") || texto.includes("programacion local")) {
    return "tamaulipecos";
  }
  /* Tres fichas vienen sin procedencia, y las tres son exposiciones de la
     Pinacoteca en Victoria -aniversario, Jaiba Brava, historia de los teatros
     de Tamaulipas-. Son programacion del estado, asi que van con las de casa. */
  if (!texto.trim()) return "tamaulipecos";
  return "nacionales";
}

/* --- Convenciones de escritura ------------------------------------------
   El proyecto escribe el contenido sin acentos, y el volcado viene con ellos.
   La conversion pasa por aqui y solo por aqui: si algun dia se decide respetar
   la ortografia de los nombres propios -que es lo que yo recomendaria para un
   sitio institucional-, se devuelve la cadena tal cual y no hay mas que tocar. */
function sinAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function limpiar(texto: string): string {
  return sinAcentos(texto).replace(/\s+/g, " ").trim();
}

function identificador(clave: string): string {
  return limpiar(clave)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* --- Fechas y sedes ------------------------------------------------------ */

/** "2026-10-02" sueltas o un tramo seguido; las exposiciones duran varios dias. */
function fecha(fechas: string[]): string {
  if (fechas.length === 0) return "Por confirmar";

  const dias = fechas.map((f) => f.slice(8, 10));
  const [anio, mes] = [fechas[0].slice(0, 4), fechas[0].slice(5, 7)];
  const rotulo = dias.length > 1 ? `${dias[0]} - ${dias[dias.length - 1]}` : dias[0];

  return `${rotulo} / ${mes} / ${anio}`;
}

/* Algunas sedes vienen con el horario de visita pegado en lineas siguientes, y
   unas pocas empiezan por la permanencia de la exposicion en vez de por el
   recinto. Se busca la primera linea que nombre un sitio y no un calendario. */
const CALENDARIO = /^(permanencia|horario|lunes|martes|miercoles|jueves|viernes|sabado|domingo)/i;

function sede(valor: string | null): string {
  if (!valor) return "Por confirmar";

  const linea = sinAcentos(valor)
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0 && !CALENDARIO.test(l));

  return linea ? limpiar(linea) : "Por confirmar";
}

function hora(valor: string | null): string {
  return valor ? `${valor} h` : "Por confirmar";
}

/* --- Fotografia ----------------------------------------------------------
   81 de las 144 companias del programa tienen material entregado; el
   resto sale con marcador de posicion.
   Las demas salen con marcador de posicion, que es lo que pide el sistema de
   diseno mientras no haya foto real: nunca la de otra compania, porque la
   ficha afirma que la fotografia es de quien la firma.

   El mapa va por la clave del volcado y no por el nombre, que lleva comillas y
   acentos y cambiaria al minimo retoque de la hoja. */
const FOTOS = new Map<string, string>([
  ["grupo de baile club chicos malos", "chicos-malos"],
  ["cirque eros", "cirque-eros"],
  ["colectivo trueque", "colectivo-trueque"],
  ["esther tovar", "esther-tovar"],
  ["gato negro teatro", "gato-negro"],
  ["joe nieto", "joe-nieto"],
  ["juan rivas band", "juan-rivas-band"],
  ["karina pimentel y la quintaley", "karina-pimentel"],
  ["la nota alegre", "la-nota-alegre"],
  ["la obra compania de teatro", "la-obra"],
  ["grupo musical latido", "latido"],
  ["los valdez ska", "los-valdes-ska"],
  ["olifante", "olifante"],
  ["internacional orquesta tampico de claudio rosas", "orquesta-tampico"],
  ["asociacion cultural rodas a.c.", "rodas"],
  ["ballet folklorico de mexico de amalia hernandez", "ballet-folklorico-de-mexico-de-amalia-hernandez"],
  ["ballet folklorico xalmana", "ballet-folklorico-xalmana"],
  ["banda de musica de gobierno del estado de tamaulipas", "banda-de-musica-de-gobierno-del-estado-de-tamaulipas"],
  ["brassas mexican beat", "brassas-mexican-beat"],
  ["cana dulce, cana brava", "cana-dulce-cana-brava"],
  ["cia. circo flotante", "cia-circo-flotante"],
  ["cia. ome", "cia-ome"],
  ["cia. teatro en espiral", "cia-teatro-en-espiral"],
  ["cirko alebrije", "cirko-alebrije"],
  ["compania bestias creativas", "compania-bestias-creativas"],
  ["compania matamorense de producciones operisticas", "compania-matamorense-de-producciones-operisticas"],
  ["cynthia sanchez, soprano & antiqva metropoli", "cynthia-sanchez-soprano-antiqva-metropoli"],
  ["dementenmente teatro", "dementenmente-teatro"],
  ["distrito cero", "distrito-cero"],
  ["el zar de monterrey", "el-zar-de-monterrey"],
  ["entre viento y marea", "entre-viento-y-marea"],
  ["femenil mariachi puebla", "femenil-mariachi-puebla"],
  ["foco teatro", "foco-teatro"],
  ["grupo de teatro cornisa 20", "grupo-de-teatro-cornisa-20"],
  ["habitando historias teatro y dosce la compania", "habitando-historias-teatro-y-dosce-la-compania"],
  ["irish dance theatre", "irish-dance-theatre"],
  ["jhonivan", "jhonivan"],
  ["la historia de todxs", "la-historia-de-todxs"],
  ["manoella torres", "manoella-torres"],
  ["momi maiga", "momi-maiga"],
  ["nahuel penissi", "nahuel-penissi"],
  ["orquesta sinfonica de la universidad autonoma de tamaulipas", "orquesta-sinfonica-de-la-universidad-autonoma-de-tamaulipas"],
  ["performance de rua do palhaco satin", "performance-de-rua-do-palhaco-satin"],
  ["proteac", "proteac"],
  ["que siempre si", "que-siempre-si"],
  ["rafael alcala trio", "rafael-alcala-trio"],
  ["rafaga teatro", "rafaga-teatro"],
  ["reales de nuevo leon", "reales-de-nuevo-leon"],
  ["rita donte", "rita-donte"],
  ["sampling is beautiful", "sampling-is-beautiful"],
  ["son kalunga y ballet folklorico de pachuca", "son-kalunga-y-ballet-folklorico-de-pachuca"],
  ["soprano leticia de altamirano y trio los panchos", "soprano-leticia-de-altamirano-y-trio-los-panchos"],
  ["teatro testigo de la vida", "teatro-testigo-de-la-vida"],
  ["adicto5", "adicto5"],
  ["amenaza nortena", "amenaza-nortena"],
  ["apapacho arte y diversidad", "apapacho-arte-y-diversidad"],
  ["balcon de montezuma tamaholipam", "balcon-de-montezuma-tamaholipam"],
  ["colectivo teatro de bolsillo", "colectivo-teatro-de-bolsillo"],
  ["conjunto varela", "conjunto-varela"],
  ["corarte: musica vocal", "corarte-musica-vocal"],
  ["el contrato", "el-contrato"],
  ["el viaje lustroso de los zapatos rotos", "el-viaje-lustroso-de-los-zapatos-rotos"],
  ["erase una vez, dos veces", "erase-una-vez-dos-veces"],
  ["espuma de mar", "espuma-de-mar"],
  ["grupo legion victoria", "grupo-legion-victoria"],
  ["grupo relativo", "grupo-relativo"],
  ["herencia huasteca", "herencia-huasteca"],
  ["los del pueblo", "los-del-pueblo"],
  ["los galindo tradicion genuina", "los-galindo-tradicion-genuina"],
  ["majumaje", "majumaje"],
  ["mfox \u2014 la puerta del talento: hip hop interactivo", "mfox-la-puerta-del-talento-hip-hop-interactivo"],
  ["nortenos de rio bravo", "nortenos-de-rio-bravo"],
  ["one beat band", "one-beat-band"],
  ["pakidermo artes escenicas", "pakidermo-artes-escenicas"],
  ["ricardo martinez y su grupo honda nor-t", "ricardo-martinez-y-su-grupo-honda-nor-t"],
  ["rondalla magisterial de tamaulipas", "rondalla-magisterial-de-tamaulipas"],
  ["soraima y sus huastecos", "soraima-y-sus-huastecos"],
  ["teatro en blanco y negro", "teatro-en-blanco-y-negro"],
  ["teatro guarapo", "teatro-guarapo"],
  ["tempus", "tempus"],
  ["zurcidores de cuentos tamaulipas", "zurcidores-de-cuentos-tamaulipas"],
]);

/* Los ocho colores del imagotipo, en el mismo ciclo de matices alternos que usa
   el resto del festival, para que dos artistas seguidos nunca repitan tono. */
const CICLO = [
  "var(--id-coral)",
  "var(--id-morado)",
  "var(--id-azul)",
  "var(--id-lavanda)",
  "var(--id-amarillo)",
  "var(--id-turquesa)",
  "var(--id-rosa)",
  "var(--id-verde)",
];

/* --- Tipos --------------------------------------------------------------- */

export type Presentacion = {
  fecha: string;
  hora: string;
  sede: string;
  municipio: string;
};

export type Artista = {
  id: string;
  nombre: string;
  /** Va a la derecha de la cabecera: la disciplina o disciplinas. */
  disciplina: string;
  /** Texto de la pastilla de color. */
  etiqueta: string;
  /** Obra o programa con el que se presenta. */
  titulo: string;
  /** De donde viene, tal como lo declara el programa. */
  procedencia: string;
  /** Todas sus fechas, en el orden del programa. */
  presentaciones: Presentacion[];
  /** Recorrido, en una linea. Sale de los datos; no hay texto de relleno. */
  descripcion: string;
  /** Carpeta de fotografia, o null si esa compania aun no ha entregado. */
  foto: string | null;
  /** Color del imagotipo que le toca. */
  tinte: string;
};

/* --- Derivacion ---------------------------------------------------------- */

type ArtistaBruto = (typeof bruto.artistas)[number];

/** Recorrido de la compania, dicho con los datos que hay y sin adornos. */
function describir(a: ArtistaBruto): string {
  const municipios = a.municipios.map(limpiar);
  const cuantas = a.total_presentaciones;
  const veces = cuantas === 1 ? "Una presentacion" : `${cuantas} presentaciones`;

  if (municipios.length === 0) return `${veces} en el programa del festival.`;
  if (municipios.length === 1) return `${veces} en ${municipios[0]}.`;

  const ultimo = municipios[municipios.length - 1];
  return `${veces} en ${municipios.slice(0, -1).join(", ")} y ${ultimo}.`;
}

function convertir(a: ArtistaBruto, i: number): Artista {
  return {
    id: identificador(a.clave),
    nombre: limpiar(a.artista),
    disciplina: a.disciplinas.map(limpiar).join(" / ") || "Programacion",
    etiqueta: limpiar(a.disciplinas[0] ?? "Programacion"),
    titulo: limpiar(a.titulos[0] ?? ""),
    procedencia: a.procedencias.map(limpiar).join(" / "),
    presentaciones: a.presentaciones.map((p) => ({
      fecha: fecha(p.fechas),
      hora: hora(p.hora),
      sede: sede(p.sede),
      municipio: limpiar(p.municipio),
    })),
    descripcion: describir(a),
    foto: FOTOS.get(a.clave) ?? null,
    tinte: CICLO[i % CICLO.length],
  };
}

function agrupar(): Record<Seccion, Artista[]> {
  const cajones: Record<Seccion, ArtistaBruto[]> = {
    tamaulipecos: [],
    nacionales: [],
    internacionales: [],
  };

  for (const a of bruto.artistas) cajones[seccionDe(a.procedencias)].push(a);

  /* El ciclo de color se cuenta dentro de cada seccion, no sobre el total: lo
     que no debe repetirse es el tono de dos fichas seguidas en la pagina. */
  return {
    tamaulipecos: cajones.tamaulipecos.map(convertir),
    nacionales: cajones.nacionales.map(convertir),
    internacionales: cajones.internacionales.map(convertir),
  };
}

export const ARTISTAS: Record<string, Artista[]> = agrupar();

/* Municipios no lleva cartelera: no es una seccion de artistas sino el
   recorrido por el territorio, y sus datos viven en festival_por_municipio. */

/** Rutas de las imagenes de un artista. Todas viven bajo la misma carpeta. */
export function imagenesDe(foto: string) {
  return {
    fondo: `/img/artistas/${foto}/fondo.webp`,
    cards: [`/img/artistas/${foto}/a.webp`, `/img/artistas/${foto}/b.webp`],
  };
}

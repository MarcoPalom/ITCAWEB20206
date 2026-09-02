import bruto from "./festival_por_artista.json";
import semblanzas from "./semblanzas.json";

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

   El orden de las preguntas es la regla, y no es arbitrario:

   1. Si nombra un pais, es internacional. Una mixta manda a la mas lejana,
      porque es la que explica por que esta en el cartel: "Portugal/Mexico".
   2. Si nombra Tamaulipas, es de casa, aunque comparta con otro estado:
      "Jalisco/Tamaulipas" sigue siendo tamaulipeca.
   3. Si nombra otro estado, es nacional. Esto va DESPUES de Tamaulipas y ANTES
      de la programacion local, y ahi esta el caso que lo motiva: "CDMX /
      Programacion Local" es una compania de CDMX que programa un municipio de
      aqui, no una compania de aqui.
   4. "Programacion Local" a secas, o sin dato, es de casa: son los grupos que
      programa cada municipio del estado.

   La lista son paises y solo paises. Llego a tener ademas la palabra suelta
   "internacional", y eso colaba a Leonora Carrington en la seccion de fuera:
   su procedencia es "Internacional-Programacion Local", que no nombra ningun
   pais y describe una exposicion programada aqui. Era la unica ficha del cartel
   con esa palabra, asi que el termino solo servia para equivocarse. */
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
];

export type Seccion = "tamaulipecos" | "nacionales" | "internacionales";

/* Los otros estados que aparecen en el cartel. "nacional" va con limites de
   palabra a proposito: sin ellos casa dentro de "Internacional" y se llevaria a
   Leonora Carrington a la seccion equivocada. */
const ESTADOS =
  /\b(nuevo leon|cdmx|veracruz|jalisco|baja california|zacatecas|puebla|guanajuato|oaxaca|estado de mexico|hidalgo|nacional)\b/;

function seccionDe(procedencias: string[]): Seccion {
  const texto = sinAcentos(procedencias.join(" / ")).toLowerCase();

  if (PAISES.some((p) => texto.includes(p))) return "internacionales";
  if (texto.includes("tamaulipas")) return "tamaulipecos";
  if (ESTADOS.test(texto)) return "nacionales";
  if (texto.includes("programacion local")) return "tamaulipecos";
  /* Tres fichas vienen sin procedencia, y las tres son exposiciones de la
     Pinacoteca en Victoria -aniversario, Jaiba Brava, historia de los teatros
     de Tamaulipas-. Son programacion del estado, asi que van con las de casa. */
  if (!texto.trim()) return "tamaulipecos";
  return "nacionales";
}



/* --- Nombres corregidos --------------------------------------------------
   Como se llama de verdad una compania, cuando el volcado la trae de otro modo.
   Vive aqui y no en el JSON a proposito: el volcado lo regenera el comite y lo
   sustituimos entero cada vez, asi que una correccion escrita alli se perderia
   en la siguiente entrega. La clave es la del volcado, que es lo unico estable. */
const NOMBRES = new Map<string, string>([
  ["cia. teatro en espiral", "Colectivo de Teatro en Espiral"],
]);

/* --- Fichas retiradas de la cartelera ------------------------------------
   Se sacan una a una y por decision del comite, no por una regla: cada una
   tiene su motivo y no comparten ninguno.

   La primera es una exposicion, y la cartelera es de companias que se
   presentan: una exposicion no tiene funcion ni hora, sino permanencia. Ojo,
   que en el programa hay 15 fichas de exposicion pura -todas de Artes Visuales,
   y ninguna mezcla exposicion con funcion-, asi que el dia que se decida que
   ninguna va en la cartelera esta lista sobra y basta filtrar por el campo tipo.

   La segunda se cae del cartel, sin mas. */
const RETIRADAS = new Set<string>([
  "vicente rojo, manuel felguerez y sergio hernandez",
  "concierto orquesta sinfonica juvenil de mexico",
]);

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



/* --- Semblanzas ----------------------------------------------------------
   Salen de los documentos que acompanan al material del comite, uno por
   compania. Son textos de 700 a 11500 caracteres y la isla no es sitio para
   un ensayo, asi que se recortan a lo que se lee de un vistazo.

   El recorte es por frases enteras y no por caracteres a pelo: cortar en seco
   deja frases mutiladas, y un texto institucional no puede leerse asi. */
const LARGO_ISLA = 460;

function resumir(texto: string): string {
  const limpio = limpiar(texto.replace(/\s+/g, " "));
  if (limpio.length <= LARGO_ISLA) return limpio;

  const frases = limpio.match(/[^.!?]+[.!?]+/g) ?? [limpio];
  let salida = "";
  for (const frase of frases) {
    if (salida.length + frase.length > LARGO_ISLA) break;
    salida += frase;
  }
  return (salida.trim() || limpio.slice(0, LARGO_ISLA).trim() + "...").trim();
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
  ["ballet folklorico de la guardia nacional", "ballet-folklorico-guardia-nacional"],
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
  ["matute", "matute"],
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
  ["pasatono orquesta", "pasatono-orquesta"],
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

<<<<<<< HEAD
/* Companias que ademas tienen clip: dos segundos sin audio, sacados del mismo
   material. Se lista aparte de FOTOS porque no todas las que tienen fotografia
   traen video -de 88 carpetas de origen, 19 no tenian ninguno- y porque el
   turno de la ficha cambia de dos piezas a tres segun lo haya o no. */
=======
/* De las companias con fotografia, estas 60 tambien entregaron un clip
   (clip.mp4, en su misma carpeta). Va aparte de FOTOS porque no todas las
   que tienen foto tienen clip. */
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
const CLIPS = new Set<string>([
  "adicto5",
  "amenaza-nortena",
  "balcon-de-montezuma-tamaholipam",
  "ballet-folklorico-de-mexico-de-amalia-hernandez",
<<<<<<< HEAD
  "ballet-folklorico-guardia-nacional",
=======
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  "ballet-folklorico-xalmana",
  "banda-de-musica-de-gobierno-del-estado-de-tamaulipas",
  "brassas-mexican-beat",
  "cana-dulce-cana-brava",
  "chicos-malos",
  "cia-circo-flotante",
  "cia-ome",
<<<<<<< HEAD
  "cia-teatro-en-espiral",
=======
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  "cirko-alebrije",
  "colectivo-teatro-de-bolsillo",
  "colectivo-trueque",
  "compania-bestias-creativas",
  "conjunto-varela",
  "corarte-musica-vocal",
  "cynthia-sanchez-soprano-antiqva-metropoli",
<<<<<<< HEAD
  "dementenmente-teatro",
=======
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  "distrito-cero",
  "el-contrato",
  "el-viaje-lustroso-de-los-zapatos-rotos",
  "el-zar-de-monterrey",
  "espuma-de-mar",
  "esther-tovar",
  "femenil-mariachi-puebla",
  "foco-teatro",
  "gato-negro",
  "grupo-de-teatro-cornisa-20",
  "grupo-legion-victoria",
  "grupo-relativo",
  "herencia-huasteca",
  "irish-dance-theatre",
<<<<<<< HEAD
  "jhonivan",
  "joe-nieto",
  "juan-rivas-band",
  "la-historia-de-todxs",
=======
  "joe-nieto",
  "juan-rivas-band",
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  "la-nota-alegre",
  "latido",
  "los-del-pueblo",
  "los-galindo-tradicion-genuina",
  "los-valdes-ska",
  "majumaje",
  "manoella-torres",
  "momi-maiga",
  "nahuel-penissi",
  "nortenos-de-rio-bravo",
  "one-beat-band",
  "pakidermo-artes-escenicas",
<<<<<<< HEAD
  "pasatono-orquesta",
  "performance-de-rua-do-palhaco-satin",
  "proteac",
  "que-siempre-si",
  "rafael-alcala-trio",
=======
  "performance-de-rua-do-palhaco-satin",
  "proteac",
  "que-siempre-si",
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  "rafaga-teatro",
  "reales-de-nuevo-leon",
  "ricardo-martinez-y-su-grupo-honda-nor-t",
  "rita-donte",
  "rodas",
  "rondalla-magisterial-de-tamaulipas",
  "sampling-is-beautiful",
  "son-kalunga-y-ballet-folklorico-de-pachuca",
<<<<<<< HEAD
  "soprano-leticia-de-altamirano-y-trio-los-panchos",
=======
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  "soraima-y-sus-huastecos",
  "teatro-guarapo",
  "teatro-testigo-de-la-vida",
]);

<<<<<<< HEAD

/* --- Banderas -----------------------------------------------------------
   La procedencia viene en texto libre y en castellano -"Portugal/Mexico",
   "Estados Unidos | Puerto Rico"-, asi que la bandera se deduce buscando
   nombres de pais dentro de esa cadena. Buscar y no partir por el separador es
   lo que permite tragarse las tres formas que trae la hoja: la barra, la barra
   con espacios y la raya.

   Solo hay paises en el mapa, de manera que las procedencias del resto del
   cartel -"Nuevo Leon", "CDMX", "Programacion Local"- no encuentran nada y se
   quedan sin bandera, que es lo correcto: la bandera distingue a quien viene de
   fuera, no adorna a todo el mundo.

   Los SVG salen de circle-flags, que ya los dibuja recortados en circulo en vez
   de meter un rectangulo dentro de una mascara. Estan copiados en
   public/img/banderas junto con su licencia; el paquete queda como dependencia
   de desarrollo para poder anadir mas si crece el cartel. */
const BANDERAS_PAIS: [string, string][] = [
  ["portugal", "pt"],
  ["mexico", "mx"],
  ["irlanda", "ie"],
  ["australia", "au"],
  ["estados unidos", "us"],
  ["puerto rico", "pr"],
  ["senegal", "sn"],
  ["argentina", "ar"],
  ["brasil", "br"],
  ["cuba", "cu"],
  ["francia", "fr"],
];

/**
 * Codigos de los paises nombrados en la procedencia, en el orden en que salen.
 *
 * Solo se llama para la seccion internacional. Es deliberado: "Estado de
 * Mexico" contiene "mexico", asi que sin acotar una ficha nacional se llevaria
 * bandera mexicana y ninguna de sus companeras, que es peor que no poner
 * ninguna.
 */
function banderasDe(procedencias: string[]): string[] {
  const texto = sinAcentos(procedencias.join(" / ")).toLowerCase();
  return BANDERAS_PAIS.filter(([nombre]) => texto.includes(nombre))
    .sort((a, b) => texto.indexOf(a[0]) - texto.indexOf(b[0]))
    .map(([, codigo]) => codigo);
}

=======
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
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
  /** Texto de la pastilla de color. */
  etiqueta: string;
  /** Obra o programa con el que se presenta. */
  titulo: string;
  /** De donde viene, tal como lo declara el programa. */
  procedencia: string;
  /** Semblanza recortada para la isla. Cadena vacia si no la hay. */
  semblanza: string;
  /** Codigos ISO de los paises que nombra esa procedencia. Vacio si no hay. */
  banderas: string[];
  /** Todas sus fechas, en el orden del programa. */
  presentaciones: Presentacion[];
  /** Carpeta de fotografia, o null si esa compania aun no ha entregado. */
  foto: string | null;
<<<<<<< HEAD
  /** Si esa carpeta trae ademas el clip de dos segundos. */
=======
  /** Si ademas de fotografia entrego un clip (siempre en la misma carpeta). */
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  clip: boolean;
  /** Color del imagotipo que le toca. */
  tinte: string;
};

/* --- Derivacion ---------------------------------------------------------- */

type ArtistaBruto = (typeof bruto.artistas)[number];

<<<<<<< HEAD
function convertir(a: ArtistaBruto, i: number, seccion: Seccion): Artista {
=======
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
  const foto = FOTOS.get(a.clave) ?? null;

>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
  return {
    id: identificador(a.clave),
    nombre: NOMBRES.get(a.clave) ?? limpiar(a.artista),
    etiqueta: limpiar(a.disciplinas[0] ?? "Programacion"),
    titulo: limpiar(a.titulos[0] ?? ""),
    procedencia: a.procedencias.map(limpiar).join(" / "),
    semblanza: resumir((semblanzas as Record<string, string>)[a.clave] ?? ""),
    banderas: seccion === "internacionales" ? banderasDe(a.procedencias) : [],
    presentaciones: a.presentaciones.map((p) => ({
      fecha: fecha(p.fechas),
      hora: hora(p.hora),
      sede: sede(p.sede),
      municipio: limpiar(p.municipio),
    })),
<<<<<<< HEAD
    foto: FOTOS.get(a.clave) ?? null,
    clip: CLIPS.has(FOTOS.get(a.clave) ?? ""),
=======
    descripcion: describir(a),
    foto,
    clip: foto !== null && CLIPS.has(foto),
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31
    tinte: CICLO[i % CICLO.length],
  };
}

function agrupar(): Record<Seccion, Artista[]> {
  const cajones: Record<Seccion, ArtistaBruto[]> = {
    tamaulipecos: [],
    nacionales: [],
    internacionales: [],
  };

  for (const a of bruto.artistas) {
    if (RETIRADAS.has(a.clave)) continue;
    cajones[seccionDe(a.procedencias)].push(a);
  }

  /* El ciclo de color se cuenta dentro de cada seccion, no sobre el total: lo
     que no debe repetirse es el tono de dos fichas seguidas en la pagina. */
  return {
    tamaulipecos: cajones.tamaulipecos.map((a, i) => convertir(a, i, "tamaulipecos")),
    nacionales: cajones.nacionales.map((a, i) => convertir(a, i, "nacionales")),
    internacionales: cajones.internacionales.map((a, i) =>
      convertir(a, i, "internacionales"),
    ),
  };
}

export const ARTISTAS: Record<string, Artista[]> = agrupar();

/* Municipios no lleva cartelera: no es una seccion de artistas sino el
   recorrido por el territorio, y sus datos viven en festival_por_municipio. */

<<<<<<< HEAD
=======
/** Rutas de las imagenes de un artista. Todas viven bajo la misma carpeta. */
export function imagenesDe(foto: string) {
  return {
    fondo: `/img/artistas/${foto}/fondo.webp`,
    cards: [`/img/artistas/${foto}/a.webp`, `/img/artistas/${foto}/b.webp`],
    clip: `/img/artistas/${foto}/clip.mp4`,
  };
}
>>>>>>> f807a861308fb0d2fdd0af3f9a4e1d5a82e11f31

import bruto from "./festival_por_artista.json";
import { nombrePorClave } from "./nombres";
import semblanzas from "./semblanzas.json";

/**
 * Cartelera por seccion, derivada del programa real.
 *
 * La fuente es festival_por_artista.json, el volcado del Excel del comite: 184
 * artistas con sus 415 presentaciones. Aqui no se copia nada a mano; se deriva,
 * de manera que cuando llegue un volcado nuevo baste sustituir el JSON, y eso
 * es exactamente lo que se hizo con la entrega del 2 de septiembre: el volcado
 * anterior traia 144 artistas y 363 presentaciones.
 *
 * Este modulo importa ese JSON de 286KB, asi que solo puede consumirlo codigo
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

/* Companias cuya procedencia es exactamente "Programacion Local", sin pais
   ni otro estado mezclado: la programacion que arma cada municipio con sus
   propios grupos, no un acto de fuera. "CDMX / Programacion Local" no cuenta
   -es una compania de CDMX que programa aqui, la regla 3 de seccionDe() ya la
   manda a nacionales- y por eso se compara la cadena entera, no con includes(). */
function esProgramacionLocal(procedencias: string[]): boolean {
  return sinAcentos(procedencias.join(" / ")).trim().toLowerCase() === "programacion local";
}

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
   La lista vive en nombres.ts, que la comparte con las fichas de municipio:
   antes estaba aqui y solo corregia la cartelera. */

/* --- Fichas que son la misma compania -------------------------------------
   Clave duplicada -> clave buena. Cuando una compania aparece dos veces en el
   volcado bajo nombres distintos, la segunda no se tira: sus funciones se
   pasan a la ficha buena, que es la que tiene fotografia y semblanza.

   El caso que lo estrena viene de la entrega del 2 de septiembre. Al llenar la
   programacion local de Matamoros, la hoja apunto "Zurcidores de Cuentos" con
   su funcion de "Pelusa al Vuelo" del dia 8, sin caer en que esa compania ya
   estaba en el cartel como "Zurcidores de Cuentos Tamaulipas" con las cinco
   funciones de la misma obra. Sin esto saldrian dos fichas seguidas con el
   mismo nombre, y la de Matamoros ademas sin foto.

   Se fusiona y no se retira porque la funcion del dia 8 es real y tiene que
   verse; y se hace por clave, como NOMBRES, porque es lo unico que el comite
   no cambia entre entregas. */
const FUSIONES = new Map<string, string>([
  ["zurcidores de cuentos", "zurcidores de cuentos tamaulipas"],
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
  "alejandro rosales lugo",
  "calixto ramirez",
  "cartel grafico mundialista y tiro al angulo: exposicion de cartel y fotografia",
  "conversatorio a cargo de calixto ramirez",
  "gustavo sanchez tudon",
  "jaiba brava: exposicion futbol",
  "leonora carrington",
  "mario fuentes, rodolfo rios, efren yanez, esther gonzalez, entre otros.",
  "mauricio saenz - canovas",
  "nexos muestra de arte emergente",
  "un viaje por la historia de los teatros en tamaulipas",
]);

/* --- Convenciones de escritura ------------------------------------------
   El volcado del comite viene acentuado y ahora se respeta tal cual. Antes no:
   limpiar() le quitaba los acentos a todo lo que se pinta, y la cartelera
   publicaba "Musica" 154 veces mientras las fichas de municipio decian "Musica"
   bien escrito -alli el nombre y la disciplina no pasan por limpiar()-. La misma
   palabra salia de dos maneras segun la ruta, y los nombres propios perdian el
   acento: Gonzalez, Xicotencatl, Guemez.

   Quitar acentos sigue haciendo falta, pero solo para comparar y para construir
   urls, nunca para pintar. Por eso sinAcentos() se llama ahora donde de verdad
   hace falta -identificador(), nivelDe(), seccionDe(), el filtro de calendario
   de sede()- y limpiar() se limita a normalizar espacios. */
function sinAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function limpiar(texto: string): string {
  return texto.replace(/\s+/g, " ").trim();
}

/* sinAcentos aqui es imprescindible: sin el, un nombre acentuado daria el slug
   "gonz-lez", porque [^a-z0-9] convierte en guion todo lo que no sea ascii. Con
   el, las urls ya publicadas no se mueven. */
function identificador(clave: string): string {
  return sinAcentos(limpiar(clave))
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

  /* Se busca sobre la linea original y se compara sin acentos. Antes se
     descartaba el acento antes de elegir, y el recinto se devolvia mutilado. */
  const linea = valor
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0 && !CALENDARIO.test(sinAcentos(l)));

  return linea ? limpiar(linea) : "Por confirmar";
}

/* Una procedencia puede repetirse dentro del array del comite -"Tamaulipas /
   Veracruz" y "Veracruz" a la vez, para Caña Dulce, Caña Brava- porque cada
   entrada nombra a un integrante distinto de la agrupacion. Unido a lo bruto
   salia "Tamaulipas / Veracruz / Veracruz". Se parte cada entrada por barras,
   se quitan los duplicados sin tocar el orden y se vuelve a unir. */
function procedenciaDe(procedencias: string[]): string {
  const vistos = new Set<string>();
  const partes: string[] = [];
  for (const entrada of procedencias.flatMap((p) => limpiar(p).split("/"))) {
    const parte = entrada.trim();
    const clave = parte.toLowerCase();
    if (!parte || vistos.has(clave)) continue;
    vistos.add(clave);
    partes.push(parte);
  }
  return partes.join(" / ");
}

function hora(valor: string | null): string {
  return valor ? `${valor} h` : "Por confirmar";
}

/* --- Fotografia ----------------------------------------------------------
   85 de las 184 companias del programa tienen material entregado.
   Las demas salen con marcador de posicion, que es lo que pide el sistema de
   diseno mientras no haya foto real: nunca la de otra compania, porque la
   ficha afirma que la fotografia es de quien la firma.

   El mapa va por la clave del volcado y no por el nombre, que lleva comillas y
   acentos y cambiaria al minimo retoque de la hoja. */
const FOTOS = new Map<string, string>([
  ["ballet folklorico de la guardia nacional", "ballet-folklorico-guardia-nacional"],
  ["grupo de baile club chicos malos", "chicos-malos"],
  ["los 10 tenores tamaulipecos", "los-10-tenores-tamaulipecos"],
  ["meche ramirez y musicos tamaulipecos", "meche-ramirez"],
  ["percutam duo", "percutam-duo"],
  ["puras del norte", "grupo-pendiente"],
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
  ["ballet folklorico yacatecutli", "yacatecutli"],
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

/* Companias que ademas tienen clip: dos segundos sin audio, sacados del mismo
   material. Se lista aparte de FOTOS porque no todas las que tienen fotografia
   traen video -de 88 carpetas de origen, 19 no tenian ninguno- y porque el
   turno de la ficha cambia de dos piezas a tres segun lo haya o no. */
const CLIPS = new Set<string>([
  "adicto5",
  "amenaza-nortena",
  "balcon-de-montezuma-tamaholipam",
  "ballet-folklorico-de-mexico-de-amalia-hernandez",
  "ballet-folklorico-guardia-nacional",
  "ballet-folklorico-xalmana",
  "banda-de-musica-de-gobierno-del-estado-de-tamaulipas",
  "brassas-mexican-beat",
  "cana-dulce-cana-brava",
  "chicos-malos",
  "cia-circo-flotante",
  "cia-ome",
  "cia-teatro-en-espiral",
  "cirko-alebrije",
  "cirque-eros",
  "colectivo-teatro-de-bolsillo",
  "colectivo-trueque",
  "compania-bestias-creativas",
  "conjunto-varela",
  "corarte-musica-vocal",
  "cynthia-sanchez-soprano-antiqva-metropoli",
  "dementenmente-teatro",
  "distrito-cero",
  "el-contrato",
  "el-viaje-lustroso-de-los-zapatos-rotos",
  "el-zar-de-monterrey",
  "erase-una-vez-dos-veces",
  "espuma-de-mar",
  "esther-tovar",
  "femenil-mariachi-puebla",
  "foco-teatro",
  "gato-negro",
  "grupo-de-teatro-cornisa-20",
  "grupo-legion-victoria",
  "grupo-pendiente",
  "grupo-relativo",
  "herencia-huasteca",
  "irish-dance-theatre",
  "jhonivan",
  "joe-nieto",
  "juan-rivas-band",
  "la-historia-de-todxs",
  "la-nota-alegre",
  "latido",
  "los-10-tenores-tamaulipecos",
  "los-del-pueblo",
  "los-galindo-tradicion-genuina",
  "los-valdes-ska",
  "majumaje",
  "manoella-torres",
  "meche-ramirez",
  "momi-maiga",
  "nahuel-penissi",
  "nortenos-de-rio-bravo",
  "one-beat-band",
  "pakidermo-artes-escenicas",
  "pasatono-orquesta",
  "percutam-duo",
  "performance-de-rua-do-palhaco-satin",
  "proteac",
  "que-siempre-si",
  "rafael-alcala-trio",
  "rafaga-teatro",
  "reales-de-nuevo-leon",
  "ricardo-martinez-y-su-grupo-honda-nor-t",
  "rita-donte",
  "rodas",
  "rondalla-magisterial-de-tamaulipas",
  "sampling-is-beautiful",
  "son-kalunga-y-ballet-folklorico-de-pachuca",
  "soprano-leticia-de-altamirano-y-trio-los-panchos",
  "soraima-y-sus-huastecos",
  "teatro-guarapo",
  "teatro-testigo-de-la-vida",
  "yacatecutli",
]);


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
  /** Si esa carpeta trae ademas el clip de dos segundos. */
  clip: boolean;
  /** Color del imagotipo que le toca. */
  tinte: string;
};

/* --- Derivacion ---------------------------------------------------------- */

type ArtistaBruto = (typeof bruto.artistas)[number];
type PresentacionBruta = ArtistaBruto["presentaciones"][number];

function convertir(
  a: ArtistaBruto,
  i: number,
  seccion: Seccion,
  absorbidas: PresentacionBruta[],
): Artista {
  /* Solo se reordena cuando ha habido fusion. El volcado ya trae las funciones
     de cada compania en orden de fecha, asi que ordenar siempre no cambiaria
     nada; pero las que llegan de otra ficha se pegan al final y ahi si haria
     falta, porque una cartelera que salta del dia 8 al 2 no se entiende. */
  const funciones = absorbidas.length
    ? [...a.presentaciones, ...absorbidas].sort((x, y) =>
        (x.fechas[0] ?? "").localeCompare(y.fechas[0] ?? ""),
      )
    : a.presentaciones;

  return {
    id: identificador(a.clave),
    nombre: nombrePorClave(a.clave) ?? limpiar(a.artista),
    etiqueta: limpiar(a.disciplinas[0] ?? "Programación"),
    titulo: limpiar(a.titulos[0] ?? ""),
    procedencia: procedenciaDe(a.procedencias),
    semblanza: resumir((semblanzas as Record<string, string>)[a.clave] ?? ""),
    banderas: seccion === "internacionales" ? banderasDe(a.procedencias) : [],
    presentaciones: funciones.map((p) => ({
      fecha: fecha(p.fechas),
      hora: hora(p.hora),
      sede: sede(p.sede),
      municipio: limpiar(p.municipio),
    })),
    foto: FOTOS.get(a.clave) ?? null,
    clip: CLIPS.has(FOTOS.get(a.clave) ?? ""),
    tinte: CICLO[i % CICLO.length],
  };
}

function agrupar(): Record<Seccion, Artista[]> {
  const cajones: Record<Seccion, ArtistaBruto[]> = {
    tamaulipecos: [],
    nacionales: [],
    internacionales: [],
  };

  /* Las funciones de las fichas duplicadas, recogidas antes de repartir para
     que la ficha buena las tenga ya montadas cuando le toque. Una fusion cuya
     clave buena no exista se ignora sola: no hay a quien darselas. */
  const heredadas = new Map<string, PresentacionBruta[]>();
  for (const a of bruto.artistas) {
    const buena = FUSIONES.get(a.clave);
    if (!buena) continue;
    heredadas.set(buena, [
      ...(heredadas.get(buena) ?? []),
      ...a.presentaciones,
    ]);
  }

  for (const a of bruto.artistas) {
    if (RETIRADAS.has(a.clave)) continue;
    if (FUSIONES.has(a.clave)) continue;
    if (esProgramacionLocal(a.procedencias)) continue;
    cajones[seccionDe(a.procedencias)].push(a);
  }

  /* El ciclo de color se cuenta dentro de cada seccion, no sobre el total: lo
     que no debe repetirse es el tono de dos fichas seguidas en la pagina. */
  const monta = (seccion: Seccion) => (a: ArtistaBruto, i: number) =>
    convertir(a, i, seccion, heredadas.get(a.clave) ?? []);

  return {
    tamaulipecos: cajones.tamaulipecos.map(monta("tamaulipecos")),
    nacionales: cajones.nacionales.map(monta("nacionales")),
    internacionales: cajones.internacionales.map(monta("internacionales")),
  };
}

export const ARTISTAS: Record<string, Artista[]> = agrupar();

/* Municipios no lleva cartelera: no es una seccion de artistas sino el
   recorrido por el territorio, y sus datos viven en festival_por_municipio. */


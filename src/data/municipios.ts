import bruto from "./festival_por_municipio.json";
import { claveDe, nombreArtista } from "./nombres";

/**
 * Programacion por municipio, derivada del volcado del comite
 * (festival_por_municipio.json, el mismo Excel que festival_por_artista.json
 * pero cortado por municipio en vez de por compania).
 *
 * A diferencia de src/data/artistas.ts, este modulo SI lo importa codigo de
 * cliente (la cartelera y los horarios de un municipio se ven en el
 * navegador, no solo en el servidor): por eso aqui se recortan los campos de
 * trabajo interno del volcado -texto_original, requiere_revision, celda,
 * fila_excel- que no le sirven a quien visita el sitio y solo pesarian de
 * mas en el cliente.
 */

type MunicipioBruto = (typeof bruto.municipios)[number];
type EventoBruto = MunicipioBruto["eventos"][number];

/* Mismo criterio que sinAcentos/identificador de artistas.ts: sin acentos,
   minusculas, espacios a guion. Se duplica en vez de importarse porque esa
   version vive sin exportar dentro de artistas.ts.

   sinAcentos es para urls y comparaciones, no para pintar: aqui el nombre del
   municipio, el titulo y la disciplina se sirven tal cual vienen del comite. */
function sinAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function identificador(nombre: string): string {
  return sinAcentos(nombre)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* Igual que sede() en artistas.ts, duplicada por el mismo motivo. Las
   exposiciones a veces traen en "sede" solo el horario de visita, pegado en
   lineas siguientes ("Permanencia:\nHorario de Visita:") y sin nombrar
   ningun recinto -el recinto real, cuando existe, esta en "inauguracion"-.
   Sin este filtro esa cadena se ensena tal cual. */
const CALENDARIO =
  /^(permanencia|horario|lunes|martes|miercoles|jueves|viernes|sabado|domingo)/i;

function limpiar(texto: string): string {
  return texto.replace(/\s+/g, " ").trim();
}

/**
 * Las notas del programa sin repetir.
 *
 * El volcado a veces trae la misma nota dos veces, una de ellas ampliada: en
 * Miguel Aleman la segunda contiene la primera entera y le anade una linea.
 * Publicar las dos es ensenar el mismo parrafo dos veces seguidas, asi que se
 * queda la larga, que es la que lo dice todo.
 */
function notasUtiles(notas: string[]): string[] {
  const limpias = [...new Set(notas.map(limpiar).filter(Boolean))];
  return limpias.filter((n) => !limpias.some((otra) => otra !== n && otra.includes(n)));
}

/**
 * A diferencia de artistas.ts, aqui si hay de donde sacar el recinto cuando
 * "sede" no trae mas que el horario de visita: "inauguracion" nombra el
 * recinto real tras un "|" en las 12 exposiciones donde esto pasa -Reynosa,
 * Matamoros, Soto la Marina, Victoria, Mante-, y no aprovecharlo dejaria
 * "Por confirmar" en un dato que el comite si entrego.
 */
function sede(valor: string | null, inauguracion: string | null): string {
  if (valor) {
    /* Se compara sin acentos pero se devuelve la linea original: antes el
       recinto salia ya mutilado de aqui. */
    const linea = valor
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 0 && !CALENDARIO.test(sinAcentos(l)));
    if (linea) return limpiar(linea);
  }

  const recinto = inauguracion?.split("|")[1]?.trim();
  return recinto ? limpiar(recinto) : "Por confirmar";
}

export type TipoEvento = "presentación" | "nota" | "exposición";

/**
 * De donde viene un acto, agrupado en las mismas cuatro categorias que ya
 * usa el comite (numero_de_actividades: Int/Nac/Tam/Local) y que
 * seccionDe() calcula en artistas.ts para repartir el cartel general. Se
 * duplica aqui -mismas listas, mismo orden de preguntas- porque esa version
 * no se exporta y porque aqui hace falta por evento, no por seccion entera:
 * es lo que ordena el cartel de un municipio de mayor a menor alcance,
 * igual que un cartel de festival pone primero a quien viene de mas lejos.
 */
export type Nivel = "internacional" | "nacional" | "tamaulipeco" | "local";

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

const ESTADOS =
  /\b(nuevo leon|cdmx|veracruz|jalisco|baja california|zacatecas|puebla|guanajuato|oaxaca|estado de mexico|hidalgo|nacional)\b/;

function nivelDe(procedencia: string): Nivel {
  const texto = sinAcentos(procedencia).toLowerCase();
  if (PAISES.some((p) => texto.includes(p))) return "internacional";
  if (texto.includes("tamaulipas")) return "tamaulipeco";
  if (ESTADOS.test(texto)) return "nacional";
  if (texto.includes("programacion local")) return "tamaulipeco";
  if (!texto.trim()) return "tamaulipeco";
  return "nacional";
}

export type EventoMunicipio = {
  titulo: string;
  artista: string;
  /**
   * El id de esa compania en la cartelera general (src/data/artistas.ts), para
   * poder cruzar los dos volcados y recuperar lo que solo vive alli -la
   * semblanza, la fotografia-.
   *
   * Sale del nombre bruto y no del corregido: claveDe() reproduce la clave del
   * volcado por artista, y sobre ella se aplica el mismo identificador() que
   * usa artistas.ts. Cruzar por el nombre ya corregido fallaria justo en las
   * companias que llevan correccion -"Puras del Norte" se publica como "Grupo
   * Pendiente", y ese nombre no es clave de nada-.
   *
   * Cruza 308 de los 321 eventos. Los que no, son en su mayoria las fichas que
   * el comite retiro de la cartelera (RETIRADAS en artistas.ts) y que aqui
   * siguen programadas: para esas no hay semblanza que ensenar, y quien lea
   * esto vera solo los datos del acto.
   */
  idArtista: string;
  disciplina: string;
  procedencia: string;
  nivel: Nivel;
  /** Sinopsis del acto cuando el programa la trae. Solo en 6 de 321. */
  descripcion: string | null;
  /** Reparto, direccion o autoria, tal como los declara el programa. */
  creditos: string[];
  /** "13:00 h", o "Por confirmar" si el comite aun no la fija. */
  hora: string;
  /** "19:45", o null cuando el programa aun no la fija. Para el calendario. */
  horaCruda: string | null;
  /** Las fechas ISO del volcado. Varias cuando la funcion dura dias. */
  fechas: string[];
  /** Recinto, o "Por confirmar" si el comite aun no lo fija. */
  sede: string;
  /** Etiquetas del programa tal cual, p. ej. "Viernes 2". Puede ser mas de
      un dia -las exposiciones duran varios-. */
  dias: string[];
  tipo: TipoEvento;
  /** Horario de inauguracion, solo en exposiciones que lo declaran. */
  inauguracion: string | null;
  notas: string[];
};

export type Municipio = {
  id: string;
  nombre: string;
  /** Numero de la lista oficial del comite (1 a 43), no un indice de array. */
  numero: number;
  /** Espectaculos reales -presentaciones y exposiciones, sin las "notas"
      sueltas del Excel-. No sale de numero_de_actividades: ese conteo del
      comite se desfaso del volcado real en 17 de los 43 municipios -Aldama
      dice 8 y trae 19 eventos-, asi que se cuenta directo sobre "eventos",
      que es la fuente que si se corrigio evento por evento. */
  totalEspectaculos: number;
  eventos: EventoMunicipio[];
};

function convertirEvento(e: EventoBruto): EventoMunicipio {
  return {
    titulo: e.titulo ?? "",
    /* Pasa por nombres.ts: el volcado por municipio trae "CIA. Circo Flotante"
       y "Raul Di Blasio" tal cual los tecleo el comite. */
    artista: nombreArtista(e.artista ?? ""),
    idArtista: identificador(claveDe(e.artista ?? "")),
    disciplina: e.disciplina ?? "",
    procedencia: e.procedencia ?? "",
    nivel: nivelDe(e.procedencia ?? ""),
    descripcion: e.descripcion ?? null,
    creditos: e.creditos ?? [],
    hora: e.hora ? `${e.hora} h` : "Por confirmar",
    horaCruda: e.hora ?? null,
    fechas: e.fechas ?? [],
    sede: sede(e.sede, e.inauguracion),
    dias: e.dias ?? [],
    tipo: e.tipo as TipoEvento,
    inauguracion: e.inauguracion ?? null,
    notas: notasUtiles(e.notas ?? []),
  };
}

function convertirMunicipio(m: MunicipioBruto): Municipio {
  /* origen "Local" es la programacion que arma el propio municipio con sus
     grupos, no un acto que trae el festival. No se confunde con "Tamaulipas"
     -companias del estado que si forman parte del cartel central- ni con los
     "null" sin dato, que se quedan. */
  const eventos = m.eventos
    .filter((e) => e.origen !== "Local")
    .map(convertirEvento);
  return {
    id: identificador(m.municipio),
    nombre: m.municipio,
    numero: m.numero,
    totalEspectaculos: eventos.filter((e) => e.tipo !== "nota").length,
    eventos,
  };
}

export const MUNICIPIOS: Municipio[] = bruto.municipios
  .map(convertirMunicipio)
  .sort((a, b) => a.numero - b.numero);

export function municipioPorId(id: string): Municipio | undefined {
  return MUNICIPIOS.find((m) => m.id === id);
}

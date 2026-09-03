import bruto from "./festival_por_municipio.json";

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
   version vive sin exportar dentro de artistas.ts. */
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
  return sinAcentos(texto).replace(/\s+/g, " ").trim();
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
    const linea = sinAcentos(valor)
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 0 && !CALENDARIO.test(l));
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
  disciplina: string;
  procedencia: string;
  nivel: Nivel;
  /** "13:00 h", o "Por confirmar" si el comite aun no la fija. */
  hora: string;
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
    artista: e.artista ?? "",
    disciplina: e.disciplina ?? "",
    procedencia: e.procedencia ?? "",
    nivel: nivelDe(e.procedencia ?? ""),
    hora: e.hora ? `${e.hora} h` : "Por confirmar",
    sede: sede(e.sede, e.inauguracion),
    dias: e.dias ?? [],
    tipo: e.tipo as TipoEvento,
    inauguracion: e.inauguracion ?? null,
    notas: e.notas ?? [],
  };
}

function convertirMunicipio(m: MunicipioBruto): Municipio {
  const eventos = m.eventos.map(convertirEvento);
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

import bruto from "./festival_por_municipio.json";

/**
 * Programacion por municipio, derivada del volcado del comite
 * (festival_por_municipio.json, el mismo Excel que festival_por_artista.json
 * pero cortado por municipio en vez de por compania).
 *
 * A diferencia de src/data/artistas.ts, este modulo SI lo importa codigo de
 * cliente (el mapa interactivo de la seccion Municipios vive en el navegador,
 * no solo en el servidor): por eso aqui se recortan los campos de trabajo
 * interno del volcado -texto_original, requiere_revision, celda,
 * fila_excel- que no le sirven a quien visita el sitio y solo pesarian de
 * mas en el cliente.
 */

type MunicipioBruto = (typeof bruto.municipios)[number];
type EventoBruto = MunicipioBruto["eventos"][number];

/* Mismo criterio que sinAcentos/identificador de artistas.ts: sin acentos,
   minusculas, espacios a guion. Se duplica en vez de importarse porque
   scripts/generar-mapa-municipios.mjs -que produce el id equivalente para el
   contorno del mapa- corre fuera del grafo de modulos de Next y no puede
   importar TypeScript de src/. */
function sinAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function identificador(nombre: string): string {
  return sinAcentos(nombre)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type TipoEvento = "presentación" | "nota" | "exposición";

export type EventoMunicipio = {
  titulo: string;
  artista: string;
  disciplina: string;
  procedencia: string;
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
  conteos: {
    internacional: number;
    nacional: number;
    tamaulipeco: number;
    local: number;
  };
  eventos: EventoMunicipio[];
};

function convertirEvento(e: EventoBruto): EventoMunicipio {
  return {
    titulo: e.titulo ?? "",
    artista: e.artista ?? "",
    disciplina: e.disciplina ?? "",
    procedencia: e.procedencia ?? "",
    hora: e.hora ? `${e.hora} h` : "Por confirmar",
    sede: e.sede ?? "Por confirmar",
    dias: e.dias ?? [],
    tipo: e.tipo as TipoEvento,
    inauguracion: e.inauguracion ?? null,
    notas: e.notas ?? [],
  };
}

function convertirMunicipio(m: MunicipioBruto): Municipio {
  return {
    id: identificador(m.municipio),
    nombre: m.municipio,
    numero: m.numero,
    conteos: {
      internacional: m.numero_de_actividades.Int,
      nacional: m.numero_de_actividades.Nac,
      tamaulipeco: m.numero_de_actividades.Tam,
      local: m.numero_de_actividades.Local,
    },
    eventos: m.eventos.map(convertirEvento),
  };
}

export const MUNICIPIOS: Municipio[] = bruto.municipios
  .map(convertirMunicipio)
  .sort((a, b) => a.numero - b.numero);

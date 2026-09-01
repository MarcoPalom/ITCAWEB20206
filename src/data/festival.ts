/**
 * Datos del Festival Internacional de la Costa del Seno Mexicano.
 *
 * La estructura es la definitiva (dias, sedes, disciplinas y horarios) y las
 * sedes son reales. Los titulos de actividad son programacion preliminar: se
 * sustituyen cuando el comite publique el cartel.
 *
 * Convencion del proyecto: el contenido se escribe sin acentos.
 */

export const FESTIVAL = {
  nombre: "Festival Internacional de la Costa del Seno Mexicano",
  /* Las siglas del nombre completo: Festival Internacional de la Costa del
     Seno Mexicano. Ojo, la carpeta del material viene nombrada FISCM. */
  siglas: "FICSM",
  anio: "2026",
  edicion: "Primera edicion",
  fechas: "02 al 11 de octubre de 2026",
  /* Como se escribe en la portada, con la preposicion incluida. */
  fechasLargas: "Del 02 al 11 de octubre",
  fechaCorta: "02-11 OCT 2026",
  entrada: "Entrada libre en todas las sedes",
} as const;

export type Sede = {
  /** Ancla y clave estable; identifica tambien a su disco en el anillo. */
  id: string;
  nombre: string;
  municipio: string;
  /** Que se programa aqui, en una linea. */
  caracter: string;
  /** Que fotografia ocupara el marcador de posicion. */
  foto: string;
};

export const SEDES: Sede[] = [
  {
    id: "miramar",
    nombre: "Playa Miramar",
    municipio: "Ciudad Madero",
    caracter: "Escenario mayor. Conciertos de cierre y programacion familiar.",
    foto: "Playa Miramar al atardecer, escenario montado sobre la arena",
  },
  {
    id: "la-pesca",
    nombre: "La Pesca",
    municipio: "Soto la Marina",
    caracter: "Danza, paisaje sonoro y proyeccion sobre la barra.",
    foto: "Barra de La Pesca, desembocadura del rio Soto la Marina",
  },
  {
    id: "barra-del-tordo",
    nombre: "Barra del Tordo",
    municipio: "Aldama",
    caracter: "Teatro al aire libre, percusion y decima en fogata.",
    foto: "Palapas de Barra del Tordo frente al Golfo",
  },
  {
    id: "playa-bagdad",
    nombre: "Playa Bagdad",
    municipio: "Matamoros",
    caracter: "Feria del libro, cocina del Golfo y folclor.",
    foto: "Playa Bagdad, dunas y pescadores al amanecer",
  },
  {
    id: "laguna-madre",
    nombre: "Laguna Madre",
    municipio: "San Fernando",
    caracter: "Recorridos de aves y talleres para publico infantil.",
    foto: "Laguna Madre con aves migratorias sobre el espejo de agua",
  },
  {
    id: "plaza-de-la-libertad",
    nombre: "Plaza de la Libertad",
    municipio: "Tampico",
    caracter: "Apertura, musica de concierto y encuentro de trios.",
    foto: "Plaza de la Libertad de Tampico con los portales iluminados",
  },
];

export type Actividad = {
  hora: string;
  titulo: string;
  disciplina: string;
  /** id de una sede de SEDES. */
  sede: string;
};

export type Dia = {
  id: string;
  /** Etiqueta corta para la navegacion de la programacion. */
  etiqueta: string;
  diaSemana: string;
  fecha: string;
  /** El hilo que ordena la jornada. */
  eje: string;
  actividades: Actividad[];
};

export const PROGRAMA: Dia[] = [
  {
    id: "dia-1",
    etiqueta: "MIE 22",
    diaSemana: "Miercoles",
    fecha: "22 de abril",
    eje: "Apertura en el puerto",
    actividades: [
      {
        hora: "17:00",
        titulo: "Ceremonia de apertura",
        disciplina: "Acto inaugural",
        sede: "plaza-de-la-libertad",
      },
      {
        hora: "18:30",
        titulo: "Huapango a la orilla: encuentro de trios huastecos",
        disciplina: "Musica tradicional",
        sede: "plaza-de-la-libertad",
      },
      {
        hora: "20:00",
        titulo: "Orquesta Sinfonica de Tamaulipas: programa del Golfo",
        disciplina: "Musica de concierto",
        sede: "plaza-de-la-libertad",
      },
      {
        hora: "21:30",
        titulo: "Cine bajo la palapa: muestra del Caribe",
        disciplina: "Cine",
        sede: "miramar",
      },
      {
        hora: "22:30",
        titulo: "Son de mar: delegacion invitada de Cuba",
        disciplina: "Musica",
        sede: "miramar",
      },
    ],
  },
  {
    id: "dia-2",
    etiqueta: "JUE 23",
    diaSemana: "Jueves",
    fecha: "23 de abril",
    eje: "Oficio y palabra",
    actividades: [
      {
        hora: "10:00",
        titulo: "Taller de construccion de jaranas",
        disciplina: "Taller",
        sede: "plaza-de-la-libertad",
      },
      {
        hora: "12:00",
        titulo: "Mesa: literatura del litoral tamaulipeco",
        disciplina: "Literatura",
        sede: "plaza-de-la-libertad",
      },
      {
        hora: "17:00",
        titulo: "Cuerpos de agua dulce",
        disciplina: "Danza contemporanea",
        sede: "la-pesca",
      },
      {
        hora: "19:00",
        titulo: "Cuerdas del continente: dialogo Mexico-Colombia",
        disciplina: "Musica",
        sede: "la-pesca",
      },
      {
        hora: "21:00",
        titulo: "Proyeccion sobre la barra: video y paisaje sonoro",
        disciplina: "Artes visuales",
        sede: "la-pesca",
      },
    ],
  },
  {
    id: "dia-3",
    etiqueta: "VIE 24",
    diaSemana: "Viernes",
    fecha: "24 de abril",
    eje: "Laguna y monte",
    actividades: [
      {
        hora: "09:00",
        titulo: "Recorrido de aves migratorias",
        disciplina: "Naturaleza y cultura",
        sede: "laguna-madre",
      },
      {
        hora: "11:30",
        titulo: "Taller infantil: papalotes del Golfo",
        disciplina: "Taller",
        sede: "laguna-madre",
      },
      {
        hora: "17:30",
        titulo: "La casa de los pescadores",
        disciplina: "Teatro",
        sede: "barra-del-tordo",
      },
      {
        hora: "19:30",
        titulo: "Percusion del Atlantico: ensamble invitado de Brasil",
        disciplina: "Musica",
        sede: "barra-del-tordo",
      },
      {
        hora: "21:30",
        titulo: "Fogata de decimas y controversia",
        disciplina: "Literatura oral",
        sede: "barra-del-tordo",
      },
    ],
  },
  {
    id: "dia-4",
    etiqueta: "SAB 25",
    diaSemana: "Sabado",
    fecha: "25 de abril",
    eje: "Frontera y mesa",
    actividades: [
      {
        hora: "10:00",
        titulo: "Feria del libro de mar",
        disciplina: "Literatura",
        sede: "playa-bagdad",
      },
      {
        hora: "12:00",
        titulo: "Cocina del Golfo: demostracion y cata",
        disciplina: "Gastronomia",
        sede: "playa-bagdad",
      },
      {
        hora: "16:00",
        titulo: "Exposicion: fotografia del litoral tamaulipeco",
        disciplina: "Artes visuales",
        sede: "playa-bagdad",
      },
      {
        hora: "18:00",
        titulo: "Ballet Folclorico de Tamaulipas",
        disciplina: "Danza",
        sede: "playa-bagdad",
      },
      {
        hora: "20:30",
        titulo: "Baile de plaza: norteno y conjunto",
        disciplina: "Musica popular",
        sede: "playa-bagdad",
      },
    ],
  },
  {
    id: "dia-5",
    etiqueta: "DOM 26",
    diaSemana: "Domingo",
    fecha: "26 de abril",
    eje: "Clausura frente al mar",
    actividades: [
      {
        hora: "10:00",
        titulo: "Coro infantil de la costa",
        disciplina: "Musica",
        sede: "miramar",
      },
      {
        hora: "12:00",
        titulo: "Encuentro de bandas municipales",
        disciplina: "Musica",
        sede: "miramar",
      },
      {
        hora: "17:00",
        titulo: "Muestra de artesania del Golfo",
        disciplina: "Artes populares",
        sede: "miramar",
      },
      {
        hora: "19:00",
        titulo: "Gala de clausura: sinfonica y voces invitadas",
        disciplina: "Musica de concierto",
        sede: "miramar",
      },
      {
        hora: "21:00",
        titulo: "Cierre: paisaje sonoro y pirotecnia fria",
        disciplina: "Acto de clausura",
        sede: "miramar",
      },
    ],
  },
];

export const CIFRAS = [
  { dato: "5", etiqueta: "dias de programacion" },
  { dato: "6", etiqueta: "sedes en el litoral" },
  { dato: "25", etiqueta: "actividades en cartel" },
  { dato: "8", etiqueta: "paises invitados" },
];

/** Nombre completo de una sede a partir de su id. */
export function nombreSede(id: string): string {
  const sede = SEDES.find((s) => s.id === id);
  if (!sede) return id;
  return sede.nombre + ", " + sede.municipio;
}

/**
 * Cartelera por seccion.
 *
 * Las fotografias y los nombres son reales, del material de FISCM2026, y van
 * emparejados correctamente: cada foto es de la compania que la firma. Lo que
 * es de muestra es todo lo demas -fecha, hora, sede, descripcion- y tambien el
 * reparto por seccion, porque no tengo el dato de origen de cada compania.
 *
 * Para sustituirlo por lo real basta editar este archivo: el componente no
 * sabe nada de artistas concretos, solo recibe la lista.
 */
export type Artista = {
  id: string;
  nombre: string;
  /** Va a la derecha de la cabecera, como el modelo en la referencia. */
  disciplina: string;
  /** Texto de la pastilla de color. */
  etiqueta: string;
  fecha: string;
  hora: string;
  sede: string;
  descripcion: string;
  /** Color del imagotipo que le toca. */
  tinte: string;
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.";

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

type Semilla = [id: string, nombre: string, disciplina: string, etiqueta: string];

function construir(semillas: Semilla[]): Artista[] {
  return semillas.map(([id, nombre, disciplina, etiqueta], i) => ({
    id,
    nombre,
    disciplina,
    etiqueta,
    fecha: `2${(i % 5) + 2} / 04 / 2026`,
    hora: `${17 + (i % 5)}:${i % 2 ? "30" : "00"} h`,
    sede: [
      "Playa Miramar, Ciudad Madero",
      "Plaza de la Libertad, Tampico",
      "La Pesca, Soto la Marina",
      "Barra del Tordo, Aldama",
    ][i % 4],
    descripcion: LOREM,
    tinte: CICLO[i % CICLO.length],
  }));
}

export const ARTISTAS: Record<string, Artista[]> = {
  tamaulipecos: construir([
    ["yacatecutli", "Ballet Folklorico Yacatecutli", "Danza folklorica", "Danza"],
    ["rodas", "Asociacion Cultural Rodas", "Teatro de calle", "Teatro"],
    ["la-nota-alegre", "La Nota Alegre", "Musica popular", "Musica"],
    ["chicos-malos", "Club Chicos Malos", "Baile de salon", "Baile"],
  ]),
  nacionales: construir([
    ["colectivo-trueque", "Colectivo Trueque", "Teatro contemporaneo", "Teatro"],
    ["la-obra", "La Obra Compania de Teatro", "Teatro de mascara", "Teatro"],
    ["gato-negro", "Gato Negro Teatro", "Teatro de sala", "Teatro"],
    ["olifante", "Olifante", "Teatro para infancias", "Infantil"],
  ]),
  internacionales: construir([
    ["cirque-eros", "Cirque Eros", "Circo contemporaneo", "Circo"],
    ["karina-pimentel", "Karina Pimentel y la QuintaLey", "Cancion de autor", "Musica"],
    ["joe-nieto", "Joe Nieto", "Rock", "Musica"],
    ["esther-tovar", "Esther Tovar", "Voz y repertorio", "Musica"],
  ]),
};

/* Municipios no lleva cartelera: no es una seccion de artistas. Si en algun
   momento lo fuera, basta anadir aqui su lista y la ruta la recoge sola. */

/** Rutas de las imagenes de un artista. Todas viven bajo el mismo id. */
export function imagenesDe(id: string) {
  return {
    fondo: `/img/artistas/${id}/fondo.webp`,
    cards: [`/img/artistas/${id}/a.webp`, `/img/artistas/${id}/b.webp`],
  };
}

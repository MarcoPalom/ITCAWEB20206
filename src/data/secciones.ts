/**
 * Las cuatro secciones del cartel, cada una con el color con el que se pinta
 * la pantalla al entrar.
 *
 * Los cuatro tintes no se eligieron por gusto sino por contraste medido: son
 * los unicos de la paleta que aguantan como fondo a pantalla completa con
 * texto encima. Morado pide tinta blanca (6.5:1) y los otros tres tinta oscura
 * (amarillo 8.7:1, turquesa 5.0:1, rosa 6.0:1). Coral, verde y azul se quedan
 * entre 3:1 y 4.1:1 con cualquiera de las dos tintas, asi que no sirven aqui.
 */
export type Seccion = {
  slug: string;
  titulo: string;
  entradilla: string;
  /** Color del imagotipo que pinta la pantalla. */
  tinte: string;
  /** Tinta que le corresponde. */
  sobre: string;
  /** Si la cabecera va en blanco sobre este fondo. */
  cabeceraClara: boolean;
  /** Si la seccion abre con cartelera de artistas o con su portadilla de color.
      Se declara aqui y no se deduce de ARTISTAS porque quien lo pregunta es el
      marco, que es codigo de cliente: importar la cartelera desde alli
      arrastraria el programa entero -286KB- al navegador. */
  cartelera: boolean;
};

export const SECCIONES: Seccion[] = [
  {
    slug: "internacionales",
    titulo: "Internacionales",
    entradilla:
      "Delegaciones invitadas de ocho países del Atlántico y del Caribe. El cartel se publica en marzo de 2026.",
    tinte: "var(--id-morado)",
    sobre: "#ffffff",
    cabeceraClara: true,
    cartelera: true,
  },
  {
    slug: "nacionales",
    titulo: "Nacionales",
    entradilla:
      "Compañías y agrupaciones del resto del país. El cartel se publica en marzo de 2026.",
    tinte: "var(--id-amarillo)",
    sobre: "var(--id-tinta)",
    cabeceraClara: false,
    cartelera: true,
  },
  {
    slug: "tamaulipecos",
    titulo: "Tamaulipecos",
    entradilla:
      "Música, teatro, danza y circo hechos en Tamaulipas. El cartel se publica en marzo de 2026.",
    tinte: "var(--id-turquesa)",
    sobre: "var(--id-tinta)",
    cabeceraClara: false,
    cartelera: true,
  },
  {
    slug: "municipios",
    titulo: "Municipios",
    entradilla:
      "La programación que recorre los 43 municipios de Tamaulipas. El cartel se publica en marzo de 2026.",
    tinte: "var(--id-rosa)",
    sobre: "var(--id-tinta)",
    cabeceraClara: false,
    cartelera: false,
  },
];

export function seccionPorSlug(slug: string): Seccion | undefined {
  return SECCIONES.find((s) => s.slug === slug);
}

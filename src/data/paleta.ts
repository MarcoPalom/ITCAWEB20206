/**
 * Los ocho colores del imagotipo del festival, en ciclo.
 *
 * No hay principal ni secundario: se reparten por rotacion, de modo que ninguno
 * aparece con mas peso que otro. El orden no es el del imagotipo sino uno de
 * matices alternos -0, 268, 210, 258, 48, 183, 331, 155 grados- para que dos
 * elementos contiguos nunca caigan en tonos parecidos.
 *
 * Se usan siempre como relleno y nunca como tinta: sobre fondo claro solo el
 * morado llega a 4.5:1, asi que emplearlos como texto obligaria a elegir uno
 * y eso es justo la jerarquia que no queremos. Los valores y la tinta que
 * corresponde a cada uno estan en globals.css, bajo .identidad-festival.
 */
export const CICLO = [
  "coral",
  "morado",
  "azul",
  "lavanda",
  "amarillo",
  "turquesa",
  "rosa",
  "verde",
] as const;

export type Tono = (typeof CICLO)[number];

/** Color que le toca al elemento i de una serie. */
export function tono(i: number): Tono {
  return CICLO[((i % CICLO.length) + CICLO.length) % CICLO.length];
}

/**
 * Variables en linea para pintar un elemento con su color y la tinta que le
 * corresponde. Se consume con las clases .ficha-color o .borde-color.
 */
export function estiloTono(i: number): React.CSSProperties {
  const t = tono(i);
  return {
    "--tono": `var(--id-${t})`,
    "--sobre": `var(--sobre-${t})`,
  } as React.CSSProperties;
}

/**
 * Solo los tonos claros, los que superan 5:1 sobre fondo oscuro. Es lo que se
 * puede usar como tinta sobre las caratulas, que van sobre foto oscurecida.
 */
const SOBRE_OSCURO = ["amarillo", "turquesa", "rosa", "lavanda"] as const;

export function tonoClaro(i: number): string {
  return SOBRE_OSCURO[((i % 4) + 4) % 4];
}

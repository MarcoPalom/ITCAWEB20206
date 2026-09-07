/**
 * Fichas retiradas del festival.
 *
 * Se sacan una a una y por decision del comite, no por una regla: cada una
 * tiene su motivo y no comparten ninguno. Once son exposiciones de Artes
 * Visuales -que no son companias que se presenten: no tienen funcion ni hora,
 * sino permanencia-, una es un conversatorio y otra un concierto que se cayo
 * del cartel.
 *
 * Vive en su propio modulo, y no dentro de artistas.ts, por el mismo motivo que
 * nombres.ts: hacen falta los dos volcados. Sacarlas solo de la cartelera las
 * dejaba publicadas en la agenda de su municipio -las once exposiciones seguian
 * saliendo en Reynosa, Matamoros, Soto la Marina, Victoria y Mante-, de modo
 * que lo mismo estaba retirado en una vista y en pie en la otra. Importar
 * artistas.ts desde municipios.ts no es opcion: arrastra 213KB de JSON al
 * navegador, y municipios.ts si lo carga el cliente.
 *
 * Las claves son las del volcado por artista: minusculas, sin acentos, sin
 * comillas y con los espacios normalizados. claveDe() en nombres.ts reproduce
 * esa forma exacta partiendo de un nombre suelto.
 */
export const RETIRADAS = new Set<string>([
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

/**
 * Si ese acto es una de las fichas retiradas.
 *
 * Mira el nombre de la compania y, si no lo trae, el titulo. No es un apano:
 * cuatro de estas fichas -NEXOS, Jaiba Brava, Cartel Grafico y Un Viaje por la
 * Historia de los Teatros- vienen sin artista, porque son muestras colectivas
 * sin autor unico, y en el volcado por artista su clave sale precisamente del
 * titulo. Mirando solo el artista se colaban las cuatro.
 */
export function estaRetirada(artista: string, titulo: string): boolean {
  return RETIRADAS.has(artista) || (artista === "" && RETIRADAS.has(titulo));
}

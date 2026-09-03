/**
 * Datos del Festival Internacional de la Costa del Seno Mexicano.
 *
 * Solo la identidad del festival: nombre, siglas, edicion y fechas, que es lo
 * unico que se escribe a mano. La programacion -jornadas, recintos, horarios y
 * actividades- no vive aqui: sale del volcado del comite
 * (festival_por_municipio.json) a traves de src/data/municipios.ts, y ese es
 * el unico origen. Aqui hubo una copia escrita a mano -seis sedes de costa y
 * cinco jornadas de abril- que contradecia al volcado en fechas, sedes y
 * numero de actividades; se borro con los cuatro componentes que la pintaban,
 * que ya no montaba nadie. Si algun dato del festival hace falta en pantalla,
 * se deriva del volcado, no se vuelve a teclear aqui.
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

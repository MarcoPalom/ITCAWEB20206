/**
 * Contenido del sitio institucional del ITCA.
 *
 * Todo viene del sitio oficial del Instituto en el portal del Gobierno del
 * Estado (tamaulipas.gob.mx/cultura): textos de Conócenos, Misión y Visión,
 * ejes de acción, unidades culturales, convocatorias y sala de prensa,
 * consultado en octubre de 2026. Las fotografías se descargaron de ese mismo
 * sitio y viven en public/img/itca/.
 *
 * Los textos largos se resumen para tarjeta; cada bloque enlaza a su pagina
 * oficial, que sigue siendo la referencia completa.
 */

export const OFICIAL = "https://tamaulipas.gob.mx/cultura";

export const INSTITUTO = {
  nombre: "Instituto Tamaulipeco para la Cultura y las Artes",
  siglas: "ITCA",
  direccion: ["Vicente Guerrero 421, Zona Centro", "87000 Ciudad Victoria, Tamaulipas"],
  telefono: "(834) 315 2977",
  telefonoHref: "tel:+528343152977",
  contacto: `${OFICIAL}/contacto/`,
  director: {
    nombre: "Mtro. Héctor Romero Lecanda",
    cargo: "Director General",
  },
  redes: [
    { nombre: "Facebook", href: "https://www.facebook.com/ITCATamaulipas/" },
    { nombre: "Instagram", href: "https://www.instagram.com/cultura_tamaulipas/" },
    { nombre: "X (Twitter)", href: "https://twitter.com/ITCATamaulipas" },
  ],
};

export const CONOCENOS = [
  "El Instituto Tamaulipeco para la Cultura y las Artes es el organismo que integra a las unidades culturales dependientes del Gobierno del Estado para sumarse a la tarea de la gestión y la promoción de acciones culturales y artísticas en la entidad.",
  "Es prioritaria la difusión y promoción de las propuestas culturales de la sociedad civil, con el fin de favorecer la formación de nuevos públicos. Es tarea del Instituto fomentar las acciones de los tamaulipecos que incidan en el ámbito de la cultura y dotarlas de proyección dentro y fuera de la entidad.",
  "Para cumplir estas metas, el ITCA cuenta con unidades culturales en diversos centros urbanos del Estado, donde se celebran procesos de enseñanza, exposiciones, conciertos y presentaciones que brindan a los tamaulipecos la oportunidad de reencontrarse con sus raíces y su identidad.",
];

export const MISION =
  "Garantizar el desarrollo, fortalecimiento, promoción y difusión cultural, artística y del patrimonio cultural en la entidad, mediante acciones que fomenten la participación de la sociedad en actividades culturales y artísticas, la formación de creadores, docentes, promotores y gestores, el fomento a la lectura y la creación de libros, la vinculación con redes comunitarias, y la preservación de las raíces culturales e históricas, tangibles e intangibles, de la identidad de los tamaulipecos.";

export const VISION =
  "Ser la instancia comprometida con construir la cultura como un derecho social, y el arte como una expresión superior de la voluntad de las y los tamaulipecos; que impulsa la preservación de la diversidad cultural, el desarrollo sociocultural y la investigación y formación cultural, para crear sociedades sostenibles, cohesionadas e inclusivas, regidas por principios de equidad y justicia.";

export type Eje = {
  slug: string;
  nombre: string;
  descripcion: string;
  programas: string[];
  /** Enlace interno cuando el eje tiene seccion propia en este sitio. */
  interno?: { etiqueta: string; href: string };
};

export const EJES: Eje[] = [
  {
    slug: "desarrollo-y-difusion-cultural",
    nombre: "Desarrollo y Difusión Cultural",
    descripcion:
      "Teatro, danza, música, artes plásticas y cine; desarrollo cultural comunitario, estímulo a la creación, promoción artística y descentralización de los bienes y servicios culturales.",
    programas: [
      "Programa Nacional de Teatro Escolar",
      "Encuentro Estatal de Teatro Rafael Solana",
      "Red de Colectivos Culturales Comunitarios",
    ],
    interno: { etiqueta: "Festival del Seno Mexicano", href: "/festival" },
  },
  {
    slug: "educacion-y-desarrollo-artistico",
    nombre: "Educación y Desarrollo Artístico",
    descripcion:
      "Enseñanza de las artes y oficios desde un punto de vista contemporáneo, para la infancia y la juventud tamaulipeca, con los centros de cultura como lugar de reunión familiar.",
    programas: [
      "Cursos, talleres, congresos y festivales",
      "Escuela de Iniciación Artística Asociada al INBAL",
    ],
  },
  {
    slug: "patrimonio-cultural-e-historico",
    nombre: "Patrimonio Cultural e Histórico",
    descripcion:
      "Fomento de las tradiciones, el arte popular y las prácticas históricas, y políticas de protección y conservación del patrimonio histórico de la entidad.",
    programas: [
      "Programa de Apoyo a las Culturas Municipales y Comunitarias",
      "Programa de Desarrollo Cultural de la Huasteca",
    ],
  },
  {
    slug: "publicaciones-y-fomento-literario",
    nombre: "Publicaciones y Fomento Literario",
    descripcion:
      "Fomento y difusión de la literatura, en especial la de escritores tamaulipecos; Salas de Lectura y Paralibros, convocatorias y edición de obras de autores locales.",
    programas: ["Programa Nacional de Salas de Lectura", "Fondo Editorial Tamaulipas"],
    interno: { etiqueta: "Biblioteca Virtual", href: "/bibliotecavirtual" },
  },
];

export type Unidad = {
  slug: string;
  nombre: string;
  ciudad: string;
  resena: string;
  horario: string[];
  /** Solo las que tienen fotografia publicada en el sitio oficial. */
  foto?: { ancho: number; alto: number; alt: string };
};

export const UNIDADES: Unidad[] = [
  {
    slug: "centro-cultural-tamaulipas",
    nombre: "Centro Cultural Tamaulipas",
    ciudad: "Ciudad Victoria",
    resena:
      "Obra de Eduardo Terrazas abierta en 1987. Reúne el Teatro Amalia G. de Castillo Ledón, de 934 butacas, el Auditorio Alberto López y la Galería Pedro Banda.",
    horario: ["Lunes a viernes, 8:00 a 20:00", "Sábado, 9:00 a 20:00", "Domingo, 9:00 a 13:00"],
    foto: {
      ancho: 1100,
      alto: 617,
      alt: "Fachada del Centro Cultural Tamaulipas, con sus volúmenes de concreto y franjas naranjas.",
    },
  },
  {
    slug: "parque-cultural-reynosa",
    nombre: "Parque Cultural Reynosa",
    ciudad: "Reynosa",
    resena:
      "Inaugurado en 2010 junto a la laguna La Escondida. Su teatro principal, con 1,181 butacas, recibe teatro, danza, ópera, cine y conciertos.",
    horario: [
      "Edificio: lunes a viernes, 10:00 a 18:00",
      "Sábado, 10:00 a 17:00; domingo, 12:00 a 17:00",
      "Área externa: todos los días, 6:00 a 21:00",
    ],
    foto: {
      ancho: 1100,
      alto: 617,
      alt: "Centro de Arte y Cultura del Parque Cultural Reynosa visto desde su explanada.",
    },
  },
  {
    slug: "pinacoteca-de-tamaulipas",
    nombre: "Pinacoteca de Tamaulipas",
    ciudad: "Ciudad Victoria",
    resena:
      "En la antigua Casa Filizola, de 1884, restaurada en 2014: más de dos mil metros cuadrados con salas de exposición, talleres, sala de consulta y librería.",
    horario: ["Martes a viernes, 10:00 a 18:00", "Sábados y domingos, 10:00 a 16:00"],
    foto: {
      ancho: 1100,
      alto: 733,
      alt: "Fachada de cantera de la Pinacoteca de Tamaulipas, la antigua Casa Filizola.",
    },
  },
  {
    slug: "museo-regional-de-historia-de-tamaulipas",
    nombre: "Museo Regional de Historia de Tamaulipas",
    ciudad: "Ciudad Victoria",
    resena:
      "En el antiguo Asilo Vicentino, levantado a finales del siglo XIX con sillares que donaron los propios victorenses.",
    horario: ["Martes a domingo, 10:00 a 17:00"],
    foto: {
      ancho: 1100,
      alto: 685,
      alt: "Fachada amarilla y roja del antiguo Asilo Vicentino, sede del Museo Regional de Historia.",
    },
  },
  {
    slug: "barco-museo-del-nino",
    nombre: "BARCO, Centro Cultural para las Infancias",
    ciudad: "Tampico",
    resena:
      "Instalado en el antiguo Palacio Penal de Andonegui, edificio neoclásico de 1924 rescatado y abierto como museo para niñas y niños en 2019.",
    horario: [],
  },
  {
    slug: "museo-de-arte-contemporaneo-de-tamaulipas-mact",
    nombre: "Museo de Arte Contemporáneo de Tamaulipas",
    ciudad: "Matamoros",
    resena:
      "En el edificio que Mario Pani proyectó en 1969 como centro artesanal; museo de arte contemporáneo desde octubre de 2002.",
    horario: ["Martes a sábado, 10:00 a 18:00", "Domingo, 12:00 a 16:00"],
  },
  {
    slug: "biblioteca-publica-central-estatal-marte-r-gomez",
    nombre: "Biblioteca Pública Central Estatal Marte R. Gómez",
    ciudad: "Ciudad Victoria",
    resena:
      "Acervo de casi 85 mil ejemplares, área especializada de Tamaulipas y fondos documentales de tamaulipecos ilustres.",
    horario: ["Lunes a viernes, 9:00 a 20:45", "Sábado y domingo, 9:00 a 15:00"],
  },
  {
    slug: "casa-del-arte-de-victoria",
    nombre: "Casa del Arte de Victoria",
    ciudad: "Ciudad Victoria",
    resena:
      "Edificio de 1913 y escuela de arte desde 1962: más de 60 talleres permanentes en 26 salones y Escuela de Iniciación Artística Asociada al INBAL.",
    horario: ["Lunes a viernes, 9:00 a 19:00"],
  },
];

export type Tema = "Festival" | "Teatro" | "Cine" | "Lectura";
export const TEMAS: Tema[] = ["Festival", "Teatro", "Cine", "Lectura"];

export type Comunicado = {
  clave: string;
  titulo: string;
  entrada: string;
  fecha: string;
  sede: string;
  tema: Tema;
  url: string;
  foto: { ancho: number; alto: number; alt: string };
};

/** Sala de prensa del ITCA, de la mas reciente a la mas antigua. */
export const COMUNICADOS: Comunicado[] = [
  {
    clave: "ica-040-2026",
    titulo: "Más de 5,200 personas cierran el FICSM 2026 con el grupo Matute en la Plaza Juárez",
    entrada:
      "Tras diez días de actividades, el Festival Internacional en la Costa del Seno Mexicano cerró su trigésima tercera edición con más de 30 mil asistentes en su último día en todo el estado.",
    fecha: "2026-10-12",
    sede: "Ciudad Victoria",
    tema: "Festival",
    url: "https://tamaulipas.gob.mx/2026/10/mas-de-5200-personas-se-reunieron-en-la-plaza-juarez-para-cerrar-junto-al-grupo-matute-el-ficsm-2026/",
    foto: { ancho: 1100, alto: 733, alt: "El grupo Matute en el escenario de la Plaza Juárez, bajo luces de colores." },
  },
  {
    clave: "ica-039-2026",
    titulo: "Niñas y niños tamaulipecos, a cargo del cierre del festival en la capital",
    entrada:
      "El concierto de clausura del 11 de octubre, en el Teatro Amalia González Caballero de Castillo Ledón, corre a cargo de 98 integrantes de las Agrupaciones Musicales Comunitarias de seis municipios.",
    fecha: "2026-10-09",
    sede: "Ciudad Victoria",
    tema: "Festival",
    url: "https://tamaulipas.gob.mx/2026/10/cerraran-telon-del-festival-internacional-en-la-costa-del-seno-mexicano-en-la-capital-del-estado-con-musica-de-ninas-y-ninos-tamaulipecos/",
    foto: { ancho: 1100, alto: 825, alt: "Orquesta infantil y juvenil sobre el escenario de un teatro." },
  },
  {
    clave: "ica-038-2026",
    titulo: "Más de 1,800 personas en la reapertura de la Concha Acústica",
    entrada:
      "La renovada Concha Acústica de la Unidad Deportiva Siglo XXI volvió a abrir con Kopalli, el espíritu astral, de la compañía jalisciense Bestias Creativas.",
    fecha: "2026-10-07",
    sede: "Ciudad Victoria",
    tema: "Festival",
    url: "https://tamaulipas.gob.mx/2026/10/se-reunen-mas-de-1800-personas-en-la-renovada-concha-acustica-por-el-festival-internacional-en-la-costa-del-seno-mexicano/",
    foto: { ancho: 1100, alto: 733, alt: "Personaje con penacho de plumas en escena durante Kopalli." },
  },
  {
    clave: "ica-037-2026",
    titulo: "La Concha Acústica vuelve a recibir público con el festival",
    entrada:
      "Tras su mantenimiento, el recinto de la Unidad Deportiva Siglo XXI programó tres espectáculos gratuitos del Festival Internacional en la Costa del Seno Mexicano.",
    fecha: "2026-10-06",
    sede: "Ciudad Victoria",
    tema: "Festival",
    url: "https://tamaulipas.gob.mx/2026/10/gobierno-de-tamaulipas-reiniciara-actividades-al-aire-libre-en-la-concha-acustica-con-programacion-artistica-del-ficsm/",
    foto: { ancho: 1100, alto: 733, alt: "La Concha Acústica renovada, con su bóveda naranja y equipo de iluminación." },
  },
  {
    clave: "ica-036-2026",
    titulo: "Encuentro de Cine Tamaulipeco en ocho sedes",
    entrada:
      "Más de 52 actividades gratuitas del 20 al 24 de septiembre en Victoria, Tampico, Madero, Reynosa, Matamoros y Nuevo Laredo, con dos sedes binacionales en Brownsville y Laredo, Texas.",
    fecha: "2026-09-18",
    sede: "Ocho sedes",
    tema: "Cine",
    url: "https://tamaulipas.gob.mx/2026/09/inicia-el-domingo-el-encuentro-de-cine-tamaulipeco-en-ocho-sedes/",
    foto: { ancho: 1100, alto: 733, alt: "Fotograma de una película: dos personas dentro de un automóvil." },
  },
  {
    clave: "ica-035-2026",
    titulo: "Primera llamada: el ITCA presenta la edición 2026 del Festival del Seno Mexicano",
    entrada:
      "Del 2 al 11 de octubre en los 43 municipios del estado, con más de 1,200 artistas y entrada gratuita a todos los eventos. La inauguración, en el Parque Cultural Reynosa.",
    fecha: "2026-09-03",
    sede: "Ciudad Victoria",
    tema: "Festival",
    url: "https://tamaulipas.gob.mx/2026/09/primera-llamada-presenta-itca-la-edicion-2026-del-festival-internacional-en-la-costa-del-seno-mexicano/",
    foto: { ancho: 1100, alto: 733, alt: "Bailarines de ballet folclórico con faldas rojas en movimiento." },
  },
  {
    clave: "ica-034-2026",
    titulo: "Inaugura el ITCA el Encuentro Estatal de Teatro Mtro. Rafael Solana",
    entrada:
      "Presentaciones teatrales, seminarios, talleres, charlas y presentaciones de libros en Matamoros, del 15 al 21 de agosto.",
    fecha: "2026-08-17",
    sede: "Matamoros",
    tema: "Teatro",
    url: "https://tamaulipas.gob.mx/2026/08/inaugura-itca-encuentro-estatal-de-teatro-mtro-rafael-solana/",
    foto: { ancho: 1100, alto: 733, alt: "Elenco saludando al público al final de una función de teatro." },
  },
  {
    clave: "ica-033-2026",
    titulo: "El Solana llega a Matamoros",
    entrada:
      "La edición 43 del Encuentro Estatal de Teatro reúne a diez agrupaciones seleccionadas por convocatoria y a más de 80 artistas becados en su programa académico.",
    fecha: "2026-08-13",
    sede: "Matamoros",
    tema: "Teatro",
    url: "https://tamaulipas.gob.mx/2026/08/dara-inicio-encuentro-estatal-de-teatro-mtro-rafael-solana-en-matamoros/",
    foto: { ancho: 1100, alto: 1100, alt: "Cartel de la inauguración del Encuentro Estatal de Teatro Rafael Solana." },
  },
  {
    clave: "ica-032-2026",
    titulo: "Concluye la 4.ª Feria Infantil del Libro y la Lectura en BARCO",
    entrada:
      "Más de 500 personas participaron en 36 actividades para niñas, niños, jóvenes y familias, del 1 al 4 de julio.",
    fecha: "2026-07-08",
    sede: "Tampico",
    tema: "Lectura",
    url: "https://tamaulipas.gob.mx/2026/07/concluyo-con-exito-la-4-a-feria-infantil-del-libro-y-la-lectura-palabras-en-movimiento-en-barco/",
    foto: { ancho: 1100, alto: 825, alt: "Público en una sala durante una actividad de la feria del libro." },
  },
  {
    clave: "ica-031-2026",
    titulo: "Cierra el telón Teatro a una sola voz",
    entrada:
      "El festival nacional de monólogos del INBAL concluyó en Nuevo Laredo su Circuito Norte tras siete días de funciones.",
    fecha: "2026-07-06",
    sede: "Nuevo Laredo",
    tema: "Teatro",
    url: "https://tamaulipas.gob.mx/2026/07/cierra-el-telon-teatro-a-una-sola-voz-en-tamaulipas/",
    foto: { ancho: 1100, alto: 733, alt: "Entrega de reconocimientos sobre el escenario al cierre del festival." },
  },
];

export const SALA_DE_PRENSA = `${OFICIAL}/prensa`;

export type Convocatoria = { titulo: string; detalle: string; href: string; formato: string };

/** Convocatorias vigentes publicadas por el Instituto. */
export const CONVOCATORIAS: Convocatoria[] = [
  {
    titulo: "Laboratorio presencial: formación para el diseño de proyectos culturales y artísticos con infancias y adolescencias 2026",
    detalle: "Publicada en octubre de 2026.",
    href: `${OFICIAL}/wp-content/uploads/sites/27/2026/10/formacion-para-el-diseno-de-proyectos-culturales-y-artisticos-con-infancias-y-adolescencias-2026.pdf`,
    formato: "PDF",
  },
  {
    titulo: "Registro Estatal de Patrimonio Vivo de Tamaulipas",
    detalle: "Publicada en abril de 2026.",
    href: `${OFICIAL}/wp-content/uploads/sites/27/2026/04/convo-patrimonio.pdf`,
    formato: "PDF",
  },
];

export const ENLACES_CONVOCATORIAS = [
  { etiqueta: "Convocatorias cerradas", href: `${OFICIAL}/convocatorias-2/` },
  { etiqueta: "Resultados", href: `${OFICIAL}/resultados/` },
];

/** Enlaces institucionales del pie: todos llevan al sitio oficial. */
export const ENLACES_INSTITUCIONALES = [
  { etiqueta: "Decreto de creación del ITCA", href: `${OFICIAL}/decreto-de-creacion-del-itca/` },
  { etiqueta: "Programa de Apoyos a la Cultura", href: `${OFICIAL}/programa-de-apoyos-a-la-cultura/` },
  { etiqueta: "Código de Conducta", href: `${OFICIAL}/codigo-de-conducta/` },
  { etiqueta: "Agenda cultural", href: `${OFICIAL}/agendacultural/` },
];

export const ENLACES_TRANSPARENCIA = [
  {
    etiqueta: "Transparencia ITCA",
    href: "http://transparencia.tamaulipas.gob.mx/informacion-publica/entidades/instituto-tamaulipeco-para-la-cultura-y-las-artes-itca/",
  },
  { etiqueta: "Marco jurídico", href: `${OFICIAL}/marco-juridico/` },
  { etiqueta: "Sistema Institucional de Archivos", href: `${OFICIAL}/sistema-institucional-de-archivos/` },
  { etiqueta: "Trámites y servicios", href: "https://www.tamaulipas.gob.mx/tramites/ciudadano/" },
  { etiqueta: "Aviso de privacidad", href: `${OFICIAL}/aviso-de-privacidad-integral/` },
];

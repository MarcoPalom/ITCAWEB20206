/**
 * Catalogo de la Biblioteca Virtual: el Fondo Editorial Tamaulipas.
 *
 * Todo sale de los archivos de imprenta que entrego Publicaciones, uno por
 * libro: el interior en PDF y el forro completo (solapa, contraportada, lomo,
 * portada y solapa). De ese forro salen la portada que se ve en el catalogo
 * -recortada del pliego, sin lomo ni solapas-, la sinopsis -el texto de la
 * contraportada- y la fotografia y la semblanza de cada autor -la solapa
 * derecha-. Los textos se copian tal cual; solo se deshicieron las palabras
 * partidas con guion al final de linea, que en el forro eran maquetacion.
 *
 * Tamaulipas LEE no trae forro aparte: su portada es la primera pagina del
 * interior, y las semblanzas y fotos de sus doce autoras vienen de sus paginas
 * finales. Cuatro de ellas tienen ademas libro propio en el fondo; para esas
 * se usa la semblanza y la foto de su solapa, que son las mas completas.
 *
 * Los archivos viven en public/biblioteca/: portadas/<libro>.webp,
 * autores/<autor>.webp y pdf/<libro>.pdf. Tres interiores pesaban de mas para
 * una descarga -hasta 50 MB por una ilustracion vectorial repetida en cada
 * portadilla- y se aligeraron; el texto sigue siendo seleccionable.
 */

export type Coleccion = {
  slug: string;
  nombre: string;
  /** Texto de la pagina legal de la propia coleccion. */
  descripcion: string;
  /** De donde le viene el nombre, cuando la coleccion lo declara. */
  nombreViene?: string;
  /** Generos que reune, en el orden en que se presentan. */
  generos: string[];
};

export type Autor = {
  slug: string;
  nombre: string;
  /** Lugar de origen, tal como lo da la semblanza. */
  origen: string;
  semblanza: string;
  /** Encuadre de la foto cuando el rostro no esta centrado. */
  encuadre?: string;
  /** Credito fotografico cuando el forro lo da. */
  creditoFoto?: string;
};

export type Libro = {
  slug: string;
  titulo: string;
  subtitulo?: string;
  autores: string[];
  /** Como figura el autor cuando no es "autor" sin mas. */
  rol?: string;
  /** Otros creditos de la portada. */
  creditos?: string;
  coleccion: string;
  genero: string;
  anio: number;
  isbn: string;
  paginas: number;
  /** Peso del PDF en bytes. */
  peso: number;
  /** Alto de la portada para un ancho de 720 px. */
  altoPortada: number;
  sinopsis: string[];
};

export const COLECCIONES: Coleccion[] = [
  {
    slug: "acroama",
    nombre: "Acroama",
    descripcion:
      "Reúne obras poéticas y dramáticas de escritores tamaulipecos, seleccionadas mediante convocatoria abierta del Programa Editorial Tamaulipas 2025.",
    nombreViene:
      "Debe su nombre al poemario homónimo de Altaír Tejeda de Tamez.",
    generos: ["Poesía", "Dramaturgia"],
  },
  {
    slug: "altas-llamas",
    nombre: "Altas Llamas",
    descripcion:
      "Reúne obras narrativas y ensayísticas de escritores tamaulipecos, seleccionadas mediante convocatoria abierta del Programa Editorial Tamaulipas 2025.",
    nombreViene:
      "Debe su nombre a la novela Casa de altas llamas, de Juan José Amador.",
    generos: ["Novela", "Cuento", "Ensayo"],
  },
  {
    slug: "cauce-del-bravo",
    nombre: "Cauce del Bravo",
    descripcion:
      "Reúne obras de autoras y autores tamaulipecos con una trayectoria literaria de gran trascendencia a nivel nacional y estatal.",
    generos: ["Novela", "Poesía", "Ensayo"],
  },
  {
    slug: "tierra-fecunda",
    nombre: "Tierra Fecunda",
    descripcion:
      "Reúne obras de autoras y autores tamaulipecos que abordan las culturas populares de Tamaulipas desde la literatura. Estas obras fueron seleccionadas mediante convocatoria abierta del Programa Editorial Tamaulipas 2025.",
    generos: ["Cultura popular"],
  },
  {
    slug: "tamaulipas-lee",
    nombre: "Tamaulipas LEE",
    descripcion:
      "Antologías que reconocen a las escritoras tamaulipecas y les dan el lugar que les pertenece. Su primer volumen reúne a doce autoras de distintas generaciones, de las que abrieron camino a las voces nuevas.",
    generos: ["Antología"],
  },
];

export const AUTORES: Autor[] = [
  {
    slug: "cynthia-rodriguez-leija",
    nombre: "Cynthia Rodríguez Leija",
    origen: "Nuevo Laredo, Tamaulipas",
    encuadre: "72% 30%",
    semblanza:
      "Nuevo Laredo, Tamaulipas. Es poeta y ensayista. Becaria del Programa de Estímulos a la Creación y al Desarrollo Artístico de Tamaulipas (PECDA); ha recibido el Premio de Poesía Juan B. Tijerina (Tamaulipas) y el Premio Nacional de Poesía Ramón Iván Suárez Caamal (Campeche). Es autora de los libros Oscuro zodiaco (UNAM, colección El Ala del Tigre), Reinos de ciudad y Kinim (Instituto Tamaulipeco para la Cultura y las Artes), La casa redonda (Norteña Editores), Estación Pandura (Bitácora de Vuelos), Galáctica. Los testimonios del barrio rojo (Senado de la República, Comisión de Derechos Humanos) y Y no hallé cosa en qué poner los ojos (Secretaría de Cultura de Coahuila, Proyecto Resiliente).",
  },
  {
    slug: "jorge-santana",
    nombre: "Jorge Santana",
    origen: "Los Laredos, 1986",
    semblanza:
      "Nace en los Laredos, en la frontera entre Texas y Tamaulipas, un 21 de agosto de 1986. Autor de los poemarios Vivir y Soñar (1999), Psique (2007), Pornosonetos (2010) y Reparaciones (2015). Ha sido incluido en numerosas antologías nacionales e internacionales; también es columnista y promotor cultural. Actualmente es el director de la Comisión Histórica del Condado de Webb y Comisionado de las Bellas Artes en Laredo, así como curador en el centro cultural Casa Ortiz.",
  },
  {
    slug: "enrique-dimas-arias",
    nombre: "Enrique Dimas Arias",
    origen: "Calabacillas, Bustamante",
    semblanza:
      "Calabacillas, Bustamante. Es contador público y poeta. Autor de La luz siempre regresa (ITCA, 2019) e Inventario (Cofradía de Coyotes, 2022), ha publicado también los libros electrónicos Perder las apuestas (Editorial 3K, 2020) y Eterno retorno (Bitácora de Vuelos, 2021). Su trabajo ha sido reconocido con el Premio Juan José Amador en la categoría de poesía (2017), y forma parte de una generación que explora con honestidad y rigor la experiencia íntima, la pérdida y los retornos posibles del lenguaje.",
  },
  {
    slug: "armando-mancilla-flores",
    nombre: "Armando Mancilla Flores",
    origen: "Matamoros, Tamaulipas",
    semblanza:
      "Matamoros, Tamaulipas. Dramaturgo y director escénico con una sólida trayectoria en la escena teatral mexicana. Ha sido influenciado por maestros como Hugo Argüelles, Emilio Carballido y Medardo Treviño, entre otros. Su obra Mercancía de Canje le valió el Premio Estatal de Dramaturgia Altaír Tejeda (2014). Ha publicado en la Colección Teatro del Norte (2010) y en la revista Tramoya (2017), y está incluido en el Ensayo Panorámico de la Literatura en Tamaulipas (ITCA, 2015), de Orlando Ortiz y Tania Ortiz. Desarrolló el proyecto cultural Pa-paz y Papas (2018), con el apoyo de Alas y Raíces del CNDCI, y el proyecto Nuestros Visitantes (2019), con el apoyo del PECDA. Su trabajo se caracteriza por una mirada crítica, lo que lo ha consolidado como una voz importante del teatro contemporáneo en el norte del país.",
  },
  {
    slug: "dulce-gabriela-gutierrez",
    nombre: "Dulce Gabriela Gutiérrez",
    origen: "Reynosa, Tamaulipas",
    semblanza:
      "Reynosa, Tamaulipas. Es dramaturga y guionista egresada de CasAzul Artes Escénicas de Argos. Fue beneficiaria del Programa de Estímulos a la Creación y al Desarrollo Artístico de Tamaulipas (PECDA), de ahí surge su obra El día que la gente pez salió del mar. En 2024 obtuvo el primer lugar en la categoría de Teatro Libre y el premio a Mejor Dramaturgia en el XLI Concurso Estatal de Teatro “Mtro. Rafael Solana”. Actualmente dirige el grupo teatral Teatromorfosis, con el que impulsa la creación escénica en el estado.",
  },
  {
    slug: "norailiana-esparza-mandujano",
    nombre: "Norailiana Esparza Mandujano",
    origen: "Victoria, Tamaulipas",
    semblanza:
      "Victoria, Tamaulipas. Poeta, narradora y artista plástica con presencia en más de treinta antologías estatales, nacionales e internacionales. Autora de Dirección Opuesta (2013, poesía), Donde Habitan las Imágenes (2015, narrativa) y Tu rostro en medio de noviembre. Su obra está incluida en el Ensayo Panorámico de la Literatura Tamaulipeca. Ha recibido el Premio Estatal Maestros con Arte “Altaír Tejeda de Tamez” (2008, cuento) y la Presea Nacional Leona Vicario (2020), en reconocimiento a su labor cultural y tanatológica en beneficio de comunidades afectadas por la violencia. Como activista cultural independiente, coordina el Movimiento Proyecto Cultural Sur Internacional en Tamaulipas, el Colectivo Catarsis y Mujeres Umbral, impulsando proyectos artísticos y sociales orientados al fortalecimiento cultural y la resiliencia comunitaria.",
  },
  {
    slug: "sergio-aguirre",
    nombre: "Sergio Aguirre",
    origen: "Tampico, Tamaulipas, 1984",
    semblanza:
      "Tampico, Tamaulipas (1984). Es dramaturgo, actor, productor audiovisual y licenciado en Ciencias de la Comunicación. Miembro fundador de la Compañía de Teatro del Espacio Cultural Metropolitano de Tampico y de Dosce La Compañía, ha participado en todos los montajes dirigidos por Sandra Muñoz, con quien también ha colaborado como dramaturgista en el proyecto Sh-Boom, dentro de la beca del Sistema Nacional de Creadores de Arte. Ha sido becario del Programa de Estímulos a la Creación y al Desarrollo Artístico de Tamaulipas (PECDA). Su obra Id Descalzos, escrita para la Compañía de Teatro Atabal (Querétaro), obtuvo el primer lugar del concurso estatal de dramaturgia. En 2016 escribió Altazores, texto seleccionado para la Convocatoria Internacional Patios de Recreo (ATINA, Argentina), representado en diversas ciudades de México y en La Plata, Argentina. Entre el rigor del teatro y la invención poética, Aguirre escribe para escena con una mirada lúcida, irónica y profundamente humana.",
  },
  {
    slug: "ramiro-rodriguez",
    nombre: "Ramiro Rodríguez",
    origen: "Nuevo Laredo, 1966",
    semblanza:
      "Nuevo Laredo (1966). Es poeta, narrador y ensayista. Ha ganado el Premio Estatal de Poesía Tamaulipas (ITCA, 2008) y el Premio Estatal de Poesía “Altaír Tejeda de Tamez” (SET, 2008); su obra ha sido incluida en el Ensayo panorámico de la literatura en Tamaulipas de Orlando Ortiz (2015), y en la antología El lejano Oriente en la poesía mexicana de Elsa Cross (2022). Ha publicado los poemarios Íngrima la ciudad (2011), Angahuan (2014), Partituras de insomnio (2016), Discurso del aislamiento (2017), Detente, sombra (2021), Espejos (2023) y Geografía del sueño (2024). En narrativa, es autor de Sin oficio ni beneficio (2012), Estropicio interior (2014) y Mala intención (2018). También ha incursionado en la literatura infantil con Los líos de Pancho Chano (2019), Fábulas del campo (2022) y De gatos y otras criaturas (2025).",
  },
  {
    slug: "giovanni-alberto-chavez-morales",
    nombre: "Giovanni Alberto Chávez Morales",
    origen: "Gómez Farías, Tamaulipas",
    semblanza:
      "Oriundo de Gómez Farías, Tamaulipas, es licenciado en Pedagogía de las Ciencias Sociales y máster en arqueología; actualmente cursa el doctorado en Estudios de Patrimonio por la Universidad Tecnológica de Brandemburgo, Alemania. Ha publicado un libro, un capítulo de libro y dos artículos en revistas científicas sobre temas de divulgación del patrimonio, antropología y antiguos pobladores indígenas de Tamaulipas.",
  },
  {
    slug: "edgar-a-rivera",
    nombre: "Édgar A. Rivera",
    origen: "Matamoros, Tamaulipas, 1989",
    semblanza:
      "Matamoros, Tamaulipas (1989). Es escritor y licenciado en Educación. Su obra transita entre la fantasía y la ciencia ficción. Ha publicado cuentos en revistas y antologías de México, Latinoamérica y España (Lexikalia y Archipiélago), y ha sido galardonado en los certámenes Lovecraft Interactivo (2019) y Relatos de Amor (2020). Fue beneficiario del PECDA Tamaulipas en 2020 (Novela) y 2023 (Cuento). Es autor de Entre el amor y la muerte (2021) y coautor de Espejos de ficción (2024).",
  },
  {
    slug: "roberto-lopez",
    nombre: "Roberto López",
    origen: "Tamaulipas, 1994",
    semblanza:
      "Tamaulipas, 1994. Ganador del I Concurso Nacional de Poesía Rubén Bonifaz Nuño (UNAM, 2017), del XII Certamen Estatal Altaír Tejeda de Tamez (SET, 2019) y del Premio Nacional de Literatura Gilberto Owen (ISIC, 2025). Becario de la generación XXXVII del Centro de Escritores de Nuevo León (CONARTE, 2024). Edita la Plana poética: Sol filamento y dirige las Jornadas de Poesía Tamaulipeca. Autor de los libros de poesía Donde el cielo desemboca (ALJA, 2018), Saudade (ITCA, 2019) y Nociones de la luz (UANL, 2025).",
  },
  {
    slug: "eduardo-vargas-lopez",
    nombre: "Eduardo Vargas López",
    origen: "Ciudad de México, 1987",
    semblanza:
      "Ciudad de México, 1987. Es profesor, escritor y artista plástico. Su trabajo reflexiona sobre la cultura y la identidad de Tamaulipas, su tierra umbilical —como dicta la tradición, su ombligo fue enterrado en las barrancas de la Sierra Madre—. En 2015 fundó, junto a Jorge Fuentes García, el Colectivo Amoxcalco, y codirige la iniciativa multidisciplinaria Tópicos Victorenses, dedicada a dar voz a las diversas herencias biosociales de la capital del estado. Ha publicado el poemario Argamasa (Alja, 2019), el libro de narrativa Mitos de los Montes Altos (Alja, 2020) y, en coautoría con Ramiro Rodríguez, Brevedades entre el haikú y la xilografía (Alja, 2022). Su obra literaria y plástica ha formado parte de antologías y exposiciones en México, Estados Unidos, Colombia y Uruguay. Cuenta con dos exposiciones individuales y varias exposiciones colectivas en distintos recintos del estado de Tamaulipas. Actualmente radica en Ciudad Victoria.",
  },
  {
    slug: "estrella-gracia-gonzalez",
    nombre: "Estrella Gracia González",
    origen: "Matamoros, Tamaulipas, 1979",
    semblanza:
      "Matamoros, Tamaulipas (1979). Es narradora, poeta y licenciada en Comunicación. Ha publicado el libro de cuentos Inventiva (Catarsis Literaria, 2023) y la separata de poesía Premoniciones de silencios (La Colmena, 2024). Su obra forma parte de diversas antologías, entre ellas Súbita convergencia (ALJA, 2022), Microtintas (ALJA, 2023) y Aconteció un ayer en México (Elipsis, 2024). Es editora de la revista delatripa: narrativa y algo más, y parte de su producción literaria ha sido publicada en revistas y suplementos como Archipiélago (UNAM), Letras en la Frontera (San Antonio, Texas), Letralia (Venezuela), Máquina combinatoria (Ecuador), entre otras. Actualmente se desempeña como presidenta del Ateneo Literario José Arrese de Matamoros y como coordinadora del maratón de lectura Creando Lectores.",
  },
  {
    slug: "edmundo-lozano-calzado",
    nombre: "Edmundo Lozano Calzado",
    origen: "1932–2004",
    semblanza:
      "Edmundo Lozano Calzado (1932–2004) fue periodista, locutor, compositor y editor con una destacada trayectoria en el ámbito cultural y mediático de Tamaulipas. Inició su carrera en 1950 como locutor en la XERG: escribió, produjo y actuó en radionovelas que marcaron una época, entre ellas Una carta y una canción, con más de mil episodios al aire. Fundó la revista Lente y fue director de El Ciudadano, el primer diario impreso a color en Nuevo Laredo. También se desempeñó como Director de Comunicación Social del Gobierno de Tamaulipas (1975-1981). En sus últimos años condujo el programa radiofónico dominical El Mundo de Mundo. A pesar de su vasta producción periodística, El planeta dorado fue su obsesión literaria y su única novela, escrita durante años como testamento creativo y humano.",
  },
  {
    slug: "sonia-arrazolo-reyna",
    nombre: "Sonia Arrazolo Reyna",
    origen: "Matamoros, Tamaulipas",
    semblanza:
      "Matamoros, Tamaulipas. Es narradora e ingeniera de profesión, con diplomado en literatura por la Escuela de Letras Españolas de la Universidad Veracruzana. Ha participado en diversas antologías: No basta con cerrar los ojos en la sombra (2021), 100 razones para no dormir esta noche (2022), Cuentos para soñar despiertos (2023), Gatos, monstruos y otros cuentos (Momo, 2023), Nuestra tibia orilla humana (2023), El cofre de cuentos encantados (2024), Atrapasueños (Momo, 2025) y Cuentos para jugar y soñar (2026), y en cuatro más de la editorial Rubin (Argentina). Sus relatos han sido publicados en revistas literarias de Chile, Portugal, Puerto Rico, Argentina, Colombia y Venezuela. Es autora de tres libros autopublicados: Benito, Nicolasa y Gotitas de amor.",
  },
  {
    slug: "david-vallejo",
    nombre: "David Vallejo",
    origen: "Tampico, Tamaulipas",
    semblanza:
      "Originario de Tampico, Tamaulipas, es politólogo, consultor, académico y lector apasionado. Ha cursado estudios en México, Estados Unidos y España. Se ha desempeñado como funcionario en los ámbitos estatal, federal y universitario. Es autor de la novela El arquitecto de sombras y del libro Cuentos desde el fin del tiempo.",
  },
  {
    slug: "itzia-rangole",
    nombre: "Itzia Rangole",
    origen: "Tampico, Tamaulipas, 1991",
    semblanza:
      "Tampico, Tamaulipas (1991). Es narradora, docente y comunicadora. Egresada de la licenciatura en Filosofía y Ciencias Sociales por el ITESO, Universidad Jesuita de Guadalajara, fue beneficiaria del PECDA Tamaulipas 2020 en la categoría de cuento. Su trabajo ha sido incluido en Chicalotas: reunión de narradoras del noreste (Editorial Funámbulo). Ha colaborado como locutora en los programas La lechuga de Minerva (Radio Itópica), en Radio Miseria y Más allá de Macbeth (Radio UDG Ocotlán). Actualmente es redactora web en El Sol de Tampico, periódico de la Organización Editorial Mexicana (OEM), y profesora universitaria de literatura.",
  },
  {
    slug: "javier-vargas-de-luna",
    nombre: "Javier Vargas de Luna",
    origen: "Tampico, Tamaulipas",
    semblanza:
      "Tampico, Tamaulipas. Es poeta, narrador, ensayista y académico. Doctor en Letras por la Universidad McGill y profesor en la Universidad Laval (Quebec), ha publicado más de veinticinco libros de poesía, narrativa y ensayo. Su obra más reciente, Bibliotecas ajenas (I), inaugura un atlas de la lectura en el mundo hispano. Ha sido docente invitado en universidades de América y Europa, y su escritura explora los vínculos entre memoria, lenguaje y pensamiento crítico. Entre sus títulos más destacados se encuentran La hora de las complacencias, Tratado de gentes y El libro de los destiempos.",
  },
  {
    slug: "yessenia-flores",
    nombre: "Yessenia Flores",
    origen: "Tamaulipas",
    semblanza:
      "Doctora en Ciencias Sociales por El Colegio de San Luis. Maestra en Historia por la Universidad de Guanajuato y licenciada en Ciencias de la Educación por la Universidad Autónoma de Tamaulipas. Miembro del Sistema Nacional de Investigadores, nivel candidata (2021-2024) y nivel 1 (2025-2029). Profesora-investigadora en El Colegio de Tamaulipas (COLTAM) y docente en la Facultad de Ciencias de la Educación de la UAT. Las líneas de investigación que trabaja son la historia de la educación y los movimientos estudiantiles y magisteriales. Obtuvo el reconocimiento por primer lugar en tesis de maestría otorgado por la Sociedad Mexicana de Historia de la Educación (SOMEHIDE), publicada en el libro El Proceso de creación de los estudios preparatorios y profesionales en Tamaulipas (Instituto Literario de San Juan-Instituto Literario del Estado-UAT, 2019). Es coautora del libro Tamatán. Patrimonio, memoria e identidad (Coltam, 2020). Ha participado en congresos nacionales e internacionales de LASA, la Asociación de Estudios Latinoamericanos, y del Consejo Mexicano de Investigación Educativa (COMIE), y es miembro de la SOMEHIDE.",
  },
  {
    slug: "eduardo-villegas-guevara",
    nombre: "Eduardo Villegas Guevara",
    origen: "Palmillas, Tamaulipas, 1962",
    semblanza:
      "Palmillas, Tamaulipas (1962). Es profesor investigador de tiempo completo en la Universidad Autónoma Chapingo (UACh) y miembro del IISEHMER de la Dirección General de Investigación, Posgrado y Servicio (DGIPS) de la UACh. Ha recibido, entre otras distinciones, el IV Premio Juan B. Tijerina de Cuento por El Juego de los gusanos y el Premio de Novela Corta Carlos González Salas por El misterio del tanque. Obtuvo también el Premio de Testimonio INBA-Chihuahua (1987), el Premio Nacional de Literatura Gilberto Owen, en cuento (1990), y la Presea Estado de México Sor Juana Inés de la Cruz, en Artes y Letras (2004). Ha publicado Nace Gatatumba (poesía), Los Breves días (cuento), El baúl de los cuentos (cuentos para niños), Trilogía Melodramática (dramaturgia), Caras y gestos, Teatro para adolescentes (ensayo), entre otros títulos.",
  },
  {
    slug: "rodrigo-vogel-pacheco",
    nombre: "Rodrigo Vogel Pacheco",
    origen: "Tampico, Tamaulipas, 1993",
    semblanza:
      "Tampico, Tamaulipas (1993). Es licenciado en Ciencias del Lenguaje, profesor y creador de contenido. Ha participado en el ámbito teatral en Francia como actor, director y dramaturgo. En 2019 escribió y dirigió el monólogo bilingüe Un appel d’amour / Una llamada de amor para el Festival de Teatro Universitario en Toulouse. En redes sociales es conocido como @elpajarolinguista, donde difunde temas de lingüística e idiomas. Tampico 2077 es su primer libro.",
  },
  {
    slug: "gloria-gomez-guzman",
    nombre: "Gloria Gómez Guzmán",
    origen: "Tampico, Tamaulipas, 1950",
    encuadre: "68% 35%",
    creditoFoto: "Alondra García Valverde",
    semblanza:
      "Tampico, Tamaulipas, 1950. Poeta y narradora. Desde su primer libro, No eran la epopeya de estos años nuestros días (UNAM, Punto de Partida, 1981), se reveló como una de las voces más sólidas de la literatura tamaulipeca. En 1988 obtuvo el Premio Estatal de Poesía Juan B. Tijerina por el poemario Para quienes en altamar aún velan, y en 2015 fue nombrada Creadora Emérita de Tamaulipas en reconocimiento a su trayectoria y aportaciones a la literatura. Otros libros suyos son Litoral sin sobresaltos (Praxis/Dosfilos/UAZ, 1987); Aguamala y otros poemas, de la colección Los Cincuenta (UANL-Conaculta, 1998); Antología personal, de la colección Nuevo Amanecer (Gobierno de Tamaulipas, 1998); José se arranó (CECAT-Conaculta, 1998), una pieza de literatura para niños y jóvenes; y Antología personal/Personal Anthology (Bric-a-Brac Press, 2025), una selección de su poesía, traducida por Rebecca Bowman. Su obra, además, forma parte de numerosas antologías nacionales.",
  },
  {
    slug: "miguel-barquiarena",
    nombre: "Miguel Barquiarena",
    origen: "Nuevo Laredo, Tamaulipas, 1975",
    semblanza:
      "Nuevo Laredo, Tamaulipas, 1975. Poeta y narrador, cuya trayectoria de más de dos décadas lo ha consolidado como una de las voces más premiadas y sólidas de la literatura mexicana contemporánea. Fue miembro del Sistema Nacional de Creadores de Arte (SNCA, 2023-2025) y desde 2017 es parte del Seminario de Cultura Mexicana. Su obra ha sido distinguida con los galardones de mayor prestigio en el país, destacando los reunidos en esta antología: Premio Nacional de Poesía Germán List Arzubide (2024), Premio Internacional de Poesía Bitácora de Vuelos (2023), Premio Nacional de Poesía Ydalio Huerta Escalante (2022), Premio Nacional de Poesía Amado Nervo (2019), Premio Nacional de Poesía Carmen Alardín (2019), Premio Nacional de Poesía Juegos Florales Ramón López Velarde (2018), Premio Estatal de Poesía Juan B. Tijerina (2015), Premio Nacional de Poesía Zafra de Utopías (2011), Premio Estatal de Poesía Tamaulipas 2007, y un largo etcétera. A nivel regional y estatal ha sido beneficiario del Programa de Estímulo a la Creación y Desarrollo Artístico (PECDA) para artistas con trayectoria. Su versatilidad narrativa lo ha llevado a obtener premios y menciones honoríficas en certámenes de minificción, humor negro, ciencia ficción y cuento campirano, reafirmando su dominio de diversos registros literarios.",
  },
  {
    slug: "orlando-ortiz",
    nombre: "Orlando Ortiz",
    origen: "Tampico, 1945–2021",
    semblanza:
      "Tampico (1945-2021), fue un destacado escritor y tallerista. Autor prolífico de ensayo, narrativa y cómics —llegó a contar más de 40 libros publicados—. Estudió Letras Hispánicas en la Facultad de Filosofía y Letras de la UNAM, y Lengua y Literatura Hispánicas en la UAM-I. Colaboró en La Jornada Semanal, donde su columna “Prosa-ismos” fue la más duradera: estuvo activa por más de quince años. También publicó en otras revistas y periódicos de circulación nacional. Formó parte del Sistema Nacional de Creadores y fue reconocido por su literatura juvenil e infantil, así como por su labor como gestor cultural y promotor de revistas literarias. Impartió un sinfín de talleres de cuento desde 2007 en la Fundación para las Letras Mexicanas. Entre sus obras más destacadas se encuentran la novela En caso de duda, por la que se hizo merecedor de la beca Martín Luis Guzmán en 1968; la novela Me quiebro, pero no me doblo; la antología La violencia en México; el cómic Torbellino; el libro Relatos del presente; el libro de cuentos En un caballo blanco; los ensayos Diré adiós a los señores. Vida cotidiana en la época de Maximiliano y Carlota, y el Ensayo panorámico de la literatura tamaulipeca, entre muchas otras obras.",
  },
  {
    slug: "francisco-ramos-aguirre",
    nombre: "Francisco Ramos Aguirre",
    origen: "Ciudad Victoria, Tamaulipas",
    semblanza:
      "Maestro en Historia (UNAM/UAT) y licenciado en Español por la Escuela Normal Superior de Tamaulipas. Ha sido Coordinador de Proyectos de la Comisión para la Conmemoración del Bicentenario de la Independencia y la Revolución Mexicana en Tamaulipas (2010). Laboró en el Museo Regional de Historia de Tamaulipas (2011-2017). Catedrático del Instituto Tecnológico de Úrsulo Galván, Veracruz, de la Universidad Autónoma de Tamaulipas y de la Universidad Pedagógica Nacional. Investigador de la cultura popular en los temas de gastronomía y música tamaulipeca. Ha asistido a congresos y coloquios sobre la música norteña en Texas, Saltillo, Monterrey, Guanajuato, Michoacán y Ciudad de México. Es autor de los libros Historia del Corrido en la Frontera Tamaulipeca (1994); Los Alegres de Terán. Vida y Canciones (1999); De Punta y Talón. La Música Norteña en Tamaulipas (2013); Cuco Sánchez. De Altamira Tamaulipas Traigo Esta Alegre Canción —coautor— (2014) y Mujeres de Armas Tomar. Canciones y Soldaderas de la Revolución Mexicana (2010), entre otros. Es Cronista Municipal de Victoria.",
  },

  /* Autoras de Tamaulipas LEE sin libro propio en el fondo. */
  {
    slug: "piedad-esther-gonzalez",
    nombre: "Piedad Esther González",
    origen: "Tampico, Tamaulipas",
    semblanza:
      "Tampico, Tamaulipas. Poeta, abuela, madre, viuda, hija, hermana y nieta. Profesora jubilada. Se dedica a la literatura desde 2012. En 2017 publica dos cuentos en la revista Literapluvia. En 2021 publica su plaquette La puerta (Voces del Barlovento). Sus poemas fueron incluidos en la antología digital Un río de muchas voces: Letras en el puerto. Forma parte de las publicaciones de los talleres de Ediciones Morgana: Donde caen las máscaras. En 2025 publica su poemario Frágil, fuerte, fantástico. Poemas al niño maltratado (Ediciones Morgana), realizado con el apoyo del Sistema de Apoyos a la Creación y Proyectos Culturales, a través del Programa de Estímulo a la Creación y Desarrollo Artístico.",
  },
  {
    slug: "elvia-ardalani",
    nombre: "Elvia Ardalani",
    origen: "H. Matamoros, Tamaulipas",
    semblanza:
      "H. Matamoros, Tamaulipas. Ha dedicado la mayor parte de su vida a la literatura y la docencia. Se doctoró en 1990 en la Universidad Texas A&I. Actualmente es catedrática de lengua y creación literaria en el Departamento de Escritura y Estudios del Lenguaje de la Universidad de Texas-Río Grande Valley. Entre sus libros publicados se incluyen Ese olvido que habita en la memoria (2017), El ser de los enseres/The Being of the Household Beings (2014), Cuadernos para un huérfano (2011), Miércoles de ceniza (2007), De cruz y media luna-From Cross and Crescent Moon (edición bilingüe, 2006), Y comerás del pan sentado junto al fuego (2002), De cruz y media luna (1996) y Por recuerdos viejos, por esos recuerdos (1989). Fue corresponsal de la revista española Alborada/Goizaldia, además de editora de la revista virtual El Collar de la Paloma.",
  },
  {
    slug: "cristina-rivera-garza",
    nombre: "Cristina Rivera Garza",
    origen: "H. Matamoros, Tamaulipas",
    semblanza:
      "H. Matamoros, Tamaulipas. Destacada escritora, traductora y académica, cuya obra ha sido reconocida con la Beca MacArthur (2020). Entre su vasta producción destaca El invencible verano de Liliana (Random House, 2021), obra ganadora del Premio Pulitzer 2024 y del Xavier Villaurrutia, consolidándose como una de las voces más potentes de la literatura contemporánea tras ser finalista del National Book Award. Su trayectoria incluye títulos fundamentales como Dolerse. Textos desde un país herido (2011, traducido al inglés en 2020 por Sarah Booker y finalista del NBCC Award) y la recopilación de su obra poética en Me llamo cuerpo que no está (Lumen, 2024). Galardonada con premios como el Sor Juana Inés de la Cruz (en dos ocasiones) y el José Donoso, actualmente ejerce como profesora distinguida en la Universidad de Houston. Su publicación más reciente es la novela Terrestre (2025).",
  },
  {
    slug: "celeste-alba-iris",
    nombre: "Celeste Alba Iris",
    origen: "Ciudad Victoria, Tamaulipas, 1968",
    semblanza:
      "Ciudad Victoria, Tamaulipas, 1968. Es creadora artística y gestora cultural. Desde 2014 radica en San Luis Potosí. Su trabajo se sitúa en el cruce entre poesía e imagen, donde la memoria y el cuerpo se convierten en territorio de exploración. Es autora de los poemarios La Edad de la Marea (2025), Abierto por inventario (2013), Lunafaz (2012), Costumbre de vivir (1999) y Cualquier día de la semana (1994), así como de los fotolibros de poesía Yo es Otra (2021) y Cartografía de una herida (2019). Su obra también forma parte de diversas antologías. En 2025 recibió el Premio Félix Dauajare Torres, otorgado por el H. Ayuntamiento de San Luis Potosí. En 2014 fue nombrada cónsul ante el Parlamento de Escritores de Colombia y en 2012 realizó una residencia artística en Cuba. Ha desarrollado diversos proyectos de gestión cultural, entre ellos la plataforma Miradas al Fotolibro, Concéntrica: Círculo de Lectura y Escritura con Celeste, el Encuentro de Escritores Los santos días de la poesía y el taller infantil Mis Manos sonríen, mi lápiz canta.",
  },
  {
    slug: "lorena-illoldi",
    nombre: "Lorena Illoldi",
    origen: "Tampico, Tamaulipas",
    semblanza:
      "Tampico, Tamaulipas. Licenciada en Ciencias de la Educación por la UAT, catedrática de inglés. Primer Premio del Segundo Concurso Estatal de Poesía y Cuento del ISSSTE, 1990; Primer Lugar del Concurso Estatal Juvenil de Literatura Juan José Amador, 1996, Universidad Autónoma de Tamaulipas; en dramaturgia, Mejor Obra Original del XX Concurso Estatal de Teatro Mtro. Rafael Solana, 2001, y Primer Lugar en el Concurso Estatal de Dramaturgia Altaír Tejeda de Tamez, 2002. Tiene publicados plaquettes y libros de poesía individuales y colectivos, así como obras de teatro en publicaciones especializadas a nivel nacional y regional; su obra aparece en cinco ediciones de la Revista Tramoya. Editora de Chichimecas, Cuadernos de teatro, primerísima colección de dramaturgia tamaulipeca (2013, 2014).",
  },
  {
    slug: "alisma-de-leon",
    nombre: "Alisma de León",
    origen: "Reynosa, Tamaulipas",
    semblanza:
      "Reynosa, Tamaulipas. Narradora, participó en el libro Rigo es amor, una rocola a dieciséis, bajo la coordinación de Cristina Rivera Garza (Tusquets, 2013) y en La disolución del cuerpo (Colectivo Tranvía, 2019). Es autora de los libros de cuentos Mariposa negra (ITCA, 2014) y Nadie verá la destrucción (UANL, 2020); de la novela Tan fácil contar hasta diez (Solar Editores, 2018), y de la novela breve “Espiral”, que junto a Catalina Kühne Peimbert con “Así empiezan los finales” conforma el libro Impresencia (La Cifra Editorial, 2021).",
  },
  {
    slug: "marisol-vera-guerra",
    nombre: "Marisol Vera Guerra",
    origen: "Ciudad Madero, Tamaulipas",
    semblanza:
      "Ciudad Madero, Tamaulipas. Editora y escritora. Es directora de la editorial independiente Ediciones Morgana, con sede en Monterrey. Ha publicado 16 libros en México, Estados Unidos e Italia, entre ellos El cuerpo, el yo y la maternidad, proyecto beneficiado por CONARTE para exponerse en Venecia en 2019 y publicado por la Universidad Autónoma de Nuevo León en 2022. Su libro Imágenes de la fertilidad (ITCA, 2016) fue desarrollado con apoyo del PECDA Tamaulipas 2010. Su obra ha sido incluida en antologías y revistas literarias de varios países, entre las más recientes Latino Book Review, Chrysalis (El Paso Community College) y Ærea. Revista Hispanoamericana de Poesía (RIL Editores / University of Georgia), así como en la página de la Academia Mexicana de la Lengua. Premio Internacional de Poesía Altino, Italia, 2020. Primer lugar en el 2do Concurso Binacional de Cuento Francisco Javier Estrada 2023. Premio Nacional de Poesía Alma Karla Sandoval, 2025, con el libro Afuera cantan las cicatrices de un árbol.",
  },
  {
    slug: "dulce-bautista-salas",
    nombre: "Dulce Bautista Salas",
    origen: "Ciudad Victoria, Tamaulipas",
    creditoFoto: "Jorge Cumpean Garcen",
    semblanza:
      "Ciudad Victoria, Tamaulipas. Irrumpió en la escena literaria siendo aún estudiante de secundaria, cuando, a sus trece años, publicó Sonrojos anónimos, una de las cuatro novelas juveniles suyas que se hicieron populares en Wattpad. Ha escrito teatro y narrativa. Actualmente estudia en la Facultad de Artes Escénicas de la Universidad Autónoma de Nuevo León y es becaria de la generación 2025 del Centro de Creación Literaria UANL, con el proyecto de cuentos protagonizados por mujeres “Mi alma tiene hambre, pero mi cuerpo no sabe cocinar”. Su cuento “Cajitas” aparece en el volumen III de la antología Con M de morras (An.alfa.beta, 2025).",
  },
];

export const LIBROS: Libro[] = [
  /* --- Acroama ------------------------------------------------------- */
  {
    slug: "bajo-carbon",
    titulo: "Bajo carbón",
    autores: ["cynthia-rodriguez-leija"],
    coleccion: "acroama",
    genero: "Poesía",
    anio: 2025,
    isbn: "978-607-8452-69-9",
    paginas: 76,
    peso: 266227,
    altoPortada: 1053,
    sinopsis: [
      "Bajo carbón, de la poeta neolaredense Cynthia Rodríguez Leija, es un libro que recupera la memoria del trabajo y la vida en las zonas mineras del norte de México. Con una voz profundamente humana, la autora entrelaza las historias de mujeres, familias y comunidades que enfrentan la pobreza, la violencia y el desarraigo. Su escritura convierte la experiencia colectiva en poesía.",
    ],
  },
  {
    slug: "concavo-y-convexo",
    titulo: "Cóncavo y convexo",
    autores: ["jorge-santana"],
    coleccion: "acroama",
    genero: "Poesía",
    anio: 2025,
    isbn: "978-607-8452-59-0",
    paginas: 94,
    peso: 559678,
    altoPortada: 1053,
    sinopsis: [
      "“¿Cuánto dura el tiempo de la búsqueda? ¿Cómo se cuentan las horas de los sueños cancelados? ¿Quién detiene el instante del beso ya no dado? Al sumarse como una voz más al filo del abismo, quien escribe también busca, espera, remueve, añora, cuenta y hace ver resquicios de luz en lo que pareciera pura oscuridad; urdimbre que no podría explicar lo inexplicable, pero dota de sentido a un proceso sustentado en un anhelo invencible: encontrar lo más amado.",
      "Cóncavo y convexo es, a la manera de T. S. Eliot, un texto pleno en símbolos, una travesía de emociones, una interrogante desesperada. Porque en la estructura narrativa de Jorge Santana hay poesía, pero también política: el espejo devuelto a una sociedad que parece haber perdido la esencia de lo humano. El escritor habla, es hablado por todas esas voces y se conecta a la gente conversando desde el abismo, renuncia al cómodo silencio para despertarnos del letargo.” —Libertad García Cabriales",
    ],
  },
  {
    slug: "herida-de-muerte",
    titulo: "Herida de muerte",
    autores: ["enrique-dimas-arias"],
    coleccion: "acroama",
    genero: "Poesía",
    anio: 2025,
    isbn: "978-607-8452-67-5",
    paginas: 96,
    peso: 365234,
    altoPortada: 1053,
    sinopsis: [
      "Herida de muerte es un recorrido por las grietas que deja la pérdida, una voz que no busca consuelo, sino lucidez. Cada poema se convierte en testimonio: el instante en que la herida se abre, la forma en que persiste y lo que revela cuando ya no puede ocultarse. Con un lenguaje preciso y una sensibilidad que rehúye el alivio fácil, este libro se adentra en la fragilidad humana, en las fracturas que modelan la memoria y en la obstinada presencia del dolor como parte de la existencia.",
    ],
  },
  {
    slug: "mis-historias-mi-verdad",
    titulo: "Mis historias, mi verdad",
    autores: ["armando-mancilla-flores"],
    coleccion: "acroama",
    genero: "Dramaturgia",
    anio: 2025,
    isbn: "978-607-8452-76-7",
    paginas: 132,
    peso: 607827,
    altoPortada: 1052,
    sinopsis: [
      "En Mis historias, mi verdad, Armando Mancilla Flores nos conduce por tres obras dramáticas que exponen la vulnerabilidad humana en sus formas más crudas. Voces femeninas que revelan la violencia y la dependencia impuestas por un sistema patriarcal; confesiones que destapan secretos perturbadores y silencios cómplices; y un secuestro que se convierte en un callejón sin salida.",
      "Cada historia abre un espacio de confrontación con aquello que preferimos callar: el abuso, la injusticia, la obsesión, la desesperación. Al usar un lenguaje directo y escenas intensas, convierte la potencial puesta en escena en un espejo incómodo pero necesario, donde la sociedad en su conjunto puede verse con claridad.",
      "Tres historias, una sola intención: sacudir al lector y al espectador, e invitarlos a reflexionar sobre las estructuras que sostienen la violencia.",
    ],
  },
  {
    slug: "obedecere-hasta-mi-ultimo-aliento",
    titulo: "Obedeceré hasta mi último aliento",
    autores: ["dulce-gabriela-gutierrez"],
    coleccion: "acroama",
    genero: "Dramaturgia",
    anio: 2025,
    isbn: "978-607-8452-61-3",
    paginas: 84,
    peso: 250790,
    altoPortada: 1053,
    sinopsis: [
      "Tras una huida forzada, Olivia se muda con sus hijos, Teo y Lili, a una vieja casa que promete ser refugio. Sin embargo, el silencio de sus habitaciones revela presencias antiguas: las hermanas Cósima, Ethel y Fiona, hijas de un líder sectario que marcó su destino con el miedo y la obediencia. A medida que las familias comienzan a cruzarse, se borra la frontera entre ambos planos, y la violencia del pasado encuentra eco en el presente.",
      "Obedeceré hasta mi último aliento es una obra que ayuda a mostrar cómo el control puede trascender incluso la muerte. Desde el horror y la ternura, la autora construye un retrato íntimo de la infancia arrebatada y de la búsqueda de libertad en medio del miedo.",
    ],
  },
  {
    slug: "quinta-esencia",
    titulo: "Quinta esencia",
    autores: ["norailiana-esparza-mandujano"],
    coleccion: "acroama",
    genero: "Poesía",
    anio: 2025,
    isbn: "978-607-8452-81-1",
    paginas: 104,
    peso: 287641,
    altoPortada: 1052,
    sinopsis: [
      "Este poemario mantiene un equilibrio entre herida y raíz, entre despojo y resurrección, entre lo personal y lo colectivo. Cada texto despliega una voz que no solo nombra, sino que encarna: la infancia truncada como herida colectiva, la mujer como fuerza telúrica y cósmica, la madre como sombra y refugio, el linaje como savia compartida.",
      "Norailiana Esparza Mandujano es capaz de articular lo íntimo con lo ancestral, lo corporal con lo mítico, sosteniendo un tono que oscila entre el testimonio desgarrado y la invocación sagrada. Quinta esencia construye un mapa poético donde la identidad femenina emerge como raíz, llama y medicina, un territorio donde el dolor no es clausura, sino semilla de permanencia y esperanza. —Julio Pesina",
    ],
  },
  {
    slug: "sh-boom-sh-boom",
    titulo: "Sh-Boom Sh-Boom",
    subtitulo: "Life Could Be a Dream",
    autores: ["sergio-aguirre"],
    coleccion: "acroama",
    genero: "Dramaturgia",
    anio: 2025,
    isbn: "978-607-8452-60-6",
    paginas: 128,
    peso: 719189,
    altoPortada: 1052,
    sinopsis: [
      "Tampico, Campeche y Matamoros se vuelven escenarios míticos donde lo cotidiano y las historias vivas de personas reales se transforman en ecos de La Odisea. A bordo de una “nave” que recorre calles, iglesias y plazas, las y los espectadores son conducidos por historias entrelazadas para desembarcar, posteriormente, en medio de un juego de beisbol, donde actores campechanos mayores de sesenta años juegan a eso: a jugar a la vida, aunque a veces duela. La travesía de estas letras finaliza en Matamoros, donde hacedores del drama, en espacios vacíos, buscan bucear en el fondo del océano o quizá en las profundidades del tiempo mismo.",
      "Tres islas creadas a partir de Penélope, Euriclea y Calipso narran amores, heridas, promesas y resistencias que se repiten como olas que atraviesan generaciones. Esta trilogía escénica reconstruye la memoria de personas que se reinterpretan hasta convertirse en sus propios mitos. Con un lirismo atrapante y una verdad emocional profunda, Aguirre propone una puesta en escena libre, lúdica y conmovedora, que celebra la vida y sus naufragios.",
    ],
  },
  {
    slug: "tragicomedia-urbana",
    titulo: "Tragicomedia urbana",
    autores: ["ramiro-rodriguez"],
    coleccion: "acroama",
    genero: "Poesía",
    anio: 2025,
    isbn: "978-607-8452-64-4",
    paginas: 76,
    peso: 250859,
    altoPortada: 1053,
    sinopsis: [
      "En esta nueva entrega poética, Ramiro Rodríguez traza un mapa de la ciudad como escenario de la descomposición y la ternura. A través de voces que transitan entre la vigilia y el sueño, el autor erige un teatro de sombras donde el miedo, la soledad y la barbarie conviven con la memoria y la lucidez. Sus poemas, poblados de bestias, estatuas, dioses terrestres, entre otras presencias, revelan una mirada crítica y compasiva sobre la vida contemporánea. Con ritmo y una aguda sensibilidad, Rodríguez convierte la urbe en espejo de nuestras contradicciones: un espacio donde la tragedia se disfraza de rutina y el humor emerge.",
    ],
  },

  /* --- Altas Llamas -------------------------------------------------- */
  {
    slug: "akbal",
    titulo: "Akbal",
    autores: ["edgar-a-rivera"],
    coleccion: "altas-llamas",
    genero: "Novela",
    anio: 2025,
    isbn: "978-607-8452-80-4",
    paginas: 192,
    peso: 2541781,
    altoPortada: 1112,
    sinopsis: [
      "En una aldea asolada por la guerra y la oscuridad, Akbal, un joven cazador, presencia el horror que se abate sobre su pueblo: criaturas de ojos negros que devoran a su familia y transforman la noche en un territorio de sangre. En su huida, es acogido por un grupo de guerreros y sacerdotes que le revelan una antigua lucha entre dioses y hombres, entre la luz y la sombra.",
      "Con una prosa minuciosa y atmósfera ritual, Édgar A. Rivera reconstruye un mundo donde el mito y el horror se confunden con la historia. Akbal es una travesía hacia el origen del miedo y una reflexión sobre lo que el ser humano está dispuesto a sacrificar para sobrevivir.",
    ],
  },
  {
    slug: "cuando-la-luna",
    titulo: "Cuando la luna",
    autores: ["estrella-gracia-gonzalez"],
    coleccion: "altas-llamas",
    genero: "Novela",
    anio: 2025,
    isbn: "978-607-8452-62-0",
    paginas: 170,
    peso: 747469,
    altoPortada: 1112,
    sinopsis: [
      "En Cuando la luna, Estrella Gracia nos transporta a la casa de la Sra. Mackenzie, en los años posteriores a la guerra de secesión estadounidense. Louise, una joven institutriz, llega para enseñar a un niño enfermo, pero pronto descubre que ese hogar oculta secretos inquietantes: apariciones nocturnas, sueños perturbadores y muñecos de trapo cargados de misterio.",
      "Entre lo gótico y lo romántico, la autora explora el peso de la memoria, la fuerza de los rituales y la posibilidad del amor en medio de la diferencia. Una novela que desafía certezas y revela que la frontera entre la vida y la muerte puede ser más delgada de lo que imaginamos.",
    ],
  },
  {
    slug: "el-planeta-dorado",
    titulo: "El planeta dorado",
    autores: ["edmundo-lozano-calzado"],
    coleccion: "altas-llamas",
    genero: "Novela",
    anio: 2025,
    isbn: "978-607-8452-58-3",
    paginas: 246,
    peso: 1054554,
    altoPortada: 1112,
    sinopsis: [
      "Elías Ulpiano sobrevive al terremoto de 1985 en la Ciudad de México y, en medio del caos, decide fingir su muerte para comenzar de nuevo bajo otro nombre. En esa huida se enfrenta a su pasado, a la culpa y al deseo de reinventarse, mientras las ruinas del país y de su propia vida se confunden.",
      "El planeta dorado, única novela de Edmundo Lozano Calzado, retrata con humor, ingenio y lucidez a un hombre común, que busca una nueva vida en la que sí pueda ser feliz. Escrita a lo largo de varios años, fue el proyecto literario más querido del autor, concluido poco antes de su fallecimiento y presentado póstumamente por sus hijos como testimonio de su última voluntad.",
    ],
  },
  {
    slug: "el-pterosaurio-rojo",
    titulo: "El pterosaurio rojo",
    autores: ["sonia-arrazolo-reyna"],
    coleccion: "altas-llamas",
    genero: "Novela",
    anio: 2025,
    isbn: "978-607-8452-66-8",
    paginas: 122,
    peso: 754275,
    altoPortada: 1112,
    sinopsis: [
      "En El pterosaurio rojo, Sonia Arrazolo Reyna combina el melodrama, la fantasía y el círculo familiar para construir una historia sobre la herencia espiritual y el miedo ancestral. Brandon, un joven controlador aéreo de ascendencia coreana, comienza a experimentar sueños perturbadores que lo vinculan con su abuela y con una profecía antigua. A partir de entonces, su vida se convierte en un territorio incierto.",
    ],
  },
  {
    slug: "el-rumor-de-un-nombre",
    titulo: "El rumor de un nombre",
    autores: ["david-vallejo"],
    coleccion: "altas-llamas",
    genero: "Novela",
    anio: 2025,
    isbn: "978-607-8452-63-7",
    paginas: 120,
    peso: 3635849,
    altoPortada: 1112,
    sinopsis: [
      "Narrada en primera persona, esta novela de David Vallejo recrea los años formativos de Bob Dylan desde una mirada íntima y poética. Entre recuerdos posibles, lecturas, acordes y silencios, el autor reinventa las memorias del famoso cantautor con una estructura casi musical, donde el mito se vuelve humano y la juventud late como una melodía infinita.",
      "A la vez, la obra se lee como un ejercicio imaginativo, como si el propio Dylan decidiera escribir las crónicas de su primera etapa antes de llegar a Nueva York, anticipando el espíritu de Chronicles y revelando los destellos de su desarrollo artístico. Una obra breve y lúcida sobre la fragilidad de los comienzos y el poder transformador de la imaginación.",
    ],
  },
  {
    slug: "juego-imperfecto",
    titulo: "Juego (im)perfecto",
    autores: ["javier-vargas-de-luna"],
    coleccion: "altas-llamas",
    genero: "Novela",
    anio: 2025,
    isbn: "978-607-8452-79-8",
    paginas: 280,
    peso: 1640079,
    altoPortada: 1112,
    sinopsis: [
      "Un escritor mexicano radicado en Montreal recibe un diagnóstico terminal que trastoca la aparente normalidad de su vida: la enfermedad se convierte en metáfora del desarraigo y en espejo de una existencia dividida entre dos lenguas, dos países y un amor en ruinas.",
      "Con una prosa confesional y una mirada que combina ironía, ternura y humor negro, la novela transita entre consultorios, estadios y hoteles, explorando el absurdo de la supervivencia y la violencia del recuerdo. Juego (im)perfecto es el retrato de un hombre que, frente a la muerte, se atreve a narrarse una última vez para no desaparecer del todo.",
    ],
  },
  {
    slug: "hadal",
    titulo: "Hadal",
    autores: ["itzia-rangole"],
    coleccion: "altas-llamas",
    genero: "Cuento",
    anio: 2025,
    isbn: "978-607-8452-68-2",
    paginas: 104,
    peso: 566224,
    altoPortada: 1112,
    sinopsis: [
      "¿Qué tendría para decir Rosalina sobre lo acontecido a Romeo y Julieta? ¿Por qué Lydia Wickham decidió fugarse antes que sus hermanas Bennet? ¿Qué pensamientos cruzaron por la mente de Lady Macbeth antes del derrumbe? En Hadal, Itzia Rangole devuelve la voz a personajes femeninos secundarios, las “sin discurso”, las “perdedoras” de las historias. En la segunda parte, una bibliotecaria (Directora de la Biblioteca Universal de la Existencia Humana) decide renunciar a su cargo y enfrentarse al vacío.",
      "Con gran lucidez, Rangole desdobla el lenguaje de estas personajes y las hace reflexionar sobre su papel en sus historias, más allá de ser un mero recurso literario. La escritura aparece entonces como un acto peligroso, un descenso hacia lo que se calla y teme.",
    ],
  },
  {
    slug: "las-propuestas-de-la-lluvia",
    titulo: "Las propuestas de la lluvia",
    autores: ["eduardo-villegas-guevara"],
    coleccion: "altas-llamas",
    genero: "Cuento",
    anio: 2025,
    isbn: "978-607-8452-70-5",
    paginas: 178,
    peso: 1138530,
    altoPortada: 1112,
    sinopsis: [
      "Los personajes de estos cuentos habitan espacios donde la realidad parece filtrarse por las grietas de la conciencia: soldados perdidos en su culpa, mujeres que enfrentan ausencias imposibles, hombres que descubren su propia sombra en el reflejo de otros. Villegas construye atmósferas cargadas de tensión, terror y humanidad; cada historia es un reflejo de lo que permanece después de la pérdida.",
      "Las propuestas de la lluvia es una inmersión en lo invisible: la fragilidad del deseo, la culpa y el anhelo de redención bajo la persistente amenaza de la lluvia.",
    ],
  },
  {
    slug: "tampico-2077",
    titulo: "Tampico 2077",
    autores: ["rodrigo-vogel-pacheco"],
    coleccion: "altas-llamas",
    genero: "Cuento",
    anio: 2025,
    isbn: "978-607-8452-78-1",
    paginas: 100,
    peso: 513376,
    altoPortada: 1112,
    sinopsis: [
      "Rodrigo Vogel Pacheco imagina un futuro en el que la costa tamaulipeca ha sido devorada por el mar y la tecnología gobierna los retazos de la vida cotidiana. A través de relatos interconectados, el autor traza el mapa de una ciudad sumergida entre el agua y la memoria, habitada por cíborgs, jáquers y humanos que aún buscan amar, sobrevivir o recordar quiénes fueron.",
      "Estos cuentos exploran los límites entre lo real y lo virtual, la herencia y el colapso, planteando una pregunta inevitable: ¿qué queda de nosotros cuando la humanidad se convierte en recuerdo?",
    ],
  },
  {
    slug: "aqui-debiamos-llegar",
    titulo: "Aquí debíamos llegar",
    autores: ["roberto-lopez"],
    coleccion: "altas-llamas",
    genero: "Ensayo",
    anio: 2025,
    isbn: "978-607-8452-65-1",
    paginas: 82,
    peso: 335128,
    altoPortada: 1112,
    sinopsis: [
      "Roberto López traza una lectura crítica y afectiva de las letras del estado, proponiendo un mapa que une tradición y contemporaneidad. Desde el análisis de figuras femeninas en la poesía hasta la exploración de temas como la docencia, el deseo o la violencia, el autor revisita la obra de escritoras y escritores tamaulipecos con una mirada renovada.",
      "Este libro es una conversación con las voces que han construido la literatura del noreste, y una invitación a leer el territorio como una forma de identidad.",
    ],
  },
  {
    slug: "canto-muerto",
    titulo: "Canto muerto de una lengua resucitada en la voz del presente",
    subtitulo: "Perífrasis de Tamaulipas",
    autores: ["eduardo-vargas-lopez"],
    coleccion: "altas-llamas",
    genero: "Ensayo",
    anio: 2025,
    isbn: "978-607-8452-82-8",
    paginas: 112,
    peso: 573393,
    altoPortada: 1112,
    sinopsis: [
      "Un canto que revive lo perdido. Canto muerto de una lengua resucitada en la voz del presente es un viaje literario que une memoria y territorio. Eduardo Vargas López nos invita a escuchar los ecos de las lenguas originarias que habitaron Tamaulipas y que, al extinguirse, dejaron un silencio que aún pesa como herida colectiva.",
      "Este ensayo, a medio camino de la poesía y la reflexión crítica, convierte la palabra en defensa: rescata los cantos olvidados, confronta la violencia histórica y contemporánea, y propone el habla como un espacio de dignidad. La desaparición de las lenguas no se presenta solo como un hecho cultural, sino como una pérdida de identidad y memoria compartida.",
    ],
  },
  {
    slug: "ensayos-sobre-arqueologia-tamaulipeca",
    titulo: "Ensayos sobre arqueología tamaulipeca",
    autores: ["giovanni-alberto-chavez-morales"],
    rol: "Coordinación",
    coleccion: "altas-llamas",
    genero: "Ensayo",
    anio: 2025,
    isbn: "978-607-8452-77-4",
    paginas: 134,
    peso: 2530500,
    altoPortada: 1112,
    sinopsis: [
      "El pasado no se conserva: se interroga. Cada hallazgo arqueológico es una pregunta abierta sobre quiénes fuimos y qué permanece de nosotros en la materia. Este libro nace de esa búsqueda colectiva: una obra que piensa a Tamaulipas desde su profundidad temporal y desde la precisión científica de quienes la investigan.",
      "Los capítulos que lo integran revelan la solidez de una comunidad académica en pleno desarrollo: investigadoras e investigadores que, con disciplina y compromiso, reconstruyen las tramas culturales que dieron forma a esta región. Cada autor aporta una mirada distinta, pero todas confluyen en un mismo propósito: comprender la historia humana desde el territorio, no desde la distancia.",
      "Bajo la coordinación del Dr. Giovanni Alberto Chávez Morales, esta obra colectiva consolida una línea de investigación rigurosa, ética y situada, que devuelve a Tamaulipas su lugar en el mapa de la arqueología nacional. En estas páginas, la tierra habla y lo hace con voz propia. —Carla Patricia Saucedo Huidobro",
    ],
  },
  {
    slug: "la-educacion-en-tamaulipas",
    titulo: "La educación en Tamaulipas",
    subtitulo: "Historia, procesos y miradas",
    autores: ["yessenia-flores"],
    coleccion: "altas-llamas",
    genero: "Ensayo",
    anio: 2025,
    isbn: "978-607-8452-71-2",
    paginas: 102,
    peso: 694022,
    altoPortada: 1112,
    sinopsis: [
      "En este ensayo, la Dra. Yessenia Flores ofrece una mirada crítica sobre los procesos que han configurado la enseñanza en el estado, desde sus orígenes hasta los desafíos del presente. Con rigor documental y sensibilidad histórica, la autora reconstruye los proyectos, actores y políticas que dieron forma al sistema educativo tamaulipeco.",
    ],
  },

  /* --- Cauce del Bravo ----------------------------------------------- */
  {
    slug: "las-mujeres-zurdas-bailan-suelto",
    titulo: "Las mujeres zurdas bailan suelto",
    autores: ["gloria-gomez-guzman"],
    coleccion: "cauce-del-bravo",
    genero: "Novela",
    anio: 2025,
    isbn: "978-607-8452-74-3",
    paginas: 122,
    peso: 942076,
    altoPortada: 1112,
    sinopsis: [
      "Habría que empezar diciendo que estamos ante un regalo: después de publicar tres libros en un mismo año, allá por 1998, Gloria Gómez Guzmán anunció que dejaría de escribir. El aviso fue real, y así esta novela permaneció en su computadora, acaso revisitada de vez en vez para hacer una corrección, “como pateando una lata”, hasta conseguir la obra definitiva.",
      "En el Tampico de la segunda mitad del siglo XX, tres mujeres —Lourdes, Clara y Eloísa— aprenden muy pronto que el destino no se reparte de manera justa. Entre la pobreza, el color de la piel, la educación sentimental y la promesa siempre fallida de “llegar a ser alguien”, cada una ensaya su propia forma de huida, de resistencia o de desencanto.",
      "Las mujeres zurdas bailan suelto es una novela de voces afiladas y memoria crítica, donde la amistad femenina, la conciencia social y la rabia contenida se entrelazan para cuestionar los mitos del progreso, la felicidad y la corrección moral. Con una prosa irónica, lúcida y sin concesiones, Gómez Guzmán retrata a mujeres que piensan demasiado, que no encajan, que se niegan a obedecer, que bailan a su aire.",
    ],
  },
  {
    slug: "osario",
    titulo: "Osario",
    subtitulo: "Antología poética, 2024-1999",
    autores: ["miguel-barquiarena"],
    coleccion: "cauce-del-bravo",
    genero: "Poesía",
    anio: 2025,
    isbn: "978-607-8452-73-6",
    paginas: 208,
    peso: 756242,
    altoPortada: 1112,
    sinopsis: [
      "“El presente libro se iba a titular Osario de otredad. ¿Por qué? Porque en mi escritura siempre me escondo en otros, me creo interlocutores o me invento identidades, no sé si para estimular la imaginación o por evitar que mi lado introvertido me bloquee. Al final quité eso de otredad, porque es común que los poetas se oculten tras sus versos. De hecho, toda poesía nos es ajena y personal, no importa quién la escriba o quién la lea. Es ahí donde radica su belleza, en su intento de salvarnos por igual.” —Miguel Barquiarena",
    ],
  },
  {
    slug: "prosa-ismos",
    titulo: "Prosa-ismos",
    subtitulo: "Textos híbridos",
    autores: ["orlando-ortiz"],
    creditos: "Selección y prólogo de Bibiana Camacho",
    coleccion: "cauce-del-bravo",
    genero: "Ensayo",
    anio: 2025,
    isbn: "978-607-8452-75-0",
    paginas: 300,
    peso: 1455893,
    altoPortada: 1112,
    sinopsis: [
      "A lo largo de su trayectoria, Orlando Ortiz colaboró en distintos medios impresos. Ahí plasmó una propuesta estética, dinámica y rebosante de su configuración intelectual. Su columna “Prosa-ismos” fue la más duradera en La Jornada Semanal, con dos colaboraciones mensuales durante más de quince años.",
      "Si ya en su obra publicada en más de cuarenta libros se aprecian sus temas —la violencia, la historia, el erotismo, el drama del hombre común, la picaresca—, en las columnas podemos encontrar el germen y continuación de los intereses que moldearon sus propuestas: la reflexión del presente en constante comunicación con el pasado y el interés por rescatar autores y autoras de gran calidad literaria, pero lamentablemente poco leídos y algunos casi olvidados.",
      "En la selección de textos que conforman este libro se nota una curiosidad honda y una investigación certera de los temas que le interesaban. El cuidado del lenguaje, siempre pulcro, pero también rebelde y juguetón, da fe del manejo de distintos registros tanto de la oralidad como de la erudición.",
    ],
  },

  /* --- Tierra Fecunda ------------------------------------------------ */
  {
    slug: "comiendo-en-tamaulipas",
    titulo: "Comiendo en Tamaulipas",
    subtitulo: "Ruta gastronómica por sus regiones",
    autores: ["francisco-ramos-aguirre"],
    coleccion: "tierra-fecunda",
    genero: "Cultura popular",
    anio: 2025,
    isbn: "978-607-8452-72-9",
    paginas: 234,
    peso: 7113643,
    altoPortada: 1035,
    sinopsis: [
      "Una cartografía culinaria que no se conforma con nombrar: explica procedencias, tiempos, técnicas y contextos, y devuelve espesor histórico a aquello que en los resúmenes turísticos suele aparecer como anécdota. Importa porque la cocina —cuando se entiende bien— es infraestructura de lo común: sostiene economías domésticas, inventa soluciones frente a la escasez, disciplina el gusto sin domesticar la memoria, y recuerda que la mesa es la primera institución democrática.",
      "La ruta que propone Francisco Ramos Aguirre no es un desfile, es método en movimiento. Frontera, altiplano, serranía y litoral aparecen como formas de organización del gusto. La fajita y el carbón de mezquite narran la invención urbana sin despegarse del asador. La jaiba y el filete al piquín enseñan que una pizca bien administrada corrige cualquier exceso. El cabrito —al pastor, en su sangre o al horno— sostiene una ética del punto justo que no admite atajos. El tamal se afina o se ensancha según el habla local, porque el maíz entiende mejor que nadie a su gente.",
    ],
  },

  /* --- Tamaulipas LEE ------------------------------------------------ */
  {
    slug: "tamaulipas-lee-a-sus-escritoras-de-hoy",
    titulo: "Tamaulipas LEE a sus escritoras de hoy",
    autores: [
      "gloria-gomez-guzman",
      "piedad-esther-gonzalez",
      "elvia-ardalani",
      "cristina-rivera-garza",
      "norailiana-esparza-mandujano",
      "celeste-alba-iris",
      "lorena-illoldi",
      "alisma-de-leon",
      "cynthia-rodriguez-leija",
      "marisol-vera-guerra",
      "itzia-rangole",
      "dulce-bautista-salas",
    ],
    rol: "Antología",
    coleccion: "tamaulipas-lee",
    genero: "Antología",
    anio: 2026,
    isbn: "978-607-8452-83-5",
    paginas: 58,
    peso: 4330155,
    altoPortada: 1113,
    sinopsis: [
      "Este volumen celebra las voces de doce escritoras tamaulipecas de distintas generaciones, desde aquellas que han abierto camino y construido una tradición literaria sólida hasta las nuevas voces que continúan el ejercicio de la creación con fuerza, sensibilidad y una mirada propia.",
      "Aquí dialogan la memoria y el porvenir: poetas y narradoras jóvenes emergentes conviven con autoras de amplia trayectoria y reconocimiento nacional e internacional. Es la primera de una serie que busca reconocerlas y darles el lugar que les pertenece.",
    ],
  },
];

/* --- Consultas --------------------------------------------------------- */

const porSlug = <T extends { slug: string }>(lista: T[]) =>
  new Map(lista.map((x) => [x.slug, x]));

const COLECCION = porSlug(COLECCIONES);
const AUTOR = porSlug(AUTORES);
const LIBRO = porSlug(LIBROS);

export const coleccionPorSlug = (slug: string) => COLECCION.get(slug);
export const autorPorSlug = (slug: string) => AUTOR.get(slug);
export const libroPorSlug = (slug: string) => LIBRO.get(slug);

export const librosDeColeccion = (slug: string) =>
  LIBROS.filter((l) => l.coleccion === slug);

export const librosDeAutor = (slug: string) =>
  LIBROS.filter((l) => l.autores.includes(slug));

/** Nombres de los autores de un libro, ya resueltos. */
export const autoresDe = (libro: Libro) =>
  libro.autores.map((s) => AUTOR.get(s)).filter((a): a is Autor => !!a);

/** Linea de autoria para tarjetas: la antologia no enumera a sus doce. */
export const firmaDe = (libro: Libro) =>
  libro.autores.length > 3
    ? `${libro.autores.length} autoras`
    : autoresDe(libro)
        .map((a) => a.nombre)
        .join(", ");

export const rutaPortada = (libro: Libro) =>
  `/biblioteca/portadas/${libro.slug}.webp`;
export const rutaPdf = (libro: Libro) => `/biblioteca/pdf/${libro.slug}.pdf`;
export const rutaFoto = (autor: Autor) => `/biblioteca/autores/${autor.slug}.webp`;

export const pesoLegible = (bytes: number) =>
  bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toLocaleString("es-MX", { maximumFractionDigits: 1 })} MB`
    : `${Math.round(bytes / 1000)} KB`;

/**
 * Apellidos para ordenar el indice, que en una biblioteca va por apellido.
 * La regla general -los dos ultimos nombres si hay tres o mas, el ultimo si
 * hay dos- falla con los nombres compuestos y las particulas, y esos se
 * declaran aqui en vez de complicar la regla.
 */
const APELLIDOS: Record<string, string> = {
  "dulce-gabriela-gutierrez": "Gutiérrez",
  "piedad-esther-gonzalez": "González",
  "edgar-a-rivera": "Rivera",
  "javier-vargas-de-luna": "Vargas de Luna",
  "alisma-de-leon": "León",
  "giovanni-alberto-chavez-morales": "Chávez Morales",
};

export const apellidosDe = (autor: Autor) => {
  if (APELLIDOS[autor.slug]) return APELLIDOS[autor.slug];
  const partes = autor.nombre.split(" ");
  return partes.slice(partes.length >= 3 ? -2 : -1).join(" ");
};

const sinAcentos = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const AUTORES_ORDENADOS = [...AUTORES].sort((a, b) =>
  sinAcentos(apellidosDe(a)).localeCompare(sinAcentos(apellidosDe(b)), "es"),
);

/** Normaliza para la busqueda: sin acentos ni mayusculas. */
export const normalizar = sinAcentos;

/** Lo que necesita una tarjeta, sin sinopsis ni semblanzas. */
export const resumenDe = (libro: Libro) => ({
  slug: libro.slug,
  titulo: libro.titulo,
  subtitulo: libro.subtitulo,
  firma: firmaDe(libro),
  coleccion: libro.coleccion,
  nombreColeccion: COLECCION.get(libro.coleccion)?.nombre ?? "",
  genero: libro.genero,
  anio: libro.anio,
  altoPortada: libro.altoPortada,
});

/** Tarjeta mas el texto en el que busca el catalogo. */
export const entradaCatalogo = (libro: Libro) => ({
  ...resumenDe(libro),
  indice: normalizar(
    [
      libro.titulo,
      libro.subtitulo ?? "",
      ...autoresDe(libro).map((a) => a.nombre),
      libro.creditos ?? "",
      libro.isbn,
      libro.isbn.replace(/-/g, ""),
      libro.genero,
      COLECCION.get(libro.coleccion)?.nombre ?? "",
    ].join(" "),
  ),
});

/** Generos en el orden en que los presentan las colecciones. */
export const GENEROS = [...new Set(COLECCIONES.flatMap((c) => c.generos))];

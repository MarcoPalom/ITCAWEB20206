/**
 * Constancia de autoria de las fotografias de public/img/municipios/.
 *
 * Derivado -no escrito a mano- por scripts/buscar-fotos-municipios.mjs.
 * Cada entrada es la foto elegida en Wikimedia Commons para ese municipio,
 * con licencia libre (CC BY, CC BY-SA o dominio publico); null donde no
 * aparecio ninguna que cumpliera. Para regenerar, ver ese script.
 */
export type FotoMunicipio = {
  titulo: string;
  autor: string;
  licencia: string;
  fuente: string;
};

export const MUNICIPIOS_FOTOS: Record<string, FotoMunicipio | null> = {
  "abasolo": {
    "titulo": "File:Presidencia Municipal, Abasolo, Tamaulipas.jpg",
    "autor": "toledo0525",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal,_Abasolo,_Tamaulipas.jpg"
  },
  "aldama": {
    "titulo": "File:Plaza Constitución Aldama.jpg",
    "autor": "Francisco Javier Mendez Pedraza",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Plaza_Constituci%C3%B3n_Aldama.jpg"
  },
  "altamira": {
    "titulo": "File:Parque champayan altamira tamaulipas 01.jpg",
    "autor": "Emanrios",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Parque_champayan_altamira_tamaulipas_01.jpg"
  },
  "antiguo-morelos": {
    "titulo": "File:Templo en Antigua Morelos, Tamaulipas.jpg",
    "autor": "nosoymeave",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Templo_en_Antigua_Morelos,_Tamaulipas.jpg"
  },
  "burgos": {
    "titulo": "File:Presidencia Municipal, Burgos, Tamaulipas.jpg",
    "autor": "lahuerquilla",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal,_Burgos,_Tamaulipas.jpg"
  },
  "bustamante": {
    "titulo": "File:Bustamante Tamaulipas.jpg",
    "autor": "Ereenegee",
    "licencia": "CC BY-SA 3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Bustamante_Tamaulipas.jpg"
  },
  "camargo": {
    "titulo": "File:Oficina Postal de Ciudad Camargo, Tamaulipas, ca. 1910.jpg",
    "autor": "Palacio Postal",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Oficina_Postal_de_Ciudad_Camargo,_Tamaulipas,_ca._1910.jpg"
  },
  "casas": {
    "titulo": "File:Centro en Casas, Tamaulipas.jpg",
    "autor": "eduardosiivan",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Centro_en_Casas,_Tamaulipas.jpg"
  },
  "cruillas": {
    "titulo": "File:Presidencia Municipal de Cruillas, Tamaulipas.jpg",
    "autor": "toledo0525",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal_de_Cruillas,_Tamaulipas.jpg"
  },
  "gomez-farias": {
    "titulo": "File:Centro en Gómez Farías, Tamaulipas.jpg",
    "autor": "connstanzaa",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Centro_en_G%C3%B3mez_Far%C3%ADas,_Tamaulipas.jpg"
  },
  "gonzalez": {
    "titulo": "File:Presidencia Municipal, González.jpg",
    "autor": "karlaimaya",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal,_Gonz%C3%A1lez.jpg"
  },
  "guemez": {
    "titulo": "File:Presidencia Municipal, Güémez, Tamaulipas.jpg",
    "autor": "ciudadvictoriatamps",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal,_G%C3%BC%C3%A9mez,_Tamaulipas.jpg"
  },
  "guerrero": {
    "titulo": "File:Oficina Postal de Ciudad Guerrero, Tamaulipas 1910.jpg",
    "autor": "Palacio Postal",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Oficina_Postal_de_Ciudad_Guerrero,_Tamaulipas_1910.jpg"
  },
  "gustavo-diaz-ordaz": {
    "titulo": "File:The hand-pulled Los Ebanos Ferry or El Chalan, formally known as the Los Ebanos-Diaz Ordaz Ferry, a hand-operated cable car-pedestrian ferry that travels across the Rio Grande River between Los Ebanos LCCN2014631807.tif",
    "autor": "Carol M. Highsmith",
    "licencia": "Public domain",
    "fuente": "https://commons.wikimedia.org/wiki/File:The_hand-pulled_Los_Ebanos_Ferry_or_El_Chalan,_formally_known_as_the_Los_Ebanos-Diaz_Ordaz_Ferry,_a_hand-operated_cable_car-pedestrian_ferry_that_travels_across_the_Rio_Grande_River_between_Los_Ebanos_LCCN2014631807.tif"
  },
  "hidalgo": {
    "titulo": "File:Presidencia Municipal, Hidalgo, Tamaulipas.jpg",
    "autor": "marianarld",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal,_Hidalgo,_Tamaulipas.jpg"
  },
  "jaumave": {
    "titulo": "File:Jaumave, Tamaulipas.jpg",
    "autor": "jaumavemas",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Jaumave,_Tamaulipas.jpg"
  },
  "jimenez": {
    "titulo": "File:Presidencia Municipal, Jiménez, Tamaulipas.jpg",
    "autor": "toledo0525",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal,_Jim%C3%A9nez,_Tamaulipas.jpg"
  },
  "llera": {
    "titulo": "File:El Bernalito, en el valle abajo de la Cuesta de Llera - panoramio.jpg",
    "autor": "panza.rayada",
    "licencia": "CC BY-SA 3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:El_Bernalito,_en_el_valle_abajo_de_la_Cuesta_de_Llera_-_panoramio.jpg"
  },
  "madero": {
    "titulo": "File:Amanecer Playa Ciudad Madero.jpg",
    "autor": "Edia29",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Amanecer_Playa_Ciudad_Madero.jpg"
  },
  "mainero": {
    "titulo": "File:Naturaleza en Mainero, Tamaulipas.jpg",
    "autor": "perea2m",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Naturaleza_en_Mainero,_Tamaulipas.jpg"
  },
  "mante": {
    "titulo": "File:EL Nacimiento, Ciudad Mante, Tamaulipas (27541700037).jpg",
    "autor": "Comisión Mexicana de Filmaciones from México D. F., México",
    "licencia": "CC BY-SA 2.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:EL_Nacimiento,_Ciudad_Mante,_Tamaulipas_(27541700037).jpg"
  },
  "matamoros": {
    "titulo": "File:Presidencia Municipal - Matamoros - Foto nocturna 2018.jpg",
    "autor": "MX",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal_-_Matamoros_-_Foto_nocturna_2018.jpg"
  },
  "mendez": {
    "titulo": "File:Méndez, Tamaulipas.jpg",
    "autor": "giovana_arzola",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:M%C3%A9ndez,_Tamaulipas.jpg"
  },
  "mier": {
    "titulo": "File:Ciudad Mier, Tamaulipas, Mexico - panoramio.jpg",
    "autor": "18jcr",
    "licencia": "CC BY-SA 3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Ciudad_Mier,_Tamaulipas,_Mexico_-_panoramio.jpg"
  },
  "miguel-aleman": {
    "titulo": "File:Miguel Alemán Centro.jpg",
    "autor": "alfredo4274",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Miguel_Alem%C3%A1n_Centro.jpg"
  },
  "miquihuana": {
    "titulo": "File:Miquihuana, Tamaulipas.jpg",
    "autor": "Comisión Mexicana de Filmaciones on Montañas, Cerros y Sierras/ Mountains, Hills and Mountain Ranges",
    "licencia": "CC BY-SA 2.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Miquihuana,_Tamaulipas.jpg"
  },
  "nuevo-laredo": {
    "titulo": "File:Nuevo Laredo south side.png",
    "autor": "Miguel Angel Omaña Rojas",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Nuevo_Laredo_south_side.png"
  },
  "nuevo-morelos": {
    "titulo": "File:Recreativo El Pescadito, Nuevo Morelos, Tamaulipas.jpg",
    "autor": "el_gagu",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Recreativo_El_Pescadito,_Nuevo_Morelos,_Tamaulipas.jpg"
  },
  "ocampo": {
    "titulo": "File:Ocampo04.jpg",
    "autor": "16jayndes1212",
    "licencia": "CC BY-SA 3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Ocampo04.jpg"
  },
  "padilla": {
    "titulo": "File:Vicente Guerrero (12058460225).jpg",
    "autor": "Comisión Mexicana de Filmaciones from México D. F., México",
    "licencia": "CC BY-SA 2.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Vicente_Guerrero_(12058460225).jpg"
  },
  "palmillas": {
    "titulo": "File:Iglesia de Nuestra Señora de las Nieves, Palmillas 5.tif",
    "autor": "Oscarp89",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Iglesia_de_Nuestra_Se%C3%B1ora_de_las_Nieves,_Palmillas_5.tif"
  },
  "reynosa": {
    "titulo": "File:Compuertas.jpg",
    "autor": "Jesus Leal Vallejo",
    "licencia": "CC BY-SA 3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Compuertas.jpg"
  },
  "rio-bravo": {
    "titulo": "File:Water Borderline.jpg",
    "autor": "Miguel A. Guzman L.",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Water_Borderline.jpg"
  },
  "san-carlos": {
    "titulo": "File:Kiosko de San Carlos, Tamaulipas.jpg",
    "autor": "kikinsoto2001",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Kiosko_de_San_Carlos,_Tamaulipas.jpg"
  },
  "san-fernando": {
    "titulo": "File:San Fernando Parque, Tamaulipas.jpg",
    "autor": "da_wrrmg",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:San_Fernando_Parque,_Tamaulipas.jpg"
  },
  "san-nicolas": {
    "titulo": "File:Presidencia Municipal de San Nicolás, Tamaulipas.jpg",
    "autor": "jcloav",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Municipal_de_San_Nicol%C3%A1s,_Tamaulipas.jpg"
  },
  "soto-la-marina": {
    "titulo": "File:Thornscrub ranchland west of Tepehuajes, Municipio Soto La Marina, Tamaulipas, Mexico (20 May 2002).jpg",
    "autor": "William L. Farr",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Thornscrub_ranchland_west_of_Tepehuajes,_Municipio_Soto_La_Marina,_Tamaulipas,_Mexico_(20_May_2002).jpg"
  },
  "tampico": {
    "titulo": "File:Presidencia Tampico, Tamps.jpg",
    "autor": "César Eduardo Ortega Villagómez",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Presidencia_Tampico,_Tamps.jpg"
  },
  "tula": {
    "titulo": "File:Templo de San Antonio de Padua, Tula.jpg",
    "autor": "Antonio de Jesús Pérez Cruz",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Templo_de_San_Antonio_de_Padua,_Tula.jpg"
  },
  "valle-hermoso": {
    "titulo": "File:Plaza de Valle Hermoso Tamaulipas en 2017.jpg",
    "autor": "Hiper zober",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Plaza_de_Valle_Hermoso_Tamaulipas_en_2017.jpg"
  },
  "victoria": {
    "titulo": "File:Rumbo Nuevo - panoramio.jpg",
    "autor": "panza.rayada",
    "licencia": "CC BY-SA 3.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Rumbo_Nuevo_-_panoramio.jpg"
  },
  "villagran": {
    "titulo": "File:Servicio en Villagrán, Tamaulipas.jpg",
    "autor": "danielasoto39781",
    "licencia": "CC BY 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:Servicio_en_Villagr%C3%A1n,_Tamaulipas.jpg"
  },
  "xicotencatl": {
    "titulo": "File:ANIVERSARIO DE LA REVOLUCIÓN MEXICANA EN XICOTÉNCATL, TAMAULIPAS.jpg",
    "autor": "Arturo Martínez H",
    "licencia": "CC BY-SA 4.0",
    "fuente": "https://commons.wikimedia.org/wiki/File:ANIVERSARIO_DE_LA_REVOLUCI%C3%93N_MEXICANA_EN_XICOT%C3%89NCATL,_TAMAULIPAS.jpg"
  }
};

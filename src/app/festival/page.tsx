import type { Metadata } from "next";
import { ViewTransition } from "react";

import PortadaFestival from "@/components/festival/PortadaFestival";
import { FESTIVAL } from "@/data/festival";
import { SITIO } from "@/data/sitio";

/* Esta es LA pagina que tiene que salir de primera al buscar el nombre del
   festival: el titulo empieza por el nombre completo -no por "ITCA" ni por
   las siglas- porque eso es literalmente lo que alguien escribe en el
   buscador, y Google pesa mas las palabras que abren el titulo. Las keywords
   ya no influyen en el ranking de Google desde hace anos, pero Bing y otros
   todavia las leen, y no cuesta nada dejarlas. */
const DESCRIPCION = `${FESTIVAL.edicion}, del ${FESTIVAL.fechas}. Musica, danza, teatro, cine y letras en seis sedes del litoral de Tamaulipas. Entrada libre en todas las sedes.`;

export const metadata: Metadata = {
  title: `${FESTIVAL.nombre} | ITCA`,
  description: DESCRIPCION,
  keywords: [
    "Festival Internacional de la Costa del Seno Mexicano",
    "FICSM",
    "FICSM 2026",
    "festival Tamaulipas",
    "festival internacional Tamaulipas",
    "cartelera cultural Tamaulipas",
    "ITCA",
  ],
  alternates: {
    canonical: `${SITIO}/festival`,
  },
  /* openGraph y twitter no se heredan campo a campo desde el layout raiz:
     declarar el objeto aqui reemplaza el de arriba entero, asi que siteName
     y locale -y la tarjeta, en twitter- se repiten en cada pagina que
     necesite su propio titulo o url, o se pierden. */
  openGraph: {
    siteName: "ITCA",
    locale: "es_MX",
    title: FESTIVAL.nombre,
    description: DESCRIPCION,
    url: `${SITIO}/festival`,
    type: "website",
    /* No por convencion de archivo -opengraph-image.png en app/ solo cubre
       "/"-, sino a mano, con la misma imagen. */
    images: [`${SITIO}/opengraph-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: FESTIVAL.nombre,
    description: DESCRIPCION,
    images: [`${SITIO}/opengraph-image.png`],
  },
};

/* Datos estructurados (schema.org/Event): lo que le permite a Google ofrecer
   un resultado enriquecido -fechas, lugar, gratuito- en vez de un enlace
   pelado, y lo que mas pesa para ganar la primera posicion en una busqueda
   que ya nombra el festival. Va en la propia pagina y no en el layout,
   porque describe este evento concreto, no el sitio entero. */
function jsonLdEvento() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: FESTIVAL.nombre,
    alternateName: `${FESTIVAL.siglas} ${FESTIVAL.anio}`,
    description: DESCRIPCION,
    startDate: `${FESTIVAL.anio}-10-02`,
    endDate: `${FESTIVAL.anio}-10-11`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Litoral de Tamaulipas",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Tamaulipas",
        addressCountry: "MX",
      },
    },
    image: [`${SITIO}/opengraph-image.png`],
    organizer: {
      "@type": "Organization",
      name: "Instituto Tamaulipeco para la Cultura y las Artes",
      url: SITIO,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
      url: `${SITIO}/festival`,
    },
    isAccessibleForFree: true,
    url: `${SITIO}/festival`,
  };
}

export default function FestivalPage() {
  return (
    /* El ViewTransition va aqui, dentro de la page, y no en el layout: un
       layout no se desmonta al cambiar de ruta, asi que React lo trataria como
       una actualizacion y las animaciones de entrada y salida no llegarian a
       dispararse. Ese fue el motivo de que antes no se animara nada. */
    <ViewTransition enter="revelar" exit="debajo" default="none">
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvento()) }}
        />
        <PortadaFestival />
      </main>
    </ViewTransition>
  );
}

import type { Metadata, Viewport } from "next";
import { Newsreader, Geist, Geist_Mono, Encode_Sans } from "next/font/google";
import "./globals.css";

import { SITIO } from "@/data/sitio";

/**
 * Tipografia del festival, que tiene identidad propia y no la del Instituto.
 * Moghul, la secundaria, no esta en Google Fonts: se carga como fuente local
 * desde globals.css y hasta que aparezca el archivo cae en esta misma Encode.
 */
const encodeSans = Encode_Sans({
  variable: "--font-encode",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

/* Las paginas de /festival heredan estos valores salvo que digan lo
   contrario, asi que aqui van los que sirven a cualquiera: el sitio, no una
   seccion en concreto. La pagina de /festival (la portada del festival, sin
   confundir con esta raiz institucional) pone los suyos propios, mas
   especificos, para la busqueda que de verdad importa. */
export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  /* Cadena simple y no { default, template }: cada pagina de /festival ya
     escribe su propio " | ITCA" o " | FICSM 2026" al final del titulo, y una
     plantilla aqui se lo pegaria una segunda vez. */
  title: "ITCA | Instituto Tamaulipeco para la Cultura y las Artes",
  description:
    "Sitio del ITCA: podcast, revista digital, repositorio cultural, charlas, convocatorias y biblioteca virtual de Tamaulipas.",
  /* La imagen se referencia a mano y no por convencion de archivo: un
     opengraph-image.png solo vale para su propio segmento de ruta, no se
     hereda a /festival ni al resto -a diferencia de layout.tsx, que si se
     hereda-, asi que cada pagina que declare su propio openGraph/twitter
     tiene que repetirla. */
  openGraph: {
    siteName: "ITCA",
    locale: "es_MX",
    type: "website",
    images: [`${SITIO}/opengraph-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITIO}/opengraph-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  /* No hace falta declarar manifest aqui: app/manifest.ts ya se sirve solo
     en /manifest.webmanifest y Next le añade su propio <link> al <head>. */
};

/* Aparte de metadata porque desde Next 14 viewport y themeColor viven en su
   propio export -meterlos en metadata da un aviso en build y Next los ignora. */
export const viewport: Viewport = {
  themeColor: "#7645af",
};

/**
 * Decide si la escena de portada se ve de dia o de noche segun la hora local
 * del visitante. Se ejecuta antes del primer pintado para que no haya un
 * salto visible de una paleta a otra.
 *
 * Para revisar el modo contrario sin esperar a que cambie la hora:
 *   ?momento=noche   o   ?momento=dia
 */
const scriptMomento = `(function(){try{
var p=new URLSearchParams(location.search).get('momento');
var h=new Date().getHours();
document.documentElement.dataset.momento =
  (p==='noche'||p==='dia') ? p : ((h<6||h>=20)?'noche':'dia');
}catch(e){document.documentElement.dataset.momento='dia';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${geist.variable} ${geistMono.variable} ${encodeSans.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptMomento }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

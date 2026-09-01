import type { Metadata } from "next";
import { Newsreader, Geist, Geist_Mono, Encode_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "ITCA | Instituto Tamaulipeco para la Cultura y las Artes",
  description:
    "Sitio del ITCA: podcast, revista digital, repositorio cultural, charlas, convocatorias y biblioteca virtual de Tamaulipas.",
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

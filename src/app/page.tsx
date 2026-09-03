import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import EscenaDia from "@/components/EscenaDia";
import Marquee from "@/components/Marquee";
import ItcaDigital from "@/components/ItcaDigital";
import EnlacesGenerales from "@/components/EnlacesGenerales";
import Comunicados from "@/components/Comunicados";
import Footer from "@/components/Footer";
import Cortinilla from "@/components/Cortinilla";

/* noindex mientras la cancela siga en pie: para cualquiera sin la llave -y
   por tanto para Google- esta ruta es la cortinilla, no el sitio. Indexarla
   pondria en el buscador una pantalla de acceso en vez del contenido real,
   y encima competiria con /festival por la misma marca. Sale de aqui y no de
   robots.txt porque un disallow ahi taparia tambien /festival: son la misma
   /, solo que en rutas de Next son ficheros distintos. */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

/**
 * Llave para ver el sitio institucional mientras dura la obra: /?acceso=itca
 *
 * Es una cancela, no una contrasena, y conviene tenerlo claro: va en la URL, no
 * cifra nada y cualquiera a quien se le pase el enlace entra. Sirve para lo que
 * se pidio -que un visitante cualquiera no se cuele en una pagina a medias- y
 * para que el equipo pueda seguir revisandola en produccion. Si algun dia hay
 * que proteger contenido de verdad, esto no es lo que hay que usar.
 */
const LLAVE = "itca";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { acceso } = await searchParams;

  /* La cortinilla se devuelve en lugar de la pagina, no encima de ella: asi no
     queda debajo un sitio institucional a medio hacer que se pueda destapar
     desde el inspector. Leer searchParams vuelve dinamica esta ruta, que es el
     precio de tener la llave; la cortinilla es minuscula y el sitio de detras
     vuelve a ser estatico en cuanto se retire todo esto. */
  if (acceso !== LLAVE) return <Cortinilla />;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <EscenaDia />
        <Marquee />
        <ItcaDigital />
        <EnlacesGenerales />
        <Comunicados />
      </main>
      <Footer />
    </div>
  );
}

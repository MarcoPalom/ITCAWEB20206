import type { Metadata } from "next";
import { ViewTransition } from "react";

import RejillaMunicipios, {
  type FichaMunicipio,
} from "@/components/festival/RejillaMunicipios";
import { FESTIVAL } from "@/data/festival";
import { MUNICIPIOS } from "@/data/municipios";
import { MUNICIPIOS_FOTOS } from "@/data/municipios_fotos";
import { SITIO } from "@/data/sitio";

const DESCRIPCION = "La programación que recorre los 43 municipios de Tamaulipas.";

export const metadata: Metadata = {
  title: `Municipios | ${FESTIVAL.siglas} ${FESTIVAL.anio}`,
  description: DESCRIPCION,
  alternates: { canonical: `${SITIO}/festival/municipios` },
  /* openGraph propio: reemplaza el del layout raiz entero, asi que siteName
     y locale se repiten aqui en vez de heredarse campo a campo. */
  openGraph: {
    siteName: "ITCA",
    locale: "es_MX",
    title: `Municipios | ${FESTIVAL.siglas} ${FESTIVAL.anio}`,
    description: DESCRIPCION,
    url: `${SITIO}/festival/municipios`,
    type: "website",
    images: [`${SITIO}/opengraph-image.png`],
  },
};

/**
 * Lo unico que cruza al cliente: cuatro campos por municipio.
 *
 * Se arma aqui, en el servidor y una sola vez al construir, porque los mandos
 * del bento -buscar y reordenar- necesitan la lista en el navegador. Lo que no
 * necesitan es la programacion: cada municipio arrastra sus eventos con
 * titulo, sede, notas y dias, y mandar eso entero para pintar 43 rectangulos
 * serian cientos de kB de mas en el telefono.
 */
const FICHAS: FichaMunicipio[] = MUNICIPIOS.map((m) => {
  const foto = MUNICIPIOS_FOTOS[m.id];
  return {
    id: m.id,
    nombre: m.nombre,
    numero: m.numero,
    totalEspectaculos: m.totalEspectaculos,
    foto: foto ? { autor: foto.autor, licencia: foto.licencia } : null,
  };
});

export default function MunicipiosPage() {
  return (
    <ViewTransition key="municipios-bento" enter="revelar" exit="debajo" default="none">
      <main className="flex-1">
        {/* bg-bone explicito y no heredado del body: el barrido circular
            revela una instantanea de esta seccion tal como la pinta el
            navegador, y una seccion sin fondo propio pinta transparente en
            sus huecos -el espacio entre fichas, los margenes-. Ahi se
            colaba la pagina anterior por debajo del circulo ya "revelado",
            como si el barrido nunca hubiera cubierto esa zona. Todas las
            demas secciones tienen fondo explicito propio (el tinte de la
            portadilla, o el oscuro de la cartelera); esta, al ser la unica
            clara que no lo tenia, era la unica donde el hueco se notaba. */}
        {/* El aire de arriba es menor que el de abajo, y a proposito. Esta
            seccion empieza con los mandos, que son una barra pegajosa: todo lo
            que se ponga encima es aire que solo se ve una vez, se va con el
            primer scroll y no vuelve. Antes eran 96px en movil y 128 en
            escritorio, que dejaban la pagina abriendose casi en blanco. */}
        <section className="border-b border-line bg-bone pt-10 pb-24 sm:pt-14 sm:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RejillaMunicipios fichas={FICHAS} />
          </div>
        </section>
      </main>
    </ViewTransition>
  );
}

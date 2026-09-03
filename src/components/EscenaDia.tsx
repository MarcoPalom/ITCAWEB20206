import Image from "next/image";
import Mariposas from "./Mariposas";
import cerroDelBernal from "../../public/img/cerro-del-bernal.jpg";

/**
 * Escena de apertura del sitio: el Cerro del Bernal como fondo fijo mientras
 * el contenido lo atraviesa, con el sol recorriendo el cielo de este a oeste.
 *
 * Geometria: la seccion mide 400svh y el escenario pegajoso 100svh, asi que
 * el fondo permanece fijo durante 300svh, es decir tres pantallas completas.
 * Si cambias el numero de paneles, ajusta tambien la altura de la seccion:
 * deben coincidir o el ciclo solar se desincroniza del texto.
 *
 * Sustitucion de la fotografia: reemplaza public/img/cerro-del-bernal.jpg.
 * Minimo 2560 px de ancho, recomendado 4200 x 2400. Next lee las dimensiones
 * al compilar y regenera el desenfoque de carga.
 */

const PANELES = [
  {
    meta: "Tamaulipas",
    titulo: "Todo el arte de Tamaulipas, en un solo lugar",
    texto:
      "El trabajo del ITCA reunido y ordenado: contenidos, programas y convocatorias, aunque vivan en sitios externos.",
    esTitular: true,
  },
  {
    meta: "Cuarenta y tres municipios",
    titulo: "De la sierra a la costa, una sola conversación",
    texto:
      "Talleres en la Huasteca, orquestas juveniles en la frontera, salas de lectura en los pueblos pesqueros. El Instituto trabaja en todo el territorio.",
  },
  {
    meta: "Archivo vivo",
    titulo: "Lo que se crea aquí merece quedar registrado",
    texto:
      "Fotografía, video y publicaciones que documentan la vida cultural del Estado y quedan disponibles para consulta libre.",
  },
  {
    meta: "Sigue bajando",
    titulo: "Todo lo del Instituto, a partir de aquí",
    texto:
      "Publicaciones, convocatorias, biblioteca y comunicados, organizados para que encuentres lo que buscas.",
  },
];

export default function EscenaDia() {
  return (
    <section className="escena-dia relative h-[400svh] bg-charcoal">
      {/* Escenario fijo */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Image
          src={cerroDelBernal}
          alt="El Cerro del Bernal se recorta sobre el horizonte tras un campo de girasoles en González, Tamaulipas."
          placeholder="blur"
          priority
          sizes="100vw"
          className="escena-imagen absolute inset-0 h-full w-full object-cover object-center [filter:saturate(0.68)]"
        />

        <div className="escena-cielo absolute inset-0" aria-hidden="true" />
        <div className="escena-luz absolute inset-0" aria-hidden="true" />

        {/* Cielo estrellado. De dia aparece solo al anochecer; de noche esta
            presente desde el principio, con parpadeo y cometas. */}
        <div className="escena-estrellas absolute inset-0" aria-hidden="true">
          <div className="capa-estrellas capa-estrellas-lejos" />
          <div className="capa-estrellas capa-estrellas-medias" />
          <div className="capa-estrellas capa-estrellas-cerca" />
        </div>

        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="cometa" style={{ top: "8%", left: "4%" }} />
          <div
            className="cometa"
            style={{ top: "3%", left: "38%", animationDelay: "6.5s" }}
          />
          <div
            className="cometa"
            style={{ top: "14%", left: "22%", animationDelay: "13s" }}
          />
        </div>

        <div
          className="escena-sol absolute left-0 top-0"
          aria-hidden="true"
        />

        <Mariposas />

        {/* Velo constante bajo el texto: el contraste no puede depender de la
            hora del dia que este representando la escena. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(18,15,11,0.82)_0%,rgba(18,15,11,0.55)_38%,rgba(18,15,11,0.12)_66%,transparent_88%)]"
        />
      </div>

      {/* Paneles de contenido, superpuestos al escenario */}
      <div className="relative -mt-[100svh]">
        {PANELES.map((panel) => (
          <div
            key={panel.titulo}
            className="escena-panel flex h-[100svh] items-center"
          >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <p className="meta text-white/75">{panel.meta}</p>

                {panel.esTitular ? (
                  <h1 className="title-display mt-5 text-[clamp(2.5rem,6.5vw,4.5rem)] font-light text-white">
                    {panel.titulo}
                  </h1>
                ) : (
                  <h2 className="title-display mt-5 text-[clamp(2rem,5vw,3.5rem)] font-light text-white">
                    {panel.titulo}
                  </h2>
                )}

                <p className="mt-6 text-lg leading-relaxed text-white/85">
                  {panel.texto}
                </p>

                {panel.esTitular && (
                  <div className="mt-12 border-t border-white/20 pt-5">
                    <p className="meta text-white/60">
                      Cerro del Bernal &middot; González
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

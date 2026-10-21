import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import TablaBeneficiarios from "@/components/TablaBeneficiarios";
import { leerPadron } from "@/lib/beneficiarios";
import { SITIO } from "@/data/sitio";

const TITULO = "Padrón de beneficiarios | ITCA";
const DESCRIPCION =
  "Beneficiarios de las convocatorias del Instituto Tamaulipeco para la Cultura y las Artes, por convocatoria y año.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: `${SITIO}/beneficiarios` },
  openGraph: {
    siteName: "ITCA",
    locale: "es_MX",
    title: TITULO,
    description: DESCRIPCION,
    url: `${SITIO}/beneficiarios`,
    type: "website",
    images: [`${SITIO}/opengraph-image.png`],
  },
};

const formatoFecha = new Intl.DateTimeFormat("es-MX", { dateStyle: "long" });

/**
 * Padron de beneficiarios. Se lee de la base en cada visita (connection()
 * evita que el build lo congele en el HTML): un concentrado nuevo cargado con
 * scripts/beneficiarios.mjs aparece al instante, sin recompilar el sitio.
 */
export default async function BeneficiariosPage() {
  await connection();
  const { convocatorias, beneficiarios } = leerPadron();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader tono="oscuro" />
      <main className="flex-1 pt-20">
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 sm:pt-20 lg:px-8">
            <nav aria-label="Ruta de navegación" className="meta text-muted">
              <Link href="/#convocatorias" className="inline-flex min-h-11 items-center transition-colors hover:text-charcoal">
                Convocatorias
              </Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page" className="text-charcoal">Beneficiarios</span>
            </nav>
            <h1 className="title-display mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-light">
              Padrón de beneficiarios
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Personas que han recibido un estímulo en las convocatorias del
              Instituto. Antes de entregar un nuevo apoyo, consulta aquí si la
              persona ya fue beneficiaria: el padrón marca a quien aparece en
              más de una convocatoria o más de una vez en la misma.
            </p>
            <p className="meta mt-8 text-muted">
              {beneficiarios.length} registros · {convocatorias.length}{" "}
              {convocatorias.length === 1 ? "convocatoria" : "convocatorias"} · Consultado el{" "}
              {formatoFecha.format(new Date())}
            </p>
          </div>
        </section>

        <section aria-label="Padrón" className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {beneficiarios.length > 0 ? (
              <TablaBeneficiarios convocatorias={convocatorias} beneficiarios={beneficiarios} />
            ) : (
              <p className="rounded-lg border border-dashed border-line px-6 py-14 text-center text-muted">
                Aún no hay concentrados cargados.
              </p>
            )}

            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
              Se publica el nombre de la persona beneficiaria o de quien
              representa el proyecto, tal como aparece en el concentrado de
              cada convocatoria. &ldquo;Nombre similar&rdquo; señala nombres que
              coinciden salvo por un apellido, un título o acentos: puede ser la
              misma persona y conviene confirmarlo antes de decidir.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

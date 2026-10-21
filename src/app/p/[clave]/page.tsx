import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import TablaBeneficiarios from "@/components/TablaBeneficiarios";
import { claveValida, leerPadron } from "@/lib/beneficiarios";
import { ANALITICA } from "@/data/sitio";

/**
 * Padron de beneficiarios, de consulta interna.
 *
 * No tiene ruta publica ni enlace desde ningun sitio: solo se llega
 * escribiendo /p/<clave>, y la clave -128 bits aleatorios- vive en la base de
 * datos del servidor, no en el codigo (el repositorio es publico). Con
 * cualquier otra clave la respuesta es el mismo 404 que da una pagina que no
 * existe, para que la ruta ni siquiera se distinga de una direccion al azar.
 *
 * Ademas, para que la direccion no se filtre ni se indexe:
 * - noindex/nofollow aqui y en la cabecera X-Robots-Tag (next.config.ts);
 * - sin referer al salir, por si alguien pega un enlace externo;
 * - sin cache compartida;
 * - fuera del sitemap y sin mencion en robots.txt, que la delataria;
 * - Google Analytics apagado en esta pagina, para que la URL no quede en los
 *   informes de visitas.
 *
 * La clave se consulta o se cambia con scripts/beneficiarios.mjs.
 */
export const metadata: Metadata = {
  title: "Padrón",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default async function PadronPage({
  params,
}: {
  params: Promise<{ clave: string }>;
}) {
  await connection();
  const { clave } = await params;
  if (!claveValida(clave)) notFound();

  const { convocatorias, beneficiarios } = leerPadron();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {/* Antes de que cargue la analitica (va despues de la hidratacion):
          gtag respeta esta bandera y no envia la visita. */}
      {ANALITICA ? (
        <script
          dangerouslySetInnerHTML={{ __html: `window['ga-disable-${ANALITICA}']=true;` }}
        />
      ) : null}
      <h1 className="sr-only">Padrón de beneficiarios</h1>
      <TablaBeneficiarios convocatorias={convocatorias} beneficiarios={beneficiarios} />
    </main>
  );
}

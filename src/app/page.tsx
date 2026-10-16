import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import EscenaDia from "@/components/EscenaDia";
import Marquee from "@/components/Marquee";
import ItcaDigital from "@/components/ItcaDigital";
import Comunicados from "@/components/Comunicados";
import Instituto from "@/components/Instituto";
import EjesAccion from "@/components/EjesAccion";
import Unidades from "@/components/Unidades";
import Convocatorias from "@/components/Convocatorias";
import Footer from "@/components/Footer";
import { SITIO } from "@/data/sitio";

export const metadata: Metadata = {
  alternates: { canonical: SITIO },
};

/* Portada del sitio institucional. Hasta el cierre del festival de 2026 esta
   ruta servia una cortinilla de obra; el sitio ya se publica completo, con el
   contenido del sitio oficial del Instituto (ver data/itca.ts). */
export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <EscenaDia />
        <Marquee />
        <ItcaDigital />
        <Comunicados />
        <Instituto />
        <EjesAccion />
        <Unidades />
        <Convocatorias />
      </main>
      <Footer />
    </div>
  );
}
